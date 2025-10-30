const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    school:{type:mongoose.Schema.ObjectId, ref:'School'},
    email:{type:String, required:true},
    name:{type:String, required:true},
    student_class:{type:mongoose.Schema.ObjectId, ref:"Class"},
    course:{type:mongoose.Schema.ObjectId, ref:"Course"},
    date_of_birth:{type:Date, required:true},
    age:{type:Number, required:true},
    date_of_admission:{type:Date, required:true, default: Date.now},
    gender:{type:String, required:true},
    guardian:{type:String, required:true},
    guardian_phone:{type:String, required:true},
    aadhaar_number:{
        type:String,
        required:false,
        validate: {
            validator: function(v) {
                if (!v) return true; // Allow empty/undefined
                return /^\d{12}$/.test(v);
            },
            message: 'Aadhaar number must be exactly 12 digits'
        },
        unique: false,
        sparse: true
    },
    student_image:{type:String,  required:false, default: 'default-student.png'},
    createdAt:{type:Date, default: new Date()},

    // Fees Information
    fees: {
        total_fees: { type: Number, default: 0 },
        paid_fees: { type: Number, default: 0 },
        balance_fees: { type: Number, default: 0 }
    },

    password:{type:String, required:true}

})

// Pre-save middleware to calculate balance fees and validate age
studentSchema.pre('save', function(next) {
    if (this.fees) {
        // Calculate balance fees (Total - Paid)
        this.fees.balance_fees = (this.fees.total_fees || 0) - (this.fees.paid_fees || 0);
    }

    // Validate minimum age of 4 years
    if (this.date_of_birth) {
        const today = new Date();
        const birthDate = new Date(this.date_of_birth);
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            calculatedAge--;
        }

        // Check minimum age requirement
        if (calculatedAge < 4) {
            return next(new Error('Student must be at least 4 years old'));
        }

        // Auto-calculate and update age
        this.age = calculatedAge;
    }

    next();
});

module.exports = mongoose.model("Student", studentSchema)
