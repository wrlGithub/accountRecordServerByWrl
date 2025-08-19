const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense']
  },
  description: {
    type: String,
    trim: true,
    maxlength: 200
  },
  billDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  ledgerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ledger',
    required: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deletedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// 更新时自动设置 updatedAt
billSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// 索引优化查询性能
billSchema.index({ userId: 1, billDate: -1 });
billSchema.index({ userId: 1, ledgerId: 1 });
billSchema.index({ userId: 1, categoryId: 1 });

module.exports = mongoose.model('Bill', billSchema);

