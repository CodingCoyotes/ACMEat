import typing as t

from acmeat.schemas import read

__all__ = (
    "UserFull",
)


class UserFull(read.UserRead):
    """
    **Full** model (with expanded relationships) for :class:`.database.tables.User`.
    """

    #restaurants: t.List[read.RestaurantRead]
    #orders: t.List[read.OrderRead]