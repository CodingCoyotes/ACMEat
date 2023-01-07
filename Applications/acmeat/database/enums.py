import enum


class UserType(enum.Enum):
    customer = 1
    owner = 2
    admin = 3


class OrderStatus(enum.Enum):
    confirmed = 1
    cancelled = 2
    w_payment = 3
    w_transport = 4
    w_kitchen = 5
    delivering = 6
    delivered = 7
