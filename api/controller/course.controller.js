const Course = require('../model/course.model');
const Student = require('../model/student.model');

// Create a new course
const createCourse = async (req, res) => {
    try {
        console.log('=== CREATE COURSE ===');
        console.log('req.user:', req.user);
        console.log('req.body:', req.body);

        const schoolId = req.user.id;

        if (!schoolId) {
            console.error('❌ No school ID found');
            return res.status(401).json({
                success: false,
                message: "School ID not found. Please login again."
            });
        }

        console.log('✅ School ID:', schoolId);

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

        console.log('Course data to save:', courseData);

        const newCourse = new Course(courseData);
        const savedCourse = await newCourse.save();

        console.log('✅ Course saved successfully:', savedCourse);

        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            course: savedCourse
        });
    } catch (error) {
        console.error('❌ Error creating course:', error);
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
        console.log('=== GET COURSES ===');
        const schoolId = req.params.schoolId;
        console.log('School ID from params:', schoolId);

        if (!schoolId) {
            console.error('❌ No school ID provided');
            return res.status(400).json({
                success: false,
                message: "School ID is required"
            });
        }

        const courses = await Course.find({ school: schoolId }).sort({ createdAt: -1 });
        console.log(`✅ Found ${courses.length} courses for school ${schoolId}`);

        res.status(200).json({
            success: true,
            count: courses.length,
            courses: courses
        });
    } catch (error) {
        console.error('❌ Error fetching courses:', error);
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

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Check if any students are enrolled in this course
        const enrolledStudents = await Student.countDocuments({
            course: courseId,
            status: 'Active'
        });

        if (enrolledStudents > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete course. ${enrolledStudents} student(s) are currently enrolled in this course. Please transfer or remove the students first.`,
                enrolledCount: enrolledStudents
            });
        }

        // If no students enrolled, proceed with deletion
        const deletedCourse = await Course.findByIdAndDelete(courseId);

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
