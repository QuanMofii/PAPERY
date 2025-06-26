from fastcrud import FastCRUD

from ..models.rate_limit import RateLimit
from ..schemas.rate_limit import RateLimitCreateInternal, RateLimitDeleteInternal, RateLimitUpdateInternal, RateLimitReadInternal

CRUDRateLimit = FastCRUD[
    RateLimit,
    RateLimitCreateInternal,
    RateLimitUpdateInternal,
    RateLimitUpdateInternal,
    RateLimitDeleteInternal,
    RateLimitReadInternal
]
crud_rate_limits = CRUDRateLimit(RateLimit)
