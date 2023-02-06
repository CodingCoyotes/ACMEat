"""
Questo modulo contiene gli endpoint per le società di consegna.
"""
import typing
from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from acmeat.database.enums import OrderStatus, UserType
from acmeat.database.models import *
import acmeat.schemas.read
from acmeat.authentication import get_current_user
from acmeat import schemas
from acmeat.crud import *
from acmeat.dependencies import dep_dbsession
import acmeat.errors as errors

router = APIRouter(
    prefix="/api/deliverers/v1",
    tags=[
        "Deliverers v1",
    ],
)


@router.get("/", response_model=typing.List[schemas.read.DelivererRead])
async def read_deliverers(db: Session = Depends(dep_dbsession)):
    """
    Restituisce la lista delle società di consegna affiliate ad ACMEat
    :param db: la sessione di database
    :return: typing.List[acmeat.schemas.read.DelivererRead], la lista delle società di consegna
    """
    return db.query(Deliverer).all()


@router.get("/{deliverer_id}", response_model=schemas.full.DelivererFull)
async def read_deliverer(deliverer_id: UUID, db: Session = Depends(dep_dbsession)):
    """
    Restituisce i dettagli su una società di consegna
    :param deliverer_id: l'UUID della società di consegna
    :param db: la sessione di database
    :return: acmeat.schemas.full.DelivererFull, i dettagli sulla società di consegna
    """
    return quick_retrieve(db, Deliverer, id=deliverer_id)


@router.post("/", response_model=schemas.read.DelivererRead)
async def create_deliverer(deliverer: schemas.edit.DelivererEdit,
                           db: Session = Depends(dep_dbsession),
                           current_user: User = Depends(get_current_user)):
    """
    Crea una nuova società di consegna
    :param deliverer: il modello contenente le informazioni
    :param db: la sessione di database
    :param current_user: l'utente attuale
    :return: acmeat.schemas.read.DelivererRead, la società di consegna appena creata
    """
    if current_user.kind != UserType.admin:
        raise errors.Forbidden
    return quick_create(db, Deliverer(name=deliverer.name, api_url=deliverer.api_url,
                                      address=deliverer.address, city=deliverer.city,
                                      nation=deliverer.nation, number=deliverer.number,
                                      external_api_key=deliverer.external_api_key,
                                      bank_address=deliverer.bank_address))


@router.put("/{deliverer_id}", response_model=schemas.read.DelivererRead)
async def edit_deliverer(edits: schemas.edit.DelivererEdit, deliverer_id: UUID,
                         current_user: User = Depends(get_current_user),
                         db: Session = Depends(dep_dbsession)):
    """
    Aggiorna la società di consegna
    :param edits: il modello contenente le modifiche
    :param deliverer_id: l'UUID della società di consegna
    :param current_user: l'utente attuale
    :param db: la sessione di database
    :return: acmeat.schemas.read.DelivererRead, la società di consegna appena modificata
    """
    target = quick_retrieve(db, Deliverer, id=deliverer_id)
    if current_user.kind != UserType.admin:
        raise errors.Forbidden
    return quick_update(db, target, edits)


@router.put("/delivery/{order_id}", response_model=schemas.read.OrderRead)
async def edit_deliverer_delivery(edits: schemas.edit.DelivererDeliveryEdit,
                                  order_id: UUID,
                                  db: Session = Depends(dep_dbsession)):
    """
    Endpoint utlizzato dalla società di consegna. Aggiorna lo stato di un ordine assegnato all'azienda.
    :param edits: il modello contenente le modifiche
    :param order_id: l'UUID dell'ordine
    :param db: la sessione di database
    :return: acmeat.schemas.read.OrderRead, l'ordine appena modificato
    """
    target = quick_retrieve(db, Deliverer, api_key=edits.api_key)
    if not target:
        raise errors.Forbidden
    target_order = quick_retrieve(db, Order, id=order_id)
    if not target_order:
        raise errors.ResourceNotFound
    if target_order.deliverer_id != target.id or target_order.status != OrderStatus.delivering:
        raise errors.Forbidden
    target_order.status = OrderStatus.delivered
    db.commit()
    return target_order


@router.get("/delivery/{order_id}", response_model=schemas.read.OrderRead)
async def deliverer_get_data(data: schemas.edit.DelivererDeliveryEdit,
                             order_id: UUID,
                             db: Session = Depends(dep_dbsession)):
    """
    Endpoint utlizzato dalla società di consegna. Ottiene i dettagli di un ordine affidato alla società di consegna.
    :param data: il modello contenente il token di autorizzazione
    :param order_id: l'UUID dell'ordine
    :param db: la sessione di database
    :return: acmeat.schemas.read.OrderRead, l'ordine richiesto
    """
    target = quick_retrieve(db, Deliverer, api_key=data.api_key)
    if not target:
        raise errors.Forbidden
    target_order = quick_retrieve(db, Order, id=order_id)
    if not target_order:
        raise errors.ResourceNotFound
    return target_order
