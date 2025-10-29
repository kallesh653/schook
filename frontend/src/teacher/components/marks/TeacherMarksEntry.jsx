import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Snackbar,
    Alert,
    Autocomplete,
    Chip,
    IconButton,
    Divider
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
    Add as AddIcon,
    Save as SaveIcon,
    School as SchoolIcon,
    Assignment as AssignmentIcon,
    Calculate as CalculateIcon,
    Person as PersonIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon
} from '@mui/icons-material';
import axios from 'axios';
import { baseUrl } from '../../../environment';

// Animation keyframes
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
    },
    animation: `${fadeInUp} 0.6s ease-out`
}));

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: '12px',
    textTransform: 'none',
    fontWeight: 600,
    padding: theme.spacing(1.5, 3),
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
        background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
    },
}));

const HeaderSection = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '20px',
    padding: theme.spacing(4),
    marginBottom: theme.spacing(4),
    color: 'white',
}));

const GradeChip = styled(Chip)(({ grade }) => {
    const getColor = (g) => {
        if (g === 'A+' || g === 'A') return { bg: '#4caf50', text: 'white' };
        if (g === 'B+' || g === 'B') return { bg: '#2196f3', text: 'white' };
        if (g === 'C+' || g === 'C') return { bg: '#ff9800', text: 'white' };
        if (g === 'D') return { bg: '#ff5722', text: 'white' };
        return { bg: '#f44336', text: 'white' };
    };
    const colors = getColor(grade);
    return {
        background: colors.bg,
        color: colors.text,
        fontWeight: 'bold'
    };
});

