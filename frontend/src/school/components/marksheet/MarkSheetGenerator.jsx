import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    Card,
    CardContent,
    IconButton,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Snackbar,
    Alert,
    Tooltip,
    Avatar,
    Fade,
    Zoom,
    Divider,
    Autocomplete
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    GetApp as DownloadIcon,
    Visibility as ViewIcon,
    School as SchoolIcon,
    Assignment as AssignmentIcon,
    Grade as GradeIcon,
    Print as PrintIcon,
    Save as SaveIcon,
    Person as PersonIcon,
    AccountCircle as TeacherIcon,
    SupervisorAccount as PrincipalIcon,
    Calculate as CalculateIcon,
    Assessment as ReportIcon
} from '@mui/icons-material';
import axios from 'axios';
import { baseUrl } from '../../../environment';
import { useDashboard } from '../../../context/DashboardContext';

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

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
    },
    animation: `${fadeInUp} 0.6s ease-out`
}));

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: '12px',
    textTransform: 'none',
    fontWeight: 600,
    padding: theme.spacing(1.5, 3),
    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
        background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
    },
    transition: 'all 0.3s ease'
}));

const HeaderSection = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '20px',
    padding: theme.spacing(4),
    marginBottom: theme.spacing(4),
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        opacity: 0.3
    }
}));

