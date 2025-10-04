import React, { useEffect, useState } from "react";
import {
  Box, Container, Card, CardContent, Typography, FormControl, MenuItem, Select,
  InputLabel, Chip, Button, IconButton, Grid, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Avatar, Badge, Skeleton, useTheme, useMediaQuery
} from "@mui/material";
import { styled } from '@mui/material/styles';
import axios from "axios";
import { baseUrl } from "../../../environment";
import { convertDate } from "../../../utilityFunctions";
import NoData from "../../../basic utility components/NoData";

// Icons
import SchoolIcon from '@mui/icons-material/School';
import EventIcon from '@mui/icons-material/Event';
import SubjectIcon from '@mui/icons-material/Subject';
import GradeIcon from '@mui/icons-material/Grade';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// Styled Components
const StyledHeaderCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
  marginBottom: theme.spacing(3),
}));

const StyledExamCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
  transition: 'all 0.3s ease-in-out',
  border: '1px solid rgba(0,0,0,0.05)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
  },
}));

const StyledFilterCard = styled(Card)(({ theme }) => ({
  borderRadius: '15px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  marginBottom: theme.spacing(3),
  background: 'linear-gradient(45deg, #f8f9fa 0%, #ffffff 100%)',
}));

const ExamTypeChip = styled(Chip)(({ examType }) => {
  const getColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'midterm': return '#ff9800';
      case 'final': return '#f44336';
      case 'quiz': return '#4caf50';
      case 'assignment': return '#2196f3';
      default: return '#9e9e9e';
    }
  };

  const color = getColor(examType);
  return {
    background: `${color}20`,
    color: color,
    fontWeight: 600,
    borderRadius: '12px',
    border: `1px solid ${color}40`,
  };
});

export default function TeacherExaminations() {
  const [allClasses, setAllClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [examinations, setExaminations] = useState([]);
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  const fetchExaminations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/examination/fetch-class/${selectedClass}`);
      console.log("ALL Examination", response);
      setExaminations(response.data.data || []);
    } catch (error) {
      console.log("Error in fetching Examinations:", error);
      setExaminations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClass) {
      fetchExaminations();
    }
  }, [selectedClass]);

  const fetchStudentClass = async () => {
    try {
      const response = await axios.get(`${baseUrl}/class/fetch-all`);
      setAllClasses(response.data.data || []);
      console.log("Class", response.data);
      if (response.data.data && response.data.data.length > 0) {
        setSelectedClass(response.data.data[0]._id);
      }
    } catch (error) {
      console.log("Error in fetching student Class", error);
    }
  };

  useEffect(() => {
    fetchStudentClass();
  }, []);

  const getExamStats = () => {
    const totalExams = examinations.length;
    const upcomingExams = examinations.filter(exam => new Date(exam.examDate) > new Date()).length;
    const pastExams = totalExams - upcomingExams;
    return { totalExams, upcomingExams, pastExams };
  };

  const stats = getExamStats();

  if (loading && !examinations.length) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: '20px' }} />
          </Grid>
          {[...Array(4)].map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: '16px' }} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Card */}
      <StyledHeaderCard>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <AssignmentIcon sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            📚 Examinations
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Manage and track examination schedules
          </Typography>
        </CardContent>
      </StyledHeaderCard>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <StyledExamCard>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <AssignmentIcon sx={{ fontSize: 40, color: '#3f51b5', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
                {stats.totalExams}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Exams
              </Typography>
            </CardContent>
          </StyledExamCard>
        </Grid>
        <Grid item xs={12} sm={4}>
          <StyledExamCard>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <EventIcon sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                {stats.upcomingExams}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Upcoming
              </Typography>
            </CardContent>
          </StyledExamCard>
        </Grid>
        <Grid item xs={12} sm={4}>
          <StyledExamCard>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <AccessTimeIcon sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                {stats.pastExams}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Completed
              </Typography>
            </CardContent>
          </StyledExamCard>
        </Grid>
      </Grid>

      {/* Filter Card */}
      <StyledFilterCard>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <FilterListIcon sx={{ color: '#1976d2', fontSize: 30 }} />
            <Typography variant="h6">Filter Examinations</Typography>
          </Box>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Select Class</InputLabel>
                <Select
                  value={selectedClass || ''}
                  label="Select Class"
                  onChange={handleClassChange}
                  sx={{ borderRadius: '12px' }}
                >
                  {allClasses.map((classItem) => (
                    <MenuItem key={classItem._id} value={classItem._id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SchoolIcon sx={{ fontSize: 20, color: '#666' }} />
                        {classItem.class_text}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={fetchExaminations}
                disabled={loading}
                sx={{
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Refresh Data
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </StyledFilterCard>

      {/* Examinations Content */}
      <StyledExamCard>
        <CardContent>
          {examinations.length < 1 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <AssignmentIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
              <Typography variant="h5" color="textSecondary" gutterBottom>
                No Examinations Found
              </Typography>
              <Typography variant="body1" color="textSecondary">
                There are no examinations scheduled for the selected class.
              </Typography>
            </Box>
          ) : (
            <>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
                📅 Examinations Schedule
              </Typography>

              {/* Mobile View - Cards */}
              {isMobile ? (
                <Grid container spacing={2}>
                  {examinations.map((examination, index) => (
                    <Grid item xs={12} key={index}>
                      <Card sx={{
                        borderRadius: '12px',
                        border: '1px solid #e0e0e0',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          transform: 'translateY(-2px)',
                        },
                      }}>
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                {examination.subject?.subject_name || 'N/A'}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <CalendarTodayIcon sx={{ fontSize: 16, color: '#666' }} />
                                <Typography variant="body2" color="textSecondary">
                                  {convertDate(examination.examDate)}
                                </Typography>
                              </Box>
                            </Box>
                            <ExamTypeChip
                              examType={examination.examType}
                              label={examination.examType || 'N/A'}
                              size="small"
                            />
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SubjectIcon sx={{ fontSize: 16, color: '#666' }} />
                            <Typography variant="caption" color="textSecondary">
                              Subject Examination
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                /* Desktop View - Table */
                <TableContainer component={Paper} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                  <Table>
                    <TableHead sx={{ background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)' }}>
                      <TableRow>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarTodayIcon />
                            Exam Date
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SubjectIcon />
                            Subject
                          </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            <GradeIcon />
                            Exam Type
                          </Box>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {examinations.map((examination, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            '&:nth-of-type(odd)': { backgroundColor: '#f8f9ff' },
                            '&:hover': {
                              backgroundColor: '#e3f2fd',
                              transition: 'all 0.2s ease',
                            },
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ width: 32, height: 32, backgroundColor: '#3f51b5' }}>
                                <EventIcon sx={{ fontSize: 18 }} />
                              </Avatar>
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {convertDate(examination.examDate)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {examination.subject?.subject_name || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <ExamTypeChip
                              examType={examination.examType}
                              label={examination.examType || 'N/A'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
        </CardContent>
      </StyledExamCard>
    </Container>
  );
}
