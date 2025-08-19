const Category = require('../models/Category');

// 创建分类
exports.createCategory = async (ctx) => {
  const { name, icon, type, color } = ctx.request.body;
  const userId = ctx.state.user._id;

  try {
    const newCategory = new Category({
      name,
      icon,
      type,
      color,
      userId
    });
    await newCategory.save();
    ctx.status = 201;
    ctx.body = newCategory;
  } catch (error) {
    ctx.status = 400;
    ctx.body = { message: '创建分类失败', error: error.message };
  }
};

// 获取分类列表
exports.getCategories = async (ctx) => {
  const userId = ctx.state.user._id;
  const { type } = ctx.query; // 可选按类型过滤

  try {
    const query = { userId, deletedAt: null };
    if (type) {
      query.type = type;
    }
    const categories = await Category.find(query)
      .sort({ createdAt: -1 });
    ctx.body = categories;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: '获取分类列表失败', error: error.message };
  }
};

// 更新分类
exports.updateCategory = async (ctx) => {
  const { id } = ctx.params;
  try {
    const updatedCategory = await Category.findOneAndUpdate(
      { _id: id, userId: ctx.state.user._id },
      ctx.request.body,
      { new: true, runValidators: true }
    );
    if (!updatedCategory) {
      ctx.status = 404;
      ctx.body = { message: '分类未找到或无权修改' };
      return;
    }
    ctx.body = updatedCategory;
  } catch (error) {
    ctx.status = 400;
    ctx.body = { message: '更新分类失败', error: error.message };
  }
};

// 删除分类（软删除）
exports.deleteCategory = async (ctx) => {
  const { id } = ctx.params;
  try {
    const deletedCategory = await Category.findOneAndUpdate(
      { _id: id, userId: ctx.state.user._id },
      { deletedAt: new Date() },
      { new: true }
    );
    if (!deletedCategory) {
      ctx.status = 404;
      ctx.body = { message: '分类未找到或无权删除' };
      return;
    }
    ctx.body = { message: '分类删除成功' };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: '删除分类失败', error: error.message };
  }
};
