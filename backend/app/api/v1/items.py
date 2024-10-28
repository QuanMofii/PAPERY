from fastapi import APIRouter, Depends

from api.deps import SessionDep, RoleChecker,check_permissions,handle_service_result

from schemas.items import Item, ItemCreate, ItemUpdate
from schemas.users import User
from schemas.utils import Message
from services.items import ItemService

item_service = ItemService()

router = APIRouter(prefix="/items")

@router.get("/", response_model=list[Item])
async def get_multi_items(
    session: SessionDep,
    current_user: User = Depends(RoleChecker(["admin", "user"])),
    offset: int = 0,
    limit: int = 100,
):
    """
    Retrieve items
    """
    kwargs = await check_permissions(current_user, action="get_multi")
    result = await item_service.get_multi_items_service( session=session, offset=offset, limit=limit, kwargs=kwargs)
    
    return result

@router.get("/{item_id}/", response_model=Item)
async def get_item(
    item_id: int,
    session: SessionDep,
    current_user: User = Depends(RoleChecker(["admin", "user"])),
):
    """
    Get a specific item by id
    """
    kwargs = await check_permissions(current_user, action="get")
    result = await item_service.get_item_service( session=session, item_id = item_id, kwargs=kwargs)
    
    return result

@router.post("/", response_model=Item)
async def create_item(
    item_in: ItemCreate,
    session: SessionDep,
    current_user: User = Depends(RoleChecker(["admin", "user"])),
):
    """
    Create new item
    """
    kwargs = await check_permissions(current_user, action="create", obj_in=item_in.dict())
    result = await item_service.create_item_service( session=session, item_in=item_in ,kwargs=kwargs)
    return result


@router.put("/{item_id}/", response_model=Item,)
async def update_item(
    item_id: int,
    item_in: ItemUpdate,
    session: SessionDep,
    current_user: User = Depends(RoleChecker(["admin"])),
):
    """
    Update an item
    """
    kwargs = await check_permissions(current_user,action="update",obj_in=item_in.dict())
    result = await item_service.update_item_service(session=session,item_id=item_id, item_in=item_in,  kwargs=kwargs)
    return result

@router.delete("/{item_id}/", response_model=Message)
async def delete_item(
    item_id: int,
    session: SessionDep,
    current_user: User = Depends(RoleChecker(["admin"])),
):
    """
    Delete an item
    """
    kwargs = await check_permissions(current_user, action="delete")
    result = await item_service.delete_item_service( session=session, item_id=item_id,  kwargs=kwargs)
    return result



