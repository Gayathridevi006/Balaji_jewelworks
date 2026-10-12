from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    mongo_uri: str = 'mongodb://mongo:27017'
    mongo_db: str = 'balaji_jewelry'
    jwt_secret: str = 'change-this-before-deploying'
    jwt_expiry_minutes: int = 480
    cors_origins: str = 'http://localhost:3000'
    upload_dir: str = '/data/uploads'
    max_upload_mb: int = 8
    storage_backend: str = 'local'
    r2_account_id: str = ''
    r2_access_key_id: str = ''
    r2_secret_access_key: str = ''
    r2_bucket_name: str = ''
    r2_public_base_url: str = ''
    bootstrap_admin_email: str = ''
    bootstrap_admin_password: str = ''
    model_config = SettingsConfigDict(env_file='.env', extra='ignore')

settings = Settings()
