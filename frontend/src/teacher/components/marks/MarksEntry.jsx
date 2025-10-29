import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  School as SchoolIcon,
  AssignmentTurnedIn as AssignmentIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { baseUrl } from '../../../environment';

// Styled Components
const PageContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '40px 20px'
});

const StyledCard = styled(Card)({
  borderRadius: '20px',
  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  overflow: 'visible'
});

const Header = styled(Box)({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: '40px',
  textAlign: 'center',
  borderRadius: '20px 20px 0 0'
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.95rem',
  padding: '16px',
  borderBottom: '2px solid #e0e0e0'
}));

const GradeChip = styled(Chip)(({ grade }) => {
  const getColor = (grade) => {
    if (grade === 'A+' || grade === 'A') return { bg: '#4caf50', text: 'white' };
    if (grade === 'B+' || grade === 'B') return { bg: '#2196f3', text: 'white' };
    if (grade === 'C+' || grade === 'C') return { bg: '#ff9800', text: 'white' };
    if (grade === 'D') return { bg: '#ff5722', text: 'white' };
    return { bg: '#f44336', text: 'white' };
  };

  const colors = getColor(grade);
  return {
    background: colors.bg,
    color: colors.text,
    fontWeight: 'bold',
    fontSize: '0.9rem'
  };
});

