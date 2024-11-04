
from repositories.base import BaseRepository
from models.user import User  
from schemas.users import User as UserSchema

user_repo = BaseRepository(User, UserSchema)