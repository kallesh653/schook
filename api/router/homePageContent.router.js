const express = require("express");
const router = express.Router();
const {
  getHomePageContent,
  createOrUpdateHomePageContent,
  updateHeader,
  addSlider,
  updateSlider,
  deleteSlider,
  updateStatistics,
  updateAbout,
  updateExploreCampus,
  addNews,
  updateNews,
  deleteNews,
  addVideo,
  updateVideo,
  deleteVideo,
  addGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  addProgram,
  updateProgram,
  deleteProgram,
  updateWhyChooseUs,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
  updateSectionVisibility,
  updateSEO,
  uploadFile
} = require("../controller/homePageContent.controller");

// Get home page content
router.get("/:schoolId", getHomePageContent);

// Create or update entire content
router.post("/:schoolId", createOrUpdateHomePageContent);
router.put("/:schoolId", createOrUpdateHomePageContent);

// Header
router.put("/:schoolId/header", updateHeader);

// Sliders
router.post("/:schoolId/sliders", addSlider);
router.put("/:schoolId/sliders/:sliderId", updateSlider);
router.delete("/:schoolId/sliders/:sliderId", deleteSlider);

// Statistics
router.put("/:schoolId/statistics", updateStatistics);

// About
router.put("/:schoolId/about", updateAbout);

// Explore Campus
router.put("/:schoolId/explore-campus", updateExploreCampus);

// News
router.post("/:schoolId/news", addNews);
router.put("/:schoolId/news/:newsId", updateNews);
router.delete("/:schoolId/news/:newsId", deleteNews);

// Videos
router.post("/:schoolId/videos", addVideo);
router.put("/:schoolId/videos/:videoId", updateVideo);
router.delete("/:schoolId/videos/:videoId", deleteVideo);

// Gallery
router.post("/:schoolId/gallery", addGalleryImage);
router.put("/:schoolId/gallery/:imageId", updateGalleryImage);
router.delete("/:schoolId/gallery/:imageId", deleteGalleryImage);

// Programs
router.post("/:schoolId/programs", addProgram);
router.put("/:schoolId/programs/:programId", updateProgram);
router.delete("/:schoolId/programs/:programId", deleteProgram);

// Why Choose Us
router.put("/:schoolId/why-choose-us", updateWhyChooseUs);

// Testimonials
router.post("/:schoolId/testimonials", addTestimonial);
router.put("/:schoolId/testimonials/:testimonialId", updateTestimonial);
router.delete("/:schoolId/testimonials/:testimonialId", deleteTestimonial);

// Section Visibility
router.put("/:schoolId/section-visibility", updateSectionVisibility);

// SEO
router.put("/:schoolId/seo", updateSEO);

// File upload
router.post("/:schoolId/upload", uploadFile);

module.exports = router;
