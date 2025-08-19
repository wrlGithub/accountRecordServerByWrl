const jwt = require('jsonwebtoken');
const User = require('../models/User');
const secret = process.env.JWT_SECRET || 'your-default-secret';

// 认证中间件
const authMiddleware = async (ctx, next) => {
  const token = ctx.headers.authorization && ctx.headers.authorization.split(' ')[1];

  if (!token) {
    ctx.status = 401;
    ctx.body = { message: '认证失败：缺少Token' };
    return;
  }

  try {
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw new Error('用户不存在');
    }
    ctx.state.user = user; // 将用户信息附加到 state
    await next();
  } catch (error) {
    ctx.status = 401;
    ctx.body = { message: '认证失败：无效的Token' };
  }
};

module.exports = authMiddleware;
