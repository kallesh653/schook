// models/Period.js
const mongoose = require('mongoose');

const periodSchema = new mongoose.Schema({
  school:{type:mongoose.Schema.ObjectId, ref:'School'},
  teacher: {   type: mongoose.Schema.Types.ObjectId,  ref: 'Teacher',   required: true, },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject',  },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true,},
  // Fixed schedule fields (day of week + period number)
  dayOfWeek: { type: Number, required: true, min: 0, max: 6 }, // 0=Sunday, 1=Monday, ..., 6=Saturday
  periodNumber: { type: Number, required: true, min: 1, max: 12 }, // Period 1-12 (Period 6 can be lunch)
  // Time slots (time only, not date-specific)
  startTime: { type: String, required: true }, // Format: "07:00"
  endTime: { type: String, required: true }, // Format: "08:00"
}, { timestamps: true });

// Create compound index to ensure one teacher can't be assigned to multiple classes in same period
periodSchema.index({ school: 1, teacher: 1, dayOfWeek: 1, periodNumber: 1 });

// Create compound index to ensure one class can't have multiple teachers in same period
periodSchema.index({ school: 1, class: 1, dayOfWeek: 1, periodNumber: 1 }, { unique: true });

module.exports = mongoose.model('Period', periodSchema);
