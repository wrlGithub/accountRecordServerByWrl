const Router = require('koa-router');
const multer = require('koa-multer');
const path = require('path');
const fs = require('fs');
const uploadController = require('../controllers/uploadController');

const router = new Router();

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 设置存储路径和文件名
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});
const upload = multer({ storage });

router.post('/avatar', upload.single('file'), uploadController.uploadAvatar);

module.exports = router; 