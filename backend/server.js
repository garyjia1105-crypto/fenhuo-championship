require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const connectDB = require('./config/db');

const app = express();

// 连接数据库
connectDB();

// 中间件
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(cors({
  origin: function (origin, callback) {
    // 允许的来源列表
    const allowedOrigins = [
      frontendUrl,
      'http://localhost:3000',
      'https://fenhuo-championship-frontend.onrender.com',
    ];
    
    // 如果没有 origin（例如 Postman 或服务器请求），允许
    if (!origin) {
      return callback(null, true);
    }
    
    // 检查是否匹配允许的来源
    const isAllowed = allowedOrigins.includes(origin);
    
    if (isAllowed || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  exposedHeaders: ['Set-Cookie'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session配置
app.use(session({
  secret: process.env.SESSION_SECRET || 'fenguo-championship-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  name: 'sessionId', // 设置 cookie 名称
  cookie: {
    secure: true, // 生产环境必须为 true（HTTPS）
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24小时
    sameSite: 'none', // 跨域必须为 'none'
    domain: undefined, // 不设置 domain，让浏览器自动处理
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
