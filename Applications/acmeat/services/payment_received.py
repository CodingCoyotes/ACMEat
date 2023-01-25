from acmeat.database.models import OrderStatus, Order
from acmeat.database.db import Session
import requests
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


def getConfirm(sid, token):
    payload = f"""
        <operationReport>
            <token xsi:type="xsd:string">{token}</token>
            <sid xsi:type="xsd:string">{sid}</sid>
        </operationReport>
        """
    response = requests.post(BANK_URI, data=generate_soap(payload), headers={'content-type': 'text/xml',
                                                                             'SOAPAction': '"/operationReport"'})
    xml = BeautifulSoup(response.content, 'xml')
    print(xml.contents)
    result = xml.find("successfull").text
    data = {}
    if result == "true":
        data = {"amount": xml.find("amount").text, "source_user": xml.find("source_user").text}
    return {"result": result, "data": data}


def payment_received(order_id, success):
    print(f"[{order_id.value}] Starting payment verification routine...")
    with Session(future=True) as db:
        order: Order = db.query(Order).filter_by(id=order_id.value).first()
        payment = order.payment[0]
        sid = login()
        if payment.verified:
            return {"order_id": order_id.value, "success": success.value}
        result = getConfirm(sid, payment.token)
        if result["result"] == "true":
            #if float(result["data"]["amount"]) != order.restaurant_total + order.deliverer_total:
            #    # Che si fa se il pagamento è inferiore? Si cancella l'ordine?
            #    pass
            #else:
            print(f"[{order_id.value}] payment verification complete!")
            order.status = OrderStatus.w_kitchen
            payment.verified = True
            db.commit()
    return {"order_id": order_id.value, "success": success.value}
