// routes/notices.js
const express = require("express");
const router = express.Router();
const authMiddleware = require('../auth/auth');
const { newNotice, fetchAllAudiance, fetchAudiance, deleteNotice, editNotice } = require("../controller/notice.controller");

router.post("/add", authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), newNotice);
router.get("/fetch/all",authMiddleware(['SCHOOL','TEACHER','STUDENT', 'SUPER_ADMIN', 'ADMIN']), fetchAllAudiance)
router.get("/fetch/:audience",authMiddleware(['SCHOOL','TEACHER','STUDENT', 'SUPER_ADMIN', 'ADMIN']),fetchAudiance);
router.put("/:id",authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']),editNotice)
router.delete("/:id",authMiddleware(['SCHOOL', 'SUPER_ADMIN']),deleteNotice)
  
module.exports = router;
