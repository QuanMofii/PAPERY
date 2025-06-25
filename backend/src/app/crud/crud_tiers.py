from fastcrud import FastCRUD

from ..models.tier import Tier
from ..schemas.tier import TierCreateInternal, TierDeleteInternal, TierUpdateInternal, TierReadInternal

CRUDTier = FastCRUD[
    Tier,
    TierCreateInternal,
    TierUpdateInternal,
    TierUpdateInternal,
    TierDeleteInternal,
    TierReadInternal
]
crud_tiers = CRUDTier(Tier)
