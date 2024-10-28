from datetime import datetime
from utils.errors.user import UserNotFoundError
from core.security import get_password_hash
from repositories.users import crud_user
from schemas.users import UserCreate, UserUpdate, UserInDB,UserUpdate


class UserService:
    def __init__(self):
        pass
    async def get_multi_users_service(self, session, offset: int, limit: int,kwargs):
        result =  await crud_user.get_multi(session, offset=offset, limit=limit,**kwargs )
        if not result:
            raise UserNotFoundError()
        return  result 

    async def get_user_service(self, session, user_id: int, kwargs):
        result = await crud_user.get(session, id=user_id,**kwargs )
        return  result
    
    async def create_user_service(self, session, user_in: UserCreate,kwargs):
        obj_in = UserInDB(
            **user_in.dict(),
            hashed_password=get_password_hash(user_in.password),
            created_at=datetime.now()  
        )
        result = await crud_user.create(session, obj_in,**kwargs)
        return result

    async def update_user_service(self, session, user_id: int, user_in: UserUpdate,kwargs):
        obj_in = UserUpdate(
            **user_in.dict(exclude_unset=True, exclude_none=True),
        )
        if user_in.password:
            obj_in["hashed_password"] = get_password_hash(user_in.password)
        result = await crud_user.update(session, id=user_id, obj_in= obj_in,**kwargs )
        return result

    async def delete_user_service(self, session, user_id: int,kwargs):
        result= await crud_user.delete(session, id=user_id,**kwargs )
        if not result:
            return UserNotFoundError()
        return {"message": "Delete success"}
        
      
  
