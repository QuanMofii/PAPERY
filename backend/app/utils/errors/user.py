from utils.errors.base import ConflictError, NotFoundError, ForbiddenError,UnauthorizedError
# =======================
# User Service Errors
# =======================

class UserAlreadyExistsError(ConflictError):
    """
    Raised when attempting to create a user that already exists.
    """
    def __init__(self, language: str = "en"):
        super().__init__("user_already_exists", language)


class UserNotFoundError(NotFoundError):
    """
    Raised when a user is not found.
    """
    def __init__(self, language: str = "en"):
        super().__init__("user_not_found", language)


class UserAccountLockedError(ForbiddenError):
    """
    Raised when a user's account is locked.
    """
    def __init__(self, language: str = "en"):
        super().__init__("user_account_locked", language)


class UserPermissionDeniedError(ForbiddenError):
    """
    Raised when a user doesn't have permission to perform an action.
    """
    def __init__(self, language: str = "en"):
        super().__init__("user_permission_denied", language)

class  UserAccountInactiveError(UnauthorizedError):
    """
    Raised when a user's account is inactive.
    """
    def __init__(self, language: str = "en"):
        super().__init__("user_account_inactive", language)

class UserAccountAleadyActivatedError(ConflictError):
    """
    Raised when a user's account is already activated.
    """
    def __init__(self, language: str = "en"):
        super().__init__("user_account_already_activated", language)