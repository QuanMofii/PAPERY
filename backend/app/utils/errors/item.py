from utils.errors.base import NotFoundError, ConflictError, GoneError, ForbiddenError
# =======================
# Item Service Errors
# =======================
class ItemNotFoundError(NotFoundError):
    """
    Raised when an item is not found.
    """
    def __init__(self, language: str = "en"):
        super().__init__("item_not_found", language)


class ItemAlreadyExistsError(ConflictError):
    """
    Raised when attempting to create an item that already exists.
    """
    def __init__(self, language: str = "en"):
        super().__init__("item_already_exists", language)


class ItemOutOfStockError(GoneError):
    """
    Raised when an item is out of stock.
    """
    def __init__(self, language: str = "en"):
        super().__init__("item_out_of_stock", language)


class ItemPermissionDeniedError(ForbiddenError):
    """
    Raised when a user doesn't have permission to access an item.
    """
    def __init__(self, language: str = "en"):
        super().__init__("item_permission_denied", language)
