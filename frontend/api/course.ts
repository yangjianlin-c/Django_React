// ... existing code ...
import { apiRequest } from "./request";

// 获取课程列表
export function listCourses() {
  return apiRequest("/api/course/courses");
}

// 获取单个课程详情
export function getCourse(course_id: number) {
  return apiRequest(`/api/course/courses/${course_id}`);
}

// 获取课程下的课时
export function listLessons(course_id: number) {
  return apiRequest(`/api/course/courses/${course_id}/lessons`);
}

// 获取单个课时详情
export function getLesson(lesson_id: number) {
  return apiRequest(`/api/course/lessons/${lesson_id}`);
}
// ... existing code ...