from datetime import datetime
from uuid import UUID

from acmeat.schemas import edit
from acmeat.database.enums import UserType

__all__ = ()


class UserRead(edit.UserBase):
    id: UUID
    email: str
    kind: UserType

    class Config(edit.UserBase.Config):
        schema_extra = {
            "example": {
                **edit.UserBase.Config.schema_extra["example"],
                "id": "971851d4-b41f-46e1-a884-5b5e84a276f8",
            },
        }


class RestaurantRead(edit.RestaurantEdit):
    id: UUID
    owner_id: UUID


class MenuRead(edit.MenuEdit):
    id: UUID
    restaurant_id: UUID


class OrderRead(edit.OrderEdit):
    id: UUID
    user_id: UUID


class ContentRead(edit.ContentEdit):
    pass


class CityRead(edit.CityEdit):
    id: UUID


class DelivererRead(edit.DelivererEdit):
    id: UUID