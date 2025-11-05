const express = require('express');
const router = express.Router();
const {
    markAttendance,
    getAttendance,
    checkAttendance,
    getAttendanceReport,
    getAttendanceSummary,
    exportAttendanceExcel,
    exportAttendancePDF
} = require('../controller/attendance.controller');
const authMiddleware = require('../auth/auth')

// Mark attendance
router.post('/mark',authMiddleware(['TEACHER', 'SUPER_ADMIN', 'ADMIN']) , markAttendance);

// Get all attendance records (for dashboard)
router.get('/', authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), getAttendanceReport);

router.get('/:studentId',authMiddleware(['TEACHER', 'STUDENT', 'SCHOOL', 'SUPER_ADMIN', 'ADMIN']),  getAttendance);
router.get('/check/:classId', authMiddleware(['TEACHER', 'SUPER_ADMIN', 'ADMIN']), checkAttendance)

// Reports
router.get('/report/all', authMiddleware(['SCHOOL', 'TEACHER', 'SUPER_ADMIN', 'ADMIN']), getAttendanceReport)
router.get('/report/summary', authMiddleware(['SCHOOL', 'TEACHER', 'SUPER_ADMIN', 'ADMIN']), getAttendanceSummary)

// Export routes
router.get('/export/excel', authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), exportAttendanceExcel)
router.get('/export/pdf', authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), exportAttendancePDF)

module.exports = router;
