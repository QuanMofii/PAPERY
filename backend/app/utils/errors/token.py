from utils.errors.base import UnauthorizedError, ForbiddenError
# =======================
# Token Service Errors
# =======================
class AccessTokenInvalidError(UnauthorizedError):
    """
    Raised when an access token is invalid 
    """
    def __init__(self, language: str = "en"):
        super().__init__("invalid_access_token", language)


class RefreshTokenInvalidError(UnauthorizedError):
    """
    Raised when a refresh token is invalid or expired.
    """
    def __init__(self, language: str = "en"):
        super().__init__("invalid_refresh_token", language)

class AccessTokenExpiredError(UnauthorizedError):
    """
    Raised when a access token has expired.
    """
    def __init__(self, language: str = "en"):
        super().__init__("access_token_expired", language)


class RefreshTokenExpiredError(UnauthorizedError):
    """
    Raised when a refresh token has expired.
    """
    def __init__(self, language: str = "en"):
        super().__init__("refresh_token_expired", language)


class TokenRevokedError(ForbiddenError):
    """
    Raised when a token has been revoked.
    """
    def __init__(self, language: str = "en"):
        super().__init__("token_revoked", language)