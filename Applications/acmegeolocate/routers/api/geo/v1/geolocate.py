from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session

from acmegeolocate.schemas.edit import *
from acmegeolocate.crud import *

router = APIRouter(
    prefix="/api/geo/v1",
    tags=[
        "Geolocate v1",
    ],
)


@router.post("/distance", response_model=DistanceResponse)
async def distance_address_evaluate(request: DistanceRequest):
    """
    Returns distance between two adrresses.
    """
    a = DistanceResponse(distance_km=1)
    return a
