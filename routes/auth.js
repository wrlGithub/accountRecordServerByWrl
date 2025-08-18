const Router = require('koa-router');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

const router = new Router();

// 用户注册
router.post('/register', authController.register);

// 用户登录
router.post('/login', authController.login);

// 用户信息修改
router.put('/profile', authMiddleware, authController.updateProfile);

module.exports = router; 