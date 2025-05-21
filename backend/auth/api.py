from django.contrib.auth import authenticate, logout as auth_logout
from django.contrib.auth.models import User
from ninja import Router
from ninja.errors import HttpError
from ninja.security import HttpBearer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password

from .schemas import LoginSchema, UserCreateSchema, ChangePasswordSchema

auth_router = Router(tags=["auth"])


class JWTAuth(HttpBearer):
    def authenticate(self, request, token):
        try:
            auth = JWTAuthentication()
            validated_token = auth.get_validated_token(token)
            user = auth.get_user(validated_token)
            return user
        except Exception:
            return None


@auth_router.post("/register")
def register(request, data: UserCreateSchema):
    if User.objects.filter(username=data.username).exists():
        raise HttpError(400, "用户名已存在")

    user = User.objects.create_user(
        username=data.username, email=data.email, password=data.password
    )
    refresh = RefreshToken.for_user(user)
    return {
        "message": "User created successfully!",
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }


@auth_router.post("/login")
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


@auth_router.post("/logout", auth=[JWTAuth()])
def logout(request):
    if request.auth:
        auth_logout(request)
        return {"success": True, "message": "已登出"}
    return {"success": False, "message": "用户未登录"}


@auth_router.post("/change_password", auth=[JWTAuth()])
def change_password(request, data: ChangePasswordSchema):
    user = request.auth
    if not check_password(data.old_password, user.password):
        return {"success": False, "message": "原密码错误"}
    user.set_password(data.new_password)
    user.save()
    return {"success": True, "message": "密码修改成功"}
