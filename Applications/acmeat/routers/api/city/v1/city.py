"""
Questo modulo contiene gli endpoint per le città.
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
from acmeat.schemas import *
from acmeat.crud import *
from acmeat.dependencies import dep_dbsession
import acmeat.errors as errors

router = APIRouter(
    prefix="/api/city/v1",
    tags=[
        "City v1",
    ],
)


@router.get("/", response_model=typing.List[acmeat.schemas.read.CityRead])
async def read_cities(db: Session = Depends(dep_dbsession)):
    """
    Ottiene una lista di tutte le città
    :param db: la sessione di database
    :return: typing.List[acmeat.schemas.read.CityRead], la lista delle città
    """
    return db.query(models.City).all()


@router.get("/{city_id}", response_model=acmeat.schemas.full.CityFull)
async def read_city(city_id: UUID, db: Session = Depends(dep_dbsession)):
    """
    Ottiene i dettagli di una città
    :param city_id: lo UUID della città
    :param db: la sessione di database
    :return: acmeat.schemas.full.CityFull, i dettagli della città
    """
    return quick_retrieve(db, models.City, id=city_id)


@router.post("/", response_model=acmeat.schemas.read.CityRead)
async def create_city(city: acmeat.schemas.edit.CityEdit,
                      db: Session = Depends(dep_dbsession),
                      current_user: models.User = Depends(get_current_user)):
    """
    Crea una nuova città
    :param city: il json contenente i dati della nuova città
    :param db: la sessione di database
    :param current_user: l'utente attuale
    :return: acmeat.schemas.read.CityRead, le informazioni sulla città
    """
    if current_user.kind != acmeat.database.enums.UserType.admin:
        raise errors.Forbidden
    return quick_create(db, models.City(name=city.name, nation=city.nation))


@router.put("/{city_id}", response_model=acmeat.schemas.read.CityRead)
async def edit_city(edits: acmeat.schemas.edit.CityEdit, city_id: UUID,
                    current_user: models.User = Depends(get_current_user),
                    db: Session = Depends(dep_dbsession)):
    """
    Modifica i dati di una città
    :param edits: il json contenente le modifiche da applicare
    :param city_id: lo UUID della città
    :param current_user: l'utente attuale
    :param db: la sessione di database
    :return: acmeat.schemas.read.CityRead, le informazioni sulla città
    """
    target = quick_retrieve(db, models.City, id=city_id)
    if current_user.kind != acmeat.database.enums.UserType.admin:
        raise errors.Forbidden
    return quick_update(db, target, edits)
