"""
Questo modulo contiene l'endpoint per la comunicazione tra il frontend della banca e la banca stessa
"""
from fastapi import APIRouter
import requests
from bank_intermediary.configuration import BANK_URI

from bank_intermediary.schemas.edit import *

router = APIRouter(
    prefix="/api/intermediary/v1",
    tags=[
        "Intermediary v1",
    ],
)


@router.post("/", response_model=Response)
def intermediary(request: Request):
    """
    Redirects to the bank the soap request and returns it back
    :param request: the soap request
    :return: Response, the soap response
    """
    response = requests.post(BANK_URI, data=request.xml, headers={'content-type': 'text/xml',
                                                                    'SOAPAction': request.action})
    return Response(xml=response.content)
