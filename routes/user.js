const Router = require('koa-router');
const userController = require('../controllers/userController');

const router = new Router();

router.get('/', userController.getUserList);
router.get('/test', userController.test);
router.get('/getUserList', userController.getUserList);
router.post('/testdb', userController.createTest);
router.get('/testdb', userController.getTests);

module.exports = router; 