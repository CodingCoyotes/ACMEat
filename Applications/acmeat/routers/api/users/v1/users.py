from uuid import UUID
from typing import Optional

import bcrypt
from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from camunda.client.engine_client import EngineClient

import acmeat.schemas.read
from acmeat.authentication import get_current_user
from acmeat.database import models
from acmeat.schemas import *
from acmeat.crud import *
from acmeat.dependencies import dep_dbsession
import acmeat.errors as errors

router = APIRouter(
    prefix="/api/user/v1",
    tags=[
        "User v1",
    ],
)


@router.get("/me", response_model=acmeat.schemas.read.UserRead)
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    """
    Returns data about the current user.
    """
    return current_user


@router.post("/", response_model=acmeat.schemas.read.UserRead)
async def create_user(user: acmeat.schemas.edit.UserNew, db: Session = Depends(dep_dbsession)):
    """
    Creates an account for a new user.
    """
    h = bcrypt.hashpw(bytes(user.password, encoding="utf-8"), bcrypt.gensalt())
    return quick_create(db, models.User(name=user.name, surname=user.surname, password=h, email=user.email))


@router.put("/{user_id}", response_model=acmeat.schemas.read.UserRead)
async def edit_user(edits: acmeat.schemas.edit.UserNew, user_id: UUID,
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
    intermediate_model = acmeat.schemas.edit.UserEdit(name=edits.name, surname=edits.surname,
                                                      password=bcrypt.hashpw(bytes(edits.password, encoding="utf-8"),
                                                                             bcrypt.gensalt()),

                                                      email=edits.email)
    target = quick_retrieve(db, models.User, id=user_id)
    return quick_update(db, target, intermediate_model)
