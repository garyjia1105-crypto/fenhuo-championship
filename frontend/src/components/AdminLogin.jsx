import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import './AdminLogin.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // #region agent log
    console.log('[DEBUG] AdminLogin: Component mounted, checking auth');
    // #endregion
    // 检查是否已登录
    apiClient.get('/auth/check')
      .then(response => {
        // #region agent log
        console.log('[DEBUG] AdminLogin: Auth check response', response.data);
        // #endregion
        if (response.data.authenticated) {
          // #region agent log
          console.log('[DEBUG] AdminLogin: Already authenticated, navigating to /admin');
          // #endregion
          navigate('/admin');
        } else {
          // #region agent log
          console.log('[DEBUG] AdminLogin: Not authenticated, showing login form');
          // #endregion
        }
      })
      .catch((err) => {
        // #region agent log
        console.error('[DEBUG] AdminLogin: Auth check failed', {
          message: err.message,
          response: err.response,
          code: err.code
        });
        // #endregion
        // 未登录，继续显示登录页面
      });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // #region agent log
    console.log('[DEBUG] AdminLogin: Form submitted', { username, passwordLength: password.length });
    // #endregion
    setError('');
    setLoading(true);

    try {
      // #region agent log
      console.log('[DEBUG] AdminLogin: Sending login request');
      // #endregion
      const response = await apiClient.post('/auth/login', {
        username,
        password,
      });

      // #region agent log
      console.log('[DEBUG] AdminLogin: Login response', response.data);
      // #endregion

      if (response.data.success) {
        // #region agent log
        console.log('[DEBUG] AdminLogin: Login successful, navigating to /admin');
        // #endregion
        navigate('/admin');
      } else {
        // #region agent log
        console.log('[DEBUG] AdminLogin: Login failed, response.data.success is false');
        // #endregion
        setError(response.data.message || '登录失败');
      }
    } catch (err) {
      // #region agent log
      console.error('[DEBUG] AdminLogin: Login error', {
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data
      });
      // #endregion
      setError(err.response?.data?.message || '登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h1>主办方登录</h1>
        <form 
          onSubmit={(e) => {
            // #region agent log
            console.log('[DEBUG] AdminLogin: Form onSubmit triggered');
            // #endregion
            handleSubmit(e);
          }}
        >
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label htmlFor="username">用户名</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            className="login-button"
            onClick={(e) => {
              // #region agent log
              console.log('[DEBUG] AdminLogin: Button clicked', { loading, username, hasPassword: !!password });
              // #endregion
            }}
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
        <a href="/" className="back-link">返回排行榜</a>
      </div>
    </div>
  );
};

export default AdminLogin;