const MarksEntry = () => {
  // State Management
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [examType, setExamType] = useState('');
  const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [marksData, setMarksData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const examTypes = ['Midterm', 'Final', 'Unit Test', 'Quiz', 'Assignment', 'Mock Test'];

  // Fetch Classes
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${baseUrl}/class/fetch-all`);
      setClasses(response.data.data || []);
      if (response.data.data && response.data.data.length > 0) {
        setSelectedClass(response.data.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      showSnackbar('Error fetching classes', 'error');
    }
  };

  // Fetch Students when class changes
  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
    }
  }, [selectedClass]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${baseUrl}/student/fetch-class/${selectedClass}`);
      const studentData = response.data.data || [];
      setStudents(studentData);

      // Initialize marks data for students
      const initialMarks = studentData.map(student => ({
        student_id: student._id,
        student_name: student.name,
        roll_number: student.roll_no || 'N/A',
        marks: '',
        max_marks: 100,
        remarks: ''
      }));
      setMarksData(initialMarks);
    } catch (error) {
      console.error('Error fetching students:', error);
      showSnackbar('Error fetching students', 'error');
    }
  };

  // Fetch Subjects
  useEffect(() => {
    if (selectedClass) {
      fetchSubjects();
    }
  }, [selectedClass]);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${baseUrl}/subject/fetch-class/${selectedClass}`);
      setSubjects(response.data.data || []);
      if (response.data.data && response.data.data.length > 0) {
        setSelectedSubject(response.data.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleMarksChange = (studentId, field, value) => {
    setMarksData(marksData.map(item =>
      item.student_id === studentId ? { ...item, [field]: value } : item
    ));
  };

  const calculateGrade = (marks, maxMarks) => {
    const percentage = (parseFloat(marks) / parseFloat(maxMarks)) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    if (percentage >= 33) return 'D';
    return 'F';
  };

  const saveMarks = async () => {
    try {
      setLoading(true);

      // Validate inputs
      if (!selectedClass || !selectedSubject || !examType) {
        showSnackbar('Please select class, subject, and examination type', 'error');
        return;
      }

      // Filter out students with no marks entered
      const validMarks = marksData.filter(item => item.marks !== '' && item.marks !== null);

      if (validMarks.length === 0) {
        showSnackbar('Please enter marks for at least one student', 'error');
        return;
      }

      // Get class and subject info
      const classInfo = classes.find(c => c._id === selectedClass);
      const subjectInfo = subjects.find(s => s._id === selectedSubject);

      // Get school info from localStorage
      const schoolId = localStorage.getItem('schoolId') || sessionStorage.getItem('schoolId');
      const schoolName = localStorage.getItem('schoolName') || sessionStorage.getItem('schoolName') || 'School';
      const teacherName = localStorage.getItem('userName') || sessionStorage.getItem('userName') || 'Teacher';

      // Prepare marksheet data for each student
      const marksheetPromises = validMarks.map(async (item) => {
        const marks = parseFloat(item.marks);
        const maxMarks = parseFloat(item.max_marks);
        const percentage = (marks / maxMarks) * 100;
        const grade = calculateGrade(marks, maxMarks);

        const marksheetData = {
          student_id: item.student_id,
          student_name: item.student_name,
          class: classInfo?.class_text || 'N/A',
          section: classInfo?.section || 'A',
          roll_number: item.roll_number,
          examination: examType,
          academic_year: academicYear,
          subjects: [{
            name: subjectInfo?.subject_name || 'Subject',
            marks: marks,
            max_marks: maxMarks,
            grade: grade,
            percentage: Math.round(percentage * 100) / 100,
            remarks: item.remarks || ''
          }],
          total_marks: marks,
          total_max_marks: maxMarks,
          percentage: Math.round(percentage * 100) / 100,
          overall_grade: grade,
          result: percentage >= 33 ? 'Pass' : 'Fail',
          teacher_name: teacherName,
          school_name: schoolName,
          issue_date: new Date(examDate),
          status: 'Issued',
          created_by: teacherName
        };

        return axios.post(`${baseUrl}/marksheet/create`, marksheetData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
          }
        });
      });

      await Promise.all(marksheetPromises);

      showSnackbar(`✅ Marks saved successfully for ${validMarks.length} student(s)!`, 'success');

      // Reset marks data after successful save
      const resetMarks = marksData.map(item => ({
        ...item,
        marks: '',
        remarks: ''
      }));
      setMarksData(resetMarks);

    } catch (error) {
      console.error('Error saving marks:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Error saving marks';
      showSnackbar(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const viewStudentDetails = (student) => {
    setSelectedStudent(student);
    setViewDialog(true);
  };

  return (
    <PageContainer>
      <Container maxWidth="xl">
        <StyledCard>
          <Header>
            <AssignmentIcon sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 900 }}>
              Marks Entry System
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Enter and manage student examination marks
            </Typography>
          </Header>

          <Box sx={{ p: 4 }}>
            {/* Selection Filters */}
            <Card sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
              <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: '#667eea', mb: 3 }}>
                Select Examination Details
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth required>
                    <InputLabel>Select Class *</InputLabel>
                    <Select
                      value={selectedClass}
                      label="Select Class *"
                      onChange={(e) => setSelectedClass(e.target.value)}
                    >
                      {classes.map((cls) => (
                        <MenuItem key={cls._id} value={cls._id}>
                          {cls.class_text}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth required>
                    <InputLabel>Select Subject *</InputLabel>
                    <Select
                      value={selectedSubject}
                      label="Select Subject *"
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      disabled={!subjects.length}
                    >
                      {subjects.map((subject) => (
                        <MenuItem key={subject._id} value={subject._id}>
                          {subject.subject_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth required>
                    <InputLabel>Examination Type *</InputLabel>
                    <Select
                      value={examType}
                      label="Examination Type *"
                      onChange={(e) => setExamType(e.target.value)}
                    >
                      {examTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Exam Date"
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Academic Year"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    placeholder="e.g., 2024-2025"
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box sx={{ pt: 1 }}>
                    <Alert severity="info" sx={{ fontSize: '0.85rem' }}>
                      All students in selected class will be shown below
                    </Alert>
                  </Box>
                </Grid>
              </Grid>
            </Card>

            {/* Student Info */}
            {students.length > 0 && (
              <Card sx={{ p: 3, mb: 3, background: '#f0f7ff' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <SchoolIcon sx={{ fontSize: 40, color: '#667eea' }} />
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        Total Students: {students.length}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Enter marks for all students below
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<SaveIcon />}
                    onClick={saveMarks}
                    disabled={loading}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      fontWeight: 'bold',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.5)'
                      }
                    }}
                  >
                    Save All Marks
                  </Button>
                </Box>
              </Card>
            )}

            {/* Marks Entry Table */}
            {students.length === 0 ? (
              <Alert severity="info" sx={{ fontSize: '1.1rem' }}>
                No students found for the selected class. Please select a class with enrolled students.
              </Alert>
            ) : (
              <TableContainer component={Paper} sx={{ borderRadius: '15px', overflow: 'hidden' }}>
                <Table>
                  <TableHead sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <TableRow>
                      <StyledTableCell sx={{ color: 'white' }}>S.No</StyledTableCell>
                      <StyledTableCell sx={{ color: 'white' }}>Roll No</StyledTableCell>
                      <StyledTableCell sx={{ color: 'white' }}>Student Name</StyledTableCell>
                      <StyledTableCell sx={{ color: 'white' }} align="center">Marks Obtained</StyledTableCell>
                      <StyledTableCell sx={{ color: 'white' }} align="center">Max Marks</StyledTableCell>
                      <StyledTableCell sx={{ color: 'white' }} align="center">Grade</StyledTableCell>
                      <StyledTableCell sx={{ color: 'white' }}>Remarks</StyledTableCell>
                      <StyledTableCell sx={{ color: 'white' }} align="center">Actions</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {marksData.map((item, index) => {
                      const grade = item.marks && item.max_marks ? calculateGrade(item.marks, item.max_marks) : '-';
                      const percentage = item.marks && item.max_marks ? ((parseFloat(item.marks) / parseFloat(item.max_marks)) * 100).toFixed(2) : 0;

                      return (
                        <TableRow
                          key={item.student_id}
                          sx={{
                            '&:nth-of-type(odd)': { backgroundColor: '#f8f9fa' },
                            '&:hover': { backgroundColor: '#e3f2fd' }
                          }}
                        >
                          <TableCell>{index + 1}</TableCell>
                          <TableCell fontWeight="bold">{item.roll_number}</TableCell>
                          <TableCell>
                            <Typography variant="body1" fontWeight="600">
                              {item.student_name}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <TextField
                              type="number"
                              size="small"
                              value={item.marks}
                              onChange={(e) => handleMarksChange(item.student_id, 'marks', e.target.value)}
                              placeholder="Enter marks"
                              inputProps={{ min: 0, max: item.max_marks }}
                              sx={{ width: '120px' }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <TextField
                              type="number"
                              size="small"
                              value={item.max_marks}
                              onChange={(e) => handleMarksChange(item.student_id, 'max_marks', e.target.value)}
                              inputProps={{ min: 1 }}
                              sx={{ width: '100px' }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            {grade !== '-' && (
                              <Tooltip title={`${percentage}%`}>
                                <GradeChip grade={grade} label={grade} size="medium" />
                              </Tooltip>
                            )}
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              value={item.remarks}
                              onChange={(e) => handleMarksChange(item.student_id, 'remarks', e.target.value)}
                              placeholder="Optional remarks"
                              sx={{ width: '180px' }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="View Student">
                              <IconButton
                                color="primary"
                                onClick={() => viewStudentDetails(item)}
                              >
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </StyledCard>

        {/* View Student Dialog */}
        <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            Student Details
          </DialogTitle>
          <DialogContent sx={{ mt: 3 }}>
            {selectedStudent && (
              <Box>
                <Typography variant="h6" gutterBottom>{selectedStudent.student_name}</Typography>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">Roll Number</Typography>
                    <Typography variant="body1" fontWeight="bold">{selectedStudent.roll_number}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">Marks</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {selectedStudent.marks || 'Not entered'} / {selectedStudent.max_marks}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">Remarks</Typography>
                    <Typography variant="body1">{selectedStudent.remarks || 'No remarks'}</Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialog(false)} variant="contained">Close</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', fontSize: '1rem' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </PageContainer>
  );
};

export default MarksEntry;
