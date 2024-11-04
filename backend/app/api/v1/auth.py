from fastapi import APIRouter, Depends, Request
from fastapi.security import OAuth2PasswordRequestForm

from schemas.tokens import TokenLogin
from schemas.users import UserCreate, UserMe, User
from schemas.auths import ChangePassword, TokenRefresh
from schemas.utils import Message

from services.auths import AuthService

from api.deps import SessionDep, RoleChecker

auth_service = AuthService()

router = APIRouter(prefix="/auth")

@router.post("/login", response_model=TokenLogin)
async def login(
    session: SessionDep,
    data: OAuth2PasswordRequestForm = Depends()):
    result = await auth_service.login_service(session, data=data)  
    return result

@router.post("/register",response_model=Message)
async def register(
    session: SessionDep,
    data: UserCreate):
    result = await auth_service.register_service(session, data)
    return result

@router.get("/login/{provider}")
async def oauth_login(request: Request, provider: str):
    result = await auth_service.oauth_login_service(request,provider)
    return result  

@router.get("/callback/{provider}")
async def oauth_callback(request: Request, provider: str, session: SessionDep):
    result = await auth_service.oauth_callback_service(request, provider, session)
    return result 

@router.post("/refresh-token", response_model=TokenLogin)
async def refresh_token(
    session: SessionDep,
    token_data: TokenRefresh, 
):
    result = await auth_service.refresh_token_service( session,token_data)
    return result

@router.get("/me", response_model=UserMe)
async def read_users_me(
    session: SessionDep,
    current_user: User = Depends(RoleChecker(["admin", "user"]))):
    result = current_user.model_dump()
    return result

@router.put("/update-password", response_model=Message)
async def update_password(
    session: SessionDep,
    data: ChangePassword, 
    current_user: User = Depends(RoleChecker(["admin", "user"]))
):
    result = await auth_service.change_password_service(session, data, current_user)
    return result