const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true
    },
    courseName: {
        type: String,
        required: true,
        trim: true
    },
    courseCode: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    duration: {
        type: String,
        trim: true
    },
    fees: {
        type: Number,
        min: 0
    },
    eligibility: {
        type: String,
        trim: true
    },
    totalSeats: {
        type: Number,
        min: 0
    },
    availableSeats: {
        type: Number,
        min: 0
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Completed'],
        default: 'Active'
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

// Update the updatedAt field before saving
courseSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Index for faster queries
courseSchema.index({ school: 1, courseName: 1 });

// Explicitly set collection name to 'courses'
const Course = mongoose.model('Course', courseSchema, 'courses');

module.exports = Course;
