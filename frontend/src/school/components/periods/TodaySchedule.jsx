import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import BookIcon from '@mui/icons-material/Book';
import FreeBreakfastIcon from '@mui/icons-material/FreeBreakfast';
import axios from 'axios';
import { baseUrl } from '../../../environment';

const StyledHeaderCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  marginBottom: theme.spacing(3),
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '15px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  marginBottom: theme.spacing(2),
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
  },
}));

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const PERIODS = [
  { num: 1, label: 'Period 1', startTime: '07:00', endTime: '08:00' },
  { num: 2, label: 'Period 2', startTime: '08:00', endTime: '09:00' },
  { num: 3, label: 'Period 3', startTime: '09:00', endTime: '10:00' },
  { num: 4, label: 'Period 4', startTime: '10:00', endTime: '11:00' },
  { num: 5, label: 'Period 5', startTime: '11:00', endTime: '12:00' },
  { num: 6, label: 'Lunch', startTime: '12:00', endTime: '13:00' },
  { num: 7, label: 'Period 6', startTime: '13:00', endTime: '14:00' },
  { num: 8, label: 'Period 7', startTime: '14:00', endTime: '15:00' },
  { num: 9, label: 'Period 8', startTime: '15:00', endTime: '16:00' },
  { num: 10, label: 'Period 9', startTime: '16:00', endTime: '17:00' },
  { num: 11, label: 'Period 10', startTime: '17:00', endTime: '18:00' },
  { num: 12, label: 'Period 11', startTime: '18:00', endTime: '19:00' },
];

const TodaySchedule = () => {
  const [todayPeriods, setTodayPeriods] = useState([]);
  const [dayOfWeek, setDayOfWeek] = useState(new Date().getDay());
  const [loading, setLoading] = useState(true);
  const [allTeachers, setAllTeachers] = useState([]);

  useEffect(() => {
    fetchTodaySchedule();
    fetchAllTeachers();
  }, []);

  const fetchTodaySchedule = async () => {
    try {
      const response = await axios.get(`${baseUrl}/period/schedule/today`);
      setTodayPeriods(response.data.periods);
      setDayOfWeek(response.data.dayOfWeek);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching today\'s schedule:', error);
      setLoading(false);
    }
  };

  const fetchAllTeachers = async () => {
    try {
      const response = await axios.get(`${baseUrl}/teacher/fetch-with-query`, { params: {} });
      setAllTeachers(response.data.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  // Group periods by period number
  const groupedByPeriod = PERIODS.map(period => {
    const periodsInSlot = todayPeriods.filter(p => p.periodNumber === period.num);
    return {
      ...period,
      periods: periodsInSlot,
    };
  });

  // Find teachers not teaching in each period
  const getFreeTeachers = (periodNumber) => {
    const busyTeacherIds = todayPeriods
      .filter(p => p.periodNumber === periodNumber)
      .map(p => p.teacher._id);

    return allTeachers.filter(t => !busyTeacherIds.includes(t._id));
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <StyledHeaderCard>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <CalendarTodayIcon sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom>
            Today's Schedule
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9 }}>
            {DAYS[dayOfWeek]} - {new Date().toLocaleDateString()}
          </Typography>
        </CardContent>
      </StyledHeaderCard>

      {loading ? (
        <Alert severity="info">Loading today's schedule...</Alert>
      ) : todayPeriods.length === 0 ? (
        <Alert severity="warning">No classes scheduled for today</Alert>
      ) : (
        <Grid container spacing={3}>
          {/* Left side - Period by period schedule */}
          <Grid item xs={12} md={8}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
              Class Schedule by Period
            </Typography>

            {groupedByPeriod.map((periodGroup) => (
              <StyledCard key={periodGroup.num}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {periodGroup.num === 6 ? (
                      <FreeBreakfastIcon sx={{ mr: 1, color: '#ff9800' }} />
                    ) : (
                      <BookIcon sx={{ mr: 1, color: '#1976d2' }} />
                    )}
                    <Typography variant="h6" fontWeight="bold">
                      {periodGroup.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                      {periodGroup.startTime} - {periodGroup.endTime}
                    </Typography>
                  </Box>

                  {periodGroup.periods.length === 0 ? (
                    <Alert severity="info" sx={{ py: 0.5 }}>
                      No classes scheduled
                    </Alert>
                  ) : (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell><strong>Class</strong></TableCell>
                            <TableCell><strong>Subject</strong></TableCell>
                            <TableCell><strong>Teacher</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {periodGroup.periods.map((period) => (
                            <TableRow key={period._id}>
                              <TableCell>
                                <Chip
                                  icon={<SchoolIcon />}
                                  label={period.class?.class_text || 'N/A'}
                                  color="primary"
                                  variant="outlined"
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>{period.subject?.subject_name || 'N/A'}</TableCell>
                              <TableCell>
                                <Chip
                                  icon={<PersonIcon />}
                                  label={period.teacher?.name || 'N/A'}
                                  color="secondary"
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}

                  {/* Show free teachers */}
                  {periodGroup.num !== 6 && (
                    <Box sx={{ mt: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Free Teachers:</strong>
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {getFreeTeachers(periodGroup.num).length === 0 ? (
                          <Typography variant="caption" color="text.secondary">
                            All teachers are busy
                          </Typography>
                        ) : (
                          getFreeTeachers(periodGroup.num).map((teacher) => (
                            <Chip
                              key={teacher._id}
                              label={teacher.name}
                              size="small"
                              variant="outlined"
                              color="success"
                            />
                          ))
                        )}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </StyledCard>
            ))}
          </Grid>

          {/* Right side - Summary */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
              Summary
            </Typography>

            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Statistics
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Total Periods Today:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {todayPeriods.length}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Unique Classes:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {new Set(todayPeriods.map(p => p.class._id)).size}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Active Teachers:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {new Set(todayPeriods.map(p => p.teacher._id)).size}
                  </Typography>
                </Box>
              </CardContent>
            </StyledCard>

            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Teachers Not Teaching Today
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {allTeachers.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Loading teachers...
                  </Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {allTeachers
                      .filter(t => !todayPeriods.some(p => p.teacher._id === t._id))
                      .map(teacher => (
                        <Chip
                          key={teacher._id}
                          label={teacher.name}
                          icon={<PersonIcon />}
                          variant="outlined"
                        />
                      ))}
                    {allTeachers.filter(t => !todayPeriods.some(p => p.teacher._id === t._id)).length === 0 && (
                      <Typography variant="body2" color="text.secondary">
                        All teachers have classes today
                      </Typography>
                    )}
                  </Box>
                )}
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default TodaySchedule;
