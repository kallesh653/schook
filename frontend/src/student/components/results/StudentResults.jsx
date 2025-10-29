import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Grid,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  School as SchoolIcon,
  EmojiEvents as TrophyIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { baseUrl } from '../../../environment';

// Styled Components
const StyledHeaderCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  marginBottom: theme.spacing(3),
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
}));

const StyledResultCard = styled(Card)(({ theme }) => ({
  borderRadius: '15px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
  marginBottom: theme.spacing(3),
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
  },
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
    fontSize: '1rem',
    padding: '8px 16px'
  };
});

const ResultChip = styled(Chip)(({ result }) => ({
  background: result === 'Pass' ? '#4caf50' : '#f44336',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '1.1rem',
  padding: '10px 20px',
  height: 'auto'
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 600,
  padding: '16px'
}));

const StudentResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentInfo, setStudentInfo] = useState(null);

  useEffect(() => {
    fetchStudentResults();
  }, []);

  const fetchStudentResults = async () => {
    try {
      setLoading(true);

      // First get student info
      const studentResp = await axios.get(`${baseUrl}/student/fetch-own`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        }
      });

      const studentData = studentResp.data.data;
      setStudentInfo(studentData);

      // Then fetch marksheets for this student
      const marksResp = await axios.get(`${baseUrl}/marksheet/student-history/${studentData._id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        }
      });

      setResults(marksResp.data.data || []);
    } catch (error) {
      console.error('Error fetching results:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Group results by examination
  const groupedResults = results.reduce((acc, result) => {
    const examKey = `${result.examination}_${result.academic_year}`;
    if (!acc[examKey]) {
      acc[examKey] = {
        examination: result.examination,
        academic_year: result.academic_year,
        issue_date: result.issue_date,
        marksheets: []
      };
    }
    acc[examKey].marksheets.push(result);
    return acc;
  }, {});

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading your results...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Card */}
      <StyledHeaderCard>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <TrophyIcon sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            📊 My Results
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            View your examination results and performance
          </Typography>
        </CardContent>
      </StyledHeaderCard>

      {/* Student Info */}
      {studentInfo && (
        <StyledResultCard>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="textSecondary">Student Name</Typography>
                <Typography variant="h6" fontWeight="bold">{studentInfo.name}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="textSecondary">Class</Typography>
                <Typography variant="h6" fontWeight="bold">
                  {studentInfo.student_class?.class_text || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="textSecondary">Roll Number</Typography>
                <Typography variant="h6" fontWeight="bold">{studentInfo.roll_no || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="textSecondary">Total Results</Typography>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {results.length} Exam(s)
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </StyledResultCard>
      )}

      {/* Results */}
      {results.length === 0 ? (
        <Alert severity="info" sx={{ fontSize: '1.1rem', borderRadius: '15px' }}>
          <Typography variant="h6">No results available yet</Typography>
          <Typography>Your examination results will appear here once your teachers have entered marks.</Typography>
        </Alert>
      ) : (
        Object.values(groupedResults).map((examGroup, groupIndex) => {
          // Calculate total marks for this examination
          const totalMarks = examGroup.marksheets.reduce((sum, ms) => sum + ms.total_marks, 0);
          const totalMaxMarks = examGroup.marksheets.reduce((sum, ms) => sum + ms.total_max_marks, 0);
          const overallPercentage = totalMaxMarks > 0 ? ((totalMarks / totalMaxMarks) * 100).toFixed(2) : 0;
          const overallResult = overallPercentage >= 33 ? 'Pass' : 'Fail';

          return (
            <StyledResultCard key={groupIndex}>
              <CardContent>
                {/* Exam Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box>
                    <Typography variant="h5" fontWeight="bold" sx={{ color: '#667eea' }}>
                      {examGroup.examination}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Academic Year: {examGroup.academic_year}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Date: {new Date(examGroup.issue_date).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <ResultChip
                      result={overallResult}
                      label={overallResult}
                      icon={overallResult === 'Pass' ? <TrophyIcon /> : undefined}
                    />
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Subject-wise Marks */}
                <TableContainer component={Paper} sx={{ borderRadius: '10px', overflow: 'hidden' }}>
                  <Table>
                    <TableHead sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                      <TableRow>
                        <StyledTableCell sx={{ color: 'white' }}>Subject</StyledTableCell>
                        <StyledTableCell sx={{ color: 'white' }} align="center">Marks Obtained</StyledTableCell>
                        <StyledTableCell sx={{ color: 'white' }} align="center">Max Marks</StyledTableCell>
                        <StyledTableCell sx={{ color: 'white' }} align="center">Percentage</StyledTableCell>
                        <StyledTableCell sx={{ color: 'white' }} align="center">Grade</StyledTableCell>
                        <StyledTableCell sx={{ color: 'white' }}>Remarks</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {examGroup.marksheets.map((marksheet, index) => (
                        <React.Fragment key={index}>
                          {marksheet.subjects.map((subject, subIndex) => (
                            <TableRow
                              key={`${index}-${subIndex}`}
                              sx={{
                                '&:nth-of-type(odd)': { backgroundColor: '#f8f9fa' },
                                '&:hover': { backgroundColor: '#e3f2fd' }
                              }}
                            >
                              <TableCell>
                                <Typography variant="body1" fontWeight="600">
                                  {subject.name}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Typography variant="h6" fontWeight="bold">
                                  {subject.marks}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Typography variant="body1">
                                  {subject.max_marks}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Chip
                                  label={`${subject.percentage}%`}
                                  color={subject.percentage >= 33 ? 'success' : 'error'}
                                  sx={{ fontWeight: 'bold' }}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <GradeChip grade={subject.grade} label={subject.grade} />
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {subject.remarks || '-'}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Overall Statistics */}
                <Box sx={{ mt: 3, p: 3, background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', borderRadius: '10px' }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <AssignmentIcon sx={{ fontSize: 40, color: '#667eea', mb: 1 }} />
                        <Typography variant="h4" fontWeight="bold">
                          {totalMarks} / {totalMaxMarks}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">Total Marks</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <TrendingUpIcon sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                        <Typography variant="h4" fontWeight="bold">{overallPercentage}%</Typography>
                        <Typography variant="body2" color="textSecondary">Percentage</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <TrophyIcon sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
                        <Typography variant="h4" fontWeight="bold">{examGroup.marksheets[0]?.overall_grade || 'N/A'}</Typography>
                        <Typography variant="body2" color="textSecondary">Overall Grade</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                {/* Teacher Info */}
                {examGroup.marksheets[0]?.teacher_name && (
                  <Box sx={{ mt: 2, textAlign: 'right' }}>
                    <Typography variant="body2" color="textSecondary">
                      Entered by: {examGroup.marksheets[0].teacher_name}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </StyledResultCard>
          );
        })
      )}
    </Container>
  );
};

export default StudentResults;
