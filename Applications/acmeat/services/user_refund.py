from acmeat.database.models import OrderStatus, Order
from acmeat.database.db import Session
import requests
import json
from bs4 import BeautifulSoup
from acmeat.configuration import BANK_URI, BANK_USERNAME, BANK_PASSWORD


def generate_soap(payload):
    soap_sample = f"""
    <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <SOAP-ENV:Body>
            {payload}
        </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>
    """
    return soap_sample


def login():
    payload = f"""
        <login>
            <password xsi:type="xsd:string">{BANK_PASSWORD}</password>
            <username xsi:type="xsd:string">{BANK_USERNAME}</username>
        </login>
        """
    response = requests.post(BANK_URI, data=generate_soap(payload), headers={'content-type': 'text/xml',
                                                                             'SOAPAction': '"/login"'})
    xml = BeautifulSoup(response.content, 'xml')
    return xml.find("sid").contents[0]


def do_refund(sid, token):
    payload = f"""
        <cancelOperationRequest>
            <token xsi:type="xsd:string">{token}</token>
            <sid xsi:type="xsd:string">{sid}</sid>
        </cancelOperationRequest>
        """
    response = requests.post(BANK_URI, data=generate_soap(payload), headers={'content-type': 'text/xml',
                                                                             'SOAPAction': '"/cancelOperation"'})
    xml = BeautifulSoup(response.content, 'xml')
    print(xml.contents)
    result = xml.find("successfull").text
    return result


def user_refund(order_id, success, paid, payment_success, TTW):
    """
    Rimborso dell'utente
    """
    print(f"[{order_id.value}] User refund procedure started!")
    with Session(future=True) as db:
        order = db.query(Order).filter_by(id=order_id.value).first()
        sid = login()
        result = do_refund(sid, order.payment[0].token)
        print(result)
    print(f"[{order_id.value}] User refund complete!")
    return {"order_id": order_id.value, "success": success.value, "paid": paid.value,
            "payment_success": payment_success.value, "TTW": TTW.value}
