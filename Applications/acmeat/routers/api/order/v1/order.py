"""
Questo modulo contiene gli endpoint per la gestione degli ordini
"""
import typing
from uuid import UUID
from fastapi import APIRouter, Depends
from pycamunda.message import CorrelateSingle
from sqlalchemy.orm import Session

from acmeat.configuration import CAMUNDA_URL, GEOLOCATE_URL
from acmeat.database.enums import OrderStatus
import acmeat.schemas.read
from acmeat.authentication import get_current_user
from acmeat.database import models
from acmeat.crud import *
from acmeat.dependencies import dep_dbsession, check_address
import acmeat.errors as errors
import pycamunda
import pycamunda.processdef
import requests
import json

router = APIRouter(
    prefix="/api/order/v1",
    tags=[
        "Order v1",
    ],
)


@router.get("/{restaurant_id}", response_model=typing.List[acmeat.schemas.read.OrderRead])
async def read_orders(restaurant_id: UUID, db: Session = Depends(dep_dbsession),
                      current_user: models.User = Depends(get_current_user)):
    """
    Restituisce tutti gli ordini di un ristorante.
    :param restaurant_id: l'UUID del ristorante
    :param db: la sessione di database
    :param current_user: l'utente attuale
    :return: typing.List[acmeat.schemas.read.OrderRead], la lista degli ordini
    """
    restaurant = quick_retrieve(db, models.Restaurant, id=restaurant_id)
    user = quick_retrieve(db, models.User, id=current_user.id)
    if restaurant not in user.restaurants:
        raise errors.Forbidden
    results = db.query(models.Order).join(models.Content).join(models.Menu).filter_by(restaurant_id=restaurant_id).all()
    return results


@router.get("/details/{order_id}", response_model=acmeat.schemas.full.OrderFull)
async def read_order(order_id: UUID, db: Session = Depends(dep_dbsession),
                     current_user: models.User = Depends(get_current_user)):
    """
    Restituisce i dettagli di un ordine
    :param order_id: l'UUID dell'ordine
    :param db: la sessione di database
    :param current_user: l'utente attuale
    :return: acmeat.schemas.full.OrderFull, i dettagli dell'ordine
    """
    order = quick_retrieve(db, models.Order, id=order_id)
    restaurant_id = order.contents[0].menu.restaurant_id
    restaurant = quick_retrieve(db, models.Restaurant, id=restaurant_id)
    if not (order.user_id == current_user.id or restaurant.owner_id == current_user.id):
        raise errors.Forbidden
    return order


@router.post("/{restaurant_id}", response_model=acmeat.schemas.read.OrderRead)
async def create_order(restaurant_id: str, order_data: acmeat.schemas.edit.OrderCreation,
                       db: Session = Depends(dep_dbsession),
                       current_user: models.User = Depends(get_current_user)):
    """
    Crea un ordine e avvia il processo BPMN collegandosi a Camunda.
    :param restaurant_id: l'UUID del ristorante
    :param order_data: la lista delle ordinazioni
    :param db: la sessione di database
    :param current_user: l'utente attuale
    :return: acmeat.schemas.read.OrderRead, l'ordine
    """
    # Verifica validità indirizzo
    restaurant = quick_retrieve(db, models.Restaurant, id=restaurant_id)
    if restaurant.closed:
        raise errors.Forbidden
    if not check_address({"nation": order_data.nation, "city": order_data.city, "roadname": order_data.address,
                      "number": order_data.number}):
        raise errors.ResourceNotFound
    order = quick_create(db,
                         models.Order(status=OrderStatus.w_restaurant_ok, delivery_time=order_data.delivery_time,
                                      user_id=current_user.id, nation=order_data.nation, number=order_data.number,
                                      address=order_data.address, city=order_data.city))
    total = 0
    for elem in order_data.contents:
        # Ensures no menu mix-up in order (all menus must be from same restaurant)
        m = quick_retrieve(db, models.Menu, id=elem.menu_id, restaurant_id=restaurant_id)
        quick_create(db, models.Content(order_id=order.id, menu_id=elem.menu_id, qty=elem.qty))
        total += m.cost * elem.qty
    order.restaurant_total = total
    db.commit()

    # Definizione del processo su camunda
    start_instance = pycamunda.processdef.StartInstance(url=CAMUNDA_URL, key='order_confirmation', tenant_id="acmeat")
    # Setup delle variabili
    start_instance.add_variable(name='order_id', value=str(order.id))
    start_instance.add_variable(name='success', value=False)
    start_instance.add_variable(name="paid", value=False)
    start_instance.add_variable(name="payment_success", value=False)
    start_instance.add_variable(name="TTW", value="PT")
    start_instance.add_variable(name="found_deliverer", value=False)
    start_instance.add_variable(name="restaurant_accepted", value=False)
    # Avvio del processo
    camunda_id = start_instance()
    # Memorizzazione ID processo
    order.camunda_id = str(camunda_id.id_)
    db.commit()
    return order


