const express = require('express');
const router = express.Router();
const transportFeesController = require('../controller/transportFees.controller');
const authMiddleware = require('../auth/auth');

// Create new transport fees location
router.post('/create', authMiddleware(['SCHOOL']), transportFeesController.createTransportFees);

// Get all transport fees for the school
router.get('/fetch-all', authMiddleware(['SCHOOL']), transportFeesController.getAllTransportFees);

// Get only active transport fees
router.get('/fetch-active', authMiddleware(['SCHOOL']), transportFeesController.getActiveTransportFees);

// Get single transport fees by ID
router.get('/fetch-single/:id', authMiddleware(['SCHOOL']), transportFeesController.getTransportFeesById);

// Update transport fees
router.patch('/update/:id', authMiddleware(['SCHOOL']), transportFeesController.updateTransportFees);

// Delete transport fees
router.delete('/delete/:id', authMiddleware(['SCHOOL']), transportFeesController.deleteTransportFees);

// Toggle active/inactive status
router.patch('/toggle-status/:id', authMiddleware(['SCHOOL']), transportFeesController.toggleActiveStatus);

module.exports = router;
