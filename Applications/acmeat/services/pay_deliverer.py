from acmeat.database.models import OrderStatus, Order
from acmeat.database.db import Session
from bs4 import BeautifulSoup
import requests
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


def pay(sid, amount, user_id):
    payload = f"""
        <paymentTo>
            <toUser xsi:type="xsd:string">{user_id}</toUser>
            <amount xsi:type="xsd:double">{amount}</amount>
            <sid xsi:type="xsd:string">{sid}</sid>
        </paymentTo>
        """
    response = requests.post(BANK_URI, data=generate_soap(payload), headers={'content-type': 'text/xml',
                                                                             'SOAPAction': '"/paymentTo"'})
    xml = BeautifulSoup(response.content, 'xml')
    result = xml.find("successfull").text
    return result


def pay_deliverer(order_id, success, paid, payment_success, TTW):
    print(f"[{order_id.value}] Executing payment to deliverer...")
    with Session(future=True) as db:
        order = db.query(Order).filter_by(id=order_id.value).first()
        sid = login()
        result = pay(sid, order.deliverer_total, order.deliverer.bank_address)
    print(f"[{order_id.value}] Payment executed successfully!")
    return {"order_id": order_id.value, "success": success.value, "paid": paid.value,
            "payment_success": payment_success.value, "TTW": TTW.value}