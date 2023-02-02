from acmeat.database.models import OrderStatus, Order
from acmeat.database.db import Session
import requests
import json


def deliverer_abort(order_id, success, paid, payment_success, TTW):
    """
    Informa la società di consegna che l'operazione è stata annullata
    """
    print(f"[{order_id.value}] Deliverer abort procedure started!")
    with Session(future=True) as db:
        order = db.query(Order).filter_by(id=order_id.value).first()
        deliverer = order.deliverer
        try:
            requests.delete(deliverer.api_url + "/api/delivery/v1/" + order_id.value, headers={"Content-Type": "application/json",
                                                                                         "Accept": "application/json"},
                            data=json.dumps(
                                {"api_key": deliverer.external_api_key}
                            ))
        except Exception:
            pass
    return {"order_id": order_id.value, "success": success.value, "paid": paid.value,
            "payment_success": payment_success.value, "TTW": TTW.value}
