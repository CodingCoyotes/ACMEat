from acmeat.database.models import OrderStatus, Order
from acmeat.database.db import Session


def order_delete(order_id, success, paid, payment_success, TTW):
    """
    Cancellazione
    """
    print(f"[{order_id.value}] Order has been deleted")
    with Session(future=True) as db:
        order = db.query(Order).filter_by(id=order_id.value).first()
        order.status = OrderStatus.cancelled
        db.commit()
    return {"order_id": order_id.value, "success": success.value, "paid": paid.value,
            "payment_success": payment_success.value, "TTW": TTW.value}