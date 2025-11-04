const express = require('express');
const router = express.Router();
const authMiddleware = require('../auth/auth');
const {
  createPeriod,
  getTeacherPeriods,
  getPeriods,
  getClassPeriods,
  updatePeriod,
  deletePeriod,
  getPeriodsWithId,
  getScheduleByDay,
  getWeeklyScheduleByClass,
  getFreeTeachers,
  getTodaySchedule,
  getTeacherClassesFromSchedule,
  canTeacherTakeAttendance
} = require('../controller/period.controller');

// Create and manage fixed periods
router.post('/create', authMiddleware(['SCHOOL']), createPeriod);
router.put('/update/:id', authMiddleware(['SCHOOL']), updatePeriod);
router.delete('/delete/:id', authMiddleware(['SCHOOL']), deletePeriod);

// Get periods
router.get('/all', authMiddleware(['SCHOOL']), getPeriods);
router.get('/:id', authMiddleware(['SCHOOL']), getPeriodsWithId);
router.get('/teacher/:teacherId', authMiddleware(['SCHOOL','TEACHER']), getTeacherPeriods);
router.get('/class/:classId', authMiddleware(['SCHOOL','STUDENT','TEACHER']), getClassPeriods);

// New endpoints for fixed schedule
router.get('/schedule/today', authMiddleware(['SCHOOL','TEACHER']), getTodaySchedule);
router.get('/schedule/day/:dayOfWeek/class/:classId', authMiddleware(['SCHOOL','STUDENT','TEACHER']), getScheduleByDay);
router.get('/schedule/week/:classId', authMiddleware(['SCHOOL','STUDENT','TEACHER']), getWeeklyScheduleByClass);
router.get('/free-teachers/:dayOfWeek/:periodNumber', authMiddleware(['SCHOOL']), getFreeTeachers);

// Attendance-related endpoints (automatically allow teachers based on schedule)
router.get('/teacher-classes-schedule', authMiddleware(['TEACHER']), getTeacherClassesFromSchedule);
router.get('/can-take-attendance/:classId', authMiddleware(['TEACHER']), canTeacherTakeAttendance);

module.exports = router;
