# utils/error/verify.py

from utils.errors.base import UnauthorizedError

# ======================
# Activate Code Errors
# ======================
class ActivateCodeInvalidError(UnauthorizedError):
    """
    Raised when the activation code is invalid.
    """
    def __init__(self, language: str = "en"):
        super().__init__("activate_code_invalid", language)


class ActivateCodeExpiredError(UnauthorizedError):
    """
    Raised when the activation code has expired.
    """
    def __init__(self, language: str = "en"):
        super().__init__("activate_code_expired", language)



# ======================
# Recovery Code Errors
# ======================
class RecoveryCodeInvalidError( UnauthorizedError):
    """
    Raised when the recovery code is invalid.
    """
    def __init__(self, language: str = "en"):
        super().__init__("recovery_code_invalid", language)


class RecoveryCodeExpiredError(UnauthorizedError):
    """
    Raised when the recovery code has expired.
    """
    def __init__(self, language: str = "en"):
        super().__init__("recovery_code_expired", language)
