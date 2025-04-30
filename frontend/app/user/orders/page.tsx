"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface Order {
    id: string
    courseName: string
    price: number
    status: "success" | "pending" | "failed"
    orderTime: string
}

const orders: Order[] = [
    {
        id: "ORD001",
        courseName: "React基础入门",
        price: 199,
        status: "success",
        orderTime: "2024-01-15 14:30:00"
    },
    {
        id: "ORD002",
        courseName: "TypeScript进阶指南",
        price: 299,
        status: "success",
        orderTime: "2024-01-10 10:15:00"
    },
]

export default function OrdersPage() {
    const getStatusText = (status: Order["status"]) => {
        switch (status) {
            case "success":
                return "支付成功"
            case "pending":
                return "待支付"
            case "failed":
                return "支付失败"
            default:
                return "未知状态"
        }
    }

    const getStatusColor = (status: Order["status"]) => {
        switch (status) {
            case "success":
                return "text-green-600"
            case "pending":
                return "text-yellow-600"
            case "failed":
                return "text-red-600"
            default:
                return "text-gray-600"
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">订单列表</h3>
                <p className="text-sm text-muted-foreground">
                    查看您的课程购买记录和交易状态
                </p>
            </div>
            <div className="grid gap-4">
                {orders.map((order) => (
                    <Card key={order.id}>
                        <CardHeader>
                            <CardTitle>{order.courseName}</CardTitle>
                            <CardDescription>订单号：{order.id}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">订单金额</span>
                                    <span className="text-sm font-medium">¥{order.price}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">支付状态</span>
                                    <span className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                                        {getStatusText(order.status)}
                                    </span>
                                </div>
                                <Separator className="my-4" />
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">下单时间</span>
                                    <span>{order.orderTime}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}