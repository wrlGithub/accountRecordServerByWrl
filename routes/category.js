const Router = require('koa-router');
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/auth');

const router = new Router();

router.use(authMiddleware);

router.post('/', categoryController.createCategory);
router.get('/', categoryController.getCategories);

module.exports = router; 