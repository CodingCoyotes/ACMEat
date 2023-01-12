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
    w_kitchen = 6
    w_transport = 7
    delivering = 8
    delivered = 9
