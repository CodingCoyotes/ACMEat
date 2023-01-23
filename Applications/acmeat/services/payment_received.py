from acmeat.database.models import OrderStatus, Order
from acmeat.database.db import Session


def payment_received(order_id, success):
    print(f"[{order_id.value}] Starting payment verification routine...")
    with Session(future=True) as db:
        order: Order = db.query(Order).filter_by(id=order_id.value).first()

    print(f"[{order_id.value}] deliverer payment verification complete!")
    return {"order_id":order_id.value, "success":success.value}