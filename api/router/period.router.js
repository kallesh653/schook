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
  canTeacherTakeAttendance,
  getTeacherOwnPeriods
} = require('../controller/period.controller');

// Create and manage fixed periods
router.post('/create', authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), createPeriod);
router.put('/update/:id', authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), updatePeriod);
router.delete('/delete/:id', authMiddleware(['SCHOOL', 'SUPER_ADMIN']), deletePeriod);

// Get periods - SPECIFIC ROUTES MUST COME BEFORE PARAMETERIZED ROUTES
router.get('/all', authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), getPeriods);
router.get('/fetch-own', authMiddleware(['TEACHER']), getTeacherOwnPeriods);
router.get('/teacher-classes-schedule', authMiddleware(['TEACHER', 'SUPER_ADMIN', 'ADMIN']), getTeacherClassesFromSchedule);
router.get('/can-take-attendance/:classId', authMiddleware(['TEACHER', 'SUPER_ADMIN', 'ADMIN']), canTeacherTakeAttendance);
router.get('/schedule/today', authMiddleware(['SCHOOL','TEACHER', 'SUPER_ADMIN', 'ADMIN']), getTodaySchedule);
router.get('/schedule/day/:dayOfWeek/class/:classId', authMiddleware(['SCHOOL','STUDENT','TEACHER', 'SUPER_ADMIN', 'ADMIN']), getScheduleByDay);
router.get('/schedule/week/:classId', authMiddleware(['SCHOOL','STUDENT','TEACHER', 'SUPER_ADMIN', 'ADMIN']), getWeeklyScheduleByClass);
router.get('/free-teachers/:dayOfWeek/:periodNumber', authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), getFreeTeachers);
router.get('/teacher/:teacherId', authMiddleware(['SCHOOL','TEACHER', 'SUPER_ADMIN', 'ADMIN']), getTeacherPeriods);
router.get('/class/:classId', authMiddleware(['SCHOOL','STUDENT','TEACHER', 'SUPER_ADMIN', 'ADMIN']), getClassPeriods);
router.get('/:id', authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), getPeriodsWithId);

module.exports = router;
