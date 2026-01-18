import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// #region agent log
console.log('[DEBUG] API_URL:', API_URL);
console.log('[DEBUG] REACT_APP_API_URL env:', process.env.REACT_APP_API_URL);
// #endregion

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // #region agent log
    console.log('[DEBUG] API Request:', config.method?.toUpperCase(), config.url, 'Full URL:', config.baseURL + config.url);
    // #endregion
    return config;
  },
  (error) => {
    // #region agent log
    console.error('[DEBUG] Request error:', error);
    // #endregion
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    // #region agent log
    console.log('[DEBUG] API Response:', response.status, response.config.url);
    // #endregion
    return response;
  },
  (error) => {
    // #region agent log
    console.error('[DEBUG] API Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      fullURL: error.config?.baseURL + error.config?.url,
      code: error.code,
      response: error.response?.data
    });
    // #endregion
    if (error.response?.status === 401) {
      // 未授权，清除登录状态
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
