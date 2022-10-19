from datetime import datetime
from uuid import UUID

from acmeat.schemas import edit

__all__ = ()


class UserRead(edit.UserEdit):
    id: UUID
    email: str

    class Config(edit.UserEdit.Config):
        schema_extra = {
            "example": {
                **edit.UserEdit.Config.schema_extra["example"],
                "id": "971851d4-b41f-46e1-a884-5b5e84a276f8",
            },
        }
