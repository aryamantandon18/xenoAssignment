const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String , required:true},
  avatar: { type: String },
  emailVerified:{type:Boolean,default:false},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
