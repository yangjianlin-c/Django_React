// ... existing code ...
import { apiRequest } from "./request";

// 登录
export function login(data: { username: string; password: string }) {
  return apiRequest("/api/user/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// 登出
export function logout() {
  return apiRequest("/api/user/logout", { method: "POST" });
}

// 获取当前用户信息
export function getMe() {
  return apiRequest("/api/user/me");
}

// 修改密码
export function changePassword(data: { old_password: string; new_password: string }) {
  return apiRequest("/api/user/change_password", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// 更新个人信息
export function updateProfile(data: any) {
  return apiRequest("/api/user/update_profile", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// 获取订单列表
export function listOrders() {
  return apiRequest("/api/user/orders");
}

// 发送欢迎邮件
export function sendWelcomeEmail(data: { email: string }) {
  return apiRequest("/api/user/send_welcome_email", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// 获取我的课程
export function listMyCourses() {
  return apiRequest("/api/user/my_courses");
}
// ... existing code ...