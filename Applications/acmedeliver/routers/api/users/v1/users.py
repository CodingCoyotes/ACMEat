"""
Questo modulo contiene gli endpoint per gli utenti
"""
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
    prefix="/api/user/v1",
    tags=[
        "User v1",
    ],
)


@router.get("/me", response_model=acmedeliver.schemas.full.UserFull)
async def read_users_me(current_user: models.User = Depends(get_current_user), db: Session = Depends(dep_dbsession)):
    """
    Restituisce i dati dell'utente attuale
    :param current_user: l'utente attuale
    :param db: la sessione di database
    :return: acmedeliver.schemas.full.UserFull, l'utente attuale
    """
    return quick_retrieve(db, models.User, id=current_user.id)


@router.get("/", response_model=List[acmedeliver.schemas.read.UserRead])
async def get_users(db: Session = Depends(dep_dbsession),
                    current_user: models.User = Depends(get_current_user)):
    """
    Restituisce una lista di utenti
    :param db: la sessione di database
    :param current_user: l'utente attuale
    :return: List[acmedeliver.schemas.read.UserRead], la lista degli utenti
    """
    if current_user.kind.value < UserType.admin.value:
        raise errors.Forbidden
    return db.query(models.User).all()


@router.get("/{user_id}", response_model=acmedeliver.schemas.full.UserFull)
async def get_user(user_id: UUID, db: Session = Depends(dep_dbsession),
                   current_user: models.User = Depends(get_current_user)):
    """
    Restituisce i dettagli di un utente specifico
    :param user_id: l'UUID dell'utente
    :param db: la sessione di database
    :param current_user: l'utente attuale
    :return: acmedeliver.schemas.full.UserFull, l'utente
    """
    if current_user.kind.value < UserType.admin.value:
        raise errors.Forbidden
    return quick_retrieve(db, models.User, id=user_id)


@router.post("/", response_model=acmedeliver.schemas.read.UserRead)
async def create_user(user: acmedeliver.schemas.edit.UserNew, db: Session = Depends(dep_dbsession),
                      current_user: models.User = Depends(get_current_user)):
    """
    Crea un account per un nuovo utente
    :param user: il modello contenente le informazioni
    :param db: la sessione di database
    :param current_user: l'utente attuale
    :return: acmedeliver.schemas.read.UserRead, il nuovo utente
    """
    if current_user.kind.value < UserType.admin.value:
        raise errors.Forbidden
    h = bcrypt.hashpw(bytes(user.password, encoding="utf-8"), bcrypt.gensalt())
    return quick_create(db, models.User(name=user.name, surname=user.surname, password=h, email=user.email))


@router.put("/{user_id}", response_model=acmedeliver.schemas.read.UserRead)
async def edit_user(edits: acmedeliver.schemas.edit.UserNew, user_id: UUID,
                    current_user: models.User = Depends(get_current_user),
                    db: Session = Depends(dep_dbsession)):
    """
    Aggiorna i dati dell'utente
    :param user_id: l'UUID dell'utente
    :param current_user: l'utente attuale
    :param edits: il modello contenente le modifiche
    :param db: la sessione di database
    :return: acmedeliver.schemas.read.UserRead, l'utente aggiornato
    """
    intermediate_model = acmedeliver.schemas.edit.UserEdit(name=edits.name, surname=edits.surname,
                                                           password=bcrypt.hashpw(
                                                               bytes(edits.password, encoding="utf-8"),
                                                               bcrypt.gensalt()),
                                                           email=edits.email)
    if user_id != current_user.id and current_user.kind != UserType.admin:
        raise acmedeliver.errors.Forbidden
    target = quick_retrieve(db, models.User, id=user_id)
    return quick_update(db, target, intermediate_model)
