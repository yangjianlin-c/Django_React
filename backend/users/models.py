from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class UserProfile(models.Model):
    USER_ROLES = [
        ("regular", "普通用户"),
        ("vip", "VIP用户"),
        ("admin", "管理员"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    role = models.CharField(max_length=10, choices=USER_ROLES, default="regular")
    vip_expiry_date = models.DateTimeField(null=True, blank=True)
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)

    def is_vip_valid(self):
        if self.role != "vip":
            return False
        return self.vip_expiry_date and self.vip_expiry_date > timezone.now()

    def set_vip(self):
        self.role = "vip"
        self.vip_expiry_date = timezone.now() + timezone.timedelta(days=365)
        self.save()

    def check_and_update_vip_status(self):
        if self.role == "vip" and not self.is_vip_valid():
            self.role = "regular"
            self.save()

    def __str__(self):
        return f"{self.user.username} - {self.get_role_display()}"
