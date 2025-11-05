const AcademicYear = require('../model/academicYear.model');
const Student = require('../model/student.model');
const Class = require('../model/class.model');

// Create a new academic year
const createAcademicYear = async (req, res) => {
    try {
        const schoolId = req.user.schoolId || req.user.id;
        const { year, startDate, endDate, isCurrent, description, terms } = req.body;

        // Check if academic year already exists
        const existingYear = await AcademicYear.findOne({ school: schoolId, year });
        if (existingYear) {
            return res.status(400).json({
                success: false,
                message: 'Academic year already exists'
            });
        }

        // Validate dates
        if (new Date(startDate) >= new Date(endDate)) {
            return res.status(400).json({
                success: false,
                message: 'Start date must be before end date'
            });
        }

        const academicYear = new AcademicYear({
            year,
            startDate,
            endDate,
            isCurrent: isCurrent || false,
            description,
            terms: terms || [],
            school: schoolId,
            createdBy: req.user.id
        });

        // Update status based on dates
        academicYear.updateStatus();

        await academicYear.save();

        res.status(201).json({
            success: true,
            message: 'Academic year created successfully',
            data: academicYear
        });
    } catch (error) {
        console.error('Error creating academic year:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating academic year',
            error: error.message
        });
    }
};

// Get all academic years for a school
const getAllAcademicYears = async (req, res) => {
    try {
        const schoolId = req.user.schoolId || req.user.id;

        const academicYears = await AcademicYear.find({ school: schoolId })
            .sort({ startDate: -1 });

        // Update status for all years
        for (let year of academicYears) {
            year.updateStatus();
            await year.save();
        }

        res.json({
            success: true,
            data: academicYears
        });
    } catch (error) {
        console.error('Error fetching academic years:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching academic years',
            error: error.message
        });
    }
};

// Get current academic year
const getCurrentAcademicYear = async (req, res) => {
    try {
        const schoolId = req.user.schoolId || req.user.id;

        let currentYear = await AcademicYear.findOne({ school: schoolId, isCurrent: true });

        if (!currentYear) {
            // If no current year, find the active one
            currentYear = await AcademicYear.findOne({ school: schoolId, status: 'active' });
        }

        if (!currentYear) {
            return res.status(404).json({
                success: false,
                message: 'No current academic year found'
            });
        }

        res.json({
            success: true,
            data: currentYear
        });
    } catch (error) {
        console.error('Error fetching current academic year:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching current academic year',
            error: error.message
        });
    }
};

// Get academic year by ID
const getAcademicYearById = async (req, res) => {
    try {
        const { id } = req.params;
        const schoolId = req.user.schoolId || req.user.id;

        const academicYear = await AcademicYear.findOne({ _id: id, school: schoolId });

        if (!academicYear) {
            return res.status(404).json({
                success: false,
                message: 'Academic year not found'
            });
        }

        res.json({
            success: true,
            data: academicYear
        });
    } catch (error) {
        console.error('Error fetching academic year:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching academic year',
            error: error.message
        });
    }
};

// Update academic year
const updateAcademicYear = async (req, res) => {
    try {
        const { id } = req.params;
        const schoolId = req.user.schoolId || req.user.id;

        const academicYear = await AcademicYear.findOne({ _id: id, school: schoolId });

        if (!academicYear) {
            return res.status(404).json({
                success: false,
                message: 'Academic year not found'
            });
        }

        // Update fields
        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== undefined) {
                academicYear[key] = req.body[key];
            }
        });

        // Update status
        academicYear.updateStatus();

        await academicYear.save();

        res.json({
            success: true,
            message: 'Academic year updated successfully',
            data: academicYear
        });
    } catch (error) {
        console.error('Error updating academic year:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating academic year',
            error: error.message
        });
    }
};

// Set current academic year
const setCurrentAcademicYear = async (req, res) => {
    try {
        const { id } = req.params;
        const schoolId = req.user.schoolId || req.user.id;

        const academicYear = await AcademicYear.findOne({ _id: id, school: schoolId });

        if (!academicYear) {
            return res.status(404).json({
                success: false,
                message: 'Academic year not found'
            });
        }

        // Set this as current and unset others
        await AcademicYear.updateMany(
            { school: schoolId },
            { $set: { isCurrent: false } }
        );

        academicYear.isCurrent = true;
        await academicYear.save();

        res.json({
            success: true,
            message: 'Current academic year set successfully',
            data: academicYear
        });
    } catch (error) {
        console.error('Error setting current academic year:', error);
        res.status(500).json({
            success: false,
            message: 'Error setting current academic year',
            error: error.message
        });
    }
};

