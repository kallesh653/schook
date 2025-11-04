const express = require("express");
const {
    getStudentWithQuery,
    loginStudent,
    updateStudentWithId,
    getStudentWithId,
    signOut,
    isStudentLoggedIn,
    getOwnDetails,
    registerStudent,
    deleteStudentWithId,
    // New endpoints
    getAllStudents,
    getStudentsByClass,
    getStudentStats
} = require("../controller/student.controller");
const { getStudentOwnMarksheets } = require("../controller/marksheet.controller");
const authMiddleware = require("../auth/auth");
const router = express.Router();

// ===== AUTHENTICATION ROUTES =====
router.post("/login", loginStudent);
router.get("/sign-out", signOut);
router.get("/is-login", isStudentLoggedIn);

// ===== STUDENT CRUD ROUTES =====
router.post('/register', authMiddleware(['SCHOOL']), registerStudent);
router.get("/fetch-with-query", authMiddleware(['SCHOOL','TEACHER']), getStudentWithQuery);
router.get("/fetch-own", authMiddleware(['STUDENT']), getOwnDetails);
router.get("/fetch-single/:id", authMiddleware(['STUDENT','SCHOOL']), getStudentWithId);
router.patch("/update/:id", authMiddleware(['SCHOOL']), updateStudentWithId);
router.delete("/delete/:id", authMiddleware(['SCHOOL']), deleteStudentWithId);

// ===== NEW PROFESSIONAL ROUTES =====
// Get all students with advanced filtering
router.get("/fetch-all", authMiddleware(['SCHOOL','TEACHER']), getAllStudents);

// Get students by specific class
router.get("/fetch-class/:classId", authMiddleware(['SCHOOL','TEACHER']), getStudentsByClass);

// Get student statistics
router.get("/stats", authMiddleware(['SCHOOL']), getStudentStats);

// ===== MARKSHEET ROUTES =====
router.get("/marksheets", authMiddleware(['STUDENT']), getStudentOwnMarksheets);

module.exports = router;
