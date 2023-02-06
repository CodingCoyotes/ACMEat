"""
Questo modulo contiene i modelli per ottenere i dati completi su un'entità.
"""
import typing as t

from acmedeliver.schemas import read

__all__ = (
    "UserFull",
)


class UserFull(read.UserRead):
    """
    **Full** model (with expanded relationships) for :class:`.database.tables.User`.
    """

    deliveries: t.List[read.DeliveryRead]


class DeliveryFull(read.DeliveryRead):
    deliverer: t.Optional[read.UserRead]
    client: t.Optional[read.ClientRead]


class ClientFull(read.ClientRead):
    api_key: str
    deliveries: t.List[read.DeliveryRead]

