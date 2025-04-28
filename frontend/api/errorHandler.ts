import { removeAccessToken } from './auth';

export const handleApiError = (error: any) => {
  if (error.response) {
    console.log('API错误:', error.response.status, error.response.data);
    if (error.response.status === 401) {
      // 清除本地存储中的 token
      removeAccessToken();
      // 重定向到登录页面
      window.location.href = '/login';
    }
  }
  // 抛出错误以便进一步处理
  return Promise.reject(error);
};