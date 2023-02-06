"""
Questo modulo contiene gli endpoint per la gestione dei ristoranti
"""
import typing
from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from acmeat import schemas
from acmeat.authentication import get_current_user
from acmeat.database.models import *
from acmeat.database.enums import UserType
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


@router.get("/", response_model=typing.List[schemas.read.RestaurantRead])
async def read_restaurants(db: Session = Depends(dep_dbsession)):
    """
    Restituisce la lista dei ristoranti
    :param db: la sessione di database
    :return: typing.List[acmeat.schemas.read.RestaurantRead], la lista dei ristoranti
    """
    return db.query(Restaurant).all()


@router.get("/{restaurant_id}", response_model=schemas.full.RestaurantFull)
async def read_restaurant(restaurant_id: UUID, db: Session = Depends(dep_dbsession)):
    """
    Restituisce i dettagli di un ristorante
    :param restaurant_id: l'UUID del ristorante
    :param db: la sessione di database
    :return: acmeat.schemas.full.RestaurantFull, il ristorante richiesto
    """
    restaurant = quick_retrieve(db, Restaurant, id=restaurant_id)
    return restaurant


@router.post("/", response_model=schemas.read.RestaurantRead)
async def create_restaurant(restaurant: schemas.edit.RestaurantEdit, db: Session = Depends(dep_dbsession),
                            current_user: User = Depends(get_current_user)):
    """
    Crea un nuovo ristorante e aggiorna la tipologia di utente
    :param restaurant: il modello contenente i dati del ristorante
    :param db: la sessione di database
    :param current_user: l'utente attuale
    :return: acmeat.schemas.read.RestaurantRead, il nuovo ristorante
    """
    if current_user.kind == UserType.customer:
        usr = quick_retrieve(db, User, id=current_user.id)
        usr.kind = UserType.owner
        db.commit()
        db.refresh(usr)
    return quick_create(db, Restaurant(name=restaurant.name, address=restaurant.address,
                                       open_times=restaurant.jsonify_time(),
                                       number=restaurant.number, closed=restaurant.closed,
                                       owner=quick_retrieve(db, User, id=current_user.id),
                                       city=quick_retrieve(db, City, id=restaurant.city_id),
                                       bank_address=restaurant.bank_address))


@router.put("/{restaurant_id}", response_model=schemas.read.RestaurantRead)
async def edit_restaurant(edits: schemas.edit.RestaurantEdit, restaurant_id: UUID,
                          current_user: User = Depends(get_current_user),
                          db: Session = Depends(dep_dbsession)):
    """
    Modifica i dati del ristorante
    :param edits: il modello contenente le modifiche
    :param restaurant_id: l'UUID del ristorante
    :param current_user: l'utente attuale
    :param db: la sessione di database
    :return: acmeat.schemas.read.RestaurantRead, il ristorante modificato
    """
    target = quick_retrieve(db, Restaurant, id=restaurant_id)
    if datetime.datetime.now().hour >= 10:
        raise errors.Forbidden
    if target.owner_id != current_user.id:
        raise errors.Forbidden
    return quick_update(db, target, edits)
