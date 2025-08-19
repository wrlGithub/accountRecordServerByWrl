const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  description: {
    type: String,
    trim: true,
    maxlength: 200
  },
  icon: {
    type: String,
    default: '📊'
  },
  color: {
    type: String,
    default: '#007AFF'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isDefault: {
    type: Boolean,
    default: false
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
ledgerSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// 索引优化查询性能
ledgerSchema.index({ userId: 1, deletedAt: 1 });
ledgerSchema.index({ userId: 1, isDefault: 1 });

module.exports = mongoose.model('Ledger', ledgerSchema);
