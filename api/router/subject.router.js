const express = require("express");
const router = express.Router();
const authMiddleware = require('../auth/auth');
const { createSubject, getAllSubjects, getSubjectWithId, updateSubjectWithId, deleteSubjectWithId } = require("../controller/subject.controller");

router.post("/create",authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), createSubject);
router.get("/fetch-all",authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN', 'TEACHER']),getAllSubjects);
router.get("/fetch-single/:id",authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN', 'TEACHER']),  getSubjectWithId);
router.patch("/update/:id",authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), updateSubjectWithId);
router.delete("/delete/:id",authMiddleware(['SCHOOL', 'SUPER_ADMIN']), deleteSubjectWithId);

module.exports = router;