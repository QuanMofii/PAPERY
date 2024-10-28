from repositories.base import CRUDBase
from models.token import Token
from schemas.tokens import TokenInDB, TokenUpdate

CRUDToken= CRUDBase[Token,TokenInDB, TokenUpdate]
crud_token = CRUDToken(Token)