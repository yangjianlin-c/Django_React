from typing import List, Dict, Any
from courses.models import Course
from django.contrib.auth.models import User
from users.models import UserProfile
from users.schemas import UserProfileSchema
from courses.api import CourseSchema
from ninja.errors import HttpError
from ninja import Router
from pydantic import BaseModel
from django.db.models import Q


class SearchResultSchema(BaseModel):
    type: str
    id: int
    title: str
    description: str = ""
    extra: Dict[str, Any] = {}

    class Config:
        orm_mode = True


def search_courses(query: str, limit=5) -> List[SearchResultSchema]:
    qs = Course.objects.filter(
        Q(title__icontains=query) | Q(description__icontains=query)
    )[:limit]
    return [
        SearchResultSchema(
            type="course", id=c.id, title=c.title, description=c.description
        )
        for c in qs
    ]


def search_users(query: str, limit=5) -> List[SearchResultSchema]:
    qs = User.objects.filter(
        Q(username__icontains=query)
        | Q(first_name__icontains=query)
        | Q(last_name__icontains=query)
    )[:limit]
    return [
        SearchResultSchema(
            type="user",
            id=u.id,
            title=u.username,
            description=f"{u.first_name} {u.last_name}",
        )
        for u in qs
    ]


def search_all(query: str, limit=5) -> List[SearchResultSchema]:
    results = []
    results.extend(search_courses(query, limit))
    results.extend(search_users(query, limit))
    # 可扩展更多模型
    return results


search_router = Router(tags=["search"])


@search_router.get("/search", response=List[SearchResultSchema])
def search_api(request, q: str, limit: int = 5):
    if not q:
        raise HttpError(400, "请输入搜索关键词")
    results = search_all(q, limit)
    return results
