from typing import List

from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.template.loader import render_to_string

from ninja import Router
from ninja.errors import HttpError
from courses.models import Course
from orders.models import Order
from users.models import UserProfile
from auth.api import JWTAuth
from .schemas import (
    EmailSchema,
    OrderSchema,
    UpdateProfileSchema,
)
from courses.schemas import CourseSchema

user_router = Router(tags=["user"], auth=JWTAuth())


@user_router.get("/me")
def get_me(request):
    user = request.auth
    profile = getattr(user, "profile", None)
    return {
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "role": getattr(profile, "role", "user"),
        "vip_expiry_date": getattr(profile, "vip_expiry_date", None) or "",
        "avatar_url": profile.avatar.url if profile and profile.avatar else "",
    }


@user_router.post("/update_profile")
def update_profile(request, data: UpdateProfileSchema):
    user = request.auth
    user.email = data.email
    user.first_name = data.first_name
    user.last_name = data.last_name
    user.save()
    return {"success": True, "message": "资料更新成功"}


@user_router.get("/orders", response=List[OrderSchema])
def list_orders(request):
    user = request.auth
    orders = Order.objects.filter(user=user)
    return orders


@user_router.post("/send_welcome_email")
def send_welcome_email(request, data: EmailSchema):
    try:
        html_message = render_to_string(
            "email_templates/welcome_email.html",
            {
                "username": data.message,
                "logo_url": "mekesim.com/logo.png",
                "login_url": "",
                "support_email": "service@mekesim.com",
            },
        )
        send_mail(
            data.subject,
            data.message,
            "service@mekesim.com",
            [data.recipient],
            fail_silently=False,
            html_message=html_message,
        )
        return {"success": True, "message": "欢迎邮件发送成功"}
    except Exception as e:
        return {"success": False, "message": f"欢迎邮件发送失败: {str(e)}"}


@user_router.get("/my_courses", response=List[CourseSchema])
def list_my_courses(request):
    user = request.auth
    profile = getattr(user, "profile", None)
    if (
        profile
        and getattr(profile, "role", "user") == "vip"
        and hasattr(profile, "is_vip_valid")
        and profile.is_vip_valid()
    ):
        return Course.objects.all()
    course_ids = Order.objects.filter(user=user, status="paid").values_list(
        "course_id", flat=True
    )
    return Course.objects.filter(id__in=course_ids)


@user_router.post("/upload_avatar")
def upload_avatar(request):
    user = request.auth
    profile = getattr(user, "profile", None)

    if not request.FILES or "avatar" not in request.FILES:
        raise HttpError(400, "Please upload an avatar file")

    avatar_file = request.FILES["avatar"]

    # Check file type
    allowed_types = ["image/jpeg", "image/png", "image/gif"]
    if avatar_file.content_type not in allowed_types:
        raise HttpError(400, "Unsupported file type. Please upload JPG, PNG, or GIF.")

    # Check file size (limit to 5MB)
    if avatar_file.size > 5 * 1024 * 1024:
        raise HttpError(400, "File size exceeds the limit (max 5MB)")

    if not profile:
        profile = UserProfile.objects.create(user=user)

    # Save avatar
    profile.avatar.save(avatar_file.name, avatar_file, save=True)  # 保存文件到服务器
    # Refresh from db to get the url
    profile.refresh_from_db()

    return {
        "success": True,
        "message": "Avatar uploaded successfully",
        "avatar_url": profile.avatar.url if profile.avatar else "",
    }
