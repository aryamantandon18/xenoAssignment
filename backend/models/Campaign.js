const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  segment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AudienceSegment',
    required: true,
  },
  stats: {
    sent: { type: Number, default: 0 },
    failed: { type: Number, default: 0 },
    delivered: { type: Number, default: 0 },
    opened: { type: Number, default: 0 },
    clicked: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  status: {
    type: String,
    enum: ['DRAFT', ,'PROCESSING', 'SCHEDULED', 'SENDING', 'SENT', 'FAILED'],
    default: 'DRAFT',
  },
  scheduledAt: { type: Date },
  createdBy: { type: String, required: true }, // Firebase UID
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Campaign', campaignSchema);