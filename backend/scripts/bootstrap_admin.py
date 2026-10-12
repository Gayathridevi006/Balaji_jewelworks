import asyncio
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
from app.security import hash_password

DEFAULT_CATEGORIES=['Earrings','Rings','Necklaces','Chains','Bangles','Bracelets','Pendants','Anklets','Nose Pins','Jhumkas','Haram','Mangalsutra','Traditional Jewellery','Bridal Jewellery','Kids Jewellery','Custom Designs']
async def main():
    if not settings.bootstrap_admin_email or len(settings.bootstrap_admin_password)<12:
        raise SystemExit('Set BOOTSTRAP_ADMIN_EMAIL and a 12+ character BOOTSTRAP_ADMIN_PASSWORD')
    client=AsyncIOMotorClient(settings.mongo_uri); db=client[settings.mongo_db]
    await db.admin_users.update_one({'email':settings.bootstrap_admin_email.lower()},{'$setOnInsert':{'email':settings.bootstrap_admin_email.lower(),'password_hash':hash_password(settings.bootstrap_admin_password),'role':'admin','created_at':datetime.now(timezone.utc)}},upsert=True)
    for idx,name in enumerate(DEFAULT_CATEGORIES):
        await db.categories.update_one({'name':name},{'$setOnInsert':{'name':name,'slug':name.lower().replace(' ','-'),'metal_type':'Both','display_order':idx,'active':True}},upsert=True)
    await db.business_settings.update_one({'_id':'main'},{'$setOnInsert':{'shop_name':'Balaji Jewelry Works'}},upsert=True)
    client.close(); print('Admin, starter categories, and business settings initialized.')
asyncio.run(main())
