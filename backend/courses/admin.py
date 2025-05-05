from django.contrib import admin
from .models import Course, Tag, Lesson


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
