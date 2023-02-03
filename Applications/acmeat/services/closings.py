import datetime
from acmeat.database.db import Session
from acmeat.database.models import Restaurant


def closings():
    """
    Resetta lo stato di chiusura dei locali
    """
    # Se è mezzanotte...
    if datetime.datetime.now().hour == 0:
        with Session(future=True) as db:
            restaurants = db.query(Restaurant).filter_by(closed=True).all()
            for restaurant in restaurants:
                restaurant.closed = False
            db.commit()
        print(f"Chiusura locali ripristinata!")
    return {}
