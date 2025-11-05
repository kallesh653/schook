const express = require('express');
const router = express.Router();
const academicYearController = require('../controller/academicYear.controller');
const authMiddleware = require('../auth/auth');

// Academic Year routes - Only SCHOOL role can manage
router.post('/', authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), academicYearController.createAcademicYear);
router.get('/', authMiddleware(['SCHOOL', 'TEACHER', 'SUPER_ADMIN', 'ADMIN']), academicYearController.getAllAcademicYears);
router.get('/current', authMiddleware(['SCHOOL', 'TEACHER', 'STUDENT']), academicYearController.getCurrentAcademicYear);
router.get('/stats/:year', authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), academicYearController.getAcademicYearStats);
router.get('/:id', authMiddleware(['SCHOOL', 'TEACHER', 'SUPER_ADMIN', 'ADMIN']), academicYearController.getAcademicYearById);
router.put('/:id', authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), academicYearController.updateAcademicYear);
router.put('/:id/set-current', authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), academicYearController.setCurrentAcademicYear);
router.delete('/:id', authMiddleware(['SCHOOL', 'SUPER_ADMIN']), academicYearController.deleteAcademicYear);

// Student promotion route
router.post('/promote-students', authMiddleware(['SCHOOL', 'SUPER_ADMIN', 'ADMIN']), academicYearController.promoteStudents);

module.exports = router;
