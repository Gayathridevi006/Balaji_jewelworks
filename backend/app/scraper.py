"""Permission-aware scraper for product pages administered by the business."""
from __future__ import annotations
import asyncio, ipaddress, json, socket
from io import BytesIO
from urllib.parse import urljoin, urlparse, urldefrag
from urllib.robotparser import RobotFileParser
from uuid import uuid4

import httpx
from bs4 import BeautifulSoup
from PIL import Image, ImageOps
from .storage import save_image

USER_AGENT = 'BalajiJewelryCatalogueBot/1.0 (+contact business administrator)'
MAX_PAGE_BYTES = 3 * 1024 * 1024
MAX_IMAGE_BYTES = 8 * 1024 * 1024
MIN_IMAGE_SIDE = 320
MAX_IMAGES = 6


def validate_public_url(url: str) -> str:
    parsed = urlparse(url)
    if parsed.scheme != 'https' or not parsed.hostname or parsed.username or parsed.password:
        raise ValueError('Only public HTTPS URLs without embedded credentials are accepted')
    try:
        addresses = socket.getaddrinfo(parsed.hostname, parsed.port or 443, type=socket.SOCK_STREAM)
    except socket.gaierror as exc:
        raise ValueError('Unable to resolve URL host') from exc
    if not addresses or any(not ipaddress.ip_address(item[4][0]).is_global for item in addresses):
        raise ValueError('Private or local network URLs are not allowed')
    return url


async def safe_get(client: httpx.AsyncClient, url: str, *, max_bytes: int, redirects: int = 3) -> httpx.Response:
    current = validate_public_url(url)
    for _ in range(redirects + 1):
        response = await client.get(current, headers={'User-Agent': USER_AGENT}, follow_redirects=False)
        if response.status_code not in (301, 302, 303, 307, 308):
            response.raise_for_status()
            if len(response.content) > max_bytes:
                raise ValueError('Remote response exceeds the allowed size')
            return response
        location = response.headers.get('location')
        if not location:
            raise ValueError('Remote server returned an invalid redirect')
        current = validate_public_url(urljoin(current, location))
    raise ValueError('Too many redirects')


async def allowed_by_robots(client: httpx.AsyncClient, url: str) -> bool:
    parsed = urlparse(url)
    robots_url = f'{parsed.scheme}://{parsed.netloc}/robots.txt'
    try:
        response = await safe_get(client, robots_url, max_bytes=256 * 1024)
        parser = RobotFileParser(robots_url)
        parser.parse(response.text.splitlines())
        return parser.can_fetch(USER_AGENT, url)
    except httpx.HTTPStatusError as exc:
        if exc.response.status_code == 404:
            return True
        return False
    except (httpx.HTTPError, ValueError):
        return False


