const express = require('express');
const router = express.Router();
const smsController = require('../controller/sms.controller');
const authMiddleware = require('../auth/auth');

// Apply authentication middleware to all routes - only SCHOOL users can access
router.use(authMiddleware(['SCHOOL']));

// SMS Template routes
router.post('/templates', smsController.createTemplate);
router.get('/templates', smsController.getTemplates);
router.get('/templates/:id', smsController.getTemplateById);
router.put('/templates/:id', smsController.updateTemplate);
router.delete('/templates/:id', smsController.deleteTemplate);
router.post('/templates/initialize-defaults', smsController.initializeDefaultTemplates);

// SMS Sending routes
router.post('/send', smsController.sendSmsFromTemplate);
router.post('/send/absent-students', smsController.sendAbsentStudentsSms);
router.post('/send/fee-balance', smsController.sendFeeBalanceSms);

// SMS Logs and Statistics
router.get('/logs', smsController.getSmsLogs);
router.get('/statistics', smsController.getSmsStatistics);

// Student Lists for Approval
router.get('/absent-students-list', smsController.getAbsentStudentsList);
router.get('/fee-balance-students-list', smsController.getFeeBalanceStudentsList);

// Gateway Settings
router.post('/gateway/settings', smsController.updateGatewaySettings);
router.post('/gateway/test', smsController.testGatewayConnection);

module.exports = router;