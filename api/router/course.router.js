const express = require('express');
const router = express.Router();
const {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse
} = require('../controller/course.controller');
const authMiddleware = require('../auth/auth');

// All routes require SCHOOL authentication
router.post('/create', authMiddleware(['SCHOOL']), createCourse);
router.get('/school/:schoolId', getCourses);
router.get('/:courseId', getCourseById);
router.put('/:courseId', authMiddleware(['SCHOOL']), updateCourse);
router.delete('/:courseId', authMiddleware(['SCHOOL']), deleteCourse);

module.exports = router;
