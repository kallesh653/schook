const express = require('express');
const router = express.Router();
const academicYearController = require('../controller/academicYear.controller');
const authMiddleware = require('../auth/auth');

// Academic Year routes - Only SCHOOL role can manage
router.post('/', authMiddleware(['SCHOOL']), academicYearController.createAcademicYear);
router.get('/', authMiddleware(['SCHOOL', 'TEACHER']), academicYearController.getAllAcademicYears);
router.get('/current', authMiddleware(['SCHOOL', 'TEACHER', 'STUDENT']), academicYearController.getCurrentAcademicYear);
router.get('/stats/:year', authMiddleware(['SCHOOL']), academicYearController.getAcademicYearStats);
router.get('/:id', authMiddleware(['SCHOOL', 'TEACHER']), academicYearController.getAcademicYearById);
router.put('/:id', authMiddleware(['SCHOOL']), academicYearController.updateAcademicYear);
router.put('/:id/set-current', authMiddleware(['SCHOOL']), academicYearController.setCurrentAcademicYear);
router.delete('/:id', authMiddleware(['SCHOOL']), academicYearController.deleteAcademicYear);

// Student promotion route
router.post('/promote-students', authMiddleware(['SCHOOL']), academicYearController.promoteStudents);

module.exports = router;
