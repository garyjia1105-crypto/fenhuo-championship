require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const connectDB = require('./config/db');

const app = express();

// 连接数据库
connectDB();

// 中间件
// #region agent log - CORS debugging
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
console.log('[DEBUG] CORS origin configured:', frontendUrl);
// #endregion

app.use(cors({
  origin: function (origin, callback) {
    // #region agent log
    console.log('[DEBUG] CORS request from origin:', origin);
    // #endregion
    // 允许所有来源（生产环境应该限制）
    const allowedOrigins = [
      frontendUrl,
      'http://localhost:3000',
      'https://fenhuo-championship-frontend.onrender.com',
      'https://*.onrender.com'
    ];
    
    // 如果没有 origin（例如 Postman 或服务器请求），允许
    if (!origin) return callback(null, true);
    
    // 检查是否匹配允许的来源
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed.includes('*')) {
        const pattern = allowed.replace('*', '.*');
        return new RegExp(pattern).test(origin);
      }
      return origin === allowed;
    });
    
    if (isAllowed || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session配置
app.use(session({
  secret: process.env.SESSION_SECRET || 'fenguo-championship-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24小时
  },
}));

// 路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/players', require('./routes/players'));

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: '烽火冠军赛排行榜API运行正常' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});
