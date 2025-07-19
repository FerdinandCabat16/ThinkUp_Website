const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  role: { type: String, enum: ['student', 'profesor'], required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String },
  password: { type: String, required: true }
});

module.exports = mongoose.model('User', UserSchema);
