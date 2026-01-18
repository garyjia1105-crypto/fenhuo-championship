const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { setTokenStore } = require('../middleware/auth');

// 主办方凭据
const ADMIN_USERNAME = 'QingXiang';
const ADMIN_PASSWORD = 'deltaforce123';

// 简单的 token 存储（生产环境应该使用 Redis 或数据库）
const tokenStore = new Map(); // token -> { username, expiresAt }

// 设置 middleware 中的 tokenStore
setTokenStore(tokenStore);

// 登录
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // 生成 token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24小时后过期
    
    // 存储 token
    tokenStore.set(token, { username, expiresAt });
    
    // #region agent log
    console.log('[DEBUG] Auth: Login successful, token generated:', token.substring(0, 10) + '...');
    // #endregion
    
    // 清理过期的 token（简单清理，生产环境应该使用定时任务）
    for (const [t, data] of tokenStore.entries()) {
      if (data.expiresAt < Date.now()) {
        tokenStore.delete(t);
      }
    }
    
    res.json({ 
      success: true, 
      message: '登录成功',
      username: username,
      token: token // 返回 token 给前端
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: '用户名或密码错误' 
    });
  }
});

// 登出
router.post('/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.replace('Bearer ', '') : req.body.token;
  
  if (token) {
    tokenStore.delete(token);
    // #region agent log
    console.log('[DEBUG] Auth: Token deleted, logout successful');
    // #endregion
  }
  
  res.json({ 
    success: true, 
    message: '登出成功' 
  });
});

// 检查登录状态
router.get('/check', (req, res) => {
  // 从 Authorization header 或 query 参数获取 token
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.replace('Bearer ', '') : req.query.token;
  
  // #region agent log
  console.log('[DEBUG] Auth: Check request, token:', token ? token.substring(0, 10) + '...' : 'none');
  // #endregion
  
  if (token) {
    const tokenData = tokenStore.get(token);
    if (tokenData && tokenData.expiresAt > Date.now()) {
      // #region agent log
      console.log('[DEBUG] Auth: Token valid, authenticated');
      // #endregion
      res.json({ 
        authenticated: true, 
        username: tokenData.username 
      });
      return;
    } else if (tokenData && tokenData.expiresAt <= Date.now()) {
      // Token 过期，删除
      tokenStore.delete(token);
    }
  }
  
  // #region agent log
  console.log('[DEBUG] Auth: Token invalid or missing, not authenticated');
  // #endregion
  res.json({ authenticated: false });
});

module.exports = router;
