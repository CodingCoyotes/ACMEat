"""
Questo modulo contiene gli endpoint per la gestione dei menu
"""
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
from acmeat.responses import NO_CONTENT
from acmeat.schemas import *
from acmeat.crud import *
from acmeat.dependencies import dep_dbsession
import acmeat.errors as errors
import datetime

router = APIRouter(
    prefix="/api/menus/v1",
    tags=[
        "Menus v1",
    ],
)


@router.get("/{restaurant_id}", response_model=typing.List[acmeat.schemas.read.MenuRead])
async def read_menus(restaurant_id: UUID, db: Session = Depends(dep_dbsession)):
    """
    Restituisce i dettagli di un menu.
    :param restaurant_id: l'UUID del ristorante
    :param db: la sessione di database
    :return: typing.list[acmeat.schemas.read.MenuRead], la lista dei menu di un ristorante
    """
    return db.query(acmeat.database.models.Menu).filter_by(restaurant_id=restaurant_id).all()


@router.get("/{menu_id}", response_model=acmeat.schemas.read.MenuRead)
async def read_menu(menu_id: UUID, db: Session = Depends(dep_dbsession)):
    """
    Restituisce i dettagli di un menu.
    :param menu_id: l'UUID del menu
    :param db: la sessione di database
    :return: acmeat.schemas.read.MenuRead, il menu richiesto
    """
    menu = quick_retrieve(db, models.Menu, id=menu_id)
    return menu


@router.post("/{restaurant_id}", response_model=acmeat.schemas.read.MenuRead)
async def create_menu(menu: acmeat.schemas.edit.MenuEdit, restaurant_id: UUID,
                      db: Session = Depends(dep_dbsession),
                      current_user: models.User = Depends(get_current_user)):
    """
    Crea un nuovo menu per il ristorante specificato.
    :param menu: il modello contenente le informazioni
    :param restaurant_id: l'UUID del ristorante
    :param db: la sessione di database
    :param current_user: l'utente attuale
    :return: acmeat.schemas.read.MenuRead, il menu appena creato
    """
    current_time = datetime.datetime.now()
    if current_time.time().hour >= 10:
        raise errors.Forbidden
    restaurant = quick_retrieve(db, models.Restaurant, id=restaurant_id)
    if restaurant.owner_id != current_user.id:
        raise errors.Forbidden
    return quick_create(db, models.Menu(name=menu.name, contents=menu.jsonify_contents(), cost=menu.cost,
                                        hidden=menu.hidden, restaurant_id=restaurant_id))


@router.put("/{menu_id}", response_model=acmeat.schemas.read.MenuRead)
async def edit_menu(edits: acmeat.schemas.edit.MenuEdit, menu_id: UUID,
                    current_user: models.User = Depends(get_current_user),
                    db: Session = Depends(dep_dbsession)):
    """
    Aggiorna il menu indicato.
    :param edits: il modello contenente le modifiche
    :param menu_id: l'UUID del menu
    :param current_user: l'utente attuale
    :param db: la sessione di database
    :return: acmeat.schemas.read.MenuRead, il menu modificato
    """
    current_time = datetime.datetime.now()
    if current_time.time().hour >= 10:
        raise errors.Forbidden
    target = quick_retrieve(db, models.Menu, id=menu_id)
    if target.restaurant.owner_id != current_user.id:
        raise errors.Forbidden
    return quick_update(db, target, edits)


@router.delete("/{menu_id}", status_code=204)
async def delete_menu(menu_id: UUID, db: Session = Depends(dep_dbsession),
                      current_user: models.User = Depends(get_current_user)):
    """
    'Cancella' (o meglio, rende invisibile) il menu indicato.
    :param menu_id: l'UUID del menu
    :param db: la sessione di database
    :param current_user: l'utente attuale
    :return: una risposta NO_CONTENT
    """
    current_time = datetime.datetime.now()
    if current_time.time().hour >= 10:
        raise errors.Forbidden
    target = quick_retrieve(db, models.Menu, id=menu_id)
    if current_user.id != target.restaurant.owner_id:
        raise errors.Forbidden
    if not target:
        raise errors.ResourceNotFound
    db.delete(target)
    db.commit()
    return NO_CONTENT
