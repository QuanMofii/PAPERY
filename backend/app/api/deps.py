from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

from sqlalchemy.ext.asyncio import AsyncSession

from datetime import datetime, timezone
from typing import Annotated,Optional, Dict

from authlib.jose import jwt
from core.config import settings
from db.db import SessionLocal

from schemas.users import User
from schemas.tokens import AccessTokenPayload

from services.users import UserService
from utils.errors.token import AccessTokenInvalidError, AccessTokenExpiredError

from logging import getLogger


logger = getLogger(__name__)

user_service = UserService()


oauth2 = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login",
)

async def get_session():
    async with SessionLocal() as session:
        yield session

SessionDep = Annotated[AsyncSession, Depends(get_session)]
TokenDep = Annotated[str, Depends(oauth2)]


async def get_token_data(token: TokenDep) -> AccessTokenPayload:
    try:
        secret_key = settings.SECRET_KEY

        payload = jwt.decode(token, key=secret_key)
        if datetime.fromtimestamp(payload["exp"], tz=timezone.utc) < datetime.now(tz=timezone.utc):
            raise  AccessTokenExpiredError()

        token_data = AccessTokenPayload(**payload)

    except Exception as e:
        raise AccessTokenInvalidError()
    return token_data


async def get_current_user( 
    session: SessionDep,
    # token: AccessTokenPayload = get_token_data()
    token: AccessTokenPayload = Depends(get_token_data)
):  
    user = await user_service.get_user_service(session, user_id=token.user_id,kwargs={})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found", headers={"WWW-Authenticate": "Bearer"})
    return user

CurrentUser = Annotated[User, Depends(get_current_user)]

async def get_current_active_user(current_user: CurrentUser):
    if current_user.is_active is False:
        raise HTTPException(status_code=400, detail="Inactive user",headers={"WWW-Authenticate": "Bearer"},)
    return current_user

CurrentActiveUser = Annotated[User, Depends(get_current_active_user)]

def RoleChecker(allowed_roles: list[str]):
    async def role_checker(
        current_user: User = Depends(get_current_user)
    ) -> User:

        if current_user.role not in allowed_roles:
            raise HTTPException(status_code=403,detail={"message": f"Not enough permissions", "code": 403},)
        return current_user
    return role_checker

async def check_permissions(
    current_user,
    action: str,
    obj_in: Optional[dict] = None,
    owner_field: str = "owner_id",
    id: Optional[int] = None
) -> Dict[str, any]:
    if current_user.role == "admin":
        return {}

    if id and id != current_user.id:
        raise HTTPException(status_code=403, detail={"message": "You are not allowed to perform this action", "code": 403})

    kwargs = {}

    if action == "create":
        if obj_in.get(owner_field) and obj_in[owner_field] != current_user.id:
            raise HTTPException(status_code=403, detail={"message": "You are not allowed to perform this action", "code": 403})
            
    if action in ["get", "get_multi", "update", "delete"]:
        if id is None:
            kwargs[owner_field] = current_user.id
    return kwargs

def handle_service_result(result):
    if isinstance(result, Exception):
        raise HTTPException(status_code=result.code, detail={"message": result.message, "code": result.code})
    return result