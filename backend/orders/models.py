from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from courses.models import Course
from django.db.models.signals import pre_save
from django.dispatch import receiver


class Order(models.Model):
    STATUS_CHOICES = (
        ("unpaid", "Unpaid"),
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("cancelled", "Cancelled"),
    )

    PAYMENT_METHODS = (
        ("manual", "手动支付"),
        ("alipay", "支付宝"),
        ("wechat", "微信支付"),
    )

    # 订单基本信息
    order_number = models.CharField(max_length=50, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="orders")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="unpaid")
    payment_method = models.CharField(
        max_length=20, choices=PAYMENT_METHODS, null=True, blank=True
    )
    note = models.TextField(blank=True, null=True, help_text="订单备注信息")

    # 时间信息
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        verbose_name = "订单"
        verbose_name_plural = "订单"

    def __str__(self):
        return f"Order {self.order_number}"

    def clean(self):
        # 验证状态转换的合法性
        if self.pk:
            previous_status = Order.objects.get(pk=self.pk).status
            if previous_status == "cancelled" and self.status != "cancelled":
                raise ValidationError("已取消的订单不能更改状态")
            if previous_status == "paid" and self.status != "paid":
                raise ValidationError("已支付的订单不能更改状态")
            if previous_status == "unpaid" and self.status == "paid":
                if not self.payment_method:
                    raise ValidationError("支付订单时必须指定支付方式")

    def save(self, *args, **kwargs):
        # 生成订单号
        if not self.order_number:
            import time
            import random

            timestamp = int(time.time())
            random_num = random.randint(1000, 9999)
            self.order_number = f"{timestamp}{random_num}"

        # 执行状态验证
        self.clean()
        super().save(*args, **kwargs)


@receiver(pre_save, sender=Order)
def update_course_users(sender, instance, **kwargs):
    try:
        if instance.pk:  # Only try to get previous order if we have a pk
            previous_order = Order.objects.get(pk=instance.pk)
            if previous_order.status != instance.status:
                # 订单状态发生改变
                if instance.status == "paid":
                    # 订单状态变为已支付，则将用户添加到课程中
                    instance.course.users.add(instance.user)
                else:
                    # 订单状态变为其他状态，则将用户从课程中移除
                    instance.course.users.remove(instance.user)
    except Order.DoesNotExist:
        # For new orders, no need to update previous course
        pass