const MarkSheetGenerator = () => {
    const { triggerDashboardRefresh } = useDashboard();
    const [markSheets, setMarkSheets] = useState([]);
    const [students, setStudents] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [examinations, setExaminations] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedClassId, setSelectedClassId] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState('create');
    const [selectedMarkSheet, setSelectedMarkSheet] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const [formData, setFormData] = useState({
        student_id: '',
        student_name: '',
        class: '',
        section: '',
        roll_number: '',
        examination: '',
        academic_year: new Date().getFullYear().toString(),
        subjects: [
            { name: 'Mathematics', marks: '', max_marks: 100, grade: '', remarks: '' },
            { name: 'Science', marks: '', max_marks: 100, grade: '', remarks: '' },
            { name: 'English', marks: '', max_marks: 100, grade: '', remarks: '' },
            { name: 'Social Studies', marks: '', max_marks: 100, grade: '', remarks: '' },
            { name: 'Hindi', marks: '', max_marks: 100, grade: '', remarks: '' }
        ],
        total_marks: 0,
        percentage: 0,
        overall_grade: '',
        result: 'Pass',
        teacher_name: '',
        teacher_signature: '',
        principal_name: '',
        principal_signature: '',
        school_name: '',
        school_address: '',
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
            const percentage = (marks / maxMarks) * 100;
            const grade = calculateGrade(percentage);

            totalMarks += marks;
            totalMaxMarks += maxMarks;

            return {
                ...subject,
                grade,
                percentage: percentage.toFixed(2)
            };
        });

        const overallPercentage = (totalMarks / totalMaxMarks) * 100;
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

    // Fetch classes
    const fetchClasses = async () => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const headers = token ? { Authorization: token } : {};

            const response = await axios.get(`${baseUrl}/class/fetch-all`, { headers });
            setClasses(response.data.data || []);
        } catch (error) {
            console.error('Error fetching classes:', error);
            setSnackbar({
                open: true,
                message: 'Error fetching classes: ' + (error.response?.data?.message || error.message),
                severity: 'error'
            });
        }
    };

    // Fetch examinations
    const fetchExaminations = async () => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const headers = token ? { Authorization: token } : {};

            const response = await axios.get(`${baseUrl}/examination/all`, { headers });
            setExaminations(response.data.data || []);
        } catch (error) {
            console.error('Error fetching examinations:', error);
            setSnackbar({
                open: true,
                message: 'Error fetching examinations: ' + (error.response?.data?.message || error.message),
                severity: 'error'
            });
        }
    };

    // Fetch all students
    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const headers = token ? { Authorization: token } : {};

            const response = await axios.get(`${baseUrl}/student-records`, { headers });
            const studentRecords = response.data.data || [];

            const transformedStudents = studentRecords.map(record => ({
                id: record._id,
                name: record.student_name,
                class: record.class, // This is a string like "Class 10 - A"
                section: record.section,
                roll_number: record.roll_number
            }));

            setAllStudents(transformedStudents);
        } catch (error) {
            console.error('Error fetching students:', error);
            setSnackbar({
                open: true,
                message: 'Error fetching students: ' + (error.response?.data?.message || error.message),
                severity: 'error'
            });
        }
    };

    // Fetch mark sheets
    const fetchMarkSheets = async () => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const headers = token ? { Authorization: token } : {};

            const response = await axios.get(`${baseUrl}/marksheets`, { headers });
            setMarkSheets(response.data.data || []);
        } catch (error) {
            console.error('Error fetching mark sheets:', error);
            setSnackbar({
                open: true,
                message: 'Error fetching mark sheets: ' + (error.response?.data?.message || error.message),
                severity: 'error'
            });
        }
    };

    useEffect(() => {
        fetchClasses();
        fetchExaminations();
        fetchStudents();
        fetchMarkSheets();
    }, []);

    // Handle class selection
    const handleClassChange = (classObj) => {
        if (classObj) {
            // Create class display name: "Class 10 - A" or "Class 10"
            const classDisplay = `Class ${classObj.class_num}${classObj.class_text ? ' - ' + classObj.class_text : ''}`;
            setSelectedClass(classDisplay);
            setSelectedClassId(classObj._id);

            // Filter students for this class - student.class is a string like "Class 10 - A"
            const classStudents = allStudents.filter(student => {
                // Match exactly or match class number
                return student.class === classDisplay ||
                       student.class?.includes(`Class ${classObj.class_num}`);
            });
            setStudents(classStudents);

            setFormData(prev => ({
                ...prev,
                class: classDisplay,
                section: classObj.class_text || '',
                student_id: '',
                student_name: '',
                roll_number: ''
            }));
        }
    };

    const handleOpenDialog = (mode, markSheet = null) => {
        setDialogMode(mode);
        if (markSheet) {
            setSelectedMarkSheet(markSheet);
            setFormData({
                ...markSheet,
                issue_date: markSheet.issue_date ? new Date(markSheet.issue_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
            });
        } else {
            resetForm();
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedMarkSheet(null);
        setSelectedClass('');
        setSelectedClassId('');
        setStudents([]);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            student_id: '',
            student_name: '',
            class: '',
            section: '',
            roll_number: '',
            examination: '',
            academic_year: new Date().getFullYear().toString(),
            subjects: [
                { name: 'Mathematics', marks: '', max_marks: 100, grade: '', remarks: '' },
                { name: 'Science', marks: '', max_marks: 100, grade: '', remarks: '' },
                { name: 'English', marks: '', max_marks: 100, grade: '', remarks: '' },
                { name: 'Social Studies', marks: '', max_marks: 100, grade: '', remarks: '' },
                { name: 'Hindi', marks: '', max_marks: 100, grade: '', remarks: '' }
            ],
            total_marks: 0,
            percentage: 0,
            overall_grade: '',
            result: 'Pass',
            teacher_name: '',
            teacher_signature: '',
            principal_name: '',
            principal_signature: '',
            school_name: '',
            school_address: '',
            issue_date: new Date().toISOString().split('T')[0],
            remarks: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleStudentSelect = (student) => {
        if (student) {
            setFormData(prev => ({
                ...prev,
                student_id: student.id,
                student_name: student.name,
                class: student.class,
                section: student.section,
                roll_number: student.roll_number
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
            subjects: [...prev.subjects, { name: '', marks: '', max_marks: 100, grade: '', remarks: '' }]
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
                percentage: calculations.percentage,
                overall_grade: calculations.overallGrade,
                result: calculations.result
            }));
        }
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const headers = token ? { Authorization: token } : {};

            // Validation
            if (!formData.student_name || !formData.examination) {
                setSnackbar({ open: true, message: 'Please fill required fields: Student Name and Examination', severity: 'error' });
                return;
            }

            if (!formData.class || !formData.section || !formData.roll_number) {
                setSnackbar({ open: true, message: 'Please fill student information: Class, Section, and Roll Number', severity: 'error' });
                return;
            }

            if (!formData.subjects || formData.subjects.length === 0) {
                setSnackbar({ open: true, message: 'Please add at least one subject', severity: 'error' });
                return;
            }

            // Check if all subjects have marks
            const invalidSubjects = formData.subjects.filter(subject =>
                !subject.name || subject.marks === '' || isNaN(parseFloat(subject.marks))
            );

            if (invalidSubjects.length > 0) {
                setSnackbar({ open: true, message: 'Please fill marks for all subjects', severity: 'error' });
                return;
            }

            const dataToSubmit = {
                ...formData,
                total_marks: parseFloat(formData.total_marks) || 0,
                percentage: parseFloat(formData.percentage) || 0,
                subjects: formData.subjects.map(subject => ({
                    ...subject,
                    marks: parseFloat(subject.marks) || 0,
                    max_marks: parseFloat(subject.max_marks) || 100
                }))
            };

            console.log('Submitting data:', dataToSubmit);

            if (dialogMode === 'edit') {
                const response = await axios.put(`${baseUrl}/marksheets/${selectedMarkSheet._id}`, dataToSubmit, { headers });
                console.log('Update response:', response.data);
                setSnackbar({ open: true, message: 'Mark sheet updated successfully!', severity: 'success' });
            } else {
                const response = await axios.post(`${baseUrl}/marksheets`, dataToSubmit, { headers });
                console.log('Create response:', response.data);
                setSnackbar({ open: true, message: 'Mark sheet created successfully!', severity: 'success' });
            }

            fetchMarkSheets();
            handleCloseDialog();
            triggerDashboardRefresh('Mark sheet updated');
        } catch (error) {
            console.error('Error saving mark sheet:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);

            let errorMessage = 'Error saving mark sheet';
            if (error.response?.data?.message) {
                errorMessage += ': ' + error.response.data.message;
            } else if (error.response?.data?.error) {
                errorMessage += ': ' + error.response.data.error;
            } else if (error.message) {
                errorMessage += ': ' + error.message;
            }

            setSnackbar({ open: true, message: errorMessage, severity: 'error' });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this mark sheet?')) {
            try {
                const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                const headers = token ? { Authorization: token } : {};

                await axios.delete(`${baseUrl}/marksheets/${id}`, { headers });
                setSnackbar({ open: true, message: 'Mark sheet deleted successfully!', severity: 'success' });
                fetchMarkSheets();
                triggerDashboardRefresh('Mark sheet deleted');
            } catch (error) {
                console.error('Error deleting mark sheet:', error);
                setSnackbar({ open: true, message: 'Error deleting mark sheet', severity: 'error' });
            }
        }
    };

    const handleDownloadPDF = async (markSheet) => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const headers = token ? { Authorization: token } : {};

            const response = await axios.get(`${baseUrl}/marksheets/${markSheet._id}/pdf`, { headers });

            if (response.data.success) {
                const printWindow = window.open('', '_blank', 'width=800,height=600');
                printWindow.document.write(response.data.data.htmlContent);
                printWindow.document.close();

                printWindow.onload = () => {
                    setTimeout(() => {
                        printWindow.print();
                        printWindow.onafterprint = () => printWindow.close();
                    }, 1000);
                };

                setSnackbar({ open: true, message: `Mark sheet PDF generated for ${markSheet.student_name}`, severity: 'success' });
            }
        } catch (error) {
            console.error('Error downloading PDF:', error);
            setSnackbar({ open: true, message: 'Error downloading PDF', severity: 'error' });
        }
    };

    const getResultColor = (result) => {
        return result === 'Pass' ? 'success' : 'error';
    };

    const getGradeColor = (grade) => {
        if (grade === 'A+' || grade === 'A') return 'success';
        if (grade === 'B+' || grade === 'B') return 'info';
        if (grade === 'C+' || grade === 'C') return 'warning';
        return 'error';
    };

    return (
        <Box sx={{ p: 0 }}>
            <HeaderSection>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                                sx={{
                                    width: 64,
                                    height: 64,
                                    background: 'rgba(255,255,255,0.2)',
                                    fontSize: '2rem',
                                    animation: `${pulse} 2s infinite`
                                }}
                            >
                                📄
                            </Avatar>
                            <Box>
                                <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                                    Mark Sheet Generator
                                </Typography>
                                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                    Create and manage student mark sheets
                                </Typography>
                            </Box>
                        </Box>
                        <StyledButton
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog('create')}
                            sx={{
                                background: 'rgba(255,255,255,0.2)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                '&:hover': {
                                    background: 'rgba(255,255,255,0.3)',
                                    transform: 'translateY(-2px) scale(1.05)'
                                }
                            }}
                        >
                            Create Mark Sheet
                        </StyledButton>
                    </Box>
                </Box>
            </HeaderSection>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Zoom in timeout={600}>
                        <StyledCard sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                                            {markSheets.length}
                                        </Typography>
                                        <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                                            Total Mark Sheets
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{
                                        width: 56,
                                        height: 56,
                                        background: 'rgba(255,255,255,0.2)',
                                        fontSize: '1.8rem'
                                    }}>
                                        📋
                                    </Avatar>
                                </Box>
                            </CardContent>
                        </StyledCard>
                    </Zoom>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Zoom in timeout={800}>
                        <StyledCard sx={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', color: 'white' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                                            {markSheets.filter(ms => ms.result === 'Pass').length}
                                        </Typography>
                                        <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                                            Pass Results
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{
                                        width: 56,
                                        height: 56,
                                        background: 'rgba(255,255,255,0.2)',
                                        fontSize: '1.8rem'
                                    }}>
                                        ✅
                                    </Avatar>
                                </Box>
                            </CardContent>
                        </StyledCard>
                    </Zoom>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Zoom in timeout={1000}>
                        <StyledCard sx={{ background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', color: 'white' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                                            {markSheets.filter(ms => ms.result === 'Fail').length}
                                        </Typography>
                                        <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                                            Fail Results
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{
                                        width: 56,
                                        height: 56,
                                        background: 'rgba(255,255,255,0.2)',
                                        fontSize: '1.8rem'
                                    }}>
                                        ❌
                                    </Avatar>
                                </Box>
                            </CardContent>
                        </StyledCard>
                    </Zoom>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Zoom in timeout={1200}>
                        <StyledCard sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                                            {markSheets.length > 0 ?
                                                (markSheets.reduce((sum, ms) => sum + parseFloat(ms.percentage || 0), 0) / markSheets.length).toFixed(1) + '%'
                                                : '0%'
                                            }
                                        </Typography>
                                        <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                                            Average Percentage
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{
                                        width: 56,
                                        height: 56,
                                        background: 'rgba(255,255,255,0.2)',
                                        fontSize: '1.8rem'
                                    }}>
                                        📊
                                    </Avatar>
                                </Box>
                            </CardContent>
                        </StyledCard>
                    </Zoom>
                </Grid>
            </Grid>

            {/* Mark Sheets Table */}
            <Fade in timeout={1000}>
                <StyledCard>
                    <CardContent sx={{ p: 0 }}>
                        <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                            <Typography variant="h5" fontWeight="bold" sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                📋 Mark Sheets Database
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Manage all student mark sheets efficiently
                            </Typography>
                        </Box>
                        <TableContainer component={Paper} elevation={0}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Student Name</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Class/Section</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Examination</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Total Marks</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Percentage</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Grade</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Result</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 600 }} align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {markSheets.map((markSheet, index) => (
                                        <TableRow key={markSheet._id} hover>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{
                                                        width: 40,
                                                        height: 40,
                                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                        fontSize: '1.2rem'
                                                    }}>
                                                        {markSheet.student_name?.charAt(0)?.toUpperCase() || '👤'}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="body1" fontWeight="600">
                                                            {markSheet.student_name}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Roll: {markSheet.roll_number}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="500">
                                                    {markSheet.class} - {markSheet.section}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {markSheet.examination}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="600">
                                                    {markSheet.total_marks}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="600" color="primary">
                                                    {markSheet.percentage}%
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={markSheet.overall_grade}
                                                    color={getGradeColor(markSheet.overall_grade)}
                                                    size="small"
                                                    sx={{ fontWeight: 600 }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={markSheet.result}
                                                    color={getResultColor(markSheet.result)}
                                                    size="small"
                                                    sx={{ fontWeight: 600 }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                    <Tooltip title="View Details">
                                                        <IconButton
                                                            onClick={() => handleOpenDialog('view', markSheet)}
                                                            size="small"
                                                            sx={{ color: 'info.main' }}
                                                        >
                                                            <ViewIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Edit">
                                                        <IconButton
                                                            onClick={() => handleOpenDialog('edit', markSheet)}
                                                            size="small"
                                                            sx={{ color: 'warning.main' }}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Download PDF">
                                                        <IconButton
                                                            onClick={() => handleDownloadPDF(markSheet)}
                                                            size="small"
                                                            sx={{ color: 'success.main' }}
                                                        >
                                                            <DownloadIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <IconButton
                                                            onClick={() => handleDelete(markSheet._id)}
                                                            size="small"
                                                            sx={{ color: 'error.main' }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </StyledCard>
            </Fade>

            {/* Create/Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
                <DialogTitle>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {dialogMode === 'create' && '📝 Create New Mark Sheet'}
                        {dialogMode === 'edit' && '✏️ Edit Mark Sheet'}
                        {dialogMode === 'view' && '👁️ View Mark Sheet'}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        {/* Student Information */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 600 }}>
                                👨‍🎓 Student Information
                            </Typography>
                        </Grid>

                        {/* Class Selection - FIRST */}
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={classes}
                                getOptionLabel={(option) => `Class ${option.class_num}${option.class_text ? ' - ' + option.class_text : ''}`}
                                onChange={(event, value) => handleClassChange(value)}
                                disabled={dialogMode === 'view'}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select Class First *"
                                        required
                                        helperText="Select a class to see students from that class"
                                    />
                                )}
                            />
                        </Grid>

                        {/* Student Selection - SECOND (shows only after class is selected) */}
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={students}
                                getOptionLabel={(option) => `${option.name} - Roll: ${option.roll_number}`}
                                onChange={(event, value) => handleStudentSelect(value)}
                                disabled={dialogMode === 'view' || !selectedClass}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select Student *"
                                        required
                                        helperText={!selectedClass ? "Please select a class first" : `${students.length} students found in ${selectedClass}`}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Student Name"
                                name="student_name"
                                value={formData.student_name}
                                onChange={handleInputChange}
                                disabled={dialogMode === 'view'}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Class"
                                name="class"
                                value={formData.class}
                                onChange={handleInputChange}
                                disabled
                                required
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Section"
                                name="section"
                                value={formData.section}
                                onChange={handleInputChange}
                                disabled={dialogMode === 'view'}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Roll Number"
                                name="roll_number"
                                value={formData.roll_number}
                                onChange={handleInputChange}
                                disabled={dialogMode === 'view'}
                                required
                            />
                        </Grid>

                        {/* Examination Details */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 600, mt: 2 }}>
                                📚 Examination Details
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Examination</InputLabel>
                                <Select
                                    name="examination"
                                    value={formData.examination}
                                    onChange={handleInputChange}
                                    disabled={dialogMode === 'view'}
                                    label="Examination"
                                >
                                    {examinations.map(exam => (
                                        <MenuItem key={exam._id} value={exam.examType}>
                                            {exam.examType}{exam.class ? ` - Class ${exam.class.class_num}${exam.class.class_text ? ' ' + exam.class.class_text : ''}` : ' - All Classes'}
                                        </MenuItem>
                                    ))}
                                    <MenuItem value="First Term">First Term</MenuItem>
                                    <MenuItem value="Second Term">Second Term</MenuItem>
                                    <MenuItem value="Final Exam">Final Exam</MenuItem>
                                    <MenuItem value="Unit Test 1">Unit Test 1</MenuItem>
                                    <MenuItem value="Unit Test 2">Unit Test 2</MenuItem>
                                    <MenuItem value="Pre-Board">Pre-Board</MenuItem>
                                    <MenuItem value="Board Exam">Board Exam</MenuItem>
                                    <MenuItem value="Half Yearly">Half Yearly</MenuItem>
                                    <MenuItem value="Annual">Annual</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Academic Year"
                                name="academic_year"
                                value={formData.academic_year}
                                onChange={handleInputChange}
                                disabled={dialogMode === 'view'}
                                placeholder="e.g., 2024-25"
                            />
                        </Grid>

                        {/* Subjects and Marks */}
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 2 }}>
                                <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }}>
                                    📋 Subjects and Marks
                                </Typography>
                                {dialogMode !== 'view' && (
                                    <Button
                                        startIcon={<AddIcon />}
                                        onClick={addSubject}
                                        variant="outlined"
                                        size="small"
                                    >
                                        Add Subject
                                    </Button>
                                )}
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <TableContainer component={Paper} variant="outlined">
                                <Table size="small">
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                            <TableCell sx={{ fontWeight: 600 }}>Subject</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Max Marks</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Marks Obtained</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Grade</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Remarks</TableCell>
                                            {dialogMode !== 'view' && <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {formData.subjects.map((subject, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <TextField
                                                        size="small"
                                                        value={subject.name}
                                                        onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                                                        disabled={dialogMode === 'view'}
                                                        placeholder="Subject name"
                                                        sx={{ minWidth: 120 }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        size="small"
                                                        type="number"
                                                        value={subject.max_marks}
                                                        onChange={(e) => handleSubjectChange(index, 'max_marks', e.target.value)}
                                                        disabled={dialogMode === 'view'}
                                                        sx={{ width: 80 }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        size="small"
                                                        type="number"
                                                        value={subject.marks}
                                                        onChange={(e) => handleSubjectChange(index, 'marks', e.target.value)}
                                                        disabled={dialogMode === 'view'}
                                                        sx={{ width: 80 }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={subject.grade || '-'}
                                                        color={getGradeColor(subject.grade)}
                                                        size="small"
                                                        sx={{ minWidth: 40 }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        size="small"
                                                        value={subject.remarks}
                                                        onChange={(e) => handleSubjectChange(index, 'remarks', e.target.value)}
                                                        disabled={dialogMode === 'view'}
                                                        placeholder="Remarks"
                                                        sx={{ minWidth: 100 }}
                                                    />
                                                </TableCell>
                                                {dialogMode !== 'view' && (
                                                    <TableCell>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => removeSubject(index)}
                                                            color="error"
                                                            disabled={formData.subjects.length <= 1}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>

                        {/* Results Summary */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 600, mt: 2 }}>
                                📊 Results Summary
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                label="Total Marks"
                                value={formData.total_marks}
                                disabled
                                sx={{ '& .MuiInputBase-input': { fontWeight: 600, color: 'primary.main' } }}
                            />
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                label="Percentage"
                                value={`${formData.percentage}%`}
                                disabled
                                sx={{ '& .MuiInputBase-input': { fontWeight: 600, color: 'primary.main' } }}
                            />
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                label="Overall Grade"
                                value={formData.overall_grade}
                                disabled
                                sx={{ '& .MuiInputBase-input': { fontWeight: 600, color: 'primary.main' } }}
                            />
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                label="Result"
                                value={formData.result}
                                disabled
                                sx={{
                                    '& .MuiInputBase-input': {
                                        fontWeight: 600,
                                        color: formData.result === 'Pass' ? 'success.main' : 'error.main'
                                    }
                                }}
                            />
                        </Grid>

                        {/* Authority Information */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 600, mt: 2 }}>
                                👥 Authority Information
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Teacher Name"
                                name="teacher_name"
                                value={formData.teacher_name}
                                onChange={handleInputChange}
                                disabled={dialogMode === 'view'}
                                InputProps={{
                                    startAdornment: <TeacherIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Principal Name"
                                name="principal_name"
                                value={formData.principal_name}
                                onChange={handleInputChange}
                                disabled={dialogMode === 'view'}
                                InputProps={{
                                    startAdornment: <PrincipalIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                }}
                            />
                        </Grid>

                        {/* School Information */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 600, mt: 2 }}>
                                🏫 School Information
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="School Name"
                                name="school_name"
                                value={formData.school_name}
                                onChange={handleInputChange}
                                disabled={dialogMode === 'view'}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Issue Date"
                                name="issue_date"
                                type="date"
                                value={formData.issue_date}
                                onChange={handleInputChange}
                                disabled={dialogMode === 'view'}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="School Address"
                                name="school_address"
                                value={formData.school_address}
                                onChange={handleInputChange}
                                disabled={dialogMode === 'view'}
                                multiline
                                rows={2}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="General Remarks"
                                name="remarks"
                                value={formData.remarks}
                                onChange={handleInputChange}
                                disabled={dialogMode === 'view'}
                                multiline
                                rows={3}
                                placeholder="Any additional remarks or comments..."
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3, gap: 2 }}>
                    <Button onClick={handleCloseDialog} variant="outlined">
                        Cancel
                    </Button>
                    {dialogMode !== 'view' && (
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            startIcon={<SaveIcon />}
                            sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                                }
                            }}
                        >
                            {dialogMode === 'create' ? 'Create Mark Sheet' : 'Update Mark Sheet'}
                        </Button>
                    )}
                    {dialogMode === 'view' && (
                        <Button
                            onClick={() => handleDownloadPDF(selectedMarkSheet)}
                            variant="contained"
                            startIcon={<DownloadIcon />}
                            sx={{
                                background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #38ef7d 0%, #11998e 100%)',
                                }
                            }}
                        >
                            Download PDF
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default MarkSheetGenerator;
