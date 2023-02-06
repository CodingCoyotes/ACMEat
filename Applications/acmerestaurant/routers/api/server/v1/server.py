"""
Questo modulo contiene gli endpoint per la gestione del server
"""
from fastapi import APIRouter, Depends
from acmerestaurant.schemas.read import ServerRead
from acmerestaurant.authentication import get_current_user
from acmerestaurant.configuration import ACME_RESTAURANT_ID
from acmerestaurant.database.models import User

router = APIRouter(
    prefix="/api/server/v1",
    tags=[
        "Server v1",
    ],
)


@router.get("/", response_model=ServerRead)
def read_server(current_user: User = Depends(get_current_user)):
    """
    Restituisce il restaurant_id
    :param current_user: l'utente attuale
    :return: ServerRead, il restaurant_id
    """
    return ServerRead(acmeat_restaurant_id=ACME_RESTAURANT_ID)
