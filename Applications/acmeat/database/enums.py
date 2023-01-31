import enum


class UserType(enum.Enum):
    customer = 1
    owner = 2
    admin = 3


class OrderStatus(enum.Enum):
    created = 0
    w_restaurant_ok = 1
    w_deliverer_ok = 2
    confirmed_by_thirds = 3
    cancelled = 4
    w_payment = 5
    w_cancellation = 6
    w_kitchen = 7
    w_transport = 8
    delivering = 9
    delivered = 10
#TODO: Aggiungere un enum per l'attesa dell'utente