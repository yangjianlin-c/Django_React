import axios from 'axios';
import { getAccessToken, getRefreshToken, setAccessToken, removeAccessToken, removeRefreshToken } from './auth';

// 从环境变量读取后端 API 地址
export const backURL = process.env.BACKEND_URL || 'http://127.0.0.1:8000/';
const API_BASE_URL = backURL + 'api/';

// 创建 axios 实例
export const api = axios.create({
  baseURL: API_BASE_URL,
});

// 请求拦截器 - 添加 token 到请求头
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('添加 token 到请求头');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误，当token失效时直接登出
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 如果是401错误（未授权），直接清除token并重定向到登录页面
    if (error.response?.status === 401) {
      console.log('Token已失效，请重新登录');
      // 清除令牌并重定向到登录页面
      removeAccessToken();
      removeRefreshToken();
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;
