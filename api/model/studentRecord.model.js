const mongoose = require('mongoose');

const studentRecordSchema = new mongoose.Schema({
    // Student Personal Information
    student_name: { type: String, required: true },
    father_name: { type: String },
    mother_name: { type: String },
    date_of_birth: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    blood_group: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
    religion: { type: String },
    caste: { type: String },
    nationality: { type: String, default: 'Indian' },
    
    // School and Academic Information
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
    school_name: { type: String },
    school_id: { type: String },
    established_year: { type: Number },
    class: { type: String },
    section: { type: String },
    roll_number: { type: String },
    admission_number: { type: String },
    admission_date: { type: Date, default: Date.now },
    academic_year: { type: String },
    
    // Contact Information
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        pincode: { type: String },
        country: { type: String, default: 'India' }
    },
    phone_number: { type: String },
    email: { type: String },
    emergency_contact: {
        name: { type: String },
        relationship: { type: String },
        phone: { type: String }
    },
    
    // Simplified Fees Information
    fees: {
        total_fees: { type: Number, required: true, default: 0 },
        paid_fees: { type: Number, default: 0 },
        balance_fees: { type: Number, default: 0 },
        transport_fees: { type: Number, default: 0 }
    },
    
    // Additional Information
    previous_school: { type: String },
    medical_conditions: { type: String },
    transport_required: { type: Boolean, default: false },
    hostel_required: { type: Boolean, default: false },
    
    // Status
    status: { type: String, enum: ['Active', 'Inactive', 'Transferred', 'Graduated'], default: 'Active' },
    
    // Timestamps
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Remove unique index to prevent save errors

// Pre-save middleware to calculate balance fees
studentRecordSchema.pre('save', function(next) {
    if (this.fees) {
        // Calculate balance fees (Total - Paid)
        this.fees.balance_fees = (this.fees.total_fees || 0) - (this.fees.paid_fees || 0);
    }
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model('StudentRecord', studentRecordSchema);
