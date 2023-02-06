"""
Questo modulo contiene tutti gli enum utilizzati internamente al database.
"""

import enum


class UserType(enum.Enum):
    worker = 1
    admin = 2


class DeliveryStatus(enum.Enum):
    waiting = 1
    working = 2
    delivered = 3
