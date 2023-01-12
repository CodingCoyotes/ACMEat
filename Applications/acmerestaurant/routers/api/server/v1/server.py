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


@router.get("/me", response_model=ServerRead)
async def read_server(current_user: User = Depends(get_current_user)):
    return ServerRead(acmeat_restaurant_id=ACME_RESTAURANT_ID)
