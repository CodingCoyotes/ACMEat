"""
Questo modulo contiene gli endpoint per le consegne
"""
from uuid import UUID
from typing import List

import requests
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import acmedeliver.schemas.read
from acmedeliver.authentication import get_current_user
from acmedeliver.database import models
from acmedeliver.crud import *
from acmedeliver.dependencies import dep_dbsession
import acmedeliver.errors as errors
from acmedeliver.database.enums import UserType, DeliveryStatus
from acmedeliver.configuration import setting_required
import json
from acmedeliver.responses import NO_CONTENT
import random

router = APIRouter(
    prefix="/api/delivery/v1",
    tags=[
        "Delivery v1",
    ],
)

PRICE_PER_KM = setting_required("PRICE_PER_KM")
GEOLOCATE_URL = setting_required("GEOLOCATE_URL")


def calculate_cost(source, destination):
    """
    Funzione che calcola il costo di una spedizione.
    :param source: l'indirizzo sorgente
    :param destination: l'indirizzo destinazione
    :return: il prezzo di spedizione
    """
    source = source.split(";")
    destination = destination.split(";")
    r = requests.post(GEOLOCATE_URL + "/api/geo/v1/distance",
                      headers={"Content-Type": "application/json",
                               "Accept": "application/json"}, data=json.dumps({
            "source": {
                "nation": source[0],
                "city": source[1],
                "roadname": source[2],
                "number": source[3]
            },
            "destination": {
                "nation": destination[0],
                "city": destination[1],
                "roadname": destination[2],
                "number": destination[3]
            }
        }))
    return r.json()['distance_km'] * float(PRICE_PER_KM)


@router.get("/", response_model=List[acmedeliver.schemas.read.DeliveryRead])
async def read_deliveries(current_user: models.User = Depends(get_current_user),
                          db: Session = Depends(dep_dbsession)):
    """
    Restituisce la lista delle consegne
    :param current_user: l'utente attuale
    :param db: la sessione di database
    :return: List[acmedeliver.schemas.read.DeliveryRead], la lista delle consegne
    """
    if current_user.kind.value < UserType.admin.value:
        raise errors.Forbidden
    return db.query(models.Delivery).all()


@router.get("/{delivery_id}", response_model=acmedeliver.schemas.full.DeliveryFull)
async def read_delivery(delivery_id: UUID, current_user: models.User = Depends(get_current_user),
                        db: Session = Depends(dep_dbsession)):
    """
    Restituisce i dettagli di una consegna
    :param delivery_id: l'UUID della consegna
    :param current_user: l'utente attuale
    :param db: la sessione di database
    :return: acmedeliver.schemas.full.DeliveryFull, la consegna
    """
    if current_user.kind.value < UserType.admin.value:
        raise errors.Forbidden
    return quick_retrieve(db, models.Delivery, id=delivery_id)


@router.post("/", response_model=acmedeliver.schemas.full.DeliveryFull)
async def create_delivery(delivery_request: acmedeliver.schemas.edit.ClientDeliveryRequest,
                          db: Session = Depends(dep_dbsession)):
    """
    Crea una nuova consegna
    :param delivery_request: il modello contenente la richiesta di consegna
    :param db: la sessione di database
    :return: acmedeliver.schemas.full.DeliveryFull, la consegna
    """
    target = quick_retrieve(db, models.Client, api_key=delivery_request.api_key)
    if not target:
        raise errors.Forbidden
    users = db.query(models.User).filter_by(kind=UserType.worker).all()
    if len(users) == 0:
        raise errors.ResourceNotFound
    user = random.choice(users)
    return quick_create(db, models.Delivery(
        cost=round(calculate_cost(delivery_request.request.source, delivery_request.request.receiver), 2),
        receiver=delivery_request.request.receiver,
        delivery_time=delivery_request.request.delivery_time,
        deliverer_id=user.id, client_id=target.id,
        source=delivery_request.request.source,
        source_id=delivery_request.request.source_id,
        status=DeliveryStatus.waiting))


@router.post("/preview", response_model=acmedeliver.schemas.edit.DeliveryPreviewCost)
async def preview_delivery(delivery_request: acmedeliver.schemas.edit.ClientDeliveryRequest,
                           db: Session = Depends(dep_dbsession)):
    """
    Funzione per il calcolo preventivi
    :param delivery_request: il modello contenente la richiesta di consegna
    :param db: la sessione di database
    :return: acmedeliver.schemas.edit.DeliveryPreviewCost, il preventivo
    """
    target = quick_retrieve(db, models.Client, api_key=delivery_request.api_key)
    if not target:
        raise errors.Forbidden
    return acmedeliver.schemas.edit.DeliveryPreviewCost(
        cost=round(calculate_cost(delivery_request.request.source, delivery_request.request.receiver), 2))


@router.put("/{delivery_id}", response_model=acmedeliver.schemas.read.DeliveryRead)
async def edit_delivery_status(delivery_id: UUID,
                               current_user: models.User = Depends(get_current_user),
                               db: Session = Depends(dep_dbsession)):
    """
    Modifica dello stato remoto della consegna
    :param delivery_id: l'UUID della consegna
    :param current_user: l'utente attuale
    :param db: la sessione di database
    :return: acmedeliver.schemas.read.DeliveryRead, la consegna aggiornata
    """
    delivery = quick_retrieve(db, models.Delivery, id=delivery_id)
    response = requests.put(delivery.client.api_url + "/api/deliverers/v1/delivery/" + str(delivery.source_id),
                            headers={"Content-Type": "application/json",
                                     "Accept": "application/json"},
                            data=acmedeliver.schemas.edit.ApiKey(api_key=delivery.client.remote_api_key).json())
    if response.status_code != 200:
        raise acmedeliver.errors.Forbidden
    delivery.status = acmedeliver.database.enums.DeliveryStatus.delivered
    db.commit()
    return delivery


@router.post("/{source_id}/confirm", response_model=acmedeliver.schemas.read.DeliveryRead)
async def delivery_confirm(source_id: UUID, api_key: acmedeliver.schemas.edit.ClientRequest,
                           db: Session = Depends(dep_dbsession)):
    """
    Conferma remota dell'ordine di spedizione
    :param source_id: l'UUID sorgente dell'ordine
    :param api_key: l'api_key usato per accedere
    :param db: la sessione del db
    :return: acmedeliver.schemas.read.DeliveryRead, la spedizione aggiornata
    """
    delivery = quick_retrieve(db, models.Delivery, source_id=source_id)
    if delivery.client.api_key != api_key.api_key:
        raise acmedeliver.errors.Forbidden
    delivery.status = DeliveryStatus.working
    db.commit()
    return delivery


@router.delete("/{source_id}", status_code=204)
async def delete_delivery(request: acmedeliver.schemas.edit.ClientRequest, source_id: UUID,
                          db: Session = Depends(dep_dbsession)):
    """
    Annullamento remoto della spedizione
    :param request: il modello contenente l'api key
    :param source_id: l'UUID sorgente della spedizione
    :param db: la sessione del database
    :return: una risposta 204
    """
    client_target = quick_retrieve(db, models.Client, api_key=request.api_key)
    target = quick_retrieve(db, models.Delivery, source_id=source_id, client_id=client_target.id)
    if not target:
        raise errors.ResourceNotFound
    db.delete(target)
    db.commit()
    return NO_CONTENT
