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

// 响应拦截器 - 处理错误，自动刷新访问令牌
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // 检查是否是 401 错误且不是刷新令牌请求
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // 使用刷新令牌获取新的访问令牌
      return api.post('/token/refresh/', {
        refresh: getRefreshToken()
      })
      .then(response => {
        // 更新访问令牌和刷新令牌
        setAccessToken(response.data.access);
        // 如果后端返回新的刷新令牌，更新它
        if (response.data.refresh) {
          setAccessToken(response.data.refresh);
        }

        // 更新请求头中的访问令牌
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

        // 重新发送原始请求
        return api(originalRequest);
      })
      .catch(err => {
        console.log('Refresh token has expired or is invalid');
        // 清除令牌并重定向到登录页面
        removeAccessToken();
        removeRefreshToken();
        window.location.href = '/auth/login';
        return Promise.reject(err);
      });
    }

    return Promise.reject(error);
  }
);

export default api;
