"""
Questo modulo contiene tutte le eccezioni personalizzate che possono venire sollevate dall'applicazione.
"""

import fastapi

from acmeat import schemas

__all__ = (
    "AcmeatException",
    "MissingAuthHeader",
    "InvalidAuthHeader",
    "WrongAuthHeader",
    "ResourceNotFound",
    "MultipleResultsFound",
)


class AcmeatException(Exception):

    STATUS_CODE: int = 500
    ERROR_CODE: str = "UNKNOWN"
    REASON: str = "Unknown error, please report this as a bug to the Impressive Strawberry developers."

    @classmethod
    def to_model(cls) -> schemas.error.AcmeatErrorModel:
        return schemas.error.AcmeatErrorModel(error_code=cls.ERROR_CODE, reason=cls.REASON)

    @classmethod
    def to_response(cls) -> fastapi.Response:
        return fastapi.Response(content=cls.to_model().json(), status_code=cls.STATUS_CODE, media_type="application/json")


class MissingAuthHeader(AcmeatException):
    STATUS_CODE = 401
    ERROR_CODE = "MISSING_AUTH_HEADER"
    REASON = "The Authorization header is missing."


class InvalidAuthHeader(AcmeatException):
    STATUS_CODE = 401
    ERROR_CODE = "INVALID_AUTH_HEADER"
    REASON = "The provided Authorization header is invalid."


class WrongAuthHeader(AcmeatException):
    STATUS_CODE = 401
    ERROR_CODE = "WRONG_AUTH_HEADER"
    REASON = "The value provideed in the Authorization header is in a valid format, but its value is incorrect."


class ResourceNotFound(AcmeatException):
    STATUS_CODE = 404
    ERROR_CODE = "NOT_FOUND"
    REASON = "The requested resource was not found. Either it does not exist, or you are not authorized to view it."


class Forbidden(AcmeatException):
    STATUS_CODE = 403
    ERROR_CODE = "FORBIDDEN"
    REASON = "You don't have access to the requested resource."


class MultipleResultsFound(AcmeatException):
    STATUS_CODE = 500
    ERROR_CODE = "MULTIPLE_FOUND"
    REASON = "Multiple resources were found with the requested identifier. This is probably a problem in the Acmeat database. If you are the system admininistrator, ensure you have run all the available migrations through Alembic."