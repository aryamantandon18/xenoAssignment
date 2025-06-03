const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`,
    },
  },
  phone: { type: String },
  totalSpent: { type: Number, default: 0 },
  lastOrderAt: { type: Date },
  visitCount: { type: Number, default: 0 },
  // createdBy: { type: String, required: true }, // Firebase UID
  createdAt: { type: Date, default: Date.now },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});
// Indexes for better performance
customerSchema.index({ email: 1, createdBy: 1 }, { unique: true });
customerSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Customer', customerSchema);
