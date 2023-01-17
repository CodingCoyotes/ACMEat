import typing
from uuid import UUID
from typing import Optional

import bcrypt
from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from camunda.client.engine_client import EngineClient

import acmerestaurant.schemas.read
from acmerestaurant.authentication import get_current_user
from acmerestaurant.database import models
from acmerestaurant.schemas import *
from acmerestaurant.crud import *
from acmerestaurant.dependencies import dep_dbsession
import acmerestaurant.errors as errors
from acmerestaurant.database.enums import UserType
from acmerestaurant.errors import *

router = APIRouter(
    prefix="/api/user/v1",
    tags=[
        "User v1",
    ],
)


@router.get("/me", response_model=acmerestaurant.schemas.full.UserFull)
def read_users_me(current_user: models.User = Depends(get_current_user), db: Session = Depends(dep_dbsession)):
    """
    Returns data about the current user.
    """
    return quick_retrieve(db, models.User, id=current_user.id)


@router.post("/", response_model=acmerestaurant.schemas.read.UserRead)
def create_user(user: acmerestaurant.schemas.edit.UserNew, db: Session = Depends(dep_dbsession),
                      current_user: models.User = Depends(get_current_user)):
    """
    Creates an account for a new user.
    """

    h = bcrypt.hashpw(bytes(user.password, encoding="utf-8"), bcrypt.gensalt())
    return quick_create(db, models.User(name=user.name, surname=user.surname, password=h, email=user.email))


@router.get("/", response_model=typing.List[acmerestaurant.schemas.read.UserRead])
def read_users(current_user: models.User = Depends(get_current_user), db: Session = Depends(dep_dbsession)):
    if current_user.kind != UserType.admin:
        raise Forbidden
    return db.query(models.User).all()


@router.put("/{user_id}", response_model=acmerestaurant.schemas.read.UserRead)
def edit_user(edits: acmerestaurant.schemas.edit.UserNew, user_id: UUID,
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
    intermediate_model = acmerestaurant.schemas.edit.UserEdit(name=edits.name, surname=edits.surname,
                                                              password=bcrypt.hashpw(
                                                                  bytes(edits.password, encoding="utf-8"),
                                                                  bcrypt.gensalt()),

                                                              email=edits.email)
    target = quick_retrieve(db, models.User, id=user_id)
    return quick_update(db, target, intermediate_model)
