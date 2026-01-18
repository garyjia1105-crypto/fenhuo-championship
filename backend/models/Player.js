const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '选手姓名不能为空'],
    trim: true,
  },
  extractionValue: {
    type: Number,
    default: 0,
    min: 0,
  },
  redValue: {
    type: Number,
    default: 0,
    min: 0,
  },
  kills: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalScore: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// 计算总分：撤离价值 - 大红价值 + 人头数 × 250000
playerSchema.pre('save', function(next) {
  this.totalScore = this.extractionValue - this.redValue + (this.kills * 250000);
  next();
});

// 虚拟字段：实时计算总分（用于查询）
playerSchema.virtual('calculatedScore').get(function() {
  return this.extractionValue - this.redValue + (this.kills * 250000);
});

module.exports = mongoose.model('Player', playerSchema);
