from pydantic import BaseModel, Field, field_validator
from typing import Literal, Optional

class DesignIn(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    design_code: str = Field(min_length=3, max_length=40, pattern=r'^[A-Za-z0-9-]+$')
    metal_type: Literal['Gold','Silver']
    category_id: str
    subcategory: str = ''
    description: str = ''
    style: Literal['Traditional','Modern','Bridal','Classic','Contemporary'] = 'Traditional'
    weight_range: Optional[str] = None
    featured: bool = False
    published: bool = False

class CategoryIn(BaseModel):
    name: str = Field(min_length=2, max_length=60)
    metal_type: Literal['Gold','Silver','Both'] = 'Both'
    display_order: int = 0
    active: bool = True

class BusinessIn(BaseModel):
    shop_name: str = 'Balaji Jewelry Works'
    goldsmith_name: str = ''
    address: str = ''
    phone: str = ''
    whatsapp: str = ''
    email: str = ''
    maps_url: str = ''
    business_hours: str = ''
    about: str = ''
    logo: str = ''

class LoginIn(BaseModel):
    email: str
    password: str

class ScrapeStartIn(BaseModel):
    source_url: str
    @field_validator('source_url')
    @classmethod
    def safe_url(cls, value):
        from urllib.parse import urlparse
        parsed = urlparse(value)
        import ipaddress, socket
        if parsed.scheme != 'https' or not parsed.hostname:
            raise ValueError('Only public HTTPS URLs are supported')
        try:
            addresses = socket.getaddrinfo(parsed.hostname, None)
            if any(not ipaddress.ip_address(item[4][0]).is_global for item in addresses):
                raise ValueError('Private or local network URLs are not allowed')
        except socket.gaierror:
            raise ValueError('Unable to resolve source host')
        return value
