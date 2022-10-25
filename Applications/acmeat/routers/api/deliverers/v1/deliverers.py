import typing
import uuid
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
    prefix="/api/deliverers/v1",
    tags=[
        "Deliverers v1",
    ],
)


@router.get("/", response_model=typing.List[acmeat.schemas.read.DelivererRead])
async def read_deliverers(db: Session = Depends(dep_dbsession)):
    return db.query(models.Deliverer).all()


@router.get("/{deliverer_id}", response_model=acmeat.schemas.full.DelivererFull)
async def read_deliverer(deliverer_id: UUID, db: Session = Depends(dep_dbsession)):
    return quick_retrieve(db, models.Deliverer, id=deliverer_id)


@router.post("/", response_model=acmeat.schemas.read.DelivererRead)
async def create_deliverer(deliverer: acmeat.schemas.edit.DelivererEdit,
                           db: Session = Depends(dep_dbsession),
                           current_user: models.User = Depends(get_current_user)):
    """
    Creates an account for a new user.
    """
    if current_user.kind != acmeat.database.enums.UserType.admin:
        raise errors.Forbidden
    return quick_create(db, models.Deliverer(name=deliverer.name, api_url=deliverer.api_url))


@router.put("/{deliverer_id}", response_model=acmeat.schemas.read.DelivererRead)
async def edit_deliverer(edits: acmeat.schemas.edit.DelivererEdit, deliverer_id: UUID,
                         current_user: models.User = Depends(get_current_user),
                         db: Session = Depends(dep_dbsession)):
    target = quick_retrieve(db, models.Deliverer, id=deliverer_id)
    if current_user.kind != acmeat.database.enums.UserType.admin:
        raise errors.Forbidden
    return quick_update(db, target, edits)
