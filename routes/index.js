const Router = require('koa-router');
const authRoutes = require('./auth');
const billRoutes = require('./bill');
const ledgerRoutes = require('./ledger');
const categoryRoutes = require('./category');
const uploadRoutes = require('./upload');

const router = new Router();

// API 根路由，可以加上前缀，如 /api
const apiRouter = new Router({ prefix: '/api' });

// 挂载各个模块的路由
apiRouter.use('/auth', authRoutes.routes(), authRoutes.allowedMethods());
apiRouter.use('/bills', billRoutes.routes(), billRoutes.allowedMethods());
apiRouter.use('/ledgers', ledgerRoutes.routes(), ledgerRoutes.allowedMethods());
apiRouter.use('/categories', categoryRoutes.routes(), categoryRoutes.allowedMethods());
apiRouter.use('/upload', uploadRoutes.routes(), uploadRoutes.allowedMethods());

// 注册总路由
router.use(apiRouter.routes(), apiRouter.allowedMethods());

module.exports = router; 