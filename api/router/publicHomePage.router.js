const express = require('express');
const router = express.Router();
const publicHomePageController = require('../controller/publicHomePage.controller');
const auth = require('../auth/auth');

// Public route - NO authentication required
router.get('/data', publicHomePageController.getPublicHomePageData);

// Protected routes - require SCHOOL authentication
router.patch('/hero-section', auth(['SCHOOL']), publicHomePageController.updateHeroSection);
router.patch('/slider', auth(['SCHOOL']), publicHomePageController.updateSlider);
router.patch('/statistics', auth(['SCHOOL']), publicHomePageController.updateStatistics);
router.patch('/features', auth(['SCHOOL']), publicHomePageController.updateFeatures);
router.patch('/announcements', auth(['SCHOOL']), publicHomePageController.updateAnnouncements);
router.patch('/header', auth(['SCHOOL']), publicHomePageController.updateHeader);
router.patch('/theme', auth(['SCHOOL']), publicHomePageController.updateTheme);

module.exports = router;
