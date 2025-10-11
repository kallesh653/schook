const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    school: { type: mongoose.Schema.ObjectId, ref: 'School', required: true },
    courseName: { type: String, required: true, trim: true },
    courseCode: { type: String, required: false, trim: true, uppercase: true },
    description: { type: String, trim: true, required: false },
    duration: {
        type: String,
        required: false,
        enum: ['1 Year', '2 Years', '3 Years', '4 Years', '5 Years', '6 Months', 'Other', '']
    },
    category: {
        type: String,
        required: false,
        // Removed strict enum to allow custom categories
    },
    totalFees: { type: Number, required: false, min: 0, default: 0 },
    subjects: [{ type: mongoose.Schema.ObjectId, ref: 'Subject' }],
    eligibilityCriteria: { type: String, trim: true, required: false },
    maxStudents: { type: Number, min: 1, required: false },
    currentEnrollment: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sparse unique index - only enforces uniqueness when courseCode exists
courseSchema.index({ courseCode: 1, school: 1 }, { unique: true, sparse: true });

// Pre-save middleware to update the updatedAt field
courseSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Virtual for checking if course is full
courseSchema.virtual('isFull').get(function() {
    return this.maxStudents && this.currentEnrollment >= this.maxStudents;
});

// Virtual for available slots
courseSchema.virtual('availableSlots').get(function() {
    return this.maxStudents ? this.maxStudents - this.currentEnrollment : null;
});

module.exports = mongoose.model("Course", courseSchema);