"""
Questo modulo contiene gli endpoint per la gestione degli utenti
"""
from uuid import UUID
import bcrypt
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import acmeat.schemas.read
from acmeat.authentication import get_current_user
from acmeat.database import models
from acmeat.crud import *
from acmeat.dependencies import dep_dbsession
import acmeat.errors as errors
from acmeat.database.enums import UserType

router = APIRouter(
    prefix="/api/user/v1",
    tags=[
        "User v1",
    ],
)


@router.get("/me", response_model=acmeat.schemas.full.UserFull)
async def read_users_me(current_user: models.User = Depends(get_current_user), db: Session = Depends(dep_dbsession)):
    """
    Restituisce i dati sull'utente attuale
    :param current_user: l'utente attuale
    :param db: la sessione di database
    :return: acmeat.schemas.full.UserFull, i dettagli dell'utente
    """
    return quick_retrieve(db, models.User, id=current_user.id)


@router.post("/", response_model=acmeat.schemas.read.UserRead)
async def create_user(user: acmeat.schemas.edit.UserNew, db: Session = Depends(dep_dbsession)):
    """
    Registra un nuovo utente
    :param user: il json contenente le informazioni sull'utente
    :param db: la sessione di database
    :return: acmeat.schemas.full.UserRead, l'utente appena creato
    """
    h = bcrypt.hashpw(bytes(user.password, encoding="utf-8"), bcrypt.gensalt())
    return quick_create(db, models.User(name=user.name, surname=user.surname, password=h, email=user.email))


@router.put("/{user_id}", response_model=acmeat.schemas.read.UserRead)
async def edit_user(edits: acmeat.schemas.edit.UserNew, user_id: UUID,
                    current_user: models.User = Depends(get_current_user),
                    db: Session = Depends(dep_dbsession)):
    """
    Aggiorna i dati dell'utente selezionato
    :param user_id: l'UUID dell'utente selezionato
    :param current_user: l'utente attuale
    :param edits: il modello contenente le modifiche
    :param db: la sessione di database
    :return: acmeat.schemas.read.UserRead, l'utente modificato
    """
    intermediate_model = acmeat.schemas.edit.UserEdit(name=edits.name, surname=edits.surname,
                                                      password=bcrypt.hashpw(bytes(edits.password, encoding="utf-8"),
                                                                             bcrypt.gensalt()),

                                                      email=edits.email)
    target = quick_retrieve(db, models.User, id=user_id)
    if target != current_user and current_user.kind != UserType.admin:
        raise errors.Forbidden
    return quick_update(db, target, intermediate_model)
