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
    // Multiple fee options with custom periods
    fee_structure: [{
        period_name: {
            type: String,
            required: true,
            trim: true
            // Examples: "Monthly", "Quarterly", "Half-Yearly", "Annual", "Per Trip", "Weekly", etc.
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    // Backward compatibility fields
    monthly_fee: {
        type: Number,
        required: false,
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

// Pre-save middleware
transportFeesSchema.pre('save', function(next) {
    // If fee_structure exists and has values, use that
    // Otherwise, ensure backward compatibility with monthly_fee/annual_fee
    if (this.fee_structure && this.fee_structure.length > 0) {
        // Find monthly and annual from fee_structure for backward compatibility
        const monthly = this.fee_structure.find(f => f.period_name.toLowerCase() === 'monthly');
        const annual = this.fee_structure.find(f => f.period_name.toLowerCase() === 'annual');

        if (monthly) this.monthly_fee = monthly.amount;
        if (annual) this.annual_fee = annual.amount;
    } else {
        // Backward compatibility: if only monthly_fee is provided, auto-calculate annual
        if (!this.annual_fee && this.monthly_fee) {
            this.annual_fee = this.monthly_fee * 12;
        }

        // Create fee_structure from legacy fields
        if (this.monthly_fee || this.annual_fee) {
            this.fee_structure = [];
            if (this.monthly_fee) {
                this.fee_structure.push({ period_name: 'Monthly', amount: this.monthly_fee });
            }
            if (this.annual_fee) {
                this.fee_structure.push({ period_name: 'Annual', amount: this.annual_fee });
            }
        }
    }

    // Update timestamp
    this.updatedAt = new Date();

    next();
});

module.exports = mongoose.model("TransportFees", transportFeesSchema);
