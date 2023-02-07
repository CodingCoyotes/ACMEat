"""
Questo modulo contiene dipendenze comuni tra più moduli.
"""
import json

import requests
import sqlalchemy

from acmeat.configuration import GEOLOCATE_URL
from acmeat.database.db import Session


def dep_dbsession() -> sqlalchemy.orm.Session:
    """
    Dipendenza che crea una nuova sessione di collegamento al database, la quale viene chiusa terminato il suo ciclo d'uso.
    """
    with Session(future=True) as session:
        yield session


def check_address(address):
    """
    Dato un indirizzo, verifica che sia corretto
    :param address: l'indirizzo
    :return: True/False
    """
    r = requests.post(GEOLOCATE_URL + "/api/geo/v1/distance",
                      headers={"Content-Type": "application/json",
                               "Accept": "application/json"}, data=json.dumps({
            "nation": address["nation"],
            "city": address["city"],
            "roadname": address["roadname"],
            "number": address["number"]
        }))
    if r.status_code != 200:
        return False
    return True