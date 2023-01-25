from acmeat.database.models import OrderStatus, Order, Deliverer, Restaurant
from acmeat.database.db import Session
import requests
import json


def deliverer_confirmation(order_id, success):
    print(f"[{order_id.value}] Starting deliverer confirmation routine...")
    with Session(future=True) as db:
        order: Order = db.query(Order).filter_by(id=order_id.value).first()
        #if not order:
        #    return {"order_id": order_id.value}
        if order.status.value > OrderStatus.w_deliverer_ok.value:
            return {"order_id": order_id.value, "success":success.value}
        deliverer: Deliverer = order.deliverer
        restaurant: Restaurant = order.contents[0].menu.restaurant
        r = requests.post(deliverer.api_url + "/api/delivery/v1",
                          headers={"Content-Type": "application/json",
                                   "Accept": "application/json"}, data=json.dumps({
                "api_key": deliverer.external_api_key,
                "request": {
                    "cost": 0,
                    "receiver": f"{order.nation};{order.city};{order.address};{order.number}",
                    "source": f"{restaurant.city.nation};{restaurant.city.name};{restaurant.address};{restaurant.number}",
                    "source_id": str(order.id),
                    "delivery_time": order.delivery_time.timestamp()
                }
            }))
        order.deliverer_total = r.json()['cost']
        order.status = OrderStatus.confirmed_by_thirds
        db.commit()
    print(f"[{order_id.value}] deliverer confirmation routine complete!")
    return {"order_id": order_id.value, "success": success.value}
