const Marksheet = require('../model/marksheet.model');

// Create a new marksheet
const createMarksheet = async (req, res) => {
    try {
        console.log('Creating marksheet:', req.body);
        console.log('User info:', req.user);

        // Validate required fields
        const { student_name, class: studentClass, section, roll_number, examination, academic_year, subjects } = req.body;

        if (!student_name || !studentClass || !section || !roll_number || !examination || !academic_year) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: student_name, class, section, roll_number, examination, academic_year'
            });
        }

        if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one subject is required'
            });
        }

        // Validate subjects
        for (const subject of subjects) {
            if (!subject.name || subject.marks === undefined || subject.marks === null) {
                return res.status(400).json({
                    success: false,
                    message: 'Each subject must have a name and marks'
                });
            }
        }

        const marksheetData = {
            ...req.body,
            school: req.user?.schoolId || req.user?.id,
            created_by: req.user?.id || req.user?.userId || 'system'
        };

        console.log('Processed marksheet data:', marksheetData);

        const marksheet = new Marksheet(marksheetData);
        const savedMarksheet = await marksheet.save();

        console.log('Saved marksheet:', savedMarksheet);

        res.status(201).json({
            success: true,
            message: 'Marksheet created successfully',
            data: savedMarksheet
        });
    } catch (error) {
        console.error('Error creating marksheet:', error);
        console.error('Error name:', error.name);
        console.error('Error stack:', error.stack);

        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                error: validationErrors.join(', ')
            });
        }

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Duplicate entry error',
                error: 'A marksheet with this combination already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error while creating marksheet',
            error: error.message
        });
    }
};

// Get all marksheets
const getAllMarksheets = async (req, res) => {
    try {
        console.log('=== GET ALL MARKSHEETS ===');
        console.log('Query params:', req.query);
        console.log('User:', req.user);

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get school ID from authenticated user
        const schoolId = req.user?.schoolId || req.user?.id;

        const filter = {
            $or: [
                { school: schoolId },
                { school: { $exists: false } } // For backward compatibility with old marksheets
            ]
        };

        // Add filters
        if (req.query.class) filter.class = req.query.class;
        if (req.query.section) filter.section = req.query.section;
        if (req.query.examination) filter.examination = req.query.examination;
        if (req.query.academic_year) filter.academic_year = req.query.academic_year;
        if (req.query.result) filter.result = req.query.result;
        if (req.query.student_name) {
            filter.student_name = { $regex: req.query.student_name, $options: 'i' };
        }

        console.log('Filter:', JSON.stringify(filter, null, 2));

        const marksheets = await Marksheet.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('student_id', 'student_name class section roll_number');

        const total = await Marksheet.countDocuments(filter);

        console.log(`✅ Found ${marksheets.length} marksheets (Total: ${total})`);

        res.json({
            success: true,
            data: marksheets,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error('❌ Error fetching marksheets:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching marksheets',
            error: error.message
        });
    }
};

// Get marksheet by ID
const getMarksheetById = async (req, res) => {
    try {
        const marksheet = await Marksheet.findById(req.params.id)
            .populate('student_id', 'student_name class section roll_number');

        if (!marksheet) {
            return res.status(404).json({
                success: false,
                message: 'Marksheet not found'
            });
        }

        res.json({
            success: true,
            data: marksheet
        });
    } catch (error) {
        console.error('Error fetching marksheet:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching marksheet',
            error: error.message
        });
    }
};

// Update marksheet
const updateMarksheet = async (req, res) => {
    try {
        const marksheetData = {
            ...req.body,
            updated_by: req.user?.id
        };

        const marksheet = await Marksheet.findByIdAndUpdate(
            req.params.id,
            marksheetData,
            { new: true, runValidators: true }
        );

        if (!marksheet) {
            return res.status(404).json({
                success: false,
                message: 'Marksheet not found'
            });
        }

        res.json({
            success: true,
            message: 'Marksheet updated successfully',
            data: marksheet
        });
    } catch (error) {
        console.error('Error updating marksheet:', error);
        res.status(400).json({
            success: false,
            message: 'Error updating marksheet',
            error: error.message
        });
    }
};

