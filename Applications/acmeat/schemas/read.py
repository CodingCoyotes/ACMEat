"""
Questo modulo contiene i modelli per ottenere i dati parziali su un'entità.
"""
from datetime import datetime
from uuid import UUID

from acmeat.schemas import edit
from acmeat.database.enums import UserType
import typing as t

__all__ = ()


class UserRead(edit.UserBase):
    id: UUID
    email: str
    kind: UserType


class RestaurantRead(edit.RestaurantEdit):
    id: UUID
    owner_id: UUID


class MenuRead(edit.MenuEdit):
    id: UUID
    restaurant_id: UUID


class OrderRead(edit.OrderEdit):
    date_order: t.Optional[datetime]
    delivery_time: t.Optional[datetime]
    restaurant_total: t.Optional[float]
    deliverer_total: t.Optional[float]
    deliverer_id: t.Optional[UUID]
    id: UUID
    user_id: UUID


class ContentRead(edit.ContentEdit):
    order_id = UUID
    pass


class CityRead(edit.CityEdit):
    id: UUID


class DelivererRead(edit.DelivererEdit):
    id: UUID


class PaymentRead(edit.PaymentEdit):
    id: UUID
    order_id: UUID
    verified: bool