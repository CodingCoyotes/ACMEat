from acmeat.database.models import OrderStatus, Order, Deliverer
from acmeat.database.db import Session
import requests
import json


def activate_delivery(order_id, success, paid, payment_success, TTW):
    """
    Attivazione ordine
    """
    print(f"[{order_id.value}] Order has been activated")
    with Session(future=True) as db:
        order = db.query(Order).filter_by(id=order_id.value).first()
        deliverer: Deliverer = order.deliverer
        r = requests.post(deliverer.api_url + "/api/delivery/v1/" + order_id.value + "/confirm",
                          headers={"Content-Type": "application/json",
                                   "Accept": "application/json"},
                          data=json.dumps(
                              {"api_key": deliverer.external_api_key}
                          ))
    return {"order_id": order_id.value, "success": success.value, "paid": paid.value,
            "payment_success": payment_success.value, "TTW": TTW.value}
