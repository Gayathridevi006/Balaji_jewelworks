import re
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
    audience: Optional[Literal['Men','Women','Unisex']] = None
    weight_range: Optional[str] = None
    featured: bool = False
    published: bool = False

class CategoryIn(BaseModel):
    name: str = Field(min_length=2, max_length=60)
    metal_type: Literal['Gold','Silver','Both'] = 'Both'
    display_order: int = 0
    active: bool = True

class BusinessIn(BaseModel):
    shop_name: str = 'Balaji Jewellery Works'
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

class ContactEnquiryIn(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    phone: str = Field(min_length=7, max_length=24)
    email: str = Field(default='', max_length=254)
    interest: str = Field(default='', max_length=120)
    message: str = Field(default='', max_length=2000)
    consent: bool
    website: str = Field(default='', max_length=200)

    @field_validator('name')
    @classmethod
    def clean_name(cls, value):
        value = ' '.join(value.split())
        if len(value) < 2:
            raise ValueError('Please enter your name')
        return value

    @field_validator('phone')
    @classmethod
    def valid_phone(cls, value):
        value = value.strip()
        digits = re.sub(r'\D', '', value)
        if not 7 <= len(digits) <= 15 or not re.fullmatch(r'[+0-9().\s-]+', value):
            raise ValueError('Enter a valid phone number with country code if needed')
        return value

    @field_validator('email')
    @classmethod
    def valid_optional_email(cls, value):
        value = value.strip().lower()
        if value and not re.fullmatch(r'[^@\s]+@[^@\s]+\.[^@\s]+', value):
            raise ValueError('Enter a valid email address')
        return value

    @field_validator('interest', 'message')
    @classmethod
    def trim_text(cls, value):
        return value.strip()

    @field_validator('consent')
    @classmethod
    def require_consent(cls, value):
        if not value:
            raise ValueError('Consent is required to submit this enquiry')
        return value

class ScrapeStartIn(BaseModel):
    source_url: str
    image_reuse_confirmed: bool = False

    @field_validator('source_url')
    @classmethod
    def safe_url(cls, value):
        from .scraper import validate_public_url
        return validate_public_url(value)
