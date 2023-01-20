from acmeat.database.models import OrderStatus, Order
from acmeat.database.db import Session


def deliverer_confirmation(order_id):
    print(f"[{order_id.value}] Starting deliverer confirmation routine...")
    with Session(future=True) as db:
        order: Order = db.query(Order).filter_by(id=order_id.value).first()

    print(f"[{order_id.value}] deliverer confirmation routine complete!")
    return {"order_id":order_id.value}