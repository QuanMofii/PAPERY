from datetime import datetime, timedelta

from authlib.jose import jwt
from passlib.context import CryptContext

from core.config import settings
from schemas.users import User

import uuid

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


ALGORITHM=settings.ALGORITHM

def create_access_token(user: User) -> str:
    expire = datetime.now() + timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
    header = {"alg": settings.ALGORITHM }  
    payload = {
        "exp": expire,  
        "user_id": str(user.id),  
    }

    token = jwt.encode(header, payload, key=settings.SECRET_KEY)
    return token
def create_refresh_token() -> str:
    expire = datetime.now() + timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
    refresh_token =str(uuid.uuid4()) 
    return refresh_token, expire 

def create_verify_code() -> str:
    expire =settings.VERIFY_CODE_EXPIRE_MINUTES
    verify_code =str(uuid.uuid4()) 
    return verify_code, expire 
def create_state() -> str:
    state =str(uuid.uuid4()) 
    return state

def is_valid_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)