def product_data(page_url: str, html: str) -> tuple[dict, list[dict]]:
    soup = BeautifulSoup(html, 'html.parser')
    def meta(*keys: str) -> str:
        for key in keys:
            node = soup.find('meta', attrs={'property': key}) or soup.find('meta', attrs={'name': key})
            if node and node.get('content'):
                return ' '.join(node['content'].split())[:3000]
        return ''

    title = meta('og:title', 'twitter:title') or (soup.title.get_text(' ', strip=True) if soup.title else '')
    description = meta('og:description', 'description', 'twitter:description')
    image_urls = []
    for key in ('og:image', 'twitter:image'):
        value = meta(key)
        if value:
            image_urls.append(value)

    structured: list[dict] = []
    for node in soup.find_all('script', type='application/ld+json'):
        try:
            decoded = json.loads(node.string or node.get_text())
            values = decoded if isinstance(decoded, list) else [decoded]
            for value in values:
                if isinstance(value, dict) and isinstance(value.get('@graph'), list):
                    values.extend(x for x in value['@graph'] if isinstance(x, dict))
            structured.extend(x for x in values if isinstance(x, dict))
        except (json.JSONDecodeError, TypeError):
            continue
    product = next((node for node in structured if 'product' in str(node.get('@type', '')).lower()), {})
    supplier_code = ''
    brand = ''
    if product:
        supplier_code = str(product.get('sku') or product.get('mpn') or '')[:100]
        raw_brand = product.get('brand', '')
        brand = (str(raw_brand.get('name', '')) if isinstance(raw_brand, dict) else str(raw_brand))[:200]
        title = title or str(product.get('name', ''))[:300]
        description = description or str(product.get('description', ''))[:3000]
        images = product.get('image', [])
        if isinstance(images, str): images = [images]
        if isinstance(images, list): image_urls.extend(x for x in images if isinstance(x, str))

    for node in soup.select('img[src], img[data-src]'):
        src = node.get('data-src') or node.get('src')
        if src and (node.get('alt') or node.get('width') or node.get('height')):
            image_urls.append(src)
    unique = []
    seen = set()
    for raw in image_urls:
        url = urldefrag(urljoin(page_url, raw.strip()))[0]
        if url.startswith('https://') and url not in seen:
            seen.add(url)
            unique.append({'url': url, 'alt': (soup.find('img', src=raw) or {}).get('alt', '')[:300]})
        if len(unique) >= MAX_IMAGES:
            break
    metal_text = (title + ' ' + description + ' ' + soup.get_text(' ', strip=True)[:3000]).lower()
    metal = 'Gold' if any(k in metal_text for k in ('gold', '22k', '18k', '14k')) else ('Silver' if 'silver' in metal_text or '925' in metal_text else None)
    category = None
    for term in ('nose pin', 'jhumka', 'earring', 'necklace', 'bracelet', 'pendant', 'anklet', 'bangle', 'chain', 'ring'):
        if term in metal_text:
            category = term.title()
            break
    return {'name': title[:300], 'description': description, 'metal_type': metal, 'category_suggestion': category, 'supplier_code': supplier_code, 'brand': brand}, unique


async def collect_product(url: str, allow_image_reuse: bool) -> dict:
    validate_public_url(url)
    timeout = httpx.Timeout(20, connect=8)
    async with httpx.AsyncClient(timeout=timeout) as client:
        if not await allowed_by_robots(client, url):
            raise ValueError('robots.txt does not allow this page, or could not be checked')
        response = await safe_get(client, url, max_bytes=MAX_PAGE_BYTES)
        content_type = response.headers.get('content-type', '').lower()
        if 'text/html' not in content_type:
            raise ValueError('Source URL did not return an HTML product page')
        metadata, refs = product_data(str(response.url), response.text)
        saved = []
        image_errors = []
        if allow_image_reuse:
            for ref in refs:
                try:
                    if not await allowed_by_robots(client, ref['url']):
                        image_errors.append('Image URL disallowed by robots.txt')
                        continue
                    image_response = await safe_get(client, ref['url'], max_bytes=MAX_IMAGE_BYTES)
                    if not image_response.headers.get('content-type', '').lower().startswith('image/'):
                        continue
                    image = Image.open(BytesIO(image_response.content))
                    image = ImageOps.exif_transpose(image)
                    if image.width < MIN_IMAGE_SIDE or image.height < MIN_IMAGE_SIDE or image.width * image.height > 40_000_000:
                        continue
                    image.thumbnail((1800, 1800))
                    image = image.convert('RGB')
                    output = BytesIO()
                    image.save(output, 'WEBP', quality=86, method=6)
                    image_url = await save_image(output.getvalue())
                    saved.append({'id': uuid4().hex, 'url': image_url, 'source_url': ref['url'], 'alt': ref['alt'] or metadata['name'] or 'Supplier product image', 'width': image.width, 'height': image.height})
                except (httpx.HTTPError, ValueError, OSError) as exc:
                    image_errors.append(str(exc)[:250])
                await asyncio.sleep(0.5)
        return {'metadata': metadata, 'image_references': saved, 'source_images': refs, 'image_errors': image_errors, 'rights_status': 'approved' if allow_image_reuse else 'metadata_only', 'source_url': str(response.url)}
