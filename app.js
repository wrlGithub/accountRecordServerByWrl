const Koa = require('koa');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const json = require('koa-json');
const static = require('koa-static');
const router = require('./routes');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = new Koa();

// CORS
app.use(cors());

// 中间件
app.use(bodyParser());
app.use(json());
console.log('RUNNING APP.JS FROM:', __dirname);
app.use(static(path.join(__dirname, 'public')));

// 连接 MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/accountRecord', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// 路由
app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
