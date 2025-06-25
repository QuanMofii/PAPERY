from fastcrud import FastCRUD

from ..models.user import User
from ..schemas.user import UserCreateInternal, UserDeleteInternal, UserUpdateInternal, UserReadInternal

CRUDUser = FastCRUD[
    User,
    UserCreateInternal,
    UserUpdateInternal,
    UserUpdateInternal,
    UserDeleteInternal,
    UserReadInternal
]
crud_users = CRUDUser(User)
