from acmeat.database.models import OrderStatus, Order
from acmeat.database.db import Session


def payment_request(order_id, success):
    print(f"[{order_id.value}] Starting payment request routine...")
    with Session(future=True) as db:
        order: Order = db.query(Order).filter_by(id=order_id.value).first()
        if len(order.payment) == 0:
            success.value = False
            order.status = OrderStatus.w_payment
            db.commit()
        else:
            print(f"[{order_id.value}] deliverer payment request complete!")
    return {"order_id": order_id.value, "success": success.value}
