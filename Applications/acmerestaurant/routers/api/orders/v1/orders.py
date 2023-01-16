import typing
from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import acmerestaurant.schemas.read
from acmerestaurant.authentication import get_current_user
from acmerestaurant.database import models
from acmerestaurant.schemas import *
from acmerestaurant.crud import *
from acmerestaurant.dependencies import dep_dbsession
import acmerestaurant.errors as errors
from acmerestaurant.configuration import ACME_EMAIL, ACME_PASSWORD, ACME_RESTAURANT_ID, ACME_URL
import requests

router = APIRouter(
    prefix="/api/orders/v1",
    tags=[
        "Orders v1",
    ],
)


def get_access_token():
    r = requests.post(ACME_URL + "/token",
                      data={"grant_type": "password", "username": ACME_EMAIL, "password": ACME_PASSWORD})
    token = r.json()
    return token


@router.get("/", response_model=typing.List[acmerestaurant.schemas.read.OrderRead])
async def read_orders(db: Session = Depends(dep_dbsession),
                      current_user: models.User = Depends(get_current_user)):
    token = get_access_token()
    orders = requests.get(ACME_URL+"/api/orders/v1/"+ACME_RESTAURANT_ID, headers={"Authorization":"Bearer "+token['access_token']})
    if orders.status_code != 200:
        raise errors.Forbidden
    return orders.json()


@router.get("/{order_id}", response_model=acmerestaurant.schemas.full.OrderFull)
async def read_order(order_id: UUID, db: Session = Depends(dep_dbsession),
                     current_user: models.User = Depends(get_current_user)):
    token = get_access_token()
    order = requests.get(ACME_URL+"/api/orders/v1/details/"+str(order_id), headers={"Authorization":"Bearer "+token['access_token']})
    if order.status_code != 200:
        raise errors.Forbidden
    return order.json()
