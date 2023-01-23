from acmeat.database.models import OrderStatus, Order
from acmeat.database.db import Session
import time


def restaurant_confirmation(order_id, success):
    print(f"[{order_id.value}] Starting restaurant confirmation routine")
    success.value = False
    with Session(future=True) as db:
        order: Order = db.query(Order).filter_by(id=order_id.value).first()
        if not order:
            pass
        elif order.status == OrderStatus.w_deliverer_ok:
            success.value = True
    return {"order_id":order_id.value, "success":success.value}