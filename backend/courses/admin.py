from django.contrib import admin
from .models import Course, Tag, Order, Lesson


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ["name", "created_at", "updated_at"]
    search_fields = ["name"]
    list_filter = ["created_at"]


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ["title", "price", "feature", "created_at"]
    list_filter = ["feature", "tags", "created_at"]
    search_fields = ["title", "description"]
    filter_horizontal = ["tags", "users"]


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ["title", "course", "free_preview", "video_source"]
    list_filter = ["free_preview", "video_source", "course"]
    search_fields = ["title", "content"]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        "order_number",
        "user",
        "course",
        "price",
        "status",
        "payment_method",
        "created_at",
    ]
    list_filter = ["status", "payment_method", "created_at"]
    search_fields = ["order_number", "user__username", "course__title"]
    readonly_fields = ["order_number"]

    def save_model(self, request, obj, form, change):
        if change and "status" in form.changed_data:
            # 状态变更时进行验证
            obj.clean()
        super().save_model(request, obj, form, change)
