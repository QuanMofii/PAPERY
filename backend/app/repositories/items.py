from repositories.base import BaseRepository
from models.item import Item
from schemas.items import Item as ItemSchema

items_repo = BaseRepository(Item, ItemSchema)