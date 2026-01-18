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
