import datetime

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
    result = xml.find("successfull").text
    data = {}
    if result == "true":
        data = {"amount": xml.find("amount").text, "source_user": xml.find("source_user").text}
    return {"result": result, "data": data}


def logout(sid):
    payload = f"""
        <logout>
            <message xsi:type="xsd:string">0</message>
            <sid xsi:type="xsd:string">{sid}</sid>
        </logout>
        """
    response = requests.post(BANK_URI, data=generate_soap(payload), headers={'content-type': 'text/xml',
                                                                             'SOAPAction': '"/logout"'})
    return


def payment_received(order_id, success, paid, payment_success, TTW):
    """
    Verifica pagamento ricevuto
    """
    print(f"[{order_id.value}] Starting payment verification routine...")
    with Session(future=True) as db:
        order: Order = db.query(Order).filter_by(id=order_id.value).first()
        payment = order.payment[0]
        sid = login()
        if payment.verified:
            payment_success.value = True
            paid.value = True
            current_time = datetime.datetime.now()
            target_time = order.delivery_time
            difference = target_time - current_time
            if difference.total_seconds()-3600 < 0:
                TTW.value = f"PT10S"
            else:
                TTW.value = f"PT{difference.total_seconds()-3600}S"
            logout(sid)
            return {"order_id": order_id.value, "success": success.value, "paid": paid.value,
                    "payment_success": payment_success.value, "TTW": TTW.value}
        result = getConfirm(sid, payment.token)
        logout(sid)
        if result["result"] == "true":
            paid.value = True
            if float(result["data"]["amount"]) != order.restaurant_total + order.deliverer_total:
                print(f"[{order_id.value}] Mismatching amounts in order payment. Aborting.")
                payment_success.value = False
                pass
            else:
                current_time = datetime.datetime.now()
                target_time = order.delivery_time
                difference = target_time - current_time
                if difference.total_seconds()-3600 < 0:
                    TTW.value = f"PT10S"
                else:
                    TTW.value = f"PT{difference.total_seconds()-3600}S"
                print(TTW.value)
                order.status = OrderStatus.w_cancellation
                payment.verified = True
                db.commit()
                payment_success.value = True
                print(f"[{order_id.value}] payment verification complete!")
        else:
            paid.value = False
            payment_success.value = False
    return {"order_id": order_id.value, "success": success.value, "paid": paid.value,
            "payment_success": payment_success.value, "TTW": TTW.value}
