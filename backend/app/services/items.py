from repositories.items import items_repo
from schemas.items import ItemCreate, ItemUpdate, ItemInDB

from utils.errors.item import ItemNotFoundError

class ItemService:
    def __init__(self):
        pass
    
    async def get_item_service(self,session, item_id: int,kwargs):
        result = await items_repo.get(session, id=item_id, **kwargs)
        return result

    
    async def get_multi_items_service(self,session, offset: int, limit: int,kwargs):
        result= await items_repo.get_multi(session, offset=offset, limit=limit,**kwargs )
        if not result:
            raise ItemNotFoundError()
        return result
    
    
    async def create_item_service(self,  session, item_in: ItemCreate,kwargs):
        obj_in = ItemInDB(
            **item_in.dict()
            )
        result= await items_repo.create(session, obj_in = obj_in,**kwargs )
        return result

    
    async def update_item_service(self, session, item_id: int, item_in: ItemUpdate,kwargs):
        obj_in = ItemUpdate(
            **item_in.dict(exclude_unset=True, exclude_none=True)
            )
        result =await items_repo.update(session,id=item_id, obj_in = obj_in,**kwargs )
        return result
    
    async def delete_item_service(self, session, item_id: int,kwargs):
        result = await items_repo.delete(session, id=item_id,**kwargs )
        if not result:
            return ItemNotFoundError()
        return {"message": "Delete success"}
    
  