// Delete academic year
const deleteAcademicYear = async (req, res) => {
    try {
        const { id } = req.params;
        const schoolId = req.user.schoolId || req.user.id;

        const academicYear = await AcademicYear.findOne({ _id: id, school: schoolId });

        if (!academicYear) {
            return res.status(404).json({
                success: false,
                message: 'Academic year not found'
            });
        }

        // Check if there are students associated with this academic year
        const studentsCount = await Student.countDocuments({
            school: schoolId,
            academic_year: academicYear.year
        });

        if (studentsCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete academic year. ${studentsCount} student(s) are associated with this year.`
            });
        }

        await AcademicYear.findByIdAndDelete(id);

        res.json({
            success: true,
            message: 'Academic year deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting academic year:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting academic year',
            error: error.message
        });
    }
};

// Promote students to next academic year and class
const promoteStudents = async (req, res) => {
    try {
        const schoolId = req.user.schoolId || req.user.id;
        const {
            studentIds,
            fromAcademicYear,
            toAcademicYear,
            classPromotions // Array of { fromClassId, toClassId }
        } = req.body;

        if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Student IDs are required'
            });
        }

        if (!fromAcademicYear || !toAcademicYear) {
            return res.status(400).json({
                success: false,
                message: 'From and To academic years are required'
            });
        }

        // Verify academic years exist
        const fromYear = await AcademicYear.findOne({ school: schoolId, year: fromAcademicYear });
        const toYear = await AcademicYear.findOne({ school: schoolId, year: toAcademicYear });

        if (!fromYear || !toYear) {
            return res.status(404).json({
                success: false,
                message: 'Academic year not found'
            });
        }

        // Create promotion map for classes
        const classPromotionMap = {};
        if (classPromotions && Array.isArray(classPromotions)) {
            classPromotions.forEach(promo => {
                classPromotionMap[promo.fromClassId] = promo.toClassId;
            });
        }

        const promotedStudents = [];
        const failedPromotions = [];

        // Promote each student
        for (const studentId of studentIds) {
            try {
                const student = await Student.findOne({ _id: studentId, school: schoolId });

                if (!student) {
                    failedPromotions.push({ studentId, reason: 'Student not found' });
                    continue;
                }

                const updates = {
                    academic_year: toAcademicYear
                };

                // If class promotion mapping exists for student's current class
                if (student.student_class && classPromotionMap[student.student_class.toString()]) {
                    updates.student_class = classPromotionMap[student.student_class.toString()];
                }

                await Student.findByIdAndUpdate(studentId, { $set: updates });
                promotedStudents.push({ studentId, name: student.name });
            } catch (err) {
                failedPromotions.push({ studentId, reason: err.message });
            }
        }

        res.json({
            success: true,
            message: `Successfully promoted ${promotedStudents.length} student(s)`,
            data: {
                promoted: promotedStudents,
                failed: failedPromotions,
                fromYear: fromAcademicYear,
                toYear: toAcademicYear
            }
        });
    } catch (error) {
        console.error('Error promoting students:', error);
        res.status(500).json({
            success: false,
            message: 'Error promoting students',
            error: error.message
        });
    }
};

// Get statistics for an academic year
const getAcademicYearStats = async (req, res) => {
    try {
        const { year } = req.params;
        const schoolId = req.user.schoolId || req.user.id;

        const academicYear = await AcademicYear.findOne({ school: schoolId, year });

        if (!academicYear) {
            return res.status(404).json({
                success: false,
                message: 'Academic year not found'
            });
        }

        // Get student count for this academic year
        const totalStudents = await Student.countDocuments({
            school: schoolId,
            academic_year: year,
            status: 'Active'
        });

        // Get class-wise distribution
        const classDistribution = await Student.aggregate([
            {
                $match: {
                    school: mongoose.Types.ObjectId(schoolId),
                    academic_year: year,
                    status: 'Active'
                }
            },
            {
                $lookup: {
                    from: 'classes',
                    localField: 'student_class',
                    foreignField: '_id',
                    as: 'classInfo'
                }
            },
            { $unwind: '$classInfo' },
            {
                $group: {
                    _id: '$student_class',
                    className: { $first: '$classInfo.class_text' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        res.json({
            success: true,
            data: {
                academicYear,
                totalStudents,
                classDistribution
            }
        });
    } catch (error) {
        console.error('Error fetching academic year stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching academic year statistics',
            error: error.message
        });
    }
};

module.exports = {
    createAcademicYear,
    getAllAcademicYears,
    getCurrentAcademicYear,
    getAcademicYearById,
    updateAcademicYear,
    setCurrentAcademicYear,
    deleteAcademicYear,
    promoteStudents,
    getAcademicYearStats
};
