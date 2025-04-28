import axios from 'axios';
import { getAccessToken, removeAccessToken } from './auth';

// 从环境变量读取后端 API 地址
const baseURL = process.env.API_BASE_URL || 'http://localhost:8000/api';

// 创建 axios 实例
export const api = axios.create({
  baseURL: baseURL,
});

// 请求拦截器 - 添加 token 到请求头
api.interceptors.request.use(
  (config) => {
    // 获取存储的 access token
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;
