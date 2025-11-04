const express = require('express');
const router = express.Router();
const marksheetController = require('../controller/marksheet.controller');
const authMiddleware = require('../auth/auth');

// Marksheet CRUD routes - Allow both SCHOOL and TEACHER roles
router.post('/', authMiddleware(['SCHOOL', 'TEACHER']), marksheetController.createMarksheet);
router.get('/', authMiddleware(['SCHOOL', 'TEACHER']), marksheetController.getAllMarksheets);
router.get('/stats', authMiddleware(['SCHOOL']), marksheetController.getMarksheetStats);
router.get('/class-performance', authMiddleware(['SCHOOL', 'TEACHER']), marksheetController.getClassPerformance);
router.get('/student-history/:studentId', authMiddleware(['SCHOOL', 'TEACHER', 'STUDENT']), marksheetController.getStudentHistory);
router.get('/:id', authMiddleware(['SCHOOL', 'TEACHER', 'STUDENT']), marksheetController.getMarksheetById);
router.get('/:id/pdf', authMiddleware(['SCHOOL', 'TEACHER', 'STUDENT']), marksheetController.getMarksheetPDF);
router.put('/:id', authMiddleware(['SCHOOL', 'TEACHER']), marksheetController.updateMarksheet);
router.delete('/:id', authMiddleware(['SCHOOL']), marksheetController.deleteMarksheet);

module.exports = router;