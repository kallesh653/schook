const mongoose = require("mongoose");

const transportFeesSchema = new mongoose.Schema({
    school: {
        type: mongoose.Schema.ObjectId,
        ref: 'School',
        required: true
    },
    location_name: {
        type: String,
        required: true,
        trim: true
    },
    distance: {
        type: String,
        required: false,
        trim: true
    },
    monthly_fee: {
        type: Number,
        required: true,
        min: 0
    },
    annual_fee: {
        type: Number,
        required: false,
        min: 0
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    is_active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-save middleware to calculate annual fee if not provided
transportFeesSchema.pre('save', function(next) {
    // Auto-calculate annual fee as 12 months if not provided
    if (!this.annual_fee && this.monthly_fee) {
        this.annual_fee = this.monthly_fee * 12;
    }

    // Update timestamp
    this.updatedAt = new Date();

    next();
});

module.exports = mongoose.model("TransportFees", transportFeesSchema);
