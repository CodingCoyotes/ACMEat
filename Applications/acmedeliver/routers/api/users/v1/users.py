from uuid import UUID
from typing import Optional

import bcrypt
from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from camunda.client.engine_client import EngineClient

import acmedeliver.schemas.read
from acmedeliver.authentication import get_current_user
from acmedeliver.database import models
from acmedeliver.schemas import *
from acmedeliver.crud import *
from acmedeliver.dependencies import dep_dbsession
import acmedeliver.errors as errors
from acmedeliver.database.enums import UserType

router = APIRouter(
    prefix="/api/user/v1",
    tags=[
        "User v1",
    ],
)


@router.get("/me", response_model=acmedeliver.schemas.full.UserFull)
async def read_users_me(current_user: models.User = Depends(get_current_user), db: Session = Depends(dep_dbsession)):
    """
    Returns data about the current user.
    """
    return quick_retrieve(db, models.User, id=current_user.id)


@router.post("/", response_model=acmedeliver.schemas.read.UserRead)
async def create_user(user: acmedeliver.schemas.edit.UserNew, db: Session = Depends(dep_dbsession),
                      current_user: models.User = Depends(get_current_user)):
    """
    Creates an account for a new user.
    """
    if current_user.kind.value < UserType.admin.value:
        raise errors.Forbidden
    h = bcrypt.hashpw(bytes(user.password, encoding="utf-8"), bcrypt.gensalt())
    return quick_create(db, models.User(name=user.name, surname=user.surname, password=h, email=user.email))


@router.put("/{user_id}", response_model=acmedeliver.schemas.read.UserRead)
async def edit_user(edits: acmedeliver.schemas.edit.UserNew, user_id: UUID,
                    current_user: models.User = Depends(get_current_user),
                    db: Session = Depends(dep_dbsession)):
    """
    Updates the account of the logged in user
    :param user_id:
    :param current_user: the current user
    :param edits: the pydantic schema that contains the edits
    :param db: the database session
    :return: the representation of the updated profile
    """
    intermediate_model = acmedeliver.schemas.edit.UserEdit(name=edits.name, surname=edits.surname,
                                                           password=bcrypt.hashpw(
                                                               bytes(edits.password, encoding="utf-8"),
                                                               bcrypt.gensalt()),

                                                           email=edits.email)
    target = quick_retrieve(db, models.User, id=user_id)
    return quick_update(db, target, intermediate_model)
