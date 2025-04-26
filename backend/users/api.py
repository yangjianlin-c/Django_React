# 用户相关API接口拆分文件

from ninja import Router
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.hashers import check_password
from ninja.errors import HttpError
from typing import List
from pydantic import BaseModel
from users.models import UserProfile
from courses.models import Order, Course
from django.core.mail import send_mail
from django.template.loader import render_to_string

user_router = Router(tags=["user"])


# 用户相关序列化类
class LoginSchema(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    success: bool
    message: str


class UserProfileSchema(BaseModel):
    username: str
    email: str = ""
    first_name: str = ""
    last_name: str = ""
    role: str = "user"
    vip_expiry_date: str | None = None

    class Config:
        orm_mode = True


class ChangePasswordSchema(BaseModel):
    old_password: str
    new_password: str


class UpdateProfileSchema(BaseModel):
    email: str = ""
    first_name: str = ""
    last_name: str = ""


class EmailSchema(BaseModel):
    subject: str
    message: str
    recipient: str
    html_message: str = ""


class OrderSchema(BaseModel):
    order_number: str
    course: int
    price: float
    status: str
    payment_method: str = ""
    created_at: str = ""

    class Config:
        orm_mode = True


# 用户相关接口
@user_router.post("/login", response=LoginResponse)
def login(request, data: LoginSchema):
    user = authenticate(username=data.username, password=data.password)
    if user is not None:
        auth_login(request, user)
        return {"success": True, "message": "登录成功"}
    else:
        return {"success": False, "message": "用户名或密码错误"}


@user_router.post("/logout")
def logout(request):
    auth_logout(request)
    return {"success": True, "message": "已登出"}


@user_router.get("/me", response=UserProfileSchema)
def get_me(request):
    user = (
        request.user
        if hasattr(request, "user") and request.user.is_authenticated
        else None
    )
    if not user:
        raise HttpError(401, "未登录")
    profile = getattr(user, "profile", None)
    return {
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "role": getattr(profile, "role", "user"),
        "vip_expiry_date": getattr(profile, "vip_expiry_date", None) or "",
    }


@user_router.post("/change_password")
def change_password(request, data: ChangePasswordSchema):
    user = (
        request.user
        if hasattr(request, "user") and request.user.is_authenticated
        else None
    )
    if not user:
        raise HttpError(401, "未登录")
    if not check_password(data.old_password, user.password):
        return {"success": False, "message": "原密码错误"}
    user.set_password(data.new_password)
    user.save()
    return {"success": True, "message": "密码修改成功"}


@user_router.post("/update_profile")
def update_profile(request, data: UpdateProfileSchema):
    user = (
        request.user
        if hasattr(request, "user") and request.user.is_authenticated
        else None
    )
    if not user:
        raise HttpError(401, "未登录")
    user.email = data.email
    user.first_name = data.first_name
    user.last_name = data.last_name
    user.save()
    return {"success": True, "message": "资料更新成功"}


@user_router.get("/orders", response=List[OrderSchema])
def list_orders(request):
    user = (
        request.user
        if hasattr(request, "user") and request.user.is_authenticated
        else None
    )
    if not user:
        raise HttpError(401, "未登录")
    orders = Order.objects.filter(user=user)
    return orders


from courses.models import Course


class CourseSchema(BaseModel):
    id: int
    title: str
    description: str = ""
    price: int
    thumbnail: str = ""
    feature: bool = False

    class Config:
        orm_mode = True


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
    user = (
        request.user
        if hasattr(request, "user") and request.user.is_authenticated
        else None
    )
    if not user:
        raise HttpError(401, "未登录")
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
