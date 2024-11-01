
from repositories.base2 import BaseRepository

from schemas.users import User

class UserRepository(BaseRepository[User, User]):
    def __init__(self):
        super().__init__( User, User)