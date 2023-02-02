from acmeat.database.models import OrderStatus, Order, Content, Restaurant, Deliverer
from acmeat.database.db import Session
from acmeat.configuration import setting_required
import requests
import json
import datetime
from threading import Thread
import time


def deliverer_preview(order_id, success, paid, payment_success, TTW, found_deliverer):
    print(f"[{order_id.value}] Order ready for delivery")
    print(f"[{order_id.value}] Starting deliverer preview routine...")
    GEOLOCATE_URL = setting_required("GEOLOCATE_SERVICE")
    candidates = []
    # TODO: add a 15s timer
    with Session(future=True) as db:
        order: Order = db.query(Order).filter_by(id=order_id.value).first()
        if not order:
            return {"order_id": order_id.value, "success": success.value}
        if order.status.value > OrderStatus.w_deliverer_ok.value:
            return {"order_id": order_id.value, "success": success.value}
        restaurant: Restaurant = order.contents[0].menu.restaurant
        deliverers: Deliverer = db.query(Deliverer).all()
        search_radius = 10  # Search radius in km, around the restaurant

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
            print(data, deliverer.name)
            if data["distance_km"] < search_radius:
                candidates.append(deliverer)
            end_time = datetime.datetime.now()

        if len(candidates) == 0:
            found_deliverer.value = False
        elif len(candidates) == 1:
            order.deliverer_id = candidates[0].id
            found_deliverer.value = True
        else:
            preview = []

            def parallel_preview(candidate, id):
                print(f"[{order_id.value}-{id}]     Parallel preview started.")
                candidate: Deliverer
                try:
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
                        }), timeout=3)
                except (requests.exceptions.Timeout, Exception):
                    print(f"[{order_id.value}-{id}]     Host timed out.")
                    return
                print(f"[{order_id.value}-{id}]     Parallel preview completed.")
                preview.append({"deliverer": candidate, "cost": r.json()['cost']})
                return

            threadlist = []
            for candidate in candidates:
                t = Thread(target=parallel_preview, args=(candidate, len(threadlist)))
                threadlist.append(t)
                t.start()

            start_time = datetime.datetime.now()
            while (datetime.datetime.now()-start_time).total_seconds() <= 15 and len(preview)!=len(candidates):
                time.sleep(1)
            for t in threadlist:
                t.join(0.1)
            if len(preview) == 0:
                found_deliverer.value = False
            else:
                found_deliverer.value = True
                sorted_by_price = sorted(preview, key=lambda d: d['cost'])
                order.deliverer_id = sorted_by_price[0]["deliverer"].id
        db.commit()
    print(f"[{order_id.value}] deliverer preview routine complete!")
    return {"order_id": order_id.value, "success": success.value, "paid": paid.value,
            "payment_success": payment_success.value, "TTW": TTW.value, "found_deliverer": found_deliverer.value}
