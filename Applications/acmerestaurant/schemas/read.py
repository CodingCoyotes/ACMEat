from datetime import datetime
from uuid import UUID

from acmerestaurant.schemas import edit
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
