const express = require('express');
const router = express.Router();
const frontPageController = require('../controller/frontPage.controller');
const auth = require('../auth/auth');

// Protected routes (require authentication)
router.get('/data', auth(['SCHOOL']), frontPageController.getFrontPageData);
router.patch('/school-info', auth(['SCHOOL']), frontPageController.updateSchoolInfo);
router.patch('/media', auth(['SCHOOL']), frontPageController.updateMedia);
router.post('/news', auth(['SCHOOL']), frontPageController.addNews);
router.patch('/news/:newsId', auth(['SCHOOL']), frontPageController.updateNews);
router.delete('/news/:newsId', auth(['SCHOOL']), frontPageController.deleteNews);
router.patch('/theme', auth(['SCHOOL']), frontPageController.updateTheme);
router.patch('/header-settings', auth(['SCHOOL']), frontPageController.updateHeaderSettings);

// Public routes (no authentication required)
router.get('/public/:schoolId', frontPageController.getPublicFrontPageData);

module.exports = router;
