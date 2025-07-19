const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  date: { type: Date, default: Date.now },
  cost: { type: Number, required: true }
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);
