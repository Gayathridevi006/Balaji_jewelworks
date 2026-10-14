from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4
import re, shutil
from typing import Optional
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Query, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from PIL import Image
from io import BytesIO
from .config import settings
from .schemas import DesignIn, CategoryIn, BusinessIn, LoginIn, ContactEnquiryIn, ScrapeStartIn
from .security import require_admin, verify_password, issue_token, hash_password
from .utils import slugify
from .catalogue_categories import SAMPLE_CATEGORY_WEIGHTS, STANDARD_CATEGORY_NAMES
from .scraper import collect_product
from .storage import save_image, delete_image
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

client = AsyncIOMotorClient(settings.mongo_uri)
db = client[settings.mongo_db]

SAMPLE_IMAGE_FILES = {
    'Gold': {
        'Bangles': 'bjw-g-003-enamel-bangles.webp', 'Chains': 'bjw-gold-chains.webp',
        'Necklaces': 'bjw-g-001-temple-necklace.webp', 'Earrings': 'bjw-gold-earrings.webp',
        'Bracelets': 'bjw-gold-bracelets.webp', 'Finger Rings': 'bjw-gold-finger-rings.webp',
        'Pendants': 'bjw-gold-pendants.webp', 'Anklets': 'bjw-gold-anklets.webp',
        'Nose Pins': 'bjw-gold-nose-pins.webp', 'Toe Rings': 'bjw-gold-toe-rings.webp',
        'Jhumkas': 'bjw-g-002-pearl-jhumkas.webp', 'Harams': 'bjw-gold-harams.webp',
        'Mangalsutra': 'bjw-gold-mangalsutra.webp', 'Bridal Jewellery': 'bjw-gold-bridal-jewellery.webp',
        'Kids Jewellery': 'bjw-gold-kids-jewellery.webp', 'Thali': 'bjw-gold-thali-01.webp', 'Other': 'bjw-gold-other.webp',
    },
    'Silver': {
        'Bangles': 'bjw-silver-bangles.webp', 'Chains': 'bjw-silver-chains.webp',
        'Necklaces': 'bjw-silver-necklaces.webp', 'Earrings': 'bjw-s-001-silver-drops.webp',
        'Bracelets': 'bjw-silver-bracelets.webp', 'Finger Rings': 'bjw-silver-finger-rings.webp',
        'Pendants': 'bjw-silver-pendants.webp', 'Anklets': 'bjw-silver-anklets.webp',
        'Nose Pins': 'bjw-silver-nose-pins.webp', 'Toe Rings': 'bjw-silver-toe-rings.webp',
        'Jhumkas': 'bjw-silver-jhumkas.webp', 'Harams': 'bjw-silver-harams.webp',
        'Mangalsutra': 'bjw-silver-mangalsutra.webp', 'Bridal Jewellery': 'bjw-silver-bridal-jewellery.webp',
        'Kids Jewellery': 'bjw-silver-kids-jewellery.webp', 'Thali': 'bjw-silver-other.webp', 'Other': 'bjw-silver-other.webp',
    },
}

