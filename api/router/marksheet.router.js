const express = require('express');
const router = express.Router();
const marksheetController = require('../controller/marksheet.controller');
const authMiddleware = require('../auth/auth');

// Marksheet CRUD routes - Allow SCHOOL, ADMIN and TEACHER roles
router.post('/', authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN', 'TEACHER']), marksheetController.createMarksheet);
router.get('/', authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN', 'TEACHER']), marksheetController.getAllMarksheets);
router.get('/stats', authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), marksheetController.getMarksheetStats);
router.get('/class-performance', authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN', 'TEACHER']), marksheetController.getClassPerformance);
router.get('/student-history/:studentId', authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT']), marksheetController.getStudentHistory);
router.get('/:id', authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT']), marksheetController.getMarksheetById);
router.get('/:id/pdf', authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT']), marksheetController.getMarksheetPDF);
router.put('/:id', authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN', 'TEACHER']), marksheetController.updateMarksheet);
router.delete('/:id', authMiddleware(['SCHOOL', 'SUPER_ADMIN']), marksheetController.deleteMarksheet);

module.exports = router;