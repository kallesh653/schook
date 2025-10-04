const express = require('express');
const {
    createStudentRecord,
    getAllStudentRecords,
    getStudentRecord,
    updateStudentRecord,
    deleteStudentRecord,
    generateStudentPDF,
    getStudentRecordStats,
    addFeePayment
} = require('../controller/studentRecord.controller');
const authMiddleware = require('../auth/auth');

const router = express.Router();

// Student record routes - temporarily disable auth for debugging
router.post('/', createStudentRecord);
router.get('/', getAllStudentRecords);
router.get('/stats', getStudentRecordStats);
router.get('/:id', getStudentRecord);
router.put('/:id', updateStudentRecord);
router.delete('/:id', deleteStudentRecord);
router.get('/:id/pdf', generateStudentPDF);
router.post('/:id/fee-payment', addFeePayment);

module.exports = router;
