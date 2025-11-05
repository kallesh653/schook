const express = require("express");
const router = express.Router();
const authMiddleware = require('../auth/auth');
const { newExamination,  getExaminationByClass, updateExaminaitonWithId, deleteExaminationById, getExaminationById, getAllExaminations} = require("../controller/examination.controller");


router.post("/new", authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']),newExamination);
router.get("/all", authMiddleware(['SCHOOL','TEACHER', 'SUPER_ADMIN', 'ADMIN']), getAllExaminations);
router.get("/fetch-class/:classId",authMiddleware(['SCHOOL','STUDENT','TEACHER', 'SUPER_ADMIN', 'ADMIN']),  getExaminationByClass);
router.get('/single/:id',authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), getExaminationById );
router.patch("/update/:id",authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), updateExaminaitonWithId);
router.delete("/delete/:id",authMiddleware(['SCHOOL', 'SUPER_ADMIN']),  deleteExaminationById);

module.exports = router;