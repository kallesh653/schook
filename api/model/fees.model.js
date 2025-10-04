const mongoose = require('mongoose');

const feesSchema = new mongoose.Schema({
  school: { type: mongoose.Schema.ObjectId, ref: 'School', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  academic_year: { type: String, required: true },
  total_fees: { type: Number, required: true },
  paid_amount: { type: Number, default: 0 },
  balance_amount: { type: Number, required: true },
  payment_date: { type: Date },
  due_date: { type: Date, required: true },
  status: { type: String, enum: ['Paid', 'Partial', 'Pending'], default: 'Pending' },
  payment_method: { type: String, enum: ['Cash', 'Card', 'Online', 'Cheque'], default: 'Cash' },
  remarks: { type: String }
}, { timestamps: true });

// Calculate balance amount before saving
feesSchema.pre('save', function(next) {
  this.balance_amount = this.total_fees - this.paid_amount;
  
  // Update status based on payment
  if (this.paid_amount === 0) {
    this.status = 'Pending';
  } else if (this.paid_amount >= this.total_fees) {
    this.status = 'Paid';
    this.balance_amount = 0;
  } else {
    this.status = 'Partial';
  }
  
  next();
});

module.exports = mongoose.model('Fees', feesSchema);
