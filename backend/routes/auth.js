const express = require('express');
const router = express.Router();

// 主办方凭据
const ADMIN_USERNAME = 'QingXiang';
const ADMIN_PASSWORD = 'deltaforce123';

// 登录
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.isAuthenticated = true;
    req.session.username = username;
    // #region agent log
    console.log('[DEBUG] Auth: Login successful, session ID:', req.sessionID);
    console.log('[DEBUG] Auth: Session data:', req.session);
    console.log('[DEBUG] Auth: Request origin:', req.headers.origin);
    console.log('[DEBUG] Auth: Request headers:', req.headers);
    // #endregion
    // 确保保存 session
    req.session.save((err) => {
      if (err) {
        // #region agent log
        console.error('[DEBUG] Auth: Session save error:', err);
        // #endregion
      } else {
        // #region agent log
        console.log('[DEBUG] Auth: Session saved successfully');
        console.log('[DEBUG] Auth: Cookie will be set with options:', {
          secure: req.session.cookie.secure,
          sameSite: req.session.cookie.sameSite,
          httpOnly: req.session.cookie.httpOnly,
          maxAge: req.session.cookie.maxAge
        });
        // #endregion
      }
    });
    // 手动设置响应头以确保 Cookie 被正确设置
    res.cookie('sessionId', req.sessionID, {
      secure: true,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'none',
    });
    res.json({ 
      success: true, 
      message: '登录成功',
      username: username 
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
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: '登出失败' 
      });
    }
    res.json({ 
      success: true, 
      message: '登出成功' 
    });
  });
});

// 检查登录状态
router.get('/check', (req, res) => {
  // #region agent log
  console.log('[DEBUG] Auth: Check request, session ID:', req.sessionID);
  console.log('[DEBUG] Auth: Session data:', req.session);
  console.log('[DEBUG] Auth: Cookies:', req.headers.cookie);
  // #endregion
  if (req.session && req.session.isAuthenticated) {
    res.json({ 
      authenticated: true, 
      username: req.session.username 
    });
  } else {
    res.json({ authenticated: false });
  }
});

module.exports = router;
