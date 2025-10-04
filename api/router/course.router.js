const express = require("express");
const router = express.Router();
const {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    getCourseStats
} = require("../controller/course.controller");

// Create a new course
router.post("/create", createCourse);

// Get all courses for a school
router.get("/school/:schoolId", getCourses);

// Get course statistics for a school
router.get("/stats/:schoolId", getCourseStats);

// Get course by ID
router.get("/:courseId", getCourseById);

// Update course
router.put("/:courseId", updateCourse);

// Delete course (soft delete)
router.delete("/:courseId", deleteCourse);

module.exports = router;