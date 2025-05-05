from ninja import Router
from ninja.errors import HttpError
from typing import List
from courses.schemas import CourseSchema, CourseDetailSchema, LessonSchema, TagSchema
from courses.models import Course, Lesson, Tag
from orders.models import Order
from ninja.pagination import paginate, PageNumberPagination

course_router = Router(tags=["course"])


# 获取所有标签列表
@course_router.get("/tags", response=List[TagSchema])
def list_tags(request):
    return Tag.objects.all()


# 课程列表接口
@course_router.get("/courses", response=List[CourseSchema])
@paginate(PageNumberPagination)
def list_courses(request, tag_id: int = None):
    courses = Course.objects.all()
    if tag_id:
        courses = courses.filter(tags__id=tag_id)
    return courses


# 课程详情接口
@course_router.get("/{course_id}", response=CourseDetailSchema)
def get_course(request, course_id: int):
    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        raise HttpError(404, "课程不存在")
    return course


# # 课时列表接口
# @course_router.get("/courses/{course_id}/lessons", response=List[LessonSchema])
# def list_lessons(request, course_id: int):
#     try:
#         course = Course.objects.get(id=course_id)
#     except Course.DoesNotExist:
#         raise HttpError(404, "课程不存在")
#     # 权限判断：免费课程所有人可访问，付费课程仅VIP或已购买用户可访问
#     if course.price > 0:
#         user = getattr(request, "user", None)
#         if not user or not user.is_authenticated:
#             raise HttpError(403, "请先登录")
#         profile = getattr(user, "profile", None)
#         is_vip = (
#             profile
#             and getattr(profile, "role", "user") == "vip"
#             and hasattr(profile, "is_vip_valid")
#             and profile.is_vip_valid()
#         )
#         has_order = Order.objects.filter(
#             user=user, course=course, status="paid"
#         ).exists()
#         if not (is_vip or has_order):
#             raise HttpError(403, "无权访问该课程课时，请购买或升级VIP")
#     lessons = Lesson.objects.filter(course=course)
#     return lessons


# 课时详情接口
@course_router.get("/lesson/{lesson_id}", response=LessonSchema)
def get_lesson(request, lesson_id: int):
    try:
        lesson = Lesson.objects.get(id=lesson_id)
        course = lesson.course
    except Lesson.DoesNotExist:
        raise HttpError(404, "课时不存在")
    # 权限判断：免费课时所有人可访问，付费课时仅VIP或已购买用户可访问
    if not lesson.free_preview and course.price > 0:
        user = getattr(request, "user", None)
        if not user or not user.is_authenticated:
            raise HttpError(403, "请先登录")
        profile = getattr(user, "profile", None)
        is_vip = (
            profile
            and getattr(profile, "role", "user") == "vip"
            and hasattr(profile, "is_vip_valid")
            and profile.is_vip_valid()
        )
        has_order = Order.objects.filter(
            user=user, course=course, status="paid"
        ).exists()
        if not (is_vip or has_order):
            raise HttpError(403, "无权访问该课时，请购买或升级VIP")
    return lesson


# 这里后续将迁移api.py中的课程相关接口和序列化类
