from fastapi import APIRouter

router = APIRouter(tags=["utils"])

@router.get("/health-check/")
async def health_check() -> bool:
    return True