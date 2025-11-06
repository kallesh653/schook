const express = require('express');
const router = express.Router();
const transportFeesController = require('../controller/transportFees.controller');
const authMiddleware = require('../auth/auth');

// Create new transport fees location
router.post('/create', authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), transportFeesController.createTransportFees);

// Get all transport fees for the school
router.get('/fetch-all', authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), transportFeesController.getAllTransportFees);

// Get only active transport fees
router.get('/fetch-active', authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), transportFeesController.getActiveTransportFees);

// Get single transport fees by ID
router.get('/fetch-single/:id', authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), transportFeesController.getTransportFeesById);

// Update transport fees
router.patch('/update/:id', authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), transportFeesController.updateTransportFees);

// Delete transport fees
router.delete('/delete/:id', authMiddleware(['SCHOOL', 'SUPER_ADMIN']), transportFeesController.deleteTransportFees);

// Toggle active/inactive status
router.patch('/toggle-status/:id', authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), transportFeesController.toggleActiveStatus);

module.exports = router;
