const Router = require('koa-router');
const uploadController = require('../controllers/uploadController');

const router = new Router();

// 文件上传路由
router.post('/file', uploadController.uploadSingle, uploadController.handleUpload);

// 删除文件路由
router.delete('/file/:filename', uploadController.deleteFile);

module.exports = router; 