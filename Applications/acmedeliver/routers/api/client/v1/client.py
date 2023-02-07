"""
Questo modulo contiene gli endpoint per la gestione dei clienti
"""
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
    prefix="/api/client/v1",
    tags=[
        "Client v1",
    ],
)


@router.get("/", response_model=List[acmedeliver.schemas.read.ClientRead])
async def read_clients(current_user: models.User = Depends(get_current_user),
                       db: Session = Depends(dep_dbsession)):
    """
    Restituisce la lista dei clienti
    :param current_user: l'utente attuale
    :param db: la sessione di database
    :return: List[acmedeliver.schemas.read.ClientRead], la lista dei clienti
    """
    if current_user.kind.value < UserType.admin.value:
        raise errors.Forbidden
    return db.query(models.Client).all()


@router.get("/{client_id}", response_model=acmedeliver.schemas.full.ClientFull)
async def read_client(client_id: UUID, current_user: models.User = Depends(get_current_user),
                      db: Session = Depends(dep_dbsession)):
    """
    Restituisce i dettagli di un cliente
    :param client_id: l'UUID del cliente
    :param current_user: l'utente attuale
    :param db: la sessione di database
    :return: acmedeliver.schemas.full.ClientFull, il cliente
    """
    if current_user.kind.value < UserType.admin.value:
        raise errors.Forbidden
    return quick_retrieve(db, models.Client, id=client_id)


@router.post("/", response_model=acmedeliver.schemas.full.ClientFull)
async def create_client(client: acmedeliver.schemas.edit.ClientEdit,
                        current_user: models.User = Depends(get_current_user),
                        db: Session = Depends(dep_dbsession)):
    """
    Aggiunge un cliente
    :param client: il modello contenente i dati per la creazione del cliente
    :param current_user: l'utente attuale
    :param db: la sessione di database
    :return: acmedeliver.schemas.full.ClientFull, il cliente
    """
    if current_user.kind.value < UserType.admin.value:
        raise errors.Forbidden
    token = binascii.hexlify(os.urandom(10)).decode()
    return quick_create(db, models.Client(name=client.name, api_key=token, api_url=client.api_url,
                                          remote_api_key=client.remote_api_key))


@router.put("/{client_id}", response_model=acmedeliver.schemas.read.ClientRead)
async def edit_client(edits: acmedeliver.schemas.edit.ClientEdit, client_id: UUID,
                      current_user: models.User = Depends(get_current_user),
                      db: Session = Depends(dep_dbsession)):
    """
    Aggiorna i dati di un cliente
    :param client_id: l'UUID del cliente
    :param current_user: l'utente attuale
    :param edits: il modello contenente le modifiche
    :param db: la sessione di database
    :return: acmedeliver.schemas.read.ClientRead, il cliente
    """
    if current_user.kind.value < UserType.admin.value:
        raise errors.Forbidden
    target = quick_retrieve(db, models.Client, id=client_id)
    target.name = edits.name
    target.remote_api_key = edits.remote_api_key
    target.api_url = edits.api_url
    db.commit()
    db.refresh(target)
    return target
