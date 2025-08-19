const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const secret = process.env.JWT_SECRET || 'your-default-secret';

// 用户注册
exports.register = async (ctx) => {
  console.log('ss', ctx.request.body)
  const { username, password, email, avatar } = ctx.request.body;
  if (!username || !password) {
    ctx.status = 400;
    ctx.body = { message: '用户名和密码是必填项' };
    return;
  }
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      ctx.status = 409;
      ctx.body = { message: '用户名已存在' };
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      avatar
    });
    await newUser.save();

    ctx.status = 201;
    ctx.body = { message: '用户注册成功' };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: '注册失败', error: error.message };
  }
};

// 用户登录
exports.login = async (ctx) => {
  const { username, password } = ctx.request.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      ctx.status = 401;
      ctx.body = { message: '认证失败：用户名或密码错误' };
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      ctx.status = 401;
      ctx.body = { message: '认证失败：用户名或密码错误' };
      return;
    }

    const token = jwt.sign({ id: user._id, username: user.username }, secret, {
      expiresIn: '7d' // Token 有效期
    });

    ctx.body = {
      message: '登录成功',
      token,
      user: { id: user._id, username: user.username, email: user.email }
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: '登录失败', error: error.message };
  }
};

// 修改用户信息
exports.updateProfile = async (ctx) => {
  const userId = ctx.state.user._id;
  const { username, phone, email, avatar, password } = ctx.request.body;
  try {
    const updateData = {};
    if (username) updateData.username = username;
    if (phone) updateData.phone = phone;
    if (email) updateData.email = email;
    if (avatar) updateData.avatar = avatar;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');
    if (!updatedUser) {
      ctx.status = 404;
      ctx.body = { message: '用户未找到' };
      return;
    }
    ctx.body = { message: '用户信息更新成功', user: updatedUser };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: '用户信息更新失败', error: error.message };
  }
};
