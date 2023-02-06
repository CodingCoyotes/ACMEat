from .api.cities.v1.cities import router as city_router
from .api.restaurants.v1.restaurants import router as restaurant_router
from .api.deliverers.v1.deliverers import router as deliverer_router
from .api.users.v1.users import router as user_router
from .api.menus.v1.menus import router as menu_router
from .api.orders.v1.orders import router as orders_router

__all__ = (
    "city_router",
    "restaurant_router",
    "deliverer_router",
    "user_router",
    "menu_router",
    "orders_router"
)