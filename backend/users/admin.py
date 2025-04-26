from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import UserProfile


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name = "用户配置"
    verbose_name_plural = "用户配置"


class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)
    list_display = (
        "username",
        "email",
        "first_name",
        "last_name",
        "get_role",
        "get_vip_status",
    )

    def get_role(self, obj):
        return obj.profile.get_role_display()

    get_role.short_description = "用户角色"

    def get_vip_status(self, obj):
        if obj.profile.role != "vip":
            return "非VIP用户"
        return (
            "有效期至 " + obj.profile.vip_expiry_date.strftime("%Y-%m-%d")
            if obj.profile.is_vip_valid()
            else "VIP已过期"
        )

    get_vip_status.short_description = "VIP状态"


# 重新注册User模型
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
