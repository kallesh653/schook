const express = require("express");
const router = express.Router();
const authMiddleware = require('../auth/auth')
const { createClass, getAllClass, getClassWithId, updateClassWithId, deleteClassWithId, createSubTeacher, updateSubTeacher, deleteSubTeacherWithId, getAttendeeTeacher } = require("../controller/class.controller");


router.post("/create",authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), createClass);
router.get("/fetch-all",authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN', 'TEACHER']),getAllClass);
router.get("/fetch-single/:id",  getClassWithId);
router.patch("/update/:id", authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), updateClassWithId);
router.delete("/delete/:id",authMiddleware(['SCHOOL', 'SUPER_ADMIN']), deleteClassWithId);
// router.post("/sub-teach/new/:id",createSubTeacher );
// router.post("/sub-teach/update/:classId/:subTeachId",updateSubTeacher );
// router.delete("/sub-teach/delete/:classId/:subTeachId",deleteSubTeacherWithId );
router.get("/attendee",authMiddleware(['TEACHER', 'SUPER_ADMIN', 'ADMIN']), getAttendeeTeacher);

module.exports = router;