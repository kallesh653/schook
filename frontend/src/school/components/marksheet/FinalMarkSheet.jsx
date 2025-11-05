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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Snackbar,
    Alert,
    Card,
    CardContent,
    Grid,
    Chip,
    Avatar,
    Divider,
    IconButton,
    Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    Download as DownloadIcon,
    School as SchoolIcon,
    Assessment as AssessmentIcon,
    Grade as GradeIcon,
    Print as PrintIcon,
    TableChart as TableIcon
} from '@mui/icons-material';
import axios from 'axios';
import { baseUrl } from '../../../environment';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    margin: theme.spacing(2, 0),
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white'
}));

const ResultCard = styled(Paper)(({ theme }) => ({
    borderRadius: '12px',
    padding: theme.spacing(3),
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    marginTop: theme.spacing(3)
}));

const FinalMarkSheet = () => {
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [examinations, setExaminations] = useState([]);
    const [markSheets, setMarkSheets] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('');
    const [finalResult, setFinalResult] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchClasses();
        fetchExaminations();
    }, []);

    useEffect(() => {
        if (selectedClass) {
            fetchStudentsByClass(selectedClass);
        }
    }, [selectedClass]);

    useEffect(() => {
        if (selectedStudent) {
            fetchStudentMarkSheets(selectedStudent);
        }
    }, [selectedStudent]);

    const fetchClasses = async () => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await axios.get(`${baseUrl}/class/fetch-all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setClasses(response.data.data || []);
        } catch (error) {
            console.error('Error fetching classes:', error);
            showSnackbar('Error fetching classes', 'error');
        }
    };

    const fetchExaminations = async () => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await axios.get(`${baseUrl}/examination/fetch-all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExaminations(response.data.data || []);
        } catch (error) {
            console.error('Error fetching examinations:', error);
        }
    };

    const fetchStudentsByClass = async (classId) => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await axios.get(`${baseUrl}/student/fetch-with-query`, {
                params: { student_class: classId },
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudents(response.data.data || []);
        } catch (error) {
            console.error('Error fetching students:', error);
            showSnackbar('Error fetching students', 'error');
        }
    };

    const fetchStudentMarkSheets = async (studentId) => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');

            // Get student details first to match by name
            const studentResponse = await axios.get(`${baseUrl}/student/fetch-with-id/${studentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const student = studentResponse.data.data;

            // Fetch all marksheets with high limit to get all records
            const response = await axios.get(`${baseUrl}/marksheets`, {
                params: { limit: 1000 },
                headers: { Authorization: `Bearer ${token}` }
            });

            // Filter marksheets for this student by name (marksheet model uses student_name)
            const allMarksheets = response.data.data || [];
            const studentMarkSheets = allMarksheets.filter(
                ms => ms.student_name === student.name ||
                      ms.student?._id === studentId ||
                      ms.student_id === studentId
            );

            setMarkSheets(studentMarkSheets);

            if (studentMarkSheets.length > 0) {
                calculateFinalResult(studentMarkSheets, student);
            } else {
                setFinalResult(null);
                showSnackbar('No marksheets found for this student', 'warning');
            }
        } catch (error) {
            console.error('Error fetching marksheets:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
            showSnackbar('Error fetching marksheets: ' + errorMsg, 'error');
            setMarkSheets([]);
            setFinalResult(null);
        }
    };

    const calculateFinalResult = (marksheets, studentData) => {
        if (!marksheets || marksheets.length === 0) {
            setFinalResult(null);
            return;
        }

        const student = studentData || marksheets[0].student;
        const subjectsMap = new Map();

        // Aggregate marks from all exams
        marksheets.forEach(sheet => {
            sheet.subjects?.forEach(subject => {
                const subName = subject.name || subject.subject_name || subject.subject;
                const maxMarks = parseFloat(subject.max_marks) || parseFloat(subject.totalMarks) || 100;
                const marks = parseFloat(subject.marks) || 0;

                if (!subjectsMap.has(subName)) {
                    subjectsMap.set(subName, {
                        subject_name: subName,
                        exams: [],
                        total_marks: 0,
                        total_max_marks: 0,
                        exam_count: 0
                    });
                }

                const subData = subjectsMap.get(subName);
                subData.exams.push({
                    exam_name: sheet.examination || sheet.exam_name || 'Exam',
                    marks: marks,
                    max_marks: maxMarks,
                    percentage: (marks / maxMarks) * 100
                });
                subData.total_marks += marks;
                subData.total_max_marks += maxMarks;
                subData.exam_count += 1;
            });
        });

        // Calculate final grades and percentages
        const subjects = Array.from(subjectsMap.values()).map(subject => {
            const percentage = (subject.total_marks / subject.total_max_marks) * 100;
            return {
                ...subject,
                average_marks: subject.total_marks / subject.exam_count,
                percentage: percentage,
                grade: calculateGrade(percentage)
            };
        });

        const totalMarks = subjects.reduce((sum, sub) => sum + sub.total_marks, 0);
        const totalMaxMarks = subjects.reduce((sum, sub) => sum + sub.total_max_marks, 0);
        const overallPercentage = (totalMarks / totalMaxMarks) * 100;

        setFinalResult({
            student,
            subjects,
            totalMarks,
            totalMaxMarks,
            overallPercentage,
            overallGrade: calculateGrade(overallPercentage),
            examCount: marksheets.length,
            marksheets
        });
    };

    const calculateGrade = (percentage) => {
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B+';
        if (percentage >= 60) return 'B';
        if (percentage >= 50) return 'C';
        if (percentage >= 40) return 'D';
        return 'F';
    };

    const getGradeColor = (grade) => {
        const colors = {
            'A+': '#4caf50',
            'A': '#66bb6a',
            'B+': '#29b6f6',
            'B': '#42a5f5',
            'C': '#ffa726',
            'D': '#ff7043',
            'F': '#f44336'
        };
        return colors[grade] || '#9e9e9e';
    };

    const downloadFinalMarkSheet = () => {
        if (!finalResult) {
            showSnackbar('No data to download', 'warning');
            return;
        }

        const doc = new jsPDF();

        // Header
        doc.setFillColor(102, 126, 234);
        doc.rect(0, 0, 210, 35, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont(undefined, 'bold');
        doc.text('FINAL MARK SHEET', 105, 15, { align: 'center' });
        doc.setFontSize(14);
        doc.text('Consolidated Report - All Examinations', 105, 25, { align: 'center' });

        // Student Info
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(`Student: ${finalResult.student.name}`, 20, 45);
        doc.setFont(undefined, 'normal');
        doc.text(`Class: ${finalResult.student.student_class?.class_text || 'N/A'}`, 20, 52);
        doc.text(`Roll No: ${finalResult.student.roll_number || 'N/A'}`, 20, 59);
        doc.text(`Total Exams: ${finalResult.examCount}`, 140, 52);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 140, 59);

        // Subjects Table
        const tableData = finalResult.subjects.map(subject => [
            subject.subject_name,
            subject.total_marks.toFixed(1),
            subject.total_max_marks.toFixed(0),
            subject.percentage.toFixed(2) + '%',
            subject.grade
        ]);

        doc.autoTable({
            startY: 70,
            head: [['Subject', 'Total Marks', 'Max Marks', 'Percentage', 'Grade']],
            body: tableData,
            theme: 'striped',
            headStyles: {
                fillColor: [102, 126, 234],
                textColor: 255,
                fontStyle: 'bold',
                halign: 'center'
            },
            styles: {
                fontSize: 10,
                cellPadding: 5,
                halign: 'center'
            },
            columnStyles: {
                0: { halign: 'left', fontStyle: 'bold' },
                1: { halign: 'center' },
                2: { halign: 'center' },
                3: { halign: 'center' },
                4: { halign: 'center', fontStyle: 'bold' }
            }
        });

        // Individual Exam Details
        let currentY = doc.lastAutoTable.finalY + 15;
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Exam-wise Performance:', 20, currentY);

        currentY += 10;
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');

        finalResult.marksheets.forEach((sheet, index) => {
            if (currentY > 250) {
                doc.addPage();
                currentY = 20;
            }

            doc.setFont(undefined, 'bold');
            const examName = typeof sheet.examination === 'object' ? sheet.examination?.name : sheet.examination;
            const examDate = sheet.issue_date || sheet.createdAt;
            doc.text(`${index + 1}. ${examName || 'Exam'} (${new Date(examDate).toLocaleDateString()})`, 25, currentY);
            currentY += 6;

            const examData = sheet.subjects?.map(sub => {
                const subName = sub.name || sub.subject_name || sub.subject;
                const marks = parseFloat(sub.marks) || 0;
                const maxMarks = parseFloat(sub.max_marks) || parseFloat(sub.totalMarks) || 100;
                return [
                    subName,
                    `${marks}/${maxMarks}`,
                    `${((marks / maxMarks) * 100).toFixed(1)}%`
                ];
            }) || [];

            doc.autoTable({
                startY: currentY,
                head: [['Subject', 'Marks', 'Percentage']],
                body: examData,
                theme: 'plain',
                styles: { fontSize: 9, cellPadding: 3 },
                margin: { left: 30 }
            });

            currentY = doc.lastAutoTable.finalY + 8;
        });

        // Summary Box
        if (currentY > 220) {
            doc.addPage();
            currentY = 20;
        }

        doc.setFillColor(230, 240, 255);
        doc.roundedRect(15, currentY, 180, 35, 3, 3, 'F');
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(102, 126, 234);
        doc.text('FINAL RESULT', 105, currentY + 10, { align: 'center' });
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text(`Total Marks: ${finalResult.totalMarks.toFixed(1)} / ${finalResult.totalMaxMarks}`, 105, currentY + 18, { align: 'center' });
        doc.text(`Overall Percentage: ${finalResult.overallPercentage.toFixed(2)}%`, 105, currentY + 25, { align: 'center' });
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text(`Grade: ${finalResult.overallGrade}`, 105, currentY + 32, { align: 'center' });

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text('This is a system-generated document', 105, 285, { align: 'center' });

        doc.save(`${finalResult.student.name.replace(/\s+/g, '_')}_Final_MarkSheet.pdf`);
        showSnackbar('Final marksheet downloaded successfully', 'success');
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    return (
        <Box sx={{ p: 3 }}>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Header */}
            <StyledCard>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'white', color: '#667eea', width: 56, height: 56 }}>
                            <AssessmentIcon fontSize="large" />
                        </Avatar>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                Final Mark Sheet Generator
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                Consolidated report combining all examination results
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </StyledCard>

            {/* Filters */}
            <Paper sx={{ p: 3, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Select Class</InputLabel>
                            <Select
                                value={selectedClass}
                                onChange={(e) => {
                                    setSelectedClass(e.target.value);
                                    setSelectedStudent('');
                                    setFinalResult(null);
                                }}
                                label="Select Class"
                            >
                                <MenuItem value="">
                                    <em>Select Class</em>
                                </MenuItem>
                                {classes.map((cls) => (
                                    <MenuItem key={cls._id} value={cls._id}>
                                        {cls.class_text}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth disabled={!selectedClass}>
                            <InputLabel>Select Student</InputLabel>
                            <Select
                                value={selectedStudent}
                                onChange={(e) => setSelectedStudent(e.target.value)}
                                label="Select Student"
                            >
                                <MenuItem value="">
                                    <em>Select Student</em>
                                </MenuItem>
                                {students.map((student) => (
                                    <MenuItem key={student._id} value={student._id}>
                                        {student.name} - Roll: {student.roll_number || 'N/A'}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>

            {/* Results */}
            {finalResult && (
                <ResultCard>
                    {/* Student Info */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                                src={`/images/uploaded/student/${finalResult.student.student_image}`}
                                sx={{ width: 80, height: 80, border: '4px solid #667eea' }}
                            />
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                                    {finalResult.student.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Class: {finalResult.student.student_class?.class_text} | Roll: {finalResult.student.roll_number}
                                </Typography>
                                <Chip
                                    label={`${finalResult.examCount} Exams Completed`}
                                    size="small"
                                    sx={{ mt: 0.5 }}
                                    color="primary"
                                />
                            </Box>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<DownloadIcon />}
                            onClick={downloadFinalMarkSheet}
                            sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '10px',
                                px: 3
                            }}
                        >
                            Download PDF
                        </Button>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Subject-wise Results */}
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Subject-wise Consolidated Results
                    </Typography>

                    <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Subject</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Total Marks</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Max Marks</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Percentage</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Grade</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {finalResult.subjects.map((subject, index) => (
                                    <TableRow key={index} hover>
                                        <TableCell sx={{ fontWeight: 'bold' }}>{subject.subject_name}</TableCell>
                                        <TableCell align="center">{subject.total_marks.toFixed(1)}</TableCell>
                                        <TableCell align="center">{subject.total_max_marks}</TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={`${subject.percentage.toFixed(2)}%`}
                                                size="small"
                                                sx={{
                                                    bgcolor: subject.percentage >= 60 ? '#e8f5e9' : '#ffebee',
                                                    color: subject.percentage >= 60 ? '#2e7d32' : '#c62828',
                                                    fontWeight: 'bold'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={subject.grade}
                                                size="small"
                                                sx={{
                                                    bgcolor: getGradeColor(subject.grade),
                                                    color: 'white',
                                                    fontWeight: 'bold'
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Overall Result */}
                    <Box
                        sx={{
                            mt: 3,
                            p: 3,
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            textAlign: 'center'
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 1, opacity: 0.9 }}>
                            FINAL RESULT
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Marks</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                    {finalResult.totalMarks.toFixed(1)} / {finalResult.totalMaxMarks}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>Overall Percentage</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                    {finalResult.overallPercentage.toFixed(2)}%
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>Final Grade</Typography>
                                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                                    {finalResult.overallGrade}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </ResultCard>
            )}
        </Box>
    );
};

export default FinalMarkSheet;
