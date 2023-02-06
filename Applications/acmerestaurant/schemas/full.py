"""
Questo modulo contiene i modelli per ottenere i dati completi su un'entità.
"""
import typing as t

from acmerestaurant.schemas import read

__all__ = (
    "UserFull",
)


class UserFull(read.UserRead):
    """
    **Full** model (with expanded relationships) for :class:`.database.tables.User`.
    """

    pass


class ContentFull(read.ContentRead):
    order: read.OrderRead
    menu: read.MenuRead


class OrderFull(read.OrderRead):
    user: read.UserRead
    contents: t.List[ContentFull]
    deliverer: t.Optional[read.DelivererRead]