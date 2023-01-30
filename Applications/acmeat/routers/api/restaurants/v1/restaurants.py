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
    prefix="/api/restaurants/v1",
    tags=[
        "Restaurants v1",
    ],
)


@router.get("/", response_model=typing.List[acmeat.schemas.read.RestaurantRead])
async def read_restaurants(db: Session = Depends(dep_dbsession)):
    return db.query(models.Restaurant).all()


@router.get("/{restaurant_id}", response_model=acmeat.schemas.full.RestaurantFull)
async def read_restaurant(restaurant_id: UUID, db: Session = Depends(dep_dbsession)):
    """
    Returns data about the current user.
    """
    restaurant = quick_retrieve(db, models.Restaurant, id=restaurant_id)
    return restaurant


@router.post("/", response_model=acmeat.schemas.read.RestaurantRead)
async def create_restaurant(restaurant: acmeat.schemas.edit.RestaurantEdit, db: Session = Depends(dep_dbsession),
                            current_user: models.User = Depends(get_current_user)):
    """
    Creates an account for a new user.
    """
    if current_user.kind == acmeat.database.enums.UserType.customer:
        usr = quick_retrieve(db, models.User, id=current_user.id)
        usr.kind = acmeat.database.enums.UserType.owner
        db.commit()
        db.refresh(usr)
    return quick_create(db, models.Restaurant(name=restaurant.name, address=restaurant.address,
                                              open_times=restaurant.jsonify_time(),
                                              number=restaurant.number, closed=restaurant.closed,
                                              owner=quick_retrieve(db, models.User, id=current_user.id),
                                              city=quick_retrieve(db, models.City, id=restaurant.city_id),
                                              bank_address=restaurant.bank_address))


@router.put("/{restaurant_id}", response_model=acmeat.schemas.read.RestaurantRead)
async def edit_restaurant(edits: acmeat.schemas.edit.RestaurantEdit, restaurant_id: UUID,
                          current_user: models.User = Depends(get_current_user),
                          db: Session = Depends(dep_dbsession)):
    target = quick_retrieve(db, models.Restaurant, id=restaurant_id)
    if target.owner_id != current_user.id:
        raise errors.Forbidden
    return quick_update(db, target, edits)