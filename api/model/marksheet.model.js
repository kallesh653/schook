const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    marks: { type: Number, required: true, min: 0 },
    max_marks: { type: Number, required: true, default: 100, min: 1 },
    grade: { type: String },
    percentage: { type: Number },
    remarks: { type: String }
});

const marksheetSchema = new mongoose.Schema({
    // Student Information
    student_id: { type: String }, // Changed to String for flexibility
    student_name: { type: String, required: true },
    class: { type: String, required: true },
    section: { type: String, required: true },
    roll_number: { type: String, required: true },

    // Examination Details
    examination: {
        type: String,
        required: true
    },
    academic_year: { type: String, required: true },

    // Subjects and Marks
    subjects: [subjectSchema],

    // Results Summary
    total_marks: { type: Number, required: true },
    total_max_marks: { type: Number },
    percentage: { type: Number, required: true },
    overall_grade: { type: String, required: true },
    result: {
        type: String,
        required: true,
        enum: ['Pass', 'Fail'],
        default: 'Pass'
    },

    // Authority Information
    teacher_name: { type: String },
    teacher_signature: { type: String }, // Can store signature image path
    principal_name: { type: String },
    principal_signature: { type: String }, // Can store signature image path

    // School Information
    school_name: { type: String },
    school_address: { type: String },
    school_logo: { type: String }, // Can store logo image path

    // Additional Information
    issue_date: { type: Date, default: Date.now },
    remarks: { type: String },

    // Status and Verification
    status: {
        type: String,
        enum: ['Draft', 'Issued', 'Verified'],
        default: 'Draft'
    },
    verified_by: { type: String },
    verification_date: { type: Date },

    // Metadata
    created_by: { type: String },
    updated_by: { type: String }
}, {
    timestamps: true
});

// Index for better performance
marksheetSchema.index({ student_name: 1, academic_year: 1, examination: 1 });
marksheetSchema.index({ class: 1, section: 1 });
marksheetSchema.index({ examination: 1, academic_year: 1 });

// Virtual for full student info
marksheetSchema.virtual('full_student_info').get(function() {
    return `${this.student_name} - ${this.class} ${this.section} (${this.roll_number})`;
});

// Method to calculate total marks and percentage
marksheetSchema.methods.calculateResults = function() {
    let totalMarks = 0;
    let totalMaxMarks = 0;

    this.subjects.forEach(subject => {
        totalMarks += subject.marks;
        totalMaxMarks += subject.max_marks;

        // Calculate individual subject grade
        const percentage = (subject.marks / subject.max_marks) * 100;
        subject.percentage = Math.round(percentage * 100) / 100;
        subject.grade = this.calculateGrade(percentage);
    });

    this.total_marks = totalMarks;
    this.total_max_marks = totalMaxMarks;
    this.percentage = Math.round((totalMarks / totalMaxMarks) * 100 * 100) / 100;
    this.overall_grade = this.calculateGrade(this.percentage);
    this.result = this.percentage >= 33 ? 'Pass' : 'Fail';

    return {
        total_marks: this.total_marks,
        total_max_marks: this.total_max_marks,
        percentage: this.percentage,
        overall_grade: this.overall_grade,
        result: this.result
    };
};

// Method to calculate grade based on percentage
marksheetSchema.methods.calculateGrade = function(percentage) {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    if (percentage >= 33) return 'D';
    return 'F';
};

// Pre-save middleware to calculate results
marksheetSchema.pre('save', function(next) {
    this.calculateResults();
    next();
});

// Static method to get class performance
marksheetSchema.statics.getClassPerformance = function(className, section, examination, academicYear) {
    return this.aggregate([
        {
            $match: {
                class: className,
                section: section,
                examination: examination,
                academic_year: academicYear
            }
        },
        {
            $group: {
                _id: null,
                totalStudents: { $sum: 1 },
                passCount: { $sum: { $cond: [{ $eq: ['$result', 'Pass'] }, 1, 0] } },
                failCount: { $sum: { $cond: [{ $eq: ['$result', 'Fail'] }, 1, 0] } },
                averagePercentage: { $avg: '$percentage' },
                highestPercentage: { $max: '$percentage' },
                lowestPercentage: { $min: '$percentage' },
                gradeDistribution: {
                    $push: '$overall_grade'
                }
            }
        }
    ]);
};

// Static method to get student academic history
marksheetSchema.statics.getStudentHistory = function(studentId) {
    return this.find({ student_id: studentId })
               .sort({ academic_year: -1, issue_date: -1 });
};

module.exports = mongoose.model('Marksheet', marksheetSchema);