const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    school: { type: mongoose.Schema.ObjectId, ref: 'School', required: true },
    courseName: { type: String, required: true, trim: true },
    courseCode: { type: String, required: true, trim: true, uppercase: true },
    description: { type: String, trim: true },
    duration: {
        type: String,
        required: true,
        enum: ['1 Year', '2 Years', '3 Years', '4 Years', '5 Years', '6 Months', 'Other']
    },
    category: {
        type: String,
        required: true,
        enum: ['Science', 'Commerce', 'Arts', 'Engineering', 'Medical', 'Vocational', 'Other']
    },
    totalFees: { type: Number, required: true, min: 0 },
    subjects: [{ type: mongoose.Schema.ObjectId, ref: 'Subject' }],
    eligibilityCriteria: { type: String, trim: true },
    maxStudents: { type: Number, min: 1 },
    currentEnrollment: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Create compound index for course code and school
courseSchema.index({ courseCode: 1, school: 1 }, { unique: true });

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