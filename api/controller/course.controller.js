const Course = require('../model/course.model');

// Create a new course
const createCourse = async (req, res) => {
    try {
        const schoolId = req.user?.schoolId || req.user?.id;

        if (!schoolId) {
            return res.status(401).json({
                success: false,
                message: "School ID not found. Please login again."
            });
        }

        const courseData = {
            school: schoolId,
            courseName: req.body.courseName,
            courseCode: req.body.courseCode || '',
            description: req.body.description || '',
            duration: req.body.duration || '',
            fees: req.body.fees || 0,
            eligibility: req.body.eligibility || '',
            totalSeats: req.body.totalSeats || 0,
            availableSeats: req.body.availableSeats || req.body.totalSeats || 0,
            startDate: req.body.startDate || null,
            endDate: req.body.endDate || null,
            status: req.body.status || 'Active'
        };

        const newCourse = new Course(courseData);
        const savedCourse = await newCourse.save();

        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            course: savedCourse
        });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating course',
            error: error.message
        });
    }
};

// Get all courses for a school
const getCourses = async (req, res) => {
    try {
        const schoolId = req.params.schoolId || req.user?.schoolId || req.user?.id;

        if (!schoolId) {
            return res.status(401).json({
                success: false,
                message: "School ID not found."
            });
        }

        const courses = await Course.find({ school: schoolId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: courses.length,
            courses: courses
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching courses',
            error: error.message
        });
    }
};

// Get a single course by ID
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        res.status(200).json({
            success: true,
            course: course
        });
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching course',
            error: error.message
        });
    }
};

// Update a course
const updateCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const updateData = {
            courseName: req.body.courseName,
            courseCode: req.body.courseCode,
            description: req.body.description,
            duration: req.body.duration,
            fees: req.body.fees,
            eligibility: req.body.eligibility,
            totalSeats: req.body.totalSeats,
            availableSeats: req.body.availableSeats,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            status: req.body.status,
            updatedAt: Date.now()
        };

        // Remove undefined fields
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Course updated successfully',
            course: updatedCourse
        });
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating course',
            error: error.message
        });
    }
};

// Delete a course
const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        const deletedCourse = await Course.findByIdAndDelete(courseId);

        if (!deletedCourse) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Course deleted successfully',
            course: deletedCourse
        });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting course',
            error: error.message
        });
    }
};

module.exports = {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse
};
