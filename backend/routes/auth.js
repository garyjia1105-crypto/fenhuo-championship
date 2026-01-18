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
    // 注意：express-session 已经设置了 Cookie，这里只是确保配置正确
    // 手动设置 Cookie 以确保跨域工作
    // #region agent log
    console.log('[DEBUG] Auth: Setting cookie manually with session ID:', req.sessionID);
    console.log('[DEBUG] Auth: Request origin:', req.headers.origin);
    // #endregion
    
    // 设置响应头以确保 Cookie 被正确设置
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    // 使用 express-session 的默认方式，但确保选项正确
    // express-session 会自动设置 Cookie，但我们也可以手动设置以确保正确
    const cookieOptions = {
      secure: true,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'none',
      path: '/',
      // 不设置 domain，让浏览器自动处理
    };
    
    // #region agent log
    console.log('[DEBUG] Auth: Cookie options:', cookieOptions);
    // #endregion
    
    res.cookie('sessionId', req.sessionID, cookieOptions);
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
