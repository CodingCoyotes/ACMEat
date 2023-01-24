from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
import requests
import math
from bank_intermediary.configuration import BANK_URI
from bs4 import BeautifulSoup

from bank_intermediary.schemas.edit import *
from bank_intermediary.crud import *
from bank_intermediary.errors import *

router = APIRouter(
    prefix="/api/intermediary/v1",
    tags=[
        "Intermediary v1",
    ],
)


def generate_soap(payload):
    soap_sample = f"""
    <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <SOAP-ENV:Body>
            {payload}
        </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>
    """
    return soap_sample


@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest):
    """
    Provides initial sid
    """
    payload = f"""
        <login>
            <name xsi:type="xsd:string">{request.username}</name>
        </login>
        """
    response = requests.post(BANK_URI, data=generate_soap(payload), headers={'content-type': 'text/xml',
                                                                        'SOAPAction': '"/login"'})
    xml = BeautifulSoup(response.content, 'xml')
    return LoginResponse(sid=xml.find("sid").contents[0])
