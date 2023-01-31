from acmeat.database.models import OrderStatus, Order
from acmeat.database.db import Session


def order_confirm(order_id, success, paid, payment_success, TTW):
    with Session(future=True) as db:
        order = db.query(Order).filter_by(id=order_id.value).first()
        order.status = OrderStatus.w_kitchen
        db.commit()
    print(f"[{order_id.value}] Order has been confirmed!")
    return {"order_id": order_id.value, "success": success.value, "paid": paid.value,
            "payment_success": payment_success.value, "TTW": TTW.value}
