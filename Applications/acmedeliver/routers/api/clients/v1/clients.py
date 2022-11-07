import binascii
import os
from uuid import UUID
from typing import Optional, List

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
    prefix="/api/client/v1",
    tags=[
        "Client v1",
    ],
)


@router.get("/", response_model=List[acmedeliver.schemas.read.ClientRead])
async def read_clients(current_user: models.User = Depends(get_current_user),
                       db: Session = Depends(dep_dbsession)):
    """
    Returns data about all clients.
    """
    if current_user.kind.value < UserType.admin.value:
        raise errors.Forbidden
    return db.query(models.Client).all()


@router.get("/{client_id}", response_model=acmedeliver.schemas.full.ClientFull)
async def read_client(client_id: UUID, current_user: models.User = Depends(get_current_user),
                      db: Session = Depends(dep_dbsession)):
    """
    Returns data about a selected client.
    """
    if current_user.kind.value < UserType.admin.value:
        raise errors.Forbidden
    return quick_retrieve(db, models.Client, id=client_id)


@router.post("/", response_model=acmedeliver.schemas.full.ClientFull)
async def create_client(client: acmedeliver.schemas.edit.ClientEdit,
                        current_user: models.User = Depends(get_current_user),
                        db: Session = Depends(dep_dbsession)):
    """
    Creates an account for a new client.
    """
    if current_user.kind.value < UserType.admin.value:
        raise errors.Forbidden
    token = binascii.hexlify(os.urandom(10)).decode()
    return quick_create(db, models.Client(name=client.name, api_key=token))


@router.put("/{client_id}", response_model=acmedeliver.schemas.read.ClientRead)
async def edit_client(edits: acmedeliver.schemas.edit.ClientEdit, client_id: UUID,
                      current_user: models.User = Depends(get_current_user),
                      db: Session = Depends(dep_dbsession)):
    """
    Updates the account of the logged in user
    :param client_id:
    :param current_user: the current user
    :param edits: the pydantic schema that contains the edits
    :param db: the database session
    :return: the representation of the updated profile
    """
    if current_user.kind.value < UserType.admin.value:
        raise errors.Forbidden
    target = quick_retrieve(db, models.Client, id=client_id)
    target.name = edits.name
    target.token = binascii.hexlify(os.urandom(10)).decode()
    db.commit()
    db.refresh(target)
    return target
