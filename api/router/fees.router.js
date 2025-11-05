const express = require('express');
const { getDashboardStats, getAttendanceStats, createFees, updatePayment } = require('../controller/fees.controller');
const authMiddleware = require('../auth/auth');

const router = express.Router();

router.get('/dashboard-stats', authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), getDashboardStats);
router.get('/attendance-stats', authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), getAttendanceStats);
router.post('/create', authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), createFees);
router.patch('/update-payment/:id', authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), updatePayment);

module.exports = router;
