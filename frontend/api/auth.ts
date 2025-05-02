import { api,backURL } from "./request";

// 通用的 token 操作函数
const tokenStorage = (tokenType: 'access' | 'refresh', token?: string): string | void => {
  if (typeof window !== 'undefined') {
    const key = `${tokenType}_token`;
    if (token) {
      localStorage.setItem(key, token);
    } else {
      return localStorage.getItem(key) || null;
    }
  }
};

// 存储 access token
export const setAccessToken = (token: string): void => tokenStorage('access', token);

// 获取 access token
export const getAccessToken = (): string | null => tokenStorage('access') as string | null;

// 移除 access token
export const removeAccessToken = (): void => localStorage.removeItem('access_token');

// 存储 refresh token
export const setRefreshToken = (token: string): void => tokenStorage('refresh', token);

// 获取 refresh token
export const getRefreshToken = (): string | null => tokenStorage('refresh') as string | null;

// 移除 refresh token
export const removeRefreshToken = (): void => localStorage.removeItem('refresh_token');

// 用户登录
export const login = async (username: string, password: string) => {
  try {
    const response = await api.post('/user/login', { username, password });
    const { access, refresh } = response.data || {};
    if (access) {
      setAccessToken(access);
      setRefreshToken(refresh);
    }
    return response;
  } catch (error) {
    console.error("登录请求失败:", error);
    throw error;
  }
};

// 用户注册
export const register = (userData: { username: string; email: string; password: string }) => 
  api.post('/user/register', userData);

// 退出登录
export const logout = () => {
  removeAccessToken();
  removeRefreshToken();
};

// 修改密码
export const changePassword = (data: { old_password: string; new_password: string }) => 
  api.post("user/change_password", data);


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
