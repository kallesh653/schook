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
router.post('/register', authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), registerStudent);
router.get("/fetch-with-query", authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN', 'TEACHER']), getStudentWithQuery);
router.get("/fetch-own", authMiddleware(['STUDENT']), getOwnDetails);
router.get("/fetch-single/:id", authMiddleware(['STUDENT', 'SCHOOL', 'SUPER_ADMIN', 'ADMIN']), getStudentWithId);
router.patch("/update/:id", authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), updateStudentWithId);
router.delete("/delete/:id", authMiddleware(['SCHOOL', 'SUPER_ADMIN']), deleteStudentWithId);

// ===== NEW PROFESSIONAL ROUTES =====
// Get all students with advanced filtering
router.get("/fetch-all", authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN', 'TEACHER']), getAllStudents);

// Get students by specific class
router.get("/fetch-class/:classId", authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN', 'TEACHER']), getStudentsByClass);

// Get student statistics
router.get("/stats", authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), getStudentStats);

// ===== MARKSHEET ROUTES =====
router.get("/marksheets", authMiddleware(['STUDENT']), getStudentOwnMarksheets);

module.exports = router;
