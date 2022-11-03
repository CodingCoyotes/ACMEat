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
    prefix="/api/menus/v1",
    tags=[
        "Menus v1",
    ],
)


@router.get("/{menu_id}", response_model=acmeat.schemas.read.MenuRead)
async def read_menu(menu_id: UUID, db: Session = Depends(dep_dbsession)):
    menu = quick_retrieve(db, models.Menu, id=menu_id)
    return menu


@router.post("/{restaurant_id}", response_model=acmeat.schemas.read.MenuRead)
async def create_menu(menu: acmeat.schemas.edit.MenuEdit, restaurant_id: UUID,
                      db: Session = Depends(dep_dbsession),
                      current_user: models.User = Depends(get_current_user)):
    """
    Creates an account for a new user.
    """
    restaurant = quick_retrieve(db, models.Restaurant, id=restaurant_id)
    if restaurant.owner_id != current_user.id:
        raise errors.Forbidden
    return quick_create(db, models.Menu(name=menu.name, contents=menu.jsonify_contents(), cost=menu.cost,
                                        hidden=menu.hidden, restaurant_id=restaurant_id))


@router.put("/{menu_id}", response_model=acmeat.schemas.read.MenuRead)
async def edit_menu(edits: acmeat.schemas.edit.MenuEdit, menu_id: UUID,
                    current_user: models.User = Depends(get_current_user),
                    db: Session = Depends(dep_dbsession)):
    target = quick_retrieve(db, models.Menu, id=menu_id)
    if target.restaurant.owner_id != current_user.id:
        raise errors.Forbidden
    return quick_update(db, target, edits)