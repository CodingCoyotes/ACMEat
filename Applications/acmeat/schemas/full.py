import typing as t

from acmeat.schemas import read

__all__ = (
    "UserFull",
)


class UserFull(read.UserRead):
    """
    **Full** model (with expanded relationships) for :class:`.database.tables.User`.
    """

    restaurants: t.List[read.RestaurantRead]
    orders: t.List[read.OrderRead]


class RestaurantFull(read.RestaurantRead):
    owner: read.UserRead
    city: read.CityRead
    menus: t.List[read.MenuRead]


class MenuFull(read.MenuRead):
    restaurant: read.RestaurantRead
    requests: t.List[read.ContentRead]


class ContentFull(read.ContentRead):
    order: read.OrderRead
    menu: read.MenuRead


class OrderFull(read.OrderRead):
    user: read.UserRead
    payment: t.Optional[read.PaymentRead]
    contents: t.List[ContentFull]
    deliverer: t.Optional[read.DelivererRead]


class CityFull(read.CityRead):
    restaurants: t.List[read.RestaurantRead]


class DelivererFull(read.DelivererRead):
    orders: t.List[read.OrderRead]


class PaymentFull(read.PaymentRead):
    order: read.OrderRead