@router.put("/{order_id}", response_model=acmeat.schemas.read.OrderRead)
async def update_order(order_id: UUID, order_data: acmeat.schemas.edit.OrderEdit,
                       db: Session = Depends(dep_dbsession),
                       current_user: models.User = Depends(get_current_user)):
    """
    Funzione di aggiornamento ordine.
    :param order_id: l'UUID dell'ordine
    :param order_data: il modello contenente l'aggiornamento
    :param db: la sessione di database
    :param current_user: l'utente attuale
    :return: acmeat.schemas.read.OrderRead, l'ordine modificato
    """
    order = quick_retrieve(db, models.Order, id=order_id)
    restaurant_id = order.contents[0].menu.restaurant_id
    restaurant = quick_retrieve(db, models.Restaurant, id=restaurant_id)
    # Se l'utente non è nè legato al locale nè è il cliente...
    if not (order.user_id == current_user.id or restaurant.owner_id == current_user.id):
        raise errors.Forbidden
    # Se l'utente è il cliente
    if order.user_id == current_user.id:
        if order_data.status != OrderStatus.cancelled:
            raise errors.Forbidden
        # Se l'ordine non può venire cancellato...
        if order.status.value != OrderStatus.w_cancellation.value:
            raise errors.Forbidden
        try:
            # Manda il messaggio di interruzione ordine
            msg = CorrelateSingle(CAMUNDA_URL, message_name="Message_Abort",
                                  process_instance_id=order.camunda_id
                                  )
            msg()
        except Exception:
            pass
        return order
    # Se l'utente è il ristorante e l'ordine si trova in un giusto stato, viene cancellato o promosso
    if order.status == OrderStatus.w_restaurant_ok and (
            order_data.status == OrderStatus.cancelled or order_data.status == OrderStatus.w_deliverer_ok):
        order.status = order_data.status
        db.commit()
        if order_data.status == OrderStatus.w_deliverer_ok or order_data.status == OrderStatus.cancelled:
            try:
                # Manda il messaggio per far proseguire il processo
                msg = CorrelateSingle(CAMUNDA_URL, message_name="Message_Restaurant",
                                      process_instance_id=order.camunda_id
                                      )
                msg()
            except Exception:
                pass
        return order
    # Se lo stato richiesto non è tra quelli autorizzati per il ristorante...
    if order.status.value > order_data.status.value or order_data.status.value not in [2, 8, 9]:
        raise errors.Forbidden
    order.status = order_data.status
    db.commit()
    return order


@router.post("/{order_id}/payment/", response_model=acmeat.schemas.read.PaymentRead)
def pay_order(order_id: UUID, payment_data: acmeat.schemas.edit.PaymentEdit,
              db: Session = Depends(dep_dbsession),
              current_user: models.User = Depends(get_current_user)):
    """
    Consente il pagamento dell'ordine.
    :param order_id: l'id dell'ordine da pagare
    :param payment_data: il modello contenente il token di pagamento
    :param db: la sessione di database
    :param current_user: l'utente attuale
    :return: acmeat.schemas.read.PaymentRead, il pagamento
    """
    order = quick_retrieve(db, models.Order, id=order_id)
    if not (order.user_id == current_user.id):
        raise errors.Forbidden
    try:
        msg = CorrelateSingle(CAMUNDA_URL, message_name="Message_Payment",
                              process_instance_id=order.camunda_id
                              )
        msg()
    except Exception:
        pass
    return quick_create(db, models.Payment(order_id=order.id, token=payment_data.token))
