from acmeat.database.models import OrderStatus, Order
from acmeat.database.db import Session
import time


def restaurant_confirmation(order_id):
    print(f"[{order_id.value}] Starting restaurant confirmation routine")
    while True:
        with Session(future=True) as db:
            order: Order = db.query(Order).filter_by(id=order_id.value).first()
            if not order:
                break
            if order.status == OrderStatus.w_deliverer_ok:
                break

        time.sleep(10)
    print(f"[{order_id.value}] Order ready for delivery")
    return {"order_id":order_id.value}