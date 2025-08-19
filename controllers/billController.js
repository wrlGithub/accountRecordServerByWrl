const Bill = require('../models/Bill');

// 创建账单
exports.createBill = async (ctx) => {
  const { amount, type, description, billDate, ledgerId, categoryId } = ctx.request.body;
  const userId = ctx.state.user._id;

  try {
    const newBill = new Bill({
      amount,
      type,
      description,
      billDate,
      ledgerId,
      categoryId,
      userId
    });
    await newBill.save();
    ctx.status = 201;
    ctx.body = newBill;
  } catch (error) {
    ctx.status = 400;
    ctx.body = { message: '创建账单失败', error: error.message };
  }
};

// 获取账单列表（支持按账本过滤）
exports.getBills = async (ctx) => {
  const userId = ctx.state.user._id;
  const { ledgerId } = ctx.query; // 从查询参数获取 ledgerId

  try {
    const query = { userId, deletedAt: null };
    if (ledgerId) {
      query.ledgerId = ledgerId;
    }
    const bills = await Bill.find(query)
      .populate('categoryId', 'name icon type') // 连表查询分类信息
      .sort({ billDate: -1 }); // 按账单日期降序
    ctx.body = bills;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: '获取账单列表失败', error: error.message };
  }
};

// 更新账单
exports.updateBill = async (ctx) => {
  const { id } = ctx.params;
  try {
    const updatedBill = await Bill.findOneAndUpdate(
      { _id: id, userId: ctx.state.user._id },
      ctx.request.body,
      { new: true, runValidators: true }
    );
    if (!updatedBill) {
      ctx.status = 404;
      ctx.body = { message: '账单未找到或无权修改' };
      return;
    }
    ctx.body = updatedBill;
  } catch (error) {
    ctx.status = 400;
    ctx.body = { message: '更新账单失败', error: error.message };
  }
};

// 删除账单（软删除）
exports.deleteBill = async (ctx) => {
  const { id } = ctx.params;
  try {
    const deletedBill = await Bill.findOneAndUpdate(
      { _id: id, userId: ctx.state.user._id },
      { deletedAt: new Date() },
      { new: true }
    );
    if (!deletedBill) {
      ctx.status = 404;
      ctx.body = { message: '账单未找到或无权删除' };
      return;
    }
    ctx.body = { message: '账单删除成功' };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: '删除账单失败', error: error.message };
  }
};
