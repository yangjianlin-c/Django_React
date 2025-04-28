import { api } from "./request";

// 通用的 token 操作函数
const tokenStorage = (tokenType: 'access' | 'refresh', token?: string): string | void => {
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem(`${tokenType}_token`, token); // 存储 token
    } else {
      return localStorage.getItem(`${tokenType}_token`); // 获取 token
    }
  }
};

// 存储 access token
export const setAccessToken = (token: string): void => tokenStorage('access', token);

// 获取 access token
export const getAccessToken = (): string | null => tokenStorage('access');

// 移除 access token
export const removeAccessToken = (): void => tokenStorage('access', '');

// 存储 refresh token
export const setRefreshToken = (token: string): void => tokenStorage('refresh', token);

// 获取 refresh token
export const getRefreshToken = (): string | null => tokenStorage('refresh');

// 移除 refresh token
export const removeRefreshToken = (): void => tokenStorage('refresh', '');

// 用户登录
export const login = async (username: string, password: string) => {
  try {
    const response = await api.post('/user/login', {
      username,
      password,
    });

    // 保存 token 到 localStorage
    if (response.data?.access) {
      setAccessToken(response.data.access);  // 存储 access token
      setRefreshToken(response.data.refresh);  // 存储 refresh token
    }
    return response;
  } catch (error) {
    console.error("登录请求失败:", error);
    throw error;  // 如果请求失败，抛出错误
  }
};


// 用户注册
export const register = (userData: { username: string; email: string; password: string }) => {
  return api.post('/user/register', userData);
};

// 退出登录
export const logout = () => {
  removeAccessToken();
  removeRefreshToken(); // 退出时移除 refresh token
};

// 修改密码
export const changePassword = (data: { old_password: string; new_password: string }) => {
  return api.post("user/change_password", data);
};

// 检查是否已登录
export const isAuthenticated = (): boolean => !!getAccessToken();


// 获取当前用户信息
export const getCurrentUser = async () => {
  console.log(localStorage.getItem('access_token'));

  const response = await api.get('/user/me');
  return response.data;
};

// 更新个人信息
export const updateProfile = (data: any) => {
  return api.post("user/update_profile", data);
};

// 获取订单列表
export const listOrders = () => {
  return api.get("user/orders");
};

// 发送欢迎邮件
export const sendWelcomeEmail = (data: { email: string }) => {
  return api.post("user/send_welcome_email", data);
};

// 获取我的课程
export const listMyCourses = () => {
  return api.get("user/my_courses");
};