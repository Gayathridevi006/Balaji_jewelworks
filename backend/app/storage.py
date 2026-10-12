"""Image storage adapter for local development and Cloudflare R2 production."""
from pathlib import Path
from uuid import uuid4

from starlette.concurrency import run_in_threadpool

from .config import settings


def _r2_client():
    import boto3
    from botocore.config import Config
    if not all((settings.r2_account_id, settings.r2_access_key_id,
                settings.r2_secret_access_key, settings.r2_bucket_name,
                settings.r2_public_base_url)):
        raise RuntimeError('R2 storage is selected but its credentials, bucket, or public URL are not configured')
    return boto3.client(
        's3',
        endpoint_url=f'https://{settings.r2_account_id}.r2.cloudflarestorage.com',
        aws_access_key_id=settings.r2_access_key_id,
        aws_secret_access_key=settings.r2_secret_access_key,
        region_name='auto',
        config=Config(signature_version='s3v4', s3={'addressing_style': 'path'}),
    )


def _store_r2(key: str, content: bytes, content_type: str) -> None:
    _r2_client().put_object(
        Bucket=settings.r2_bucket_name,
        Key=key,
        Body=content,
        ContentType=content_type,
        CacheControl='public, max-age=31536000, immutable',
    )


async def save_image(content: bytes, content_type: str = 'image/webp') -> str:
    key = f'{uuid4().hex}.webp'
    if settings.storage_backend.lower() == 'r2':
        await run_in_threadpool(_store_r2, key, content, content_type)
        return f'{settings.r2_public_base_url.rstrip("/")}/{key}'
    target = Path(settings.upload_dir) / key
    target.parent.mkdir(parents=True, exist_ok=True)
    await run_in_threadpool(target.write_bytes, content)
    return f'/uploads/{key}'


def _delete_r2(key: str) -> None:
    _r2_client().delete_object(Bucket=settings.r2_bucket_name, Key=key)


async def delete_image(url: str) -> None:
    if settings.storage_backend.lower() == 'r2':
        base = settings.r2_public_base_url.rstrip('/') + '/'
        if url.startswith(base):
            key = url[len(base):]
            if key and '/' not in key:
                await run_in_threadpool(_delete_r2, key)
        return
    if url.startswith('/uploads/'):
        target = Path(settings.upload_dir) / Path(url).name
        await run_in_threadpool(target.unlink, missing_ok=True)
