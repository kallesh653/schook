const express = require("express");
const router = express.Router();
const authMiddleware = require("../auth/auth");
const {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    getCourseStats
} = require("../controller/course.controller");

// Create a new course (School admin only)
router.post("/create", authMiddleware(['SCHOOL']), createCourse);

// Get all courses for a school
router.get("/school/:schoolId", getCourses);

// Get course statistics for a school
router.get("/stats/:schoolId", getCourseStats);

// Get course by ID
router.get("/:courseId", getCourseById);

// Update course (School admin only)
router.put("/:courseId", authMiddleware(['SCHOOL']), updateCourse);

// Delete course (School admin only)
router.delete("/:courseId", authMiddleware(['SCHOOL']), deleteCourse);

module.exports = router;