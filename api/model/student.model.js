const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    // ===== AUTHENTICATION & BASIC INFO =====
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    name: { type: String, required: true, trim: true },

    // ===== SCHOOL & CLASS INFORMATION =====
    school: { type: mongoose.Schema.ObjectId, ref: 'School', required: true },
    school_name: { type: String },
    school_id: { type: String },
    established_year: { type: Number },
    student_class: { type: mongoose.Schema.ObjectId, ref: "Class" },
    class_name: { type: String }, // Display format: "Class 10 - A"
    section: { type: String },
    roll_number: { type: String, trim: true },
    admission_number: { type: String, unique: true, sparse: true },
    course: { type: mongoose.Schema.ObjectId, ref: "Course" },
    academic_year: { type: String, default: () => {
        const year = new Date().getFullYear();
        return `${year}-${year + 1}`;
    }},

    // ===== PERSONAL INFORMATION =====
    date_of_birth: { type: Date, required: true },
    age: { type: Number }, // Auto-calculated
    gender: {
        type: String,
        required: true,
        enum: {
            values: ['Male', 'Female', 'Other', 'male', 'female', 'other'],
            message: '{VALUE} is not a valid gender'
        }
    },
    blood_group: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''] },
    religion: { type: String },
    caste: { type: String },
    nationality: { type: String, default: 'Indian' },
    aadhaar_number: {
        type: String,
        required: false,
        validate: {
            validator: function(v) {
                if (!v) return true;
                return /^\d{12}$/.test(v);
            },
            message: 'Aadhaar number must be exactly 12 digits'
        },
        unique: false,
        sparse: true
    },
    student_image: { type: String, required: false, default: 'default-student.png' },

    // ===== GUARDIAN/PARENT INFORMATION =====
    father_name: { type: String },
    mother_name: { type: String },
    guardian: { type: String, required: true }, // Primary guardian name
    guardian_relation: { type: String, default: 'Father' },
    guardian_phone: { type: String, required: true },
    guardian_email: { type: String, lowercase: true, trim: true },
    guardian_occupation: { type: String },

    // ===== CONTACT & ADDRESS =====
    phone_number: { type: String },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        pincode: { type: String },
        country: { type: String, default: 'India' }
    },
    emergency_contact: {
        name: { type: String },
        relationship: { type: String },
        phone: { type: String }
    },

    // ===== ADMISSION & DATES =====
    date_of_admission: { type: Date, required: true, default: Date.now },
    previous_school: { type: String },
    transfer_certificate: { type: String }, // TC file path

    // ===== FEES MANAGEMENT =====
    fees: {
        total_fees: { type: Number, required: false, default: 0 },
        paid_fees: { type: Number, required: false, default: 0 },
        advance_fees: { type: Number, required: false, default: 0 },
        balance_fees: { type: Number, required: false, default: 0 }, // Auto-calculated
        discount: { type: Number, default: 0 },
        fee_payment_history: [{
            amount: Number,
            payment_date: Date,
            payment_method: String,
            receipt_number: String,
            remarks: String
        }]
    },

    // ===== TRANSPORT =====
    transport_required: { type: Boolean, default: false },
    transport_fees: {
        type: mongoose.Schema.ObjectId,
        ref: 'TransportFees',
        required: false,
        default: null
    },
    transport_route: { type: String },
    pickup_point: { type: String },

    // ===== HOSTEL =====
    hostel_required: { type: Boolean, default: false },
    hostel_room_number: { type: String },

    // ===== HEALTH & MEDICAL =====
    medical_conditions: { type: String },
    allergies: { type: String },

    // ===== STATUS & TRACKING =====
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Transferred', 'Graduated', 'Suspended'],
        default: 'Active'
    },
    remarks: { type: String },

    // ===== TIMESTAMPS =====
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true // Automatically manages createdAt and updatedAt
})

// ===== PRE-SAVE MIDDLEWARE =====
studentSchema.pre('save', function(next) {
    // 1. Auto-calculate age from date_of_birth
    if (this.date_of_birth) {
        const today = new Date();
        const birthDate = new Date(this.date_of_birth);
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            calculatedAge--;
        }

        // Check minimum age requirement (4 years)
        if (calculatedAge < 4) {
            return next(new Error('Student must be at least 4 years old'));
        }

        this.age = calculatedAge;
    }

    // 2. Auto-calculate balance fees
    if (this.fees) {
        this.fees.balance_fees = (this.fees.total_fees || 0) - (this.fees.paid_fees || 0) - (this.fees.advance_fees || 0) + (this.fees.discount || 0);
    }

    // 3. Generate admission number if not provided
    if (!this.admission_number) {
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        this.admission_number = `ADM${year}${random}`;
    }

    // 4. Update timestamps
    this.updatedAt = Date.now();

    next();
});

// ===== INDEXES FOR PERFORMANCE =====
studentSchema.index({ school: 1, student_class: 1 });
studentSchema.index({ email: 1 });
studentSchema.index({ roll_number: 1, student_class: 1 });
studentSchema.index({ admission_number: 1 });
studentSchema.index({ status: 1 });

// ===== VIRTUAL FIELDS =====
// Full address as single string
studentSchema.virtual('fullAddress').get(function() {
    if (!this.address) return '';
    const parts = [
        this.address.street,
        this.address.city,
        this.address.state,
        this.address.pincode,
        this.address.country
    ].filter(Boolean);
    return parts.join(', ');
});

// ===== METHODS =====
// Method to check if student has pending fees
studentSchema.methods.hasPendingFees = function() {
    return this.fees && this.fees.balance_fees > 0;
};

// Method to get fee percentage paid
studentSchema.methods.getFeePercentagePaid = function() {
    if (!this.fees || !this.fees.total_fees || this.fees.total_fees === 0) return 0;
    return ((this.fees.paid_fees || 0) / this.fees.total_fees) * 100;
};

// ===== STATIC METHODS =====
// Get students by class
studentSchema.statics.findByClass = function(classId) {
    return this.find({ student_class: classId, status: 'Active' })
        .populate('student_class', 'class_num class_text')
        .populate('school', 'school_name school_id')
        .sort({ roll_number: 1 });
};

// Get students with pending fees
studentSchema.statics.findWithPendingFees = function(schoolId) {
    return this.find({
        school: schoolId,
        status: 'Active',
        'fees.balance_fees': { $gt: 0 }
    }).sort({ 'fees.balance_fees': -1 });
};

module.exports = mongoose.model("Student", studentSchema)
