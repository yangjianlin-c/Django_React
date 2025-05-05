from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db.models.signals import pre_save


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return self.name


class Course(models.Model):
    title = models.CharField(max_length=255)
    thumbnail = models.ImageField(upload_to="courses/", null=True, blank=True)
    description = models.TextField()
    price = models.IntegerField(default=0)
    feature = models.BooleanField(default=False)
    users = models.ManyToManyField(User, related_name="courses", blank=True)
    tags = models.ManyToManyField(Tag, related_name="courses", blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return self.title


Video_Source = (
    ("bili", "Bilibili"),
    ("qiniu", "Qiniu Cloud"),
    ("local", "Local"),
)


class Lesson(models.Model):
    title = models.CharField(max_length=255)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="lessons")
    free_preview = models.BooleanField(default=False)
    video_source = models.CharField(max_length=20, choices=Video_Source)
    video_url = models.CharField(max_length=255, null=True, blank=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return self.title
