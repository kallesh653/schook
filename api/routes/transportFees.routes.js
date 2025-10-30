const express = require('express');
const router = express.Router();
const transportFeesController = require('../controller/transportFees.controller');

// TODO: Add authentication middleware when available
// const { authMiddleware } = require('../middleware/auth.middleware');
// router.use(authMiddleware);

// Create new transport fees location
router.post('/create', transportFeesController.createTransportFees);

// Get all transport fees for the school
router.get('/fetch-all', transportFeesController.getAllTransportFees);

// Get only active transport fees
router.get('/fetch-active', transportFeesController.getActiveTransportFees);

// Get single transport fees by ID
router.get('/fetch-single/:id', transportFeesController.getTransportFeesById);

// Update transport fees
router.patch('/update/:id', transportFeesController.updateTransportFees);

// Delete transport fees
router.delete('/delete/:id', transportFeesController.deleteTransportFees);

// Toggle active/inactive status
router.patch('/toggle-status/:id', transportFeesController.toggleActiveStatus);

module.exports = router;
