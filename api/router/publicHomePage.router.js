const express = require('express');
const router = express.Router();
const publicHomePageController = require('../controller/publicHomePage.controller');
const auth = require('../auth/auth');

// Public route - NO authentication required
router.get('/data', publicHomePageController.getPublicHomePageData);

// Protected routes - require SCHOOL, SUPER_ADMIN, or ADMIN authentication
router.patch('/hero-section', auth(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), publicHomePageController.updateHeroSection);
router.patch('/slider', auth(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), publicHomePageController.updateSlider);
router.patch('/statistics', auth(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), publicHomePageController.updateStatistics);
router.patch('/features', auth(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), publicHomePageController.updateFeatures);
router.patch('/announcements', auth(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), publicHomePageController.updateAnnouncements);
router.patch('/header', auth(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), publicHomePageController.updateHeader);
router.patch('/theme', auth(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), publicHomePageController.updateTheme);
router.patch('/programs', auth(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), publicHomePageController.updatePrograms);
router.patch('/campus', auth(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), publicHomePageController.updateCampus);
router.patch('/testimonials', auth(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), publicHomePageController.updateTestimonials);
router.patch('/about', auth(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), publicHomePageController.updateAbout);
router.patch('/social-media', auth(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), publicHomePageController.updateSocialMedia);
router.patch('/achievements', auth(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), publicHomePageController.updateAchievements);
router.patch('/contact', auth(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), publicHomePageController.updateContact);

// File upload (requires SCHOOL, SUPER_ADMIN, or ADMIN authentication)
router.post('/upload', auth(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), publicHomePageController.uploadFile);

module.exports = router;
