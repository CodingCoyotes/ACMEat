from acmeat.database.models import OrderStatus, Order, Content, Restaurant, Deliverer
from acmeat.database.db import Session
from acmeat.configuration import setting_required
import requests
import json


def deliverer_preview(order_id):
    print(f"[{order_id.value}] Starting deliverer preview routine...")
    GEOLOCATE_URL = setting_required("GEOLOCATE_SERVICE")
    candidates = []
    with Session(future=True) as db:
        order: Order = db.query(Order).filter_by(id=order_id.value).first()
        if not order:
            return {"order_id": order_id.value}
        restaurant: Restaurant = order.contents[0].menu.restaurant
        deliverers: Deliverer = db.query(Deliverer).all()
        search_radius = 15  # Search radius in km, around the restaurant

        for deliverer in deliverers:
            r = requests.post(GEOLOCATE_URL + "/api/geo/v1/distance",
                              headers={"Content-Type": "application/json",
                                       "Accept": "application/json"}, data=json.dumps({
                    "source": {
                        "nation": restaurant.city.nation,
                        "city": restaurant.city.name,
                        "roadname": restaurant.address,
                        "number": restaurant.number
                    },
                    "destination": {
                        "nation": deliverer.nation,
                        "city": deliverer.city,
                        "roadname": deliverer.address,
                        "number": restaurant.number
                    }
                }))
            data = r.json()
            if data["distance_km"] < search_radius:
                candidates.append(deliverer)
        if len(candidates) == 0:
            order.status = OrderStatus.cancelled
        if len(candidates) == 1:
            order.deliverer_id = candidates[0].id
        else:
            preview = []
            for candidate in candidates:
                candidate: Deliverer
                r = requests.post(candidate.api_url + "/api/delivery/v1/preview",
                                  headers={"Content-Type": "application/json",
                                           "Accept": "application/json"}, data=json.dumps({
                        "api_key": candidate.external_api_key,
                        "request": {
                            "cost": 0,
                            "receiver": f"{order.nation};{order.city};{order.address};{order.number}",
                            "source": f"{restaurant.city.nation};{restaurant.city.name};{restaurant.address};{restaurant.number}",
                            "source_id": str(restaurant.id),
                            "delivery_time": order.delivery_time.timestamp()
                        }
                    }))
                preview.append({"deliverer": candidate, "cost": r.json()['cost']})
            sorted_by_price = sorted(preview, key=lambda d: d['cost'])
            order.deliverer_id = sorted_by_price[0]["deliverer"].id
        db.commit()
    print(f"[{order_id.value}] deliverer preview routine complete!")
    return {"order_id": order_id.value}
