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

// All routes require SCHOOL or ADMIN authentication
router.post('/create', authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), createCourse);
router.get('/school/:schoolId', getCourses);
router.get('/:courseId', getCourseById);
router.put('/:courseId', authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), updateCourse);
router.delete('/:courseId', authMiddleware(['SCHOOL', 'SUPER_ADMIN']), deleteCourse);

module.exports = router;
