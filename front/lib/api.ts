import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
})

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken') // 获取 accessToken
      if (token) {
        config.headers.Authorization = `Bearer ${token}` // 添加 Authorization 头
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api
