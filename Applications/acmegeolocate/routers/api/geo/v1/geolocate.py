"""
Questo modulo contiene gli endpoint per la geolocazione
"""
from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
import requests
import math

from acmegeolocate.schemas.edit import *
from acmegeolocate.crud import *
from acmegeolocate.errors import *

router = APIRouter(
    prefix="/api/geo/v1",
    tags=[
        "Geolocate v1",
    ],
)


def calculate_distance(source: dict, destination: dict):
    """
    Calcola la distanza tra due punti su una sfera
    :param source: coordinate punto sorgente
    :param destination: coordinate punto destinazione
    :return: la distanza tra due punti
    """
    earth_radius = 6371e3
    # Radians conversion
    phi_1 = source["lat"] * math.pi / 180
    phi_2 = destination["lat"] * math.pi / 180
    delta_phi = (destination["lat"] - source["lat"]) * math.pi / 180
    delta_lambda = (destination["lon"] - source["lon"]) * math.pi / 180

    tmp = math.sin(delta_phi / 2) * math.sin(delta_phi / 2) + math.cos(phi_1) * math.cos(phi_2) * math.sin(
        delta_lambda / 2) * math.sin(delta_lambda / 2)
    tmp2 = 2 * math.atan2(math.sqrt(tmp), math.sqrt(1 - tmp))
    return (earth_radius * tmp2) / 1000


@router.post("/distance", response_model=DistanceResponse)
def distance_address_evaluate(request: DistanceRequest):
    """
    Restituisce la distanza tra due indirizzi
    :param request: il modello contenente gli indirizzi
    :return: DistanceResponse, la distanza in km
    """
    payload_s = {"q": request.source.__repr__(), "format": "json", "polygon": 1, "addressdetails": 0}
    r_s = requests.get(f"https://nominatim.openstreetmap.org/search", params=payload_s)
    if r_s.status_code != 200 or len(r_s.json()) == 0:
        print("Could not find "+request.source.__repr__())
        raise ResourceNotFound
    payload_d = {"q": request.destination.__repr__(), "format": "json", "polygon": 1, "addressdetails": 1}
    r_d = requests.get(f"https://nominatim.openstreetmap.org/search", params=payload_d)
    if r_d.status_code != 200 or len(r_d.json()) == 0:
        print("Could not find "+request.destination.__repr__())
        raise ResourceNotFound
    source_coords = {"lat": float(r_s.json()[0]["lat"]), "lon": float(r_s.json()[0]["lon"])}
    destination_coords = {"lat": float(r_d.json()[0]["lat"]), "lon": float(r_d.json()[0]["lon"])}
    return DistanceResponse(distance_km=calculate_distance(source_coords, destination_coords))


@router.post("/coordinates", response_model=CoordsResponse)
def coordinates_evaluate(request: Address):
    """
    Restituisce le coordinate di un indirizzo
    :param request: il modello contenente l'indirizzo
    :return: CoordsResponse, le coordinate
    """
    payload = {"q": request.__repr__(), "format": "json", "polygon": 1, "addressdetails": 0}
    r = requests.get(f"https://nominatim.openstreetmap.org/search", params=payload)
    if r.status_code != 200 or len(r.json()) == 0:
        raise ResourceNotFound
    return CoordsResponse(longitude=float(r.json()[0]["lon"]), latitude=float(r.json()[0]["lat"]))