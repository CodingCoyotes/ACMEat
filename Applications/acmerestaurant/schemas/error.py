from acmerestaurant.schemas import base

__all__ = (
    "AcmerestaurantErrorModel",
)


class AcmerestaurantErrorModel(base.ACMEModel):
    """
    Model for errors returned by the API.
    """

    error_code: str
    reason: str

    class Config(base.ACMEModel.Config):
        schema_extra = {
            "example": {
                "error_code": "NOT_FOUND",
                "reason": "The requested object was not found.",
            },
        }
