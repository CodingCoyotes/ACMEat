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
def login(request: Request):
    """
    Provides initial sid
    """
    response = requests.post(BANK_URI, data=request.xml, headers={'content-type': 'text/xml',
                                                                    'SOAPAction': request.action})
    return Response(xml=response.content)
