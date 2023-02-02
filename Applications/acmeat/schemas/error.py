from acmeat.schemas import base

__all__ = (
    "AcmeatErrorModel",
)


class AcmeatErrorModel(base.ACMEModel):
    """
    Modello per gli errori restituiti dal backend.
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
