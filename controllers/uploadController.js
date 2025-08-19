const multer = require('koa-multer');
const path = require('path');
const fs = require('fs');

// 配置 multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../public/uploads');
    // 确保上传目录存在
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // 生成唯一文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 限制5MB
  },
  fileFilter: function (req, file, cb) {
    // 只允许图片
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件'), false);
    }
  }
});

// 单文件上传
exports.uploadSingle = upload.single('file');

// 处理上传
exports.handleUpload = async (ctx) => {
  try {
    if (!ctx.req.file) {
      ctx.status = 400;
      ctx.body = { message: '没有文件上传' };
      return;
    }

    const file = ctx.req.file;
    const fileUrl = `/uploads/${file.filename}`;

    ctx.body = {
      message: '文件上传成功',
      filename: file.filename,
      originalname: file.originalname,
      url: fileUrl,
      size: file.size
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: '文件上传失败', error: error.message };
  }
};

// 删除文件
exports.deleteFile = async (ctx) => {
  const { filename } = ctx.params;
  
  try {
    const filePath = path.join(__dirname, '../public/uploads', filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      ctx.body = { message: '文件删除成功' };
    } else {
      ctx.status = 404;
      ctx.body = { message: '文件不存在' };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: '文件删除失败', error: error.message };
  }
};
