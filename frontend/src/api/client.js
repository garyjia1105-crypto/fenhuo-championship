import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: false, // 不再需要 Cookie
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：从 localStorage 获取 token 并添加到请求头
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 未授权，清除登录状态
      localStorage.removeItem('authToken');
      window.location.href = '#/admin/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
