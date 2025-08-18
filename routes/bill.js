const Router = require('koa-router');
const billController = require('../controllers/billController');
const authMiddleware = require('../middleware/auth');

const router = new Router();

// 应用认证中间件，以下所有路由都需要登录
router.use(authMiddleware);

// 创建账单
router.post('/', billController.createBill);
// 获取账单列表
router.get('/', billController.getBills);
// 更新账单
router.put('/:id', billController.updateBill);
// 删除账单
router.delete('/:id', billController.deleteBill);

module.exports = router; 