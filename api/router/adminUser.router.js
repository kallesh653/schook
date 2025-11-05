const express = require('express');
const router = express.Router();
const authMiddleware = require('../auth/auth');
const adminUserController = require('../controller/adminUser.controller');

/**
 * Admin User Routes
 * These routes handle all admin user management operations
 */

// Public routes (no authentication required)
router.post('/login', adminUserController.loginAdminUser);

// Protected routes - require authentication
// SUPER_ADMIN only routes (create, delete, toggle status)
router.post('/create', authMiddleware(['SUPER_ADMIN']), adminUserController.createAdminUser);
router.delete('/:id', authMiddleware(['SUPER_ADMIN']), adminUserController.deleteAdminUser);
router.put('/:id/toggle-status', authMiddleware(['SUPER_ADMIN']), adminUserController.toggleAdminStatus);

// Routes accessible by both SUPER_ADMIN and ADMIN (view only for regular admins)
router.get('/all', authMiddleware(['SUPER_ADMIN', 'ADMIN']), adminUserController.getAllAdminUsers);

// Routes accessible by both SUPER_ADMIN and ADMIN
router.get('/profile', authMiddleware(['SUPER_ADMIN', 'ADMIN']), adminUserController.getMyProfile);
router.get('/:id', authMiddleware(['SUPER_ADMIN', 'ADMIN']), adminUserController.getAdminUserById);
router.put('/:id', authMiddleware(['SUPER_ADMIN', 'ADMIN']), adminUserController.updateAdminUser);
router.put('/change-password', authMiddleware(['SUPER_ADMIN', 'ADMIN']), adminUserController.changePassword);

module.exports = router;
