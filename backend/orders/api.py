from ninja import Router, Schema
from auth.api import JWTAuth
from typing import Optional
from django.shortcuts import get_object_or_404
from courses.models import Course
from .models import Order
from decimal import Decimal

order_router = Router(tags=["order"], auth=JWTAuth())


class OrderCreateSchema(Schema):
    course_id: int
    note: Optional[str] = None


class OrderConfirmSchema(Schema):
    order_number: str
    payment_method: str


@order_router.post("/create")
def create_order(request, data: OrderCreateSchema):

    # 获取课程信息
    course = get_object_or_404(Course, id=data.course_id)

    # 检查用户是否已经购买过该课程
    if course.users.filter(id=request.user.id).exists():
        return {"success": False, "message": "您已经购买过该课程"}

    # 检查是否存在未支付的相同课程订单
    existing_order = Order.objects.filter(
        user=request.user, course=course, status="unpaid"
    ).first()

    if existing_order:
        return {
            "success": False,
            "message": "您已有该课程的未支付订单",
            "order_number": existing_order.order_number,
        }

    # 创建新订单
    order = Order.objects.create(
        user=request.user,
        course=course,
        price=Decimal(str(course.price)),
        status="unpaid",
        note=data.note,
    )

    return {
        "success": True,
        "message": "订单创建成功",
        "order_number": order.order_number,
    }


@order_router.post("/confirm")
def confirm_order(request, data: OrderConfirmSchema):
    # 检查用户是否是管理员
    if not request.auth.is_staff:
        return {"success": False, "message": "只有管理员可以确认订单"}

    # 获取订单信息
    try:
        order = Order.objects.get(order_number=data.order_number)
    except Order.DoesNotExist:
        return {"success": False, "message": "订单不存在"}

    # 检查订单状态
    if order.status != "unpaid":
        return {"success": False, "message": "只能确认未支付的订单"}

    try:
        # 更新订单状态和支付方式
        order.status = "paid"
        order.payment_method = data.payment_method
        order.save()

        return {
            "success": True,
            "message": "订单确认成功",
            "order_number": order.order_number,
        }
    except Exception as e:
        return {"success": False, "message": f"订单确认失败: {str(e)}"}
