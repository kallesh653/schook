const Course = require("../model/course.model");
const Student = require("../model/student.model");

// Create a new course
const createCourse = async (req, res) => {
    try {
        const { courseName, courseCode, description, duration, category, totalFees, eligibilityCriteria, maxStudents } = req.body;
        // Get schoolId from authenticated user
        const schoolId = req.body.school || req.user?.schoolId || req.user?.id;

        if (!schoolId) {
            return res.status(401).json({ success: false, message: "School ID not found. Please login again." });
        }

        // Check if course code already exists for this school (only if courseCode is provided)
        if (courseCode) {
            const existingCourse = await Course.findOne({ courseCode, school: schoolId });
            if (existingCourse) {
                return res.status(400).json({ success: false, message: "Course code already exists for this school" });
            }
        }

        // Build course data with only provided fields
        const courseData = {
            school: schoolId,
            courseName
        };

        // Add optional fields only if they have actual values (not empty strings)
        if (courseCode && courseCode.trim() !== '') {
            courseData.courseCode = courseCode.trim().toUpperCase();
        }
        if (description && description.trim() !== '') {
            courseData.description = description.trim();
        }
        if (duration) courseData.duration = duration;
        if (category) courseData.category = category;
        if (totalFees !== undefined && totalFees !== null && totalFees !== '') {
            courseData.totalFees = Number(totalFees);
        }
        if (eligibilityCriteria && eligibilityCriteria.trim() !== '') {
            courseData.eligibilityCriteria = eligibilityCriteria.trim();
        }
        if (maxStudents) courseData.maxStudents = parseInt(maxStudents);

        const newCourse = new Course(courseData);
        const savedCourse = await newCourse.save();

        res.status(201).json({ success: true, message: "Course created successfully", course: savedCourse });
    } catch (error) {
        console.log("Error creating course:", error);
        res.status(500).json({ success: false, message: "Error creating course", error: error.message });
    }
};

// Get all courses for a school
const getCourses = async (req, res) => {
    try {
        const { schoolId } = req.params;
        const courses = await Course.find({ school: schoolId, isActive: true })
            .populate('subjects', 'subject_name')
            .sort({ courseName: 1 });

        res.status(200).json({ success: true, courses });
    } catch (error) {
        console.log("Error fetching courses:", error);
        res.status(500).json({ success: false, message: "Error fetching courses", error: error.message });
    }
};

// Get course by ID
const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId)
            .populate('subjects', 'subject_name')
            .populate('school', 'school_name');

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json({ course });
    } catch (error) {
        res.status(500).json({ message: "Error fetching course", error: error.message });
    }
};

// Update course
const updateCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const updateData = req.body;

        // If course code is being updated, check for duplicates
        if (updateData.courseCode) {
            const existingCourse = await Course.findOne({
                courseCode: updateData.courseCode,
                school: updateData.school,
                _id: { $ne: courseId }
            });
            if (existingCourse) {
                return res.status(400).json({ success: false, message: "Course code already exists for this school" });
            }
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            updateData,
            { new: true, runValidators: true }
        ).populate('subjects', 'subject_name');

        if (!updatedCourse) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        res.status(200).json({ success: true, message: "Course updated successfully", course: updatedCourse });
    } catch (error) {
        console.log("Error updating course:", error);
        res.status(500).json({ success: false, message: "Error updating course", error: error.message });
    }
};

// Delete course (soft delete)
const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Check if any students are enrolled in this course
        const enrolledStudents = await Student.countDocuments({ course: courseId });
        if (enrolledStudents > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete course. ${enrolledStudents} students are currently enrolled.`
            });
        }

        const course = await Course.findByIdAndUpdate(
            courseId,
            { isActive: false },
            { new: true }
        );

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        res.status(200).json({ success: true, message: "Course deleted successfully" });
    } catch (error) {
        console.log("Error deleting course:", error);
        res.status(500).json({ success: false, message: "Error deleting course", error: error.message });
    }
};

// Get course statistics
const getCourseStats = async (req, res) => {
    try {
        const { schoolId } = req.params;

        const stats = await Course.aggregate([
            { $match: { school: schoolId, isActive: true } },
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 },
                    totalEnrollment: { $sum: "$currentEnrollment" },
                    avgFees: { $avg: "$totalFees" }
                }
            },
            { $sort: { count: -1 } }
        ]);

        const totalCourses = await Course.countDocuments({ school: schoolId, isActive: true });
        const totalEnrollment = await Course.aggregate([
            { $match: { school: schoolId, isActive: true } },
            { $group: { _id: null, total: { $sum: "$currentEnrollment" } } }
        ]);

        res.status(200).json({
            stats,
            totalCourses,
            totalEnrollment: totalEnrollment[0]?.total || 0
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching course statistics", error: error.message });
    }
};

module.exports = {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    getCourseStats
};