const TeacherMarksEntry = () => {
    const [markSheets, setMarkSheets] = useState([]);
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const [formData, setFormData] = useState({
        student_id: '',
        student_name: '',
        class: '',
        section: '',
        roll_number: '',
        examination: '',
        academic_year: new Date().getFullYear().toString(),
        subjects: [],
        total_marks: 0,
        total_max_marks: 0,
        percentage: 0,
        overall_grade: '',
        result: 'Pass',
        teacher_name: '',
        school_name: '',
        issue_date: new Date().toISOString().split('T')[0],
        remarks: ''
    });

    // Grade calculation function
    const calculateGrade = (percentage) => {
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B+';
        if (percentage >= 60) return 'B';
        if (percentage >= 50) return 'C+';
        if (percentage >= 40) return 'C';
        if (percentage >= 33) return 'D';
        return 'F';
    };

    // Calculate marks and grades
    const calculateMarksAndGrades = (subjects) => {
        let totalMarks = 0;
        let totalMaxMarks = 0;
        const updatedSubjects = subjects.map(subject => {
            const marks = parseFloat(subject.marks) || 0;
            const maxMarks = parseFloat(subject.max_marks) || 100;
            const percentage = maxMarks > 0 ? (marks / maxMarks) * 100 : 0;
            const grade = calculateGrade(percentage);

            totalMarks += marks;
            totalMaxMarks += maxMarks;

            return {
                ...subject,
                grade,
                percentage: percentage.toFixed(2)
            };
        });

        const overallPercentage = totalMaxMarks > 0 ? (totalMarks / totalMaxMarks) * 100 : 0;
        const overallGrade = calculateGrade(overallPercentage);
        const result = overallPercentage >= 33 ? 'Pass' : 'Fail';

        return {
            subjects: updatedSubjects,
            totalMarks,
            totalMaxMarks,
            percentage: overallPercentage.toFixed(2),
            overallGrade,
            result
        };
    };

    // Fetch students
    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await axios.get(`${baseUrl}/student-records`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const studentRecords = response.data.data || [];
            const transformedStudents = studentRecords.map(record => ({
                id: record._id,
                name: record.student_name,
                class: record.class,
                section: record.section,
                roll_number: record.roll_number
            }));
            setStudents(transformedStudents);
        } catch (error) {
            console.error('Error fetching students:', error);
            showSnackbar('Error fetching students', 'error');
        }
    };

    // Fetch subjects from class
    const fetchSubjects = async (studentId) => {
        try {
            // Get student's class first
            const student = students.find(s => s.id === studentId);
            if (!student) return;

            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await axios.get(`${baseUrl}/subject/fetch-all`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const subjectList = response.data.data || [];
            const subjectNames = subjectList.map(s => ({
                name: s.subject_name,
                marks: '',
                max_marks: 100,
                grade: '',
                percentage: '',
                remarks: ''
            }));

            // If no subjects found, use default subjects
            if (subjectNames.length === 0) {
                return [
                    { name: 'Mathematics', marks: '', max_marks: 100, grade: '', percentage: '', remarks: '' },
                    { name: 'Science', marks: '', max_marks: 100, grade: '', percentage: '', remarks: '' },
                    { name: 'English', marks: '', max_marks: 100, grade: '', percentage: '', remarks: '' },
                    { name: 'Social Studies', marks: '', max_marks: 100, grade: '', percentage: '', remarks: '' },
                    { name: 'Hindi', marks: '', max_marks: 100, grade: '', percentage: '', remarks: '' }
                ];
            }

            return subjectNames;
        } catch (error) {
            console.error('Error fetching subjects:', error);
            return [
                { name: 'Mathematics', marks: '', max_marks: 100, grade: '', percentage: '', remarks: '' },
                { name: 'Science', marks: '', max_marks: 100, grade: '', percentage: '', remarks: '' },
                { name: 'English', marks: '', max_marks: 100, grade: '', percentage: '', remarks: '' },
                { name: 'Social Studies', marks: '', max_marks: 100, grade: '', percentage: '', remarks: '' },
                { name: 'Hindi', marks: '', max_marks: 100, grade: '', percentage: '', remarks: '' }
            ];
        }
    };

    // Fetch mark sheets
    const fetchMarkSheets = async () => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await axios.get(`${baseUrl}/marksheet/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMarkSheets(response.data.data || []);
        } catch (error) {
            console.error('Error fetching mark sheets:', error);
        }
    };

    useEffect(() => {
        fetchStudents();
        fetchMarkSheets();
    }, []);

    const handleOpenDialog = async () => {
        // Get teacher and school info
        const teacherName = localStorage.getItem('userName') || sessionStorage.getItem('userName') || 'Teacher';
        const schoolName = localStorage.getItem('schoolName') || sessionStorage.getItem('schoolName') || 'School';

        setFormData({
            student_id: '',
            student_name: '',
            class: '',
            section: '',
            roll_number: '',
            examination: '',
            academic_year: new Date().getFullYear().toString(),
            subjects: [
                { name: 'Mathematics', marks: '', max_marks: 100, grade: '', percentage: '', remarks: '' },
                { name: 'Science', marks: '', max_marks: 100, grade: '', percentage: '', remarks: '' },
                { name: 'English', marks: '', max_marks: 100, grade: '', percentage: '', remarks: '' },
                { name: 'Social Studies', marks: '', max_marks: 100, grade: '', percentage: '', remarks: '' },
                { name: 'Hindi', marks: '', max_marks: 100, grade: '', percentage: '', remarks: '' }
            ],
            total_marks: 0,
            total_max_marks: 0,
            percentage: 0,
            overall_grade: '',
            result: 'Pass',
            teacher_name: teacherName,
            school_name: schoolName,
            issue_date: new Date().toISOString().split('T')[0],
            remarks: ''
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleStudentSelect = async (student) => {
        if (student) {
            const subjectsList = await fetchSubjects(student.id);
            setFormData(prev => ({
                ...prev,
                student_id: student.id,
                student_name: student.name,
                class: student.class,
                section: student.section,
                roll_number: student.roll_number,
                subjects: subjectsList
            }));
        }
    };

    const handleSubjectChange = (index, field, value) => {
        const updatedSubjects = [...formData.subjects];
        updatedSubjects[index] = {
            ...updatedSubjects[index],
            [field]: value
        };

        // Recalculate when marks change
        if (field === 'marks' || field === 'max_marks') {
            const calculations = calculateMarksAndGrades(updatedSubjects);
            setFormData(prev => ({
                ...prev,
                subjects: calculations.subjects,
                total_marks: calculations.totalMarks,
                total_max_marks: calculations.totalMaxMarks,
                percentage: calculations.percentage,
                overall_grade: calculations.overallGrade,
                result: calculations.result
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                subjects: updatedSubjects
            }));
        }
    };

    const addSubject = () => {
        setFormData(prev => ({
            ...prev,
            subjects: [...prev.subjects, { name: '', marks: '', max_marks: 100, grade: '', percentage: '', remarks: '' }]
        }));
    };

    const removeSubject = (index) => {
        if (formData.subjects.length > 1) {
            const updatedSubjects = formData.subjects.filter((_, i) => i !== index);
            const calculations = calculateMarksAndGrades(updatedSubjects);
            setFormData(prev => ({
                ...prev,
                subjects: calculations.subjects,
                total_marks: calculations.totalMarks,
                total_max_marks: calculations.totalMaxMarks,
                percentage: calculations.percentage,
                overall_grade: calculations.overallGrade,
                result: calculations.result
            }));
        }
    };

    const handleSubmit = async () => {
        try {
            // Validate required fields
            if (!formData.student_name || !formData.examination || !formData.academic_year) {
                showSnackbar('Please fill in all required fields', 'error');
                return;
            }

            if (formData.subjects.length === 0 || formData.subjects.some(s => !s.name || s.marks === '')) {
                showSnackbar('Please enter marks for all subjects', 'error');
                return;
            }

            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const dataToSend = {
                ...formData,
                status: 'Issued',
                created_by: formData.teacher_name
            };

            await axios.post(`${baseUrl}/marksheet/create`, dataToSend, {
                headers: { Authorization: `Bearer ${token}` }
            });

            showSnackbar('Marksheet created successfully!', 'success');
            handleCloseDialog();
            fetchMarkSheets();
        } catch (error) {
            console.error('Error creating marksheet:', error);
            showSnackbar(error.response?.data?.message || 'Error creating marksheet', 'error');
        }
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleDeleteMarksheet = async (id) => {
        if (window.confirm('Are you sure you want to delete this marksheet?')) {
            try {
                const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                await axios.delete(`${baseUrl}/marksheet/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                showSnackbar('Marksheet deleted successfully!', 'success');
                fetchMarkSheets();
            } catch (error) {
                console.error('Error deleting marksheet:', error);
                showSnackbar('Error deleting marksheet', 'error');
            }
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            {/* Header */}
            <HeaderSection>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 2 }}>
                            <SchoolIcon sx={{ fontSize: 50 }} />
                            Teacher Marks Entry
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9 }}>
                            Enter marks for all subjects for your students
                        </Typography>
                    </Box>
                    <StyledButton
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpenDialog}
                        sx={{ background: 'white', color: '#667eea', '&:hover': { background: '#f5f5f5' } }}
                    >
                        Create New Marksheet
                    </StyledButton>
                </Box>
            </HeaderSection>

            {/* Marksheets List */}
            <StyledCard>
                <CardContent>
                    <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
                        📊 Entered Marksheets
                    </Typography>

                    {markSheets.length === 0 ? (
                        <Alert severity="info">
                            No marksheets found. Click "Create New Marksheet" to add student marks.
                        </Alert>
                    ) : (
                        <TableContainer component={Paper} sx={{ borderRadius: '12px' }}>
                            <Table>
                                <TableHead sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                                    <TableRow>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Student Name</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Class</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Roll No</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Examination</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Percentage</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Grade</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Result</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {markSheets.map((sheet) => (
                                        <TableRow
                                            key={sheet._id}
                                            sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f8f9fa' }, '&:hover': { backgroundColor: '#e3f2fd' } }}
                                        >
                                            <TableCell>{sheet.student_name}</TableCell>
                                            <TableCell>{sheet.class} - {sheet.section}</TableCell>
                                            <TableCell>{sheet.roll_number}</TableCell>
                                            <TableCell>{sheet.examination}</TableCell>
                                            <TableCell align="center">
                                                <Chip label={`${sheet.percentage}%`} color={sheet.percentage >= 33 ? 'success' : 'error'} />
                                            </TableCell>
                                            <TableCell align="center">
                                                <GradeChip grade={sheet.overall_grade} label={sheet.overall_grade} />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={sheet.result}
                                                    color={sheet.result === 'Pass' ? 'success' : 'error'}
                                                    sx={{ fontWeight: 'bold' }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton color="error" onClick={() => handleDeleteMarksheet(sheet._id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>
            </StyledCard>

            {/* Create/Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <AssignmentIcon />
                        Create New Marksheet
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ mt: 3 }}>
                    <Grid container spacing={3}>
                        {/* Student Selection */}
                        <Grid item xs={12}>
                            <Autocomplete
                                options={students}
                                getOptionLabel={(option) => `${option.name} - ${option.class} (Roll: ${option.roll_number})`}
                                onChange={(e, value) => handleStudentSelect(value)}
                                renderInput={(params) => (
                                    <TextField {...params} label="Select Student *" placeholder="Search student..." />
                                )}
                            />
                        </Grid>

                        {/* Student Info (Read-only) */}
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Class"
                                value={formData.class}
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Section"
                                value={formData.section}
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Roll Number"
                                value={formData.roll_number}
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>

                        {/* Examination Details */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                required
                                label="Examination Name"
                                name="examination"
                                value={formData.examination}
                                onChange={handleInputChange}
                                placeholder="e.g., Midterm, Final Exam"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Academic Year"
                                name="academic_year"
                                value={formData.academic_year}
                                onChange={handleInputChange}
                                placeholder="e.g., 2024"
                            />
                        </Grid>

                        {/* Subjects Section */}
                        <Grid item xs={12}>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" fontWeight="bold">Subjects & Marks</Typography>
                                <Button startIcon={<AddIcon />} onClick={addSubject} variant="outlined">
                                    Add Subject
                                </Button>
                            </Box>

                            {formData.subjects.map((subject, index) => (
                                <Paper key={index} sx={{ p: 2, mb: 2, background: '#f8f9fa' }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} md={3}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Subject Name"
                                                value={subject.name}
                                                onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={2}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                type="number"
                                                label="Marks"
                                                value={subject.marks}
                                                onChange={(e) => handleSubjectChange(index, 'marks', e.target.value)}
                                                inputProps={{ min: 0 }}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={2}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                type="number"
                                                label="Max Marks"
                                                value={subject.max_marks}
                                                onChange={(e) => handleSubjectChange(index, 'max_marks', e.target.value)}
                                                inputProps={{ min: 1 }}
                                            />
                                        </Grid>
                                        <Grid item xs={4} md={1}>
                                            <Chip
                                                label={subject.percentage ? `${subject.percentage}%` : '-'}
                                                size="small"
                                                color={subject.percentage >= 33 ? 'success' : 'error'}
                                            />
                                        </Grid>
                                        <Grid item xs={4} md={1}>
                                            {subject.grade && <GradeChip grade={subject.grade} label={subject.grade} size="small" />}
                                        </Grid>
                                        <Grid item xs={12} md={2}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Remarks"
                                                value={subject.remarks}
                                                onChange={(e) => handleSubjectChange(index, 'remarks', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={1}>
                                            <IconButton color="error" onClick={() => removeSubject(index)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            ))}
                        </Grid>

                        {/* Summary */}
                        <Grid item xs={12}>
                            <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6} md={3}>
                                        <Typography variant="body2" color="textSecondary">Total Marks</Typography>
                                        <Typography variant="h5" fontWeight="bold">
                                            {formData.total_marks} / {formData.total_max_marks}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                        <Typography variant="body2" color="textSecondary">Percentage</Typography>
                                        <Typography variant="h5" fontWeight="bold" color={formData.percentage >= 33 ? 'success.main' : 'error.main'}>
                                            {formData.percentage}%
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                        <Typography variant="body2" color="textSecondary">Overall Grade</Typography>
                                        <Typography variant="h5" fontWeight="bold">
                                            {formData.overall_grade || '-'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                        <Typography variant="body2" color="textSecondary">Result</Typography>
                                        <Chip
                                            label={formData.result}
                                            color={formData.result === 'Pass' ? 'success' : 'error'}
                                            sx={{ fontWeight: 'bold', fontSize: '1rem', mt: 1 }}
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        {/* Additional Info */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                label="Additional Remarks"
                                name="remarks"
                                value={formData.remarks}
                                onChange={handleInputChange}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleCloseDialog} variant="outlined">
                        Cancel
                    </Button>
                    <StyledButton startIcon={<SaveIcon />} onClick={handleSubmit}>
                        Save Marksheet
                    </StyledButton>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default TeacherMarksEntry;
