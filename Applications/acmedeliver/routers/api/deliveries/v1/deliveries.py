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
    prefix="/api/delivery/v1",
    tags=[
        "Delivery v1",
    ],
)


@router.get("/", response_model=List[acmedeliver.schemas.read.DeliveryRead])
async def read_deliveries(current_user: models.User = Depends(get_current_user),
                          db: Session = Depends(dep_dbsession)):
    """
    Returns data about all deliveries.
    """
    if current_user.kind.value < UserType.admin.value:
        raise errors.Forbidden
    return db.query(models.Delivery).all()


@router.get("/{delivery_id}", response_model=acmedeliver.schemas.full.DeliveryFull)
async def read_delivery(delivery_id: UUID, current_user: models.User = Depends(get_current_user),
                        db: Session = Depends(dep_dbsession)):
    """
    Returns data about a selected client.
    """
    if current_user.kind.value < UserType.admin.value:
        raise errors.Forbidden
    return quick_retrieve(db, models.Delivery, id=delivery_id)


@router.post("/", response_model=acmedeliver.schemas.full.DeliveryFull)
async def create_delivery(delivery_request: acmedeliver.schemas.edit.ClientDeliveryRequest,
                          db: Session = Depends(dep_dbsession)):
    """
    Creates an account for a new client.
    """
    target = quick_retrieve(db, models.Client, api_key=delivery_request.api_key)
    if not target:
        raise errors.Forbidden
    # Todo: Aggiungi funzione calcolo costo, logica selezione utente
    user = db.query(models.User).first()
    return quick_create(db, models.Delivery(cost=0.1, receiver=delivery_request.request.receiver,
                                            delivery_time=delivery_request.request.delivery_time,
                                            deliverer_id=user.id, client_id=target.id))


# Todo: aggiungi funzione preventivo


@router.put("/{client_id}", response_model=acmedeliver.schemas.read.ClientRead)
async def edit_delivery(edits: acmedeliver.schemas.edit.ClientEdit, client_id: UUID,
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
    # Todo: scrivi questa funzione
    return None
