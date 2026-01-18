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
    // #region agent log
    console.log('[DEBUG] API Request:', config.method?.toUpperCase(), config.url, 'Token:', token ? token.substring(0, 10) + '...' : 'none');
    // #endregion
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // #region agent log
    console.error('[DEBUG] API Request error:', error);
    // #endregion
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    // #region agent log
    console.log('[DEBUG] API Response:', response.status, response.config.url, 'Headers:', response.headers);
    // #endregion
    return response;
  },
  (error) => {
    // #region agent log
    console.error('[DEBUG] API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message
    });
    // #endregion
    if (error.response?.status === 401) {
      // 未授权，清除登录状态
      localStorage.removeItem('authToken');
      window.location.href = '#/admin/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
