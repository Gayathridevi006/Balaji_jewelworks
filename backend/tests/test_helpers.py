from app.utils import slugify

def test_slugify_design_code():
    assert slugify('Gold Earrings BJW-GE-001') == 'gold-earrings-bjw-ge-001'
