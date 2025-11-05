const mongoose = require('mongoose');

const academicYearSchema = new mongoose.Schema({
    year: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        // Format: "2023-2024"
        match: /^\d{4}-\d{4}$/
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    isCurrent: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['upcoming', 'active', 'completed'],
        default: 'upcoming'
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    terms: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        }
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School'
    }
}, {
    timestamps: true
});

// Index for faster queries
academicYearSchema.index({ school: 1, year: 1 });
academicYearSchema.index({ school: 1, isCurrent: 1 });

// Ensure only one current academic year per school
academicYearSchema.pre('save', async function(next) {
    if (this.isCurrent && this.isModified('isCurrent')) {
        await this.constructor.updateMany(
            { school: this.school, _id: { $ne: this._id } },
            { $set: { isCurrent: false } }
        );
    }
    next();
});

// Auto-update status based on dates
academicYearSchema.methods.updateStatus = function() {
    const now = new Date();
    if (now < this.startDate) {
        this.status = 'upcoming';
    } else if (now > this.endDate) {
        this.status = 'completed';
    } else {
        this.status = 'active';
    }
};

module.exports = mongoose.model('AcademicYear', academicYearSchema);
