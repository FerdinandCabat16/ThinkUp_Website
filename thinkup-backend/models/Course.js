// models/Course.js

const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  domain: { type: String, required: true }, // Ex: IT, Inginerie, Matematică
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  sessions: { type: Number, required: true },
  cost: { type: Number, required: true },
  availableSpots: { type: Number, required: true },
  languages: [{ type: String }], // ex: ['Română', 'Engleză']
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // profesorul care a creat cursul
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);
