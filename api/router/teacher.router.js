const express = require("express");
const { getTeacherWithQuery, loginTeacher,updateTeacherWithId,getTeacherWithId,signOut,isTeacherLoggedIn,  registerTeacher, deleteTeacherWithId ,getTeacherOwnDetails} = require("../controller/teacher.controller");
const router = express.Router();
const authMiddleware = require("../auth/auth");

router.post('/register',authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), registerTeacher);
router.get("/fetch-with-query",authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN', 'TEACHER']),getTeacherWithQuery);
router.post("/login", loginTeacher);
router.patch("/update/:id", authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), updateTeacherWithId);
router.get("/fetch-own", authMiddleware(['TEACHER']), getTeacherOwnDetails);
router.get("/fetch-single/:id", authMiddleware(['TEACHER', 'SCHOOL', 'SUPER_ADMIN', 'ADMIN']), getTeacherWithId);
router.delete("/delete/:id",authMiddleware(['SCHOOL', 'SUPER_ADMIN']),  deleteTeacherWithId)
// router.get("/sign-out", signOut);
// router.get("/is-login",  isTeacherLoggedIn)

module.exports = router;