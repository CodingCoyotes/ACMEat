from datetime import datetime
from uuid import UUID

from acmedeliver.schemas import edit
from acmedeliver.database.enums import UserType, DeliveryStatus

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


class DeliveryRead(edit.DeliveryEdit):
    id: UUID
    status: DeliveryStatus
    date: datetime
    deliverer_id: UUID
    client_id: UUID


class ClientRead(edit.ClientEdit):
    id: UUID

