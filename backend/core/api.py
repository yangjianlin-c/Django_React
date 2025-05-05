from auth.api import auth_router
from courses.api import course_router
from users.api import user_router
from orders.api import order_router
from ninja import NinjaAPI
from .search import search_router


api = NinjaAPI()
api.add_router("/auth", auth_router)
api.add_router("/user", user_router)
api.add_router("/course", course_router)
api.add_router("/order", order_router)
api.add_router("/search", search_router)