WORKSHOP_PHOTO_SAMPLES = [
    ('BJW-G-REF-101', 'Layered Ribbed Earrings', 'Earrings', 'Classic', 'bjw-user-gold-ribbed-cuffs.webp'),
    ('BJW-G-REF-102', 'Colourstone Blossom Studs', 'Earrings', 'Traditional', 'bjw-user-gold-colourstone-studs.webp'),
    ('BJW-G-REF-103', 'Triple Petal Studs', 'Earrings', 'Contemporary', 'bjw-user-gold-triple-petal-studs.webp'),
    ('BJW-G-REF-104', 'Temple Motif Hoop Bangles', 'Bangles', 'Traditional', 'bjw-user-gold-temple-hoop-bangles.webp'),
    ('BJW-G-REF-105', 'Ruby Mosaic Studs', 'Earrings', 'Traditional', 'bjw-user-gold-ruby-mosaic-studs.webp'),
    ('BJW-G-REF-106', 'Filigree Cascade Jhumkas', 'Jhumkas', 'Traditional', 'bjw-user-gold-filigree-jhumkas.webp'),
    ('BJW-G-REF-107', 'Sunburst Flower Studs', 'Earrings', 'Classic', 'bjw-user-gold-sunburst-studs.webp'),
    ('BJW-G-REF-108', 'Emerald Temple Jhumkas', 'Jhumkas', 'Traditional', 'bjw-user-gold-emerald-jhumkas.webp'),
    ('BJW-G-REF-109', 'Everyday Pendant Necklace', 'Necklaces', 'Classic', 'bjw-user-gold-pendant-necklace.webp'),
    ('BJW-G-REF-110', 'Lotus Pearl Drop Earrings', 'Earrings', 'Traditional', 'bjw-user-gold-lotus-drop-earrings.webp'),
    ('BJW-G-REF-111', 'Pearl Lattice Earrings', 'Earrings', 'Classic', 'bjw-user-gold-pearl-lattice-earrings.webp'),
    ('BJW-G-REF-112', 'Heritage Bell Jhumkas', 'Jhumkas', 'Traditional', 'bjw-user-gold-heritage-jhumkas.webp'),
    ('BJW-G-REF-115', 'Filigree Bead Drop Jhumkas', 'Jhumkas', 'Traditional', 'bjw-user-gold-filigree-bead-jhumkas.webp'),
    ('BJW-G-REF-116', 'Engraved Dome Jhumkas', 'Jhumkas', 'Traditional', 'bjw-user-gold-engraved-dome-jhumkas.webp'),
    ('BJW-G-REF-113', 'Textured Rope Chain', 'Chains', 'Classic', 'bjw-user-gold-rope-chain.webp'),
    ('BJW-G-REF-114', 'Medallion Panel Cuff', 'Bracelets', 'Contemporary', 'bjw-user-gold-medallion-cuff.webp'),
    ('BJW-G-REF-117', 'Classic Line Thali', 'Thali', 'Traditional', 'bjw-gold-thali-01.webp'),
    ('BJW-G-REF-118', 'Floral Vine Thali', 'Thali', 'Traditional', 'bjw-gold-thali-02.webp'),
    ('BJW-G-REF-119', 'Geometric Band Thali', 'Thali', 'Classic', 'bjw-gold-thali-03.webp'),
    ('BJW-G-REF-120', 'Temple Emblem Thali', 'Thali', 'Traditional', 'bjw-gold-thali-04.webp'),
    ('BJW-G-REF-121', 'Flower Crest Thali', 'Thali', 'Traditional', 'bjw-gold-thali-05.webp'),
    ('BJW-G-REF-122', 'Beaded Temple Pair Thali', 'Thali', 'Traditional', 'bjw-gold-thali-06.webp'),
    ('BJW-G-REF-123', 'Blue Eye Kids Kada', 'Kids Jewellery', 'Contemporary', 'bjw-kids-kada-01.webp'),
    ('BJW-G-REF-124', 'Sunburst Bell Kids Kadas', 'Kids Jewellery', 'Traditional', 'bjw-kids-kada-02.webp'),
    ('BJW-S-REF-125', 'Floral Silver Kids Kada', 'Kids Jewellery', 'Traditional', 'bjw-kids-kada-03.webp', 'Silver'),
    ('BJW-G-REF-126', 'Medallion Kids Kada', 'Kids Jewellery', 'Classic', 'bjw-kids-kada-04.webp'),
    ('BJW-G-REF-127', 'Turtle Motif Kids Kada', 'Kids Jewellery', 'Contemporary', 'bjw-kids-kada-05.webp'),
    ('BJW-G-REF-128', 'Enamel Teardrop Kids Kada', 'Kids Jewellery', 'Traditional', 'bjw-kids-kada-06.webp'),
    ('BJW-G-REF-129', 'Link Chain Kids Kada', 'Kids Jewellery', 'Contemporary', 'bjw-kids-kada-07.webp'),
    ('BJW-S-REF-130', 'Engraved Silver Kids Kada', 'Kids Jewellery', 'Traditional', 'bjw-kids-kada-08.webp', 'Silver'),
    ('BJW-S-REF-131', 'Multicolour Stone Kids Kadas', 'Kids Jewellery', 'Contemporary', 'bjw-kids-kada-09.webp', 'Silver'),
    ('BJW-G-REF-132', 'Leaf Motif Open Kids Kada', 'Kids Jewellery', 'Traditional', 'bjw-kids-kada-10.webp'),
    ('BJW-G-REF-133', 'Pearl Grapevine Earrings', 'Earrings', 'Traditional', 'bjw-gold-grape-earrings-01.webp'),
    ('BJW-G-REF-134', 'Grape Cluster Drop Earrings', 'Earrings', 'Traditional', 'bjw-gold-grape-earrings-02.webp'),
    ('BJW-G-REF-135', 'Pearl Crescent Earrings', 'Earrings', 'Traditional', 'bjw-gold-pearl-crescent-earrings.webp'),
    ('BJW-G-REF-136', 'Crystal Cascade Earrings', 'Earrings', 'Contemporary', 'bjw-gold-crystal-cascade-earrings.webp'),
    ('BJW-G-REF-137', 'Temple Peacock Bangles', 'Bangles', 'Traditional', 'bjw-gold-temple-peacock-bangles.webp'),
    ('BJW-G-REF-138', 'Ornate Rope Chain', 'Chains', 'Traditional', 'bjw-gold-ornate-rope-chain.webp'),
    ('BJW-G-REF-139', 'Multicolour Bead Necklace', 'Necklaces', 'Traditional', 'bjw-gold-multicolour-bead-necklace.webp'),
    ('BJW-G-REF-140', 'Punjabi Wave Open Kada', 'Bangles', 'Traditional', 'bjw-gold-punjabi-wave-kada.webp'),
    ('BJW-G-REF-141', 'Twist Ribbon Kada', 'Bangles', 'Contemporary', 'bjw-gold-twist-band-kada.webp'),
    ('BJW-G-REF-142', 'Diamond Lattice Kada', 'Bangles', 'Classic', 'bjw-gold-diamond-grid-kada.webp'),
    ('BJW-G-REF-143', 'Geometric Punjabi Kada', 'Bangles', 'Traditional', 'bjw-gold-geometric-punjabi-kada.webp'),
    ('BJW-G-REF-144', 'Diagonal Cut Kada', 'Bangles', 'Classic', 'bjw-gold-crosshatch-kada.webp'),
    ('BJW-G-REF-145', 'Diamond Crosshatch Kada', 'Bangles', 'Contemporary', 'bjw-gold-lattice-open-kada.webp'),
    ('BJW-G-REF-146', 'Emerald Drop Necklace', 'Necklaces', 'Contemporary', 'bjw-gold-emerald-drop-necklace.webp'),
    ('BJW-G-REF-147', 'Peacock Pendant Necklace', 'Necklaces', 'Traditional', 'bjw-gold-peacock-pendant-necklace.webp'),
    ('BJW-G-REF-148', 'Beaded Gold Necklace', 'Necklaces', 'Traditional', 'bjw-gold-beaded-necklace.webp'),
    ('BJW-G-REF-149', 'Heart Drop Motif Necklace', 'Necklaces', 'Traditional', 'bjw-gold-heart-drop-necklace.webp'),
    ('BJW-G-REF-150', 'Fan Motif Necklace', 'Necklaces', 'Classic', 'bjw-gold-fan-motif-necklace.webp'),
    ('BJW-G-REF-151', 'Floral Front Necklace', 'Necklaces', 'Traditional', 'bjw-gold-floral-front-necklace.webp'),
    ('BJW-G-REF-152', 'Halo Circle Drop Earrings', 'Earrings', 'Contemporary', 'bjw-gold-halo-drop-earrings.webp'),
    ('BJW-G-REF-153', 'Ganesha Gold Pendant', 'Pendants', 'Traditional', 'bjw-gold-ganesha-pendant.webp'),
    ('BJW-G-REF-154', 'Filigree Chandbali Earrings', 'Earrings', 'Traditional', 'bjw-gold-filigree-chandbali-earrings.webp'),
    ('BJW-G-REF-155', 'Floral Lotus Pendant Necklace', 'Pendants', 'Contemporary', 'bjw-gold-floral-lotus-pendant.webp'),
    ('BJW-G-REF-156', 'Diamond Band Ring', 'Finger Rings', 'Classic', 'bjw-gold-diamond-band-ring.webp'),
    ('BJW-G-REF-157', 'Pearl Knot Drop Earrings', 'Earrings', 'Classic', 'bjw-gold-pearl-knot-drop-earrings.webp'),
    ('BJW-G-REF-158', 'Diamond Panel Open Kada', 'Bangles', 'Contemporary', 'bjw-gold-diamond-panel-cuff.webp'),
    ('BJW-G-REF-159', 'Speckled Long Drop Earrings', 'Earrings', 'Contemporary', 'bjw-gold-speckled-drop-earrings.webp'),
    ('BJW-G-REF-160', 'Textured Rectangle Stud Earrings', 'Earrings', 'Classic', 'bjw-gold-textured-rectangle-studs.webp'),
    ('BJW-G-REF-161', 'Openwork Hexagon Ring', 'Finger Rings', 'Contemporary', 'bjw-gold-openwork-hexagon-ring.webp'),
    ('BJW-G-REF-162', 'Leaf Openwork Ring', 'Finger Rings', 'Contemporary', 'bjw-gold-leaf-openwork-ring.webp'),
    ('BJW-G-REF-163', 'Pearl Centre Flower Ring', 'Finger Rings', 'Classic', 'bjw-gold-pearl-flower-ring.webp'),
    ('BJW-G-REF-164', 'Braided Leaf Ring', 'Finger Rings', 'Classic', 'bjw-gold-braided-leaf-ring.webp'),
    ('BJW-G-REF-165', 'Gold Net Pattern Ring', 'Finger Rings', 'Contemporary', 'bjw-gold-net-pattern-ring.webp'),
    ('BJW-G-REF-166', 'Flower Arc Ring', 'Finger Rings', 'Classic', 'bjw-gold-flower-arc-ring.webp'),
    ('BJW-G-REF-167', 'Open Oval Hoop Earrings', 'Earrings', 'Contemporary', 'bjw-gold-open-oval-hoop-earrings.webp'),
    ('BJW-G-REF-168', 'Floral Filigree Ring', 'Finger Rings', 'Traditional', 'bjw-gold-floral-filigree-ring.webp'),
    ('BJW-G-REF-169', 'Geometric Lattice Pendant', 'Pendants', 'Contemporary', 'bjw-gold-geometric-lattice-pendant.webp'),
    ('BJW-G-REF-170', 'Classic Round Gold Bangle', 'Bangles', 'Classic', 'bjw-gold-classic-round-bangle.webp'),
    ('BJW-G-REF-171', 'Flower Centre Stud Earrings', 'Earrings', 'Classic', 'bjw-gold-flower-stud-earrings.webp'),
    ('BJW-G-REF-172', 'Spiral Disc Stud Earrings', 'Earrings', 'Contemporary', 'bjw-gold-spiral-stud-earrings.webp'),
    ('BJW-G-REF-173', 'Two Tone Link Chain', 'Chains', 'Contemporary', 'bjw-gold-two-tone-link-chain.webp'),
    ('BJW-G-REF-174', 'Fine Gold Chain', 'Chains', 'Classic', 'bjw-gold-fine-chain.webp'),
    ('BJW-G-REF-175', 'Segment Link Gold Chain', 'Chains', 'Classic', 'bjw-gold-segment-link-chain.webp'),
    ('BJW-G-REF-176', 'Engraved Floral Gold Bangle', 'Bangles', 'Traditional', 'bjw-gold-engraved-floral-bangle.webp'),
    ('BJW-G-REF-177', 'Pearl Cone Jhumkas', 'Jhumkas', 'Traditional', 'bjw-gold-pearl-cone-jhumkas.webp'),
    ('BJW-G-REF-178', 'Openwork Statement Ring', 'Finger Rings', 'Contemporary', 'bjw-gold-openwork-statement-ring.webp'),
    ('BJW-G-REF-179', 'Four Petal Stud Earrings', 'Earrings', 'Classic', 'bjw-gold-four-petal-stud-earrings.webp'),
]