// Delete marksheet
const deleteMarksheet = async (req, res) => {
    try {
        const marksheet = await Marksheet.findByIdAndDelete(req.params.id);

        if (!marksheet) {
            return res.status(404).json({
                success: false,
                message: 'Marksheet not found'
            });
        }

        res.json({
            success: true,
            message: 'Marksheet deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting marksheet:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting marksheet',
            error: error.message
        });
    }
};

// Get marksheet PDF
const getMarksheetPDF = async (req, res) => {
    try {
        const marksheet = await Marksheet.findById(req.params.id);

        if (!marksheet) {
            return res.status(404).json({
                success: false,
                message: 'Marksheet not found'
            });
        }

        // Generate HTML content for PDF
        const htmlContent = generateMarksheetHTML(marksheet);

        res.json({
            success: true,
            data: {
                htmlContent,
                filename: `Marksheet_${marksheet.student_name}_${marksheet.examination}_${marksheet.academic_year}.pdf`
            }
        });
    } catch (error) {
        console.error('Error generating marksheet PDF:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating marksheet PDF',
            error: error.message
        });
    }
};

// Generate HTML content for marksheet
const generateMarksheetHTML = (marksheet) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Mark Sheet - ${marksheet.student_name}</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    margin: 20px;
                    color: #333;
                    line-height: 1.4;
                }
                .header {
                    text-align: center;
                    border-bottom: 3px solid #2196F3;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                .school-name {
                    font-size: 28px;
                    font-weight: bold;
                    color: #1976d2;
                    margin-bottom: 5px;
                }
                .school-address {
                    font-size: 14px;
                    color: #666;
                    margin-bottom: 15px;
                }
                .marksheet-title {
                    font-size: 24px;
                    font-weight: bold;
                    color: #333;
                    text-decoration: underline;
                }
                .student-info {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin-bottom: 30px;
                    border: 2px solid #e0e0e0;
                    padding: 20px;
                    border-radius: 8px;
                }
                .info-group {
                    margin-bottom: 10px;
                }
                .label {
                    font-weight: bold;
                    color: #1976d2;
                    display: inline-block;
                    width: 140px;
                }
                .marks-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 30px;
                    border: 2px solid #2196F3;
                }
                .marks-table th {
                    background: linear-gradient(135deg, #2196F3, #1976d2);
                    color: white;
                    padding: 12px;
                    text-align: center;
                    font-weight: bold;
                }
                .marks-table td {
                    padding: 10px;
                    text-align: center;
                    border: 1px solid #ddd;
                }
                .marks-table tr:nth-child(even) {
                    background-color: #f8f9fa;
                }
                .marks-table tr:hover {
                    background-color: #e3f2fd;
                }
                .total-row {
                    background-color: #e3f2fd !important;
                    font-weight: bold;
                }
                .result-section {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 20px;
                    margin-bottom: 30px;
                    border: 2px solid #4caf50;
                    padding: 20px;
                    border-radius: 8px;
                    background: linear-gradient(135deg, #e8f5e8, #f1f8e9);
                }
                .result-item {
                    text-align: center;
                }
                .result-value {
                    font-size: 24px;
                    font-weight: bold;
                    color: #2e7d32;
                }
                .result-label {
                    font-size: 14px;
                    color: #666;
                    margin-top: 5px;
                }
                .signatures {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 50px;
                    margin-top: 50px;
                    margin-bottom: 30px;
                }
                .signature-box {
                    text-align: center;
                    border-top: 2px solid #333;
                    padding-top: 10px;
                }
                .signature-title {
                    font-weight: bold;
                    color: #1976d2;
                }
                .pass {
                    color: #4caf50;
                    font-weight: bold;
                }
                .fail {
                    color: #f44336;
                    font-weight: bold;
                }
                .grade-a {
                    color: #4caf50;
                    font-weight: bold;
                }
                .grade-b {
                    color: #2196f3;
                    font-weight: bold;
                }
                .grade-c {
                    color: #ff9800;
                    font-weight: bold;
                }
                .grade-d {
                    color: #f44336;
                    font-weight: bold;
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #ddd;
                    font-size: 12px;
                    color: #666;
                }
                .remarks {
                    margin: 20px 0;
                    padding: 15px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    background-color: #fafafa;
                }
                @media print {
                    body {
                        margin: 0;
                        font-size: 12px;
                    }
                    .header {
                        break-inside: avoid;
                    }
                    .marks-table {
                        break-inside: avoid;
                    }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="school-name">${marksheet.school_name || 'School Name'}</div>
                <div class="school-address">${marksheet.school_address || 'School Address'}</div>
                <div class="marksheet-title">MARK SHEET</div>
            </div>

            <div class="student-info">
                <div>
                    <div class="info-group">
                        <span class="label">Student Name:</span>
                        <span>${marksheet.student_name}</span>
                    </div>
                    <div class="info-group">
                        <span class="label">Class:</span>
                        <span>${marksheet.class}</span>
                    </div>
                    <div class="info-group">
                        <span class="label">Section:</span>
                        <span>${marksheet.section}</span>
                    </div>
                    <div class="info-group">
                        <span class="label">Roll Number:</span>
                        <span>${marksheet.roll_number}</span>
                    </div>
                </div>
                <div>
                    <div class="info-group">
                        <span class="label">Examination:</span>
                        <span>${marksheet.examination}</span>
                    </div>
                    <div class="info-group">
                        <span class="label">Academic Year:</span>
                        <span>${marksheet.academic_year}</span>
                    </div>
                    <div class="info-group">
                        <span class="label">Issue Date:</span>
                        <span>${new Date(marksheet.issue_date).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            <table class="marks-table">
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Max Marks</th>
                        <th>Marks Obtained</th>
                        <th>Percentage</th>
                        <th>Grade</th>
                        <th>Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    ${marksheet.subjects.map(subject => `
                        <tr>
                            <td style="text-align: left;">${subject.name}</td>
                            <td>${subject.max_marks}</td>
                            <td>${subject.marks}</td>
                            <td>${subject.percentage || ((subject.marks / subject.max_marks) * 100).toFixed(1)}%</td>
                            <td class="grade-${subject.grade?.toLowerCase()}">${subject.grade}</td>
                            <td style="text-align: left;">${subject.remarks || '-'}</td>
                        </tr>
                    `).join('')}
                    <tr class="total-row">
                        <td style="text-align: left;"><strong>TOTAL</strong></td>
                        <td><strong>${marksheet.total_max_marks || marksheet.subjects.reduce((sum, s) => sum + s.max_marks, 0)}</strong></td>
                        <td><strong>${marksheet.total_marks}</strong></td>
                        <td><strong>${marksheet.percentage}%</strong></td>
                        <td class="grade-${marksheet.overall_grade?.toLowerCase()}"><strong>${marksheet.overall_grade}</strong></td>
                        <td><strong class="${marksheet.result.toLowerCase()}">${marksheet.result}</strong></td>
                    </tr>
                </tbody>
            </table>

            <div class="result-section">
                <div class="result-item">
                    <div class="result-value">${marksheet.total_marks}/${marksheet.total_max_marks || marksheet.subjects.reduce((sum, s) => sum + s.max_marks, 0)}</div>
                    <div class="result-label">Total Marks</div>
                </div>
                <div class="result-item">
                    <div class="result-value">${marksheet.percentage}%</div>
                    <div class="result-label">Percentage</div>
                </div>
                <div class="result-item">
                    <div class="result-value class="${marksheet.result.toLowerCase()}">${marksheet.result}</div>
                    <div class="result-label">Result</div>
                </div>
            </div>

            ${marksheet.remarks ? `
                <div class="remarks">
                    <strong>Remarks:</strong> ${marksheet.remarks}
                </div>
            ` : ''}

            <div class="signatures">
                <div class="signature-box">
                    <div style="height: 50px;"></div>
                    <div class="signature-title">Class Teacher</div>
                    <div>${marksheet.teacher_name || 'Teacher Name'}</div>
                </div>
                <div class="signature-box">
                    <div style="height: 50px;"></div>
                    <div class="signature-title">Principal</div>
                    <div>${marksheet.principal_name || 'Principal Name'}</div>
                </div>
            </div>

            <div class="footer">
                <p>This is a computer-generated mark sheet. No signature is required.</p>
                <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            </div>
        </body>
        </html>
    `;
};

// Get class performance statistics
const getClassPerformance = async (req, res) => {
    try {
        const { class: className, section, examination, academic_year } = req.query;

        if (!className || !examination || !academic_year) {
            return res.status(400).json({
                success: false,
                message: 'Class, examination, and academic year are required'
            });
        }

        const performance = await Marksheet.getClassPerformance(className, section, examination, academic_year);

        res.json({
            success: true,
            data: performance[0] || {
                totalStudents: 0,
                passCount: 0,
                failCount: 0,
                averagePercentage: 0,
                highestPercentage: 0,
                lowestPercentage: 0,
                gradeDistribution: []
            }
        });
    } catch (error) {
        console.error('Error fetching class performance:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching class performance',
            error: error.message
        });
    }
};

// Get student academic history
const getStudentHistory = async (req, res) => {
    try {
        const { studentId } = req.params;

        const history = await Marksheet.getStudentHistory(studentId);

        res.json({
            success: true,
            data: history
        });
    } catch (error) {
        console.error('Error fetching student history:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching student history',
            error: error.message
        });
    }
};

// Get student's own marksheets (for student role)
const getStudentOwnMarksheets = async (req, res) => {
    try {
        const studentId = req.user.id; // Get student ID from JWT token

        // First, get student details to get the student name
        const Student = require('../model/student.model');
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Find marksheets by student name (since marksheet model uses student_name, not student_id)
        const marksheets = await Marksheet.find({
            student_name: student.name
        }).sort({ academic_year: -1, issue_date: -1 });

        // Transform the data to match frontend expectations
        const transformedData = marksheets.map(marksheet => ({
            _id: marksheet._id,
            examination: marksheet.examination,
            academic_year: marksheet.academic_year,
            subjects: marksheet.subjects.map(subject => ({
                subject: subject.name,
                marks: subject.marks,
                totalMarks: subject.max_marks,
                percentage: subject.percentage || Math.round((subject.marks / subject.max_marks) * 100),
                grade: subject.grade,
                examType: marksheet.examination // Use examination type as exam type for each subject
            })),
            total_marks: marksheet.total_marks,
            total_max_marks: marksheet.total_max_marks,
            percentage: marksheet.percentage,
            overall_grade: marksheet.overall_grade,
            result: marksheet.result,
            issue_date: marksheet.issue_date,
            class: marksheet.class,
            section: marksheet.section,
            roll_number: marksheet.roll_number
        }));

        res.json({
            success: true,
            data: transformedData
        });
    } catch (error) {
        console.error('Error fetching student marksheets:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching student marksheets',
            error: error.message
        });
    }
};

// Get marksheet statistics
const getMarksheetStats = async (req, res) => {
    try {
        const totalMarksheets = await Marksheet.countDocuments();
        const passCount = await Marksheet.countDocuments({ result: 'Pass' });
        const failCount = await Marksheet.countDocuments({ result: 'Fail' });

        const averageStats = await Marksheet.aggregate([
            {
                $group: {
                    _id: null,
                    averagePercentage: { $avg: '$percentage' },
                    highestPercentage: { $max: '$percentage' },
                    lowestPercentage: { $min: '$percentage' }
                }
            }
        ]);

        const gradeDistribution = await Marksheet.aggregate([
            {
                $group: {
                    _id: '$overall_grade',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id': 1 }
            }
        ]);

        const examinationStats = await Marksheet.aggregate([
            {
                $group: {
                    _id: '$examination',
                    count: { $sum: 1 },
                    averagePercentage: { $avg: '$percentage' }
                }
            },
            {
                $sort: { 'count': -1 }
            }
        ]);

        res.json({
            success: true,
            data: {
                totalMarksheets,
                passCount,
                failCount,
                passPercentage: totalMarksheets > 0 ? ((passCount / totalMarksheets) * 100).toFixed(2) : 0,
                averagePercentage: averageStats[0]?.averagePercentage?.toFixed(2) || 0,
                highestPercentage: averageStats[0]?.highestPercentage || 0,
                lowestPercentage: averageStats[0]?.lowestPercentage || 0,
                gradeDistribution,
                examinationStats
            }
        });
    } catch (error) {
        console.error('Error fetching marksheet statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching marksheet statistics',
            error: error.message
        });
    }
};

module.exports = {
    createMarksheet,
    getAllMarksheets,
    getMarksheetById,
    updateMarksheet,
    deleteMarksheet,
    getMarksheetPDF,
    getClassPerformance,
    getStudentHistory,
    getStudentOwnMarksheets,
    getMarksheetStats
};