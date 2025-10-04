const express = require('express');
const router = express.Router();
const { markAttendance, getAttendance, checkAttendance, getAttendanceReport, getAttendanceSummary } = require('../controller/attendance.controller');
const authMiddleware = require('../auth/auth')
// Mark attendance
router.post('/mark',authMiddleware(['TEACHER']) , markAttendance);
router.get('/:studentId',authMiddleware(['TEACHER', 'STUDENT','SCHOOL']),  getAttendance);
router.get('/check/:classId', authMiddleware(['TEACHER']), checkAttendance)
router.get('/report/all', authMiddleware(['SCHOOL', 'TEACHER']), getAttendanceReport)
router.get('/report/summary', authMiddleware(['SCHOOL', 'TEACHER']), getAttendanceSummary)
module.exports = router;
