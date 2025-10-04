const express = require('express');
const { getDashboardStats, getAttendanceStats, createFees, updatePayment } = require('../controller/fees.controller');
const authMiddleware = require('../auth/auth');

const router = express.Router();

router.get('/dashboard-stats', authMiddleware(['SCHOOL']), getDashboardStats);
router.get('/attendance-stats', authMiddleware(['SCHOOL']), getAttendanceStats);
router.post('/create', authMiddleware(['SCHOOL']), createFees);
router.patch('/update-payment/:id', authMiddleware(['SCHOOL']), updatePayment);

module.exports = router;
