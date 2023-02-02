from acmeat.database.models import OrderStatus, Order
from acmeat.database.db import Session
import time


def restaurant_confirmation(order_id, success, paid, payment_success, TTW, restaurant_accepted):
    """
    Si valuta se il ristorante ha accettato o meno l'ordine
    """
    print(f"[{order_id.value}] Starting restaurant confirmation routine")
    success.value = True
    with Session(future=True) as db:
        order: Order = db.query(Order).filter_by(id=order_id.value).first()
        if order.status.value == OrderStatus.cancelled.value:
            restaurant_accepted.value = False
        elif order.status.value >= OrderStatus.w_deliverer_ok.value:
            restaurant_accepted.value = True
    return {"order_id": order_id.value, "success": success.value, "paid": paid.value,
            "payment_success": payment_success.value, "TTW": TTW.value, 'restaurant_accepted': restaurant_accepted.value}