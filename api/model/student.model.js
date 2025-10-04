const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    school:{type:mongoose.Schema.ObjectId, ref:'School'},
    email:{type:String, required:true},
    name:{type:String, required:true},
    student_class:{type:mongoose.Schema.ObjectId, ref:"Class"},
    course:{type:mongoose.Schema.ObjectId, ref:"Course"},
    age:{type:String, required:true},
    gender:{type:String, required:true},
    guardian:{type:String, required:true},
    guardian_phone:{type:String, required:true},
    aadhaar_number:{
        type:String,
        required:true,
        validate: {
            validator: function(v) {
                return /^\d{12}$/.test(v);
            },
            message: 'Aadhaar number must be exactly 12 digits'
        },
        unique: true
    },
    student_image:{type:String,  required:true},
    createdAt:{type:Date, default: new Date()},

    // Fees Information
    fees: {
        total_fees: { type: Number, default: 0 },
        paid_fees: { type: Number, default: 0 },
        balance_fees: { type: Number, default: 0 }
    },

    password:{type:String, required:true}

})

// Pre-save middleware to calculate balance fees
studentSchema.pre('save', function(next) {
    if (this.fees) {
        // Calculate balance fees (Total - Paid)
        this.fees.balance_fees = (this.fees.total_fees || 0) - (this.fees.paid_fees || 0);
    }
    next();
});

module.exports = mongoose.model("Student", studentSchema)
