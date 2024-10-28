from fastapi import APIRouter, Depends, HTTPException

from api.deps import SessionDep, RoleChecker, check_permissions

from schemas.users import UserCreate, User, UserUpdate
from schemas.utils import Message
from services.users import UserService

user_service = UserService()

router = APIRouter(prefix="/users")

@router.get("/", response_model=list[User])
async def get_users(
    session: SessionDep, 
    current_user: User = Depends(RoleChecker(["admin"])),                            
    offset: int = 0,
    limit: int = 100,
):  
    kwargs = await check_permissions(current_user, action="get_multi", owner_field="id")
    result = await user_service.get_multi_users_service(session=session, offset=offset, limit=limit, kwargs=kwargs)
    return  result
  

@router.get("/{user_id}/", response_model=User)
async def get_user(
    user_id: int,
    session: SessionDep,
    current_user: User = Depends(RoleChecker(["admin", "user"])), 
):
    kwargs = await check_permissions(current_user, action="get", owner_field="id", id=user_id)
    result = await user_service.get_user_service(session=session, user_id=user_id, kwargs=kwargs)
    return  result


@router.post("/", response_model=User)
async def create_user(
    session: SessionDep, 
    user_in: UserCreate, 
    current_user: User = Depends(RoleChecker(["admin"])) 
):
    kwargs = await check_permissions(current_user, action="create", obj_in=user_in.dict(), owner_field="id")
    result = await user_service.create_user_service(session=session, user_in=user_in, kwargs=kwargs)
    return  result

@router.put("/{user_id}/", response_model=User)
async def update_user(
    user_id: int,
    session: SessionDep,
    user_in: UserUpdate,
    current_user: User = Depends(RoleChecker([" admin"])) 
):
    kwargs = await check_permissions(current_user, action="update", owner_field="id", id=user_id)
    result = await user_service.update_user_service(session=session, user_id=user_id, user_in=user_in, kwargs=kwargs)
    return  result

@router.delete("/{user_id}/", response_model=Message)
async def delete_user(
    user_id: int,
    session: SessionDep,
    current_user: User = Depends(RoleChecker(["admin"])) 
):
    kwargs = await check_permissions(current_user, action="delete", owner_field="id")
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="You can't delete yourself")
    result = await user_service.delete_user_service(session=session, user_id=user_id, kwargs=kwargs)
    return  result
