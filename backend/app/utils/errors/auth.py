from utils.errors.base import BadRequestError, UnauthorizedError,ConflictError,UnprocessableEntityError
# =======================
# Auth Service Errors
# =======================

class OAuthProviderNotSupportedError(BadRequestError):
    """
    Raised when the requested OAuth provider is not supported.
    """
    def __init__(self, language: str = "en"):
        super().__init__("oauth_provider_not_supported", language)


class OAuthClientError(BadRequestError):
    """
    Raised when there is an issue creating the OAuth client.
    """
    def __init__(self, language: str = "en"):
        super().__init__("oauth_client_error", language)


class OAuthStateMismatchError(ConflictError):
    """
    Raised when there is a state mismatch during the OAuth flow.
    """
    def __init__(self, language: str = "en"):
        super().__init__("oauth_state_mismatch", language)


class InvalidCredentialsError(UnauthorizedError):
    """
    Raised when user credentials are invalid (e.g., incorrect password).
    """
    def __init__(self, language: str = "en"):
        super().__init__("invalid_credentials", language)


class EmailSendFailureError(BadRequestError):
    """
    Raised when the email service fails to send an email.
    """
    def __init__(self, language: str = "en"):
        super().__init__("email_send_failure", language)


class RefreshTokenError(UnauthorizedError):
    """
    Raised when there is an issue with the refresh token (e.g., expired or invalid).
    """
    def __init__(self, language: str = "en"):
        super().__init__("invalid_refresh_token", language)
class InvalidEmailError(UnprocessableEntityError):
    """
    Raised when the email is invalid.
    """
    def __init__(self, language: str = "en"):
        super().__init__("invalid_email", language)

