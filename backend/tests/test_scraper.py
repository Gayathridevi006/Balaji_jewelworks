import pytest
from app.scraper import product_data, validate_public_url

def test_extracts_product_details_and_image_urls():
    html='''<html><head>
    <meta property="og:title" content="Gold Jhumka Earrings">
    <meta property="og:description" content="Hand finished supplier design">
    <script type="application/ld+json">{"@type":"Product","name":"Gold Jhumka Earrings","sku":"SUP-123","image":["https://supplier.example/images/item.jpg"],"brand":{"name":"Supplier"}}</script>
    </head><body><img src="https://supplier.example/images/detail.jpg" alt="Side view"></body></html>'''
    metadata, images = product_data('https://supplier.example/products/item', html)
    assert metadata['name'] == 'Gold Jhumka Earrings'
    assert metadata['description'] == 'Hand finished supplier design'
    assert metadata['metal_type'] == 'Gold'
    assert metadata['category_suggestion'] == 'Jhumka'
    assert metadata['supplier_code'] == 'SUP-123'
    assert metadata['brand'] == 'Supplier'
    assert len(images) == 2

def test_scraper_rejects_non_https_and_private_addresses():
    with pytest.raises(ValueError):
        validate_public_url('http://supplier.example/item')
    with pytest.raises(ValueError):
        validate_public_url('https://127.0.0.1/private')
