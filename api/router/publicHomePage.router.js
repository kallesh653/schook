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
router.patch('/programs', auth(['SCHOOL']), publicHomePageController.updatePrograms);
router.patch('/campus', auth(['SCHOOL']), publicHomePageController.updateCampus);
router.patch('/testimonials', auth(['SCHOOL']), publicHomePageController.updateTestimonials);
router.patch('/about', auth(['SCHOOL']), publicHomePageController.updateAbout);
router.patch('/social-media', auth(['SCHOOL']), publicHomePageController.updateSocialMedia);

// File upload (requires SCHOOL authentication)
router.post('/upload', auth(['SCHOOL']), publicHomePageController.uploadFile);

module.exports = router;
