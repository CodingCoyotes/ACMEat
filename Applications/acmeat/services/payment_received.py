from acmeat.database.models import OrderStatus, Order
from acmeat.database.db import Session


def payment_received(order_id, success):
    print(f"[{order_id.value}] Starting payment verification routine...")
    with Session(future=True) as db:
        order: Order = db.query(Order).filter_by(id=order_id.value).first()
        #TODO: add bank check
        print(f"[{order_id.value}] payment verification complete!")
        order.status = OrderStatus.w_kitchen
        db.commit()
    return {"order_id":order_id.value, "success":success.value}