import { api,backURL } from "./request";

export const getCurrentUser = async () => {
  const response = await api.get('/user/me');
  if (response.data && response.data.avatar_url) {
    response.data.avatar_url = `${backURL}${response.data.avatar_url}`;
  }  
  return response;
};
// 更新个人信息
export const updateProfile = (data: any) => api.post("user/update_profile", data);

// 获取订单列表
export const listOrders = () => api.get("user/orders");

// 发送欢迎邮件
export const sendWelcomeEmail = (data: { email: string }) => api.post("user/send_welcome_email", data);

// 获取我的课程
export const listMyCourses = () => api.get("user/my_courses");

// 上传用户头像
export const uploadAvatar = (file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);
  return api.post("user/upload_avatar", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