def public(doc):
    if not doc: return doc
    doc['id'] = str(doc.pop('_id'))
    return doc

@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.catalogue_items.create_index('design_code', unique=True)
    await db.catalogue_items.create_index('slug', unique=True)
    await db.catalogue_items.create_index([('published',1),('metal_type',1),('category_id',1),('created_at',-1)])
    await db.enquiries.create_index([('created_at', -1)])
    await db.categories.create_index([('display_order',1)])
    await db.business_settings.update_one(
        {'_id': 'main', 'shop_name': 'Balaji Jewelry Works'},
        {'$set': {'shop_name': 'Balaji Jewellery Works'}},
    )
    for metal in ('Gold', 'Silver'):
        for order, name in enumerate(STANDARD_CATEGORY_NAMES):
            exists = await db.categories.find_one({'name': name, 'metal_type': metal, 'active': True})
            if not exists:
                await db.categories.insert_one({
                    'name': name,
                    'slug': slugify(f'{metal}-{name}'),
                    'metal_type': metal,
                    'display_order': order,
                    'active': True,
                })
    for legacy in await db.categories.find({'metal_type': 'Both', 'active': True}).to_list(None):
        for metal in ('Gold', 'Silver'):
            specific = await db.categories.find_one({'name': legacy['name'], 'metal_type': metal, 'active': True})
            if specific:
                await db.catalogue_items.update_many(
                    {'category_id': str(legacy['_id']), 'metal_type': metal},
                    {'$set': {'category_id': str(specific['_id'])}},
                )
    earrings_category = await db.categories.find_one({'name': 'Earrings', 'metal_type': 'Gold', 'active': True})
    if earrings_category:
        await db.catalogue_items.update_one(
            {'design_code': 'BJW-G-REF-101'},
            {'$set': {
                'name': 'Layered Ribbed Earrings',
                'category_id': str(earrings_category['_id']),
                'updated_at': datetime.now(timezone.utc),
            }},
        )
    image_base = 'https://balaji-jewelworks.ms-gayathridevi6.workers.dev/products/'
    for metal in ('Gold', 'Silver'):
        for order, name in enumerate(STANDARD_CATEGORY_NAMES):
            category = await db.categories.find_one({'name': name, 'metal_type': metal, 'active': True})
            if not category:
                continue
            image_url = image_base + SAMPLE_IMAGE_FILES[metal][name]
            # Refresh only starter samples. Administrator-uploaded catalogue images stay untouched.
            await db.catalogue_items.update_many(
                {'category_id': str(category['_id']), 'metal_type': metal, 'sample': True, 'deleted_at': None},
                {'$set': {
                    'primary_image': image_url,
                    'images.0.url': image_url,
                    'images.0.alt': f'{metal} {name} illustrative sample',
                    'updated_at': datetime.now(timezone.utc),
                }},
            )
            # Thali uses the supplied reference designs below rather than a generic category placeholder.
            if name == 'Thali':
                continue
            if await db.catalogue_items.find_one({
                'category_id': str(category['_id']), 'metal_type': metal, 'deleted_at': None,
            }):
                continue
            code = f"BJW-{'G' if metal == 'Gold' else 'S'}-CAT-{order + 1:03d}"
            if await db.catalogue_items.find_one({'design_code': code}):
                continue
            item_name = 'Heritage Pearl Jhumkas' if metal == 'Gold' and name == 'Jhumkas' else f'{metal} {name} Sample'
            await db.catalogue_items.insert_one({
                'name': item_name,
                'design_code': code,
                'metal_type': metal,
                'category_id': str(category['_id']),
                'subcategory': '',
                'description': f'Illustrative {metal.lower()} {name.lower()} catalogue sample. Confirm the design, image, and approximate weight with the workshop before treating it as an actual product.',
                'style': 'Traditional',
                'weight_range': SAMPLE_CATEGORY_WEIGHTS[name][metal],
                'featured': False,
                'published': True,
                'sample': True,
                'images': [{'id': code.lower() + '-image', 'url': image_url, 'alt': f'{metal} {name} illustrative sample'}],
                'primary_image': image_url,
                'source_url': None,
                'created_at': datetime.now(timezone.utc),
                'updated_at': datetime.now(timezone.utc),
                'deleted_at': None,
            })
    for code, name, category_name, style, image_file, *metal_args in WORKSHOP_PHOTO_SAMPLES:
        if await db.catalogue_items.find_one({'design_code': code}):
            continue
        metal = metal_args[0] if metal_args else 'Gold'
        category = await db.categories.find_one({'name': category_name, 'metal_type': metal, 'active': True})
        if not category:
            continue
        now = datetime.now(timezone.utc)
        image_url = image_base + image_file
        await db.catalogue_items.insert_one({
            'name': name,
            'slug': slugify(f'{metal}-{name}-{code}'),
            'design_code': code,
            'metal_type': metal,
            'category_id': str(category['_id']),
            'subcategory': '',
            'description': 'Photo supplied for design reference. Confirm metal, purity, exact weight, and availability with the workshop before ordering.',
            'style': style,
            'weight_range': 'Confirm with workshop',
            'featured': False,
            'published': True,
            'sample': True,
            'images': [{'id': code.lower() + '-image', 'url': image_url, 'alt': name}],
            'primary_image': image_url,
            'source_url': None,
            'created_at': now,
            'updated_at': now,
            'deleted_at': None,
        })
    cascade_primary = image_base + 'bjw-gold-crystal-cascade-earrings.webp'
    await db.catalogue_items.update_one(
        {'design_code': 'BJW-G-REF-136'},
        {'$set': {
            'primary_image': cascade_primary,
            'images': [
                {'id': 'bjw-g-ref-136-image', 'url': cascade_primary, 'alt': 'Crystal Cascade Earrings'},
                {'id': 'bjw-g-ref-136-image-2', 'url': image_base + 'bjw-gold-crystal-cascade-earrings-detail.webp', 'alt': 'Crystal Cascade Earrings, alternate view'},
            ],
        }},
    )
    await db.staged_imports.create_index([('review_status',1),('created_at',-1)])
    if settings.bootstrap_admin_email and settings.bootstrap_admin_password:
        await db.admin_users.update_one({'email':settings.bootstrap_admin_email.lower()},{'$setOnInsert':{'email':settings.bootstrap_admin_email.lower(),'password_hash':hash_password(settings.bootstrap_admin_password),'role':'admin','created_at':datetime.now(timezone.utc)}},upsert=True)
    Path(settings.upload_dir).mkdir(parents=True,exist_ok=True)
    yield
    client.close()

app=FastAPI(title='Balaji Jewellery Works API',version='1.0.0',lifespan=lifespan)
limiter=Limiter(key_func=get_remote_address)
app.state.limiter=limiter
app.add_exception_handler(RateLimitExceeded,_rate_limit_exceeded_handler)
app.add_middleware(CORSMiddleware,allow_origins=[v.strip() for v in settings.cors_origins.split(',')],allow_credentials=True,allow_methods=['*'],allow_headers=['*'])
if settings.storage_backend.lower() != 'r2':
    Path(settings.upload_dir).mkdir(parents=True,exist_ok=True)
    app.mount('/uploads',StaticFiles(directory=settings.upload_dir),name='uploads')

@app.get('/health')
async def health():
    await db.command('ping'); return {'status':'ok'}

@app.get('/api/catalogue')
async def catalogue(metal_type:Optional[str]=None,category_id:Optional[str]=None,style:Optional[str]=None,search:Optional[str]=None,featured:Optional[bool]=None,page:int=Query(1,ge=1),limit:int=Query(24,ge=1,le=60)):
    query={'published':True,'deleted_at':None}
    if metal_type in ('Gold','Silver'): query['metal_type']=metal_type
    if category_id: query['category_id']=category_id
    if style: query['style']=style
    if featured is not None: query['featured']=featured
    if search: query['$or']=[{'name':{'$regex':re.escape(search),'$options':'i'}},{'design_code':{'$regex':re.escape(search),'$options':'i'}}]
    total=await db.catalogue_items.count_documents(query)
    cursor=db.catalogue_items.find(query).sort('created_at',-1).skip((page-1)*limit).limit(limit)
    rows=[public(x) async for x in cursor]
    return {'items':rows,'total':total,'page':page,'pages':(total+limit-1)//limit}

@app.get('/api/catalogue/featured')
async def featured():
    return [public(x) async for x in db.catalogue_items.find({'published':True,'featured':True,'deleted_at':None}).sort('created_at',-1).limit(8)]

@app.get('/api/catalogue/{slug}')
async def catalogue_item(slug:str):
    item=await db.catalogue_items.find_one({'slug':slug,'published':True,'deleted_at':None})
    if not item: raise HTTPException(404,'Design not found')
    return public(item)

@app.get('/api/categories')
async def categories():
    return [public(c) async for c in db.categories.find({'active':True}).sort('display_order',1)]

@app.get('/api/business')
async def business():
    doc = await db.business_settings.find_one({'_id':'main'}) or {'shop_name':'Balaji Jewellery Works','about':'Handcrafted jewellery designs, made to your preference.'}
    doc.pop('_id', None)
    return doc

@app.post('/api/enquiries')
@limiter.limit('5/hour')
async def create_enquiry(request: Request, body: ContactEnquiryIn):
    # Quietly discard likely bot submissions from the hidden honeypot field.
    if body.website:
        return {'ok': True}
    now = datetime.now(timezone.utc)
    await db.enquiries.insert_one({
        'name': body.name,
        'phone': body.phone,
        'email': body.email,
        'interest': body.interest,
        'message': body.message,
        'status': 'new',
        'consent_at': now,
        'created_at': now,
    })
    return {'ok': True, 'message': 'Your enquiry was received. We will contact you soon.'}

@app.post('/api/admin/login')
@limiter.limit('5/minute')
async def login(request:Request,body:LoginIn):
    user=await db.admin_users.find_one({'email':body.email.lower()})
    if not user or not verify_password(body.password,user['password_hash']): raise HTTPException(401,'Email or password is incorrect')
    return {'access_token':issue_token(user['email']),'token_type':'bearer'}

@app.get('/api/admin/overview')
async def overview(_:str=Depends(require_admin)):
    match={'deleted_at':None}
    return {'total_designs':await db.catalogue_items.count_documents(match),'gold_designs':await db.catalogue_items.count_documents({**match,'metal_type':'Gold'}),'silver_designs':await db.catalogue_items.count_documents({**match,'metal_type':'Silver'}),'categories':await db.categories.count_documents({'active':True}),'total_images':await db.catalogue_items.aggregate([{'$match':match},{'$project':{'n':{'$size':{'$ifNull':['$images',[]]}}}},{'$group':{'_id':None,'n':{'$sum':'$n'}}}]).to_list(1),'imports':await db.scraping_jobs.count_documents({})}

@app.get('/api/admin/catalogue')
async def admin_catalogue(_:str=Depends(require_admin)):
    return [public(x) async for x in db.catalogue_items.find({'deleted_at':None}).sort('created_at',-1)]

@app.get('/api/admin/enquiries')
async def admin_enquiries(_:str=Depends(require_admin)):
    return [public(x) async for x in db.enquiries.find().sort('created_at', -1).limit(200)]

@app.delete('/api/admin/enquiries/{enquiry_id}')
async def delete_enquiry(enquiry_id:str,_:str=Depends(require_admin)):
    if not ObjectId.is_valid(enquiry_id): raise HTTPException(404, 'Enquiry not found')
    result = await db.enquiries.delete_one({'_id': ObjectId(enquiry_id)})
    if not result.deleted_count: raise HTTPException(404, 'Enquiry not found')
    return {'ok': True}

@app.post('/api/admin/catalogue')
async def create_design(body:DesignIn,_:str=Depends(require_admin)):
    now=datetime.now(timezone.utc); data=body.model_dump(); data.update({'slug':slugify(data['metal_type']+'-'+data['name']+'-'+data['design_code']),'images':[],'primary_image':None,'source_url':None,'created_at':now,'updated_at':now,'deleted_at':None})
    try: result=await db.catalogue_items.insert_one(data)
    except Exception as exc: raise HTTPException(409,'Design code or URL already exists') from exc
    return public(await db.catalogue_items.find_one({'_id':result.inserted_id}))

@app.put('/api/admin/catalogue/{item_id}')
async def update_design(item_id:str,body:DesignIn,_:str=Depends(require_admin)):
    if not ObjectId.is_valid(item_id): raise HTTPException(404,'Design not found')
    data=body.model_dump(); data.update({'slug':slugify(data['metal_type']+'-'+data['name']+'-'+data['design_code']),'updated_at':datetime.now(timezone.utc)})
    try: result=await db.catalogue_items.update_one({'_id':ObjectId(item_id),'deleted_at':None},{'$set':data})
    except Exception as exc: raise HTTPException(409,'Design code or URL already exists') from exc
    if not result.matched_count: raise HTTPException(404,'Design not found')
    return public(await db.catalogue_items.find_one({'_id':ObjectId(item_id)}))

@app.delete('/api/admin/catalogue/{item_id}')
async def delete_design(item_id:str,_:str=Depends(require_admin)):
    if not ObjectId.is_valid(item_id): raise HTTPException(404,'Design not found')
    await db.catalogue_items.update_one({'_id':ObjectId(item_id)},{'$set':{'deleted_at':datetime.now(timezone.utc),'published':False}}); return {'ok':True}

@app.post('/api/admin/catalogue/{item_id}/images')
async def upload_images(item_id:str,files:list[UploadFile]=File(...),_:str=Depends(require_admin)):
    if not ObjectId.is_valid(item_id): raise HTTPException(404,'Design not found')
    paths=[]
    for file in files:
        raw=await file.read(settings.max_upload_mb*1024*1024+1)
        if len(raw)>settings.max_upload_mb*1024*1024: raise HTTPException(413,'Image exceeds the 8 MB limit')
        try:
            image=Image.open(BytesIO(raw)); image.verify()
            if image.format not in {'JPEG','PNG','WEBP'}: raise ValueError()
        except Exception: raise HTTPException(400,'Only valid JPEG, PNG, and WebP images are accepted')
        im=Image.open(BytesIO(raw)).convert('RGB'); im.thumbnail((1800,1800)); output=BytesIO(); im.save(output,'WEBP',quality=86)
        url=await save_image(output.getvalue())
        paths.append({'id':uuid4().hex,'url':url,'alt':file.filename or 'Jewellery design'})
    doc=await db.catalogue_items.find_one({'_id':ObjectId(item_id),'deleted_at':None})
    if not doc: raise HTTPException(404,'Design not found')
    await db.catalogue_items.update_one({'_id':ObjectId(item_id)},{'$push':{'images':{'$each':paths}},'$set':{'updated_at':datetime.now(timezone.utc)}})
    if not doc.get('primary_image') and paths: await db.catalogue_items.update_one({'_id':ObjectId(item_id)},{'$set':{'primary_image':paths[0]['url']}})
    return paths

@app.delete('/api/admin/catalogue/{item_id}/images/{image_id}')
async def delete_image(item_id:str,image_id:str,_:str=Depends(require_admin)):
    doc=await db.catalogue_items.find_one({'_id':ObjectId(item_id)}) if ObjectId.is_valid(item_id) else None
    if not doc: raise HTTPException(404,'Design not found')
    image=next((x for x in doc.get('images',[]) if x.get('id')==image_id),None)
    if not image: raise HTTPException(404,'Image not found')
    await delete_image(image['url'])
    remaining=[x for x in doc['images'] if x.get('id')!=image_id]
    await db.catalogue_items.update_one({'_id':doc['_id']},{'$set':{'images':remaining,'primary_image':remaining[0]['url'] if remaining else None}})
    return {'ok':True}

@app.post('/api/admin/categories')
async def create_category(body:CategoryIn,_:str=Depends(require_admin)):
    data=body.model_dump(); data['slug']=slugify(data['name'])
    result=await db.categories.insert_one(data); return public(await db.categories.find_one({'_id':result.inserted_id}))

@app.put('/api/admin/categories/{category_id}')
async def update_category(category_id:str,body:CategoryIn,_:str=Depends(require_admin)):
    if not ObjectId.is_valid(category_id): raise HTTPException(404,'Category not found')
    data=body.model_dump(); data['slug']=slugify(data['name'])
    result=await db.categories.update_one({'_id':ObjectId(category_id)},{'$set':data})
    if not result.matched_count: raise HTTPException(404,'Category not found')
    return public(await db.categories.find_one({'_id':ObjectId(category_id)}))

@app.delete('/api/admin/categories/{category_id}')
async def delete_category(category_id:str,_:str=Depends(require_admin)):
    if not ObjectId.is_valid(category_id): raise HTTPException(404,'Category not found')
    await db.categories.update_one({'_id':ObjectId(category_id)},{'$set':{'active':False}}); return {'ok':True}

@app.put('/api/admin/business')
async def update_business(body:BusinessIn,_:str=Depends(require_admin)):
    await db.business_settings.update_one({'_id':'main'},{'$set':body.model_dump()},upsert=True); return await business()

async def run_scrape_job(job_id: ObjectId, source_url: str, image_reuse_confirmed: bool):
    await db.scraping_jobs.update_one({'_id':job_id},{'$set':{'status':'running'}})
    try:
        result = await collect_product(source_url, image_reuse_confirmed)
        stage = {
            'job_id': str(job_id), 'source_url': result['source_url'],
            'metadata': result['metadata'], 'image_references': result['image_references'],
            'source_images': result['source_images'], 'image_errors': result['image_errors'],
            'rights_status': result['rights_status'], 'review_status':'pending',
            'created_at': datetime.now(timezone.utc),
        }
        await db.staged_imports.insert_one(stage)
        await db.scraping_jobs.update_one({'_id':job_id},{'$set':{
            'status':'completed','items_found':1,'items_imported':0,
            'completed_at':datetime.now(timezone.utc),
            'errors':result['image_errors'], 'staged_import_id':str(stage.get('_id','')),
        }})
    except Exception as exc:
        await db.scraping_jobs.update_one({'_id':job_id},{'$set':{'status':'failed','errors':[str(exc)[:500]],'completed_at':datetime.now(timezone.utc)}})

@app.post('/api/admin/scraping/start')
async def start_scraping(body:ScrapeStartIn,background_tasks:BackgroundTasks,_:str=Depends(require_admin)):
    job={'source':body.source_url,'image_reuse_confirmed':body.image_reuse_confirmed,'status':'queued','items_found':0,'items_imported':0,'errors':[],'started_at':datetime.now(timezone.utc),'completed_at':None}
    result=await db.scraping_jobs.insert_one(job)
    background_tasks.add_task(run_scrape_job,result.inserted_id,body.source_url,body.image_reuse_confirmed)
    return {'id':str(result.inserted_id),'status':'queued','message':'Fetching permitted product-page details and staging the result for admin review. Nothing will be published automatically.'}

@app.get('/api/admin/scraping/jobs')
async def scraping_jobs(_:str=Depends(require_admin)):
    return [public(x) async for x in db.scraping_jobs.find().sort('started_at',-1).limit(100)]

@app.get('/api/admin/imports')
async def imports(_:str=Depends(require_admin)):
    return [public(x) async for x in db.staged_imports.find().sort('created_at',-1).limit(200)]

@app.post('/api/admin/imports/{import_id}/approve')
async def approve_import(import_id:str,_:str=Depends(require_admin)):
    if not ObjectId.is_valid(import_id): raise HTTPException(404,'Import not found')
    result=await db.staged_imports.update_one({'_id':ObjectId(import_id),'rights_status':{'$in':['approved','metadata_only']}},{'$set':{'review_status':'approved','rights_verified_at':datetime.now(timezone.utc),'reviewed_at':datetime.now(timezone.utc)}})
    if not result.matched_count: raise HTTPException(400,'Usage rights must be verified before approval')
    return {'ok':True}

@app.delete('/api/admin/imports/{import_id}')
async def delete_import(import_id:str,_:str=Depends(require_admin)):
    if not ObjectId.is_valid(import_id): raise HTTPException(404,'Import not found')
    staged = await db.staged_imports.find_one({'_id':ObjectId(import_id)})
    if not staged: raise HTTPException(404,'Import not found')
    for image in staged.get('image_references', []):
        await delete_image(image.get('url',''))
    await db.staged_imports.delete_one({'_id':ObjectId(import_id)})
    return {'ok':True}
