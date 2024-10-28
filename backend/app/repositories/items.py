from repositories.base import CRUDBase
from models.item import Item
from schemas.items import  ItemInDB, ItemUpdate

CRUDItem = CRUDBase[Item, ItemInDB, ItemUpdate]
crud_item = CRUDItem(Item)