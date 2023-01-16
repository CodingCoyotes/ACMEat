from datetime import datetime
from uuid import UUID

from acmerestaurant.schemas import edit, base
from acmerestaurant.database.enums import UserType

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


class ServerRead(base.ACMEModel):
    acmeat_restaurant_id: UUID


class OrderRead(edit.OrderEdit):
    id: UUID
    user_id: UUID


class MenuRead(edit.MenuEdit):
    id: UUID
    restaurant_id: UUID


class ContentRead(edit.ContentEdit):
    order_id = UUID
    pass

class DelivererRead(edit.DelivererEdit):
    id: UUID




