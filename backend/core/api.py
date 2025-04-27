from courses.api import course_router
from users.api import user_router
from ninja import NinjaAPI


api = NinjaAPI()

api.add_router("/course", course_router)
api.add_router("/user", user_router)
