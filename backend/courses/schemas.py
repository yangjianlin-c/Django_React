from ninja import Schema
from typing import Optional
from ninja.orm import create_schema
from courses.models import Lesson


class TagSchema(Schema):
    id: int
    name: str


LessonSchema = create_schema(Lesson)


class CourseSchema(Schema):
    id: int
    title: str
    description: str = ""
    price: int
    thumbnail: str = ""
    feature: bool = False


class CourseDetailSchema(Schema):
    id: int
    title: str
    description: str = ""
    price: int
    thumbnail: str = ""
    feature: bool = False
    lessons: list[LessonSchema]
