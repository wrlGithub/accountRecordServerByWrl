const Router = require('koa-router');
const ledgerController = require('../controllers/ledgerController');
const authMiddleware = require('../middleware/auth');

const router = new Router();

// 创建账本
router.post('/', authMiddleware, ledgerController.createLedger);

// 获取用户的所有账本
router.get('/', authMiddleware, ledgerController.getLedgers);

// 更新账本
router.put('/:id', authMiddleware, ledgerController.updateLedger);

// 删除账本
router.delete('/:id', authMiddleware, ledgerController.deleteLedger);

module.exports = router; 