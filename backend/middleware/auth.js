// 注意：这个 middleware 需要访问 tokenStore
// 为了避免循环依赖，我们在这里重新定义 tokenStore
// 生产环境应该使用 Redis 或数据库来共享 token 存储
let tokenStore;

// 设置 tokenStore 的函数（从 auth.js 调用）
const setTokenStore = (store) => {
  tokenStore = store;
};

const requireAuth = (req, res, next) => {
  if (!tokenStore) {
    // 如果 tokenStore 未设置，回退到 session 检查
    if (req.session && req.session.isAuthenticated) {
      return next();
    }
    return res.status(401).json({ message: '未授权，请先登录' });
  }
  
  // 从 Authorization header 获取 token
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.replace('Bearer ', '') : null;
  
  if (token) {
    const tokenData = tokenStore.get(token);
    if (tokenData && tokenData.expiresAt > Date.now()) {
      req.user = { username: tokenData.username };
      return next();
    }
  }
  
  return res.status(401).json({ message: '未授权，请先登录' });
};

module.exports = { requireAuth, setTokenStore };
