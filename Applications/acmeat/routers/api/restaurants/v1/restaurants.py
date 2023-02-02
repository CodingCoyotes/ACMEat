"""
Questo modulo contiene gli endpoint per la gestione dei ristoranti
"""
import typing
from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import acmeat.schemas.read
from acmeat.authentication import get_current_user
from acmeat.database import models
from acmeat.crud import *
from acmeat.dependencies import dep_dbsession
import acmeat.errors as errors
import datetime

router = APIRouter(
    prefix="/api/restaurants/v1",
    tags=[
        "Restaurants v1",
    ],
)


@router.get("/", response_model=typing.List[acmeat.schemas.read.RestaurantRead])
async def read_restaurants(db: Session = Depends(dep_dbsession)):
    """
    Restituisce la lista dei ristoranti
    :param db: la sessione di database
    :return: typing.List[acmeat.schemas.read.RestaurantRead], la lista dei ristoranti
    """
    return db.query(models.Restaurant).all()


@router.get("/{restaurant_id}", response_model=acmeat.schemas.full.RestaurantFull)
async def read_restaurant(restaurant_id: UUID, db: Session = Depends(dep_dbsession)):
    """
    Restituisce i dettagli di un ristorante
    :param restaurant_id: l'UUID del ristorante
    :param db: la sessione di database
    :return: acmeat.schemas.full.RestaurantFull, il ristorante richiesto
    """
    restaurant = quick_retrieve(db, models.Restaurant, id=restaurant_id)
    return restaurant


@router.post("/", response_model=acmeat.schemas.read.RestaurantRead)
async def create_restaurant(restaurant: acmeat.schemas.edit.RestaurantEdit, db: Session = Depends(dep_dbsession),
                            current_user: models.User = Depends(get_current_user)):
    """
    Crea un nuovo ristorante e aggiorna la tipologia di utente
    :param restaurant: il modello contenente i dati del ristorante
    :param db: la sessione di database
    :param current_user: l'utente attuale
    :return: acmeat.schemas.read.RestaurantRead, il nuovo ristorante
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
    """
    Modifica i dati del ristorante
    :param edits: il modello contenente le modifiche
    :param restaurant_id: l'UUID del ristorante
    :param current_user: l'utente attuale
    :param db: la sessione di database
    :return: acmeat.schemas.read.RestaurantRead, il ristorante modificato
    """
    target = quick_retrieve(db, models.Restaurant, id=restaurant_id)
    if datetime.datetime.now().hour > 10:
        raise errors.Forbidden
    if target.owner_id != current_user.id:
        raise errors.Forbidden
    return quick_update(db, target, edits)