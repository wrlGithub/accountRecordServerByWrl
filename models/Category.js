const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  icon: {
    type: String,
    default: '📁'
  },
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense']
  },
  color: {
    type: String,
    default: '#666666'
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
categorySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// 索引优化查询性能
categorySchema.index({ userId: 1, type: 1 });
categorySchema.index({ userId: 1, deletedAt: 1 });

module.exports = mongoose.model('Category', categorySchema);

