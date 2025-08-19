const Ledger = require('../models/Ledger');

// 创建账本
exports.createLedger = async (ctx) => {
  const { name, description, icon, color } = ctx.request.body;
  const userId = ctx.state.user._id;

  try {
    const newLedger = new Ledger({
      name,
      description,
      icon,
      color,
      userId
    });
    await newLedger.save();
    ctx.status = 201;
    ctx.body = newLedger;
  } catch (error) {
    ctx.status = 400;
    ctx.body = { message: '创建账本失败', error: error.message };
  }
};

// 获取账本列表
exports.getLedgers = async (ctx) => {
  const userId = ctx.state.user._id;

  try {
    const ledgers = await Ledger.find({ userId, deletedAt: null })
      .sort({ createdAt: -1 });
    ctx.body = ledgers;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: '获取账本列表失败', error: error.message };
  }
};

// 更新账本
exports.updateLedger = async (ctx) => {
  const { id } = ctx.params;
  try {
    const updatedLedger = await Ledger.findOneAndUpdate(
      { _id: id, userId: ctx.state.user._id },
      ctx.request.body,
      { new: true, runValidators: true }
    );
    if (!updatedLedger) {
      ctx.status = 404;
      ctx.body = { message: '账本未找到或无权修改' };
      return;
    }
    ctx.body = updatedLedger;
  } catch (error) {
    ctx.status = 400;
    ctx.body = { message: '更新账本失败', error: error.message };
  }
};

// 删除账本（软删除）
exports.deleteLedger = async (ctx) => {
  const { id } = ctx.params;
  try {
    const deletedLedger = await Ledger.findOneAndUpdate(
      { _id: id, userId: ctx.state.user._id },
      { deletedAt: new Date() },
      { new: true }
    );
    if (!deletedLedger) {
      ctx.status = 404;
      ctx.body = { message: '账本未找到或无权删除' };
      return;
    }
    ctx.body = { message: '账本删除成功' };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: '删除账本失败', error: error.message };
  }
};
