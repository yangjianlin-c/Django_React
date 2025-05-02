from pydantic import BaseModel
from ninja import Schema


class LessonSchema(Schema):
    id: int
    title: str
    free_preview: bool
    video_source: str
    video_url: str
    content: str
    created_at: str
    updated_at: str


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
