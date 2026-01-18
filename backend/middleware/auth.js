const requireAuth = (req, res, next) => {
  if (req.session && req.session.isAuthenticated) {
    return next();
  }
  return res.status(401).json({ message: '未授权，请先登录' });
};

module.exports = { requireAuth };
