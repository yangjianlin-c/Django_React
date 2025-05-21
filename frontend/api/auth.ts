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
export const removeAccessToken = (): void => tokenStorage('access', null);

// 存储 refresh token
export const setRefreshToken = (token: string): void => tokenStorage('refresh', token);

// 获取 refresh token
export const getRefreshToken = (): string | null => tokenStorage('refresh') as string | null;

// 移除 refresh token
export const removeRefreshToken = (): void => tokenStorage('refresh', null);

// 用户登录
export const login = async (username: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { username, password });
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
  api.post('/auth/register', userData);


// 退出登录
export const logout = () => {
  removeAccessToken();
  removeRefreshToken();
};

// 修改密码
export const changePassword = (data: { old_password: string; new_password: string }) => 
  api.post("auth/change_password", data);

