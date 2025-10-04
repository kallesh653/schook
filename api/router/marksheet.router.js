const express = require('express');
const router = express.Router();
const marksheetController = require('../controller/marksheet.controller');
const authMiddleware = require('../auth/auth');

// Apply authentication middleware to all routes
router.use(authMiddleware(['SCHOOL']));

// Marksheet CRUD routes
router.post('/', marksheetController.createMarksheet);
router.get('/', marksheetController.getAllMarksheets);
router.get('/stats', marksheetController.getMarksheetStats);
router.get('/class-performance', marksheetController.getClassPerformance);
router.get('/student-history/:studentId', marksheetController.getStudentHistory);
router.get('/:id', marksheetController.getMarksheetById);
router.get('/:id/pdf', marksheetController.getMarksheetPDF);
router.put('/:id', marksheetController.updateMarksheet);
router.delete('/:id', marksheetController.deleteMarksheet);

module.exports = router;