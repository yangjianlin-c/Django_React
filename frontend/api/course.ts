import { api, backURL } from "./request";

// 获取课程tag列表
export function listTags() {
  return api({ method: "GET", url: "course/tags" });
}

// 获取课程列表
export function listCourses(tagId?: number) {
  return api({ 
    method: "GET", 
    url: "course/courses",
    params: tagId ? { tag_id: tagId } : undefined
  }).then(response => {
    if (response.data && response.data.items) {
      response.data.items = response.data.items.map(course => ({
        ...course,
        thumbnail: course.thumbnail ? `${backURL}${course.thumbnail}` : ''
      }));
    }
    return response;
  });
}

// 获取单个课程详情
export function getCourse(course_id: number) {
  return api({ method: "GET", url: `course/${course_id}` }).then(response => {
    if (response.data) {
      response.data.thumbnail = response.data.thumbnail? `${backURL}${response.data.thumbnail}` : '';
    }
    return response;
  });
}

// 获取课程下的课时
export function listLessons(course_id: number) {
  return api({ method: "GET", url: `course/${course_id}/lessons` });
}

// 获取单个课时详情
export function getLesson(lesson_id: number) {
  return api({ method: "GET", url: `course/lessons/${lesson_id}` });
}

// 为课程创建订单
export function createOrderForCourse(course_id: number, note?: string) {
  return api({
    method: "POST",
    url: "order/create",
    data: {
      course_id,
      note
    }
  });
}

