const express = require('express');
const router = express.Router();
const frontPageController = require('../controller/frontPage.controller');
const auth = require('../auth/auth');

// Protected routes (require authentication)
router.get('/data', auth(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), frontPageController.getFrontPageData);
router.patch('/school-info', auth(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), frontPageController.updateSchoolInfo);
router.patch('/media', auth(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), frontPageController.updateMedia);
router.post('/news', auth(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), frontPageController.addNews);
router.patch('/news/:newsId', auth(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), frontPageController.updateNews);
router.delete('/news/:newsId', auth(['SCHOOL', 'SUPER_ADMIN']), frontPageController.deleteNews);
router.patch('/theme', auth(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), frontPageController.updateTheme);
router.patch('/header-settings', auth(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), frontPageController.updateHeaderSettings);

// Public routes (no authentication required)
router.get('/public/:schoolId', frontPageController.getPublicFrontPageData);

module.exports = router;
