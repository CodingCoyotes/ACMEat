import typing
import uuid
from uuid import UUID
from typing import Optional

import bcrypt
from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from camunda.client.engine_client import EngineClient
from acmeat.database.enums import OrderStatus

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
    return quick_create(db, models.Deliverer(name=deliverer.name, api_url=deliverer.api_url,
                                             address=deliverer.address, city=deliverer.city,
                                             nation=deliverer.nation, number=deliverer.number,
                                             external_api_key=deliverer.external_api_key))


@router.put("/{deliverer_id}", response_model=acmeat.schemas.read.DelivererRead)
async def edit_deliverer(edits: acmeat.schemas.edit.DelivererEdit, deliverer_id: UUID,
                         current_user: models.User = Depends(get_current_user),
                         db: Session = Depends(dep_dbsession)):
    target = quick_retrieve(db, models.Deliverer, id=deliverer_id)
    if current_user.kind != acmeat.database.enums.UserType.admin:
        raise errors.Forbidden
    return quick_update(db, target, edits)


@router.put("/delivery/{order_id}", response_model=acmeat.schemas.read.OrderRead)
async def edit_deliverer(edits: acmeat.schemas.edit.DelivererDeliveryEdit,
                         order_id: UUID,
                         db: Session = Depends(dep_dbsession)):
    target = quick_retrieve(db, models.Deliverer, api_key=edits.api_key)
    if not target:
        raise errors.Forbidden
    target_order = quick_retrieve(db, models.Order, id=order_id)
    if not target_order:
        raise errors.ResourceNotFound
    if target_order.deliverer_id != target.id or target_order.status != OrderStatus.delivering:
        raise errors.Forbidden
    target_order.status = OrderStatus.delivered
    db.commit()
    return target_order


@router.get("/delivery/{order_id}", response_model=acmeat.schemas.read.OrderRead)
async def edit_deliverer(edits: acmeat.schemas.edit.DelivererDeliveryEdit,
                         order_id: UUID,
                         db: Session = Depends(dep_dbsession)):
    target = quick_retrieve(db, models.Deliverer, api_key=edits.api_key)
    if not target:
        raise errors.Forbidden
    target_order = quick_retrieve(db, models.Order, id=order_id)
    if not target_order:
        raise errors.ResourceNotFound
    return target_order
