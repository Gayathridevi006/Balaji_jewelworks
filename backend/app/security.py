from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from .config import settings

pwd = CryptContext(schemes=['bcrypt'], deprecated='auto')
bearer = HTTPBearer(auto_error=False)

def hash_password(value: str) -> str:
    return pwd.hash(value)

def verify_password(value: str, hashed: str) -> bool:
    return pwd.verify(value, hashed)

def issue_token(subject: str) -> str:
    expiry = datetime.now(timezone.utc) + timedelta(minutes=settings.jwt_expiry_minutes)
    return jwt.encode({'sub': subject, 'exp': expiry}, settings.jwt_secret, algorithm='HS256')

async def require_admin(credentials: HTTPAuthorizationCredentials | None = Depends(bearer)):
    if not credentials:
        raise HTTPException(401, 'Authentication required')
    try:
        payload = jwt.decode(credentials.credentials, settings.jwt_secret, algorithms=['HS256'])
        return payload['sub']
    except (JWTError, KeyError):
        raise HTTPException(401, 'Invalid or expired session')
