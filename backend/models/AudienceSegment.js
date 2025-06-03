const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
  field: { type: String, required: true },
  operator: {
    type: String,
    enum: ['>', '<', '=', '!=', '>=', '<=', 'IN', 'NOT_IN', 'CONTAINS', 'NOT_CONTAINS'],
    required: true,
  },
  value: mongoose.Schema.Types.Mixed,
});

const audienceSegmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  rules: [ruleSchema],
  logicOperator: {
    type: String,
    enum: ['AND', 'OR'],
    default: 'AND',
  },
  estimatedSize: { type: Number, default: 0 },
  createdBy: { type: String, required: true }, // Firebase UID
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Add text index for search functionality
audienceSegmentSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('AudienceSegment', audienceSegmentSchema);