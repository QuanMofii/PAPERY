from repositories.base import CRUDBase
from models.user import User
from schemas.users import UserInDB,UserUpdate

CRUDUser = CRUDBase[User, UserInDB, UserUpdate]
crud_user = CRUDUser(User)