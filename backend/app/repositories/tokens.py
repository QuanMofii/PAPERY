

from repositories.base import BaseRepository
from models.token import Token 
from schemas.tokens import Token as TokenSchema

token_repo = BaseRepository(Token,TokenSchema )