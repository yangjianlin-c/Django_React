from typing import List

from django.contrib.auth import authenticate, logout as auth_logout
from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.template.loader import render_to_string

from ninja import Router
from ninja.errors import HttpError
from ninja.security import HttpBearer

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

from courses.models import Course, Order
from users.models import UserProfile

from .schemas import (
    ChangePasswordSchema,
    EmailSchema,
    LoginSchema,
    OrderSchema,
    UpdateProfileSchema,
    UserCreateSchema,
    UserProfileSchema,
)
from courses.schemas import CourseSchema


user_router = Router(tags=["user"])


class JWTAuth(HttpBearer):
    def authenticate(self, request, token):
        try:
            auth = JWTAuthentication()
            validated_token = auth.get_validated_token(token)
            user = auth.get_user(validated_token)
            return user
        except Exception:
            return None


# 用户相关接口
@user_router.post("/register")
def register(request, data: UserCreateSchema):
    # 检查用户名是否已存在
    if User.objects.filter(username=data.username).exists():
        raise HttpError(400, "用户名已存在")

    user = User.objects.create_user(
        username=data.username, email=data.email, password=data.password
    )
    # 生成 JWT 令牌
    refresh = RefreshToken.for_user(user)
    # 返回响应
    return {
        "message": "User created successfully!",
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }


@user_router.post("/login")
def login(request, data: LoginSchema):
    try:
        user = User.objects.get(username=data.username)
    except User.DoesNotExist:
        raise HttpError(404, "用户名不存在")

    user = authenticate(username=data.username, password=data.password)
    if user is not None:
        refresh = RefreshToken.for_user(user)
        return {
            "message": "登录成功",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }
    raise HttpError(401, "用户名或密码错误")


@user_router.post("/logout")
def logout(request):
    auth_logout(request)
    return {"success": True, "message": "已登出"}


@user_router.get("/me", auth=[JWTAuth()])
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
        "avatar_url": profile.avatar.url or "",
    }


@user_router.post("/change_password", auth=[JWTAuth()])
def change_password(request, data: ChangePasswordSchema):
    user = request.auth
    if not check_password(data.old_password, user.password):
        return {"success": False, "message": "原密码错误"}
    user.set_password(data.new_password)
    user.save()
    return {"success": True, "message": "密码修改成功"}


@user_router.post("/update_profile", auth=[JWTAuth()])
def update_profile(request, data: UpdateProfileSchema):
    user = request.auth
    user.email = data.email
    user.first_name = data.first_name
    user.last_name = data.last_name
    user.save()
    return {"success": True, "message": "资料更新成功"}


@user_router.get("/orders", response=List[OrderSchema], auth=[JWTAuth()])
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


@user_router.get("/my_courses", response=List[CourseSchema], auth=[JWTAuth()])
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


@user_router.post("/upload_avatar", auth=[JWTAuth()])
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
