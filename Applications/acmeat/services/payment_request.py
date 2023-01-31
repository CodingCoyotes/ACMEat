from acmeat.database.models import OrderStatus, Order
from acmeat.database.db import Session


def payment_request(order_id, success, paid, payment_success, TTW):
    print(f"[{order_id.value}] Starting payment request routine...")
    success.value=True
    with Session(future=True) as db:
        order: Order = db.query(Order).filter_by(id=order_id.value).first()
        if not order.payment:
            success.value = False
            order.status = OrderStatus.w_payment
            db.commit()
        else:
            print(f"[{order_id.value}] Payment request complete!")
    return {"order_id": order_id.value, "success": success.value, "paid": paid.value,
            "payment_success": payment_success.value, "TTW": TTW.value}
