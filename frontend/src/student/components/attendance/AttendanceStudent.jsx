import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  Avatar,
  useMediaQuery,
  useTheme,
  Skeleton
} from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js';
import { styled, keyframes } from '@mui/material/styles';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import axios from 'axios';
import { baseUrl } from '../../../environment';

Chart.register(ArcElement);

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// Mobile-First Card Components
const MobileCard = styled(Card)(({ theme }) => ({
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
  overflow: 'hidden',
  marginBottom: theme.spacing(2),
  background: '#ffffff',
  animation: `${fadeIn} 0.5s ease-out`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:active': {
    transform: 'scale(0.98)',
  },
}));

const StatsCard = styled(Card)(({ theme, bgcolor }) => ({
  background: bgcolor || '#1976d2',
  borderRadius: '20px',
  padding: theme.spacing(2.5),
  color: 'white',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  animation: `${slideIn} 0.6s ease-out`,
  minHeight: '120px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

const AttendanceCard = styled(Card)(({ status, theme }) => ({
  borderRadius: '16px',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1.5),
  border: `2px solid ${status === 'Present' ? '#4caf50' : '#f44336'}20`,
  background: status === 'Present'
    ? 'linear-gradient(135deg, #4caf5015 0%, #81c78415 100%)'
    : 'linear-gradient(135deg, #f4433615 0%, #e5739315 100%)',
  transition: 'all 0.3s ease',
  '&:active': {
    transform: 'scale(0.98)',
  },
}));

const ChartContainer = styled(Box)(({ theme }) => ({
  background: 'white',
  borderRadius: '20px',
  padding: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
  marginBottom: theme.spacing(2),
}));

const AttendanceStudent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [attendanceData, setAttendanceData] = useState([]);
  const [chartData, setChartData] = useState([0, 0]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState(null);
  const [classDetails, setClassDetails] = useState(null);

  const dateConvert = (date) => {
    const dateData = new Date(date);
    return dateData.getDate() + '-' + (+dateData.getMonth() + 1) + '-' + dateData.getFullYear();
  };

  const chartDataFunc = (data) => {
    let present = 0;
    let absent = 0;
    data.forEach((record) => {
      if (record.status === 'Present') {
        present++;
      } else if (record.status === 'Absent') {
        absent++;
      }
    });
    setChartData([present, absent]);
  };

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(`${baseUrl}/student/student-attendance`, config);

        if (response.data.success) {
          setAttendanceData(response.data.data.attendance);
          setStudentId(response.data.data.student_id);
          setClassDetails(response.data.data.class);
          chartDataFunc(response.data.data.attendance);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching attendance:', error);
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  const totalDays = attendanceData.length;
  const presentDays = chartData[0];
  const absentDays = chartData[1];
  const attendancePercentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0;

  const pieData = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: chartData,
        backgroundColor: ['#4caf50', '#f44336'],
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: isMobile ? 'bottom' : 'right',
        labels: {
          padding: 15,
          font: {
            size: isMobile ? 12 : 14,
            weight: '600',
          },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
    },
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 4 }, mb: { xs: 10, md: 4 } }}>
        <Skeleton variant="rectangular" height={150} sx={{ borderRadius: '20px', mb: 2 }} />
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={6} md={3} key={item}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: '20px' }} />
            </Grid>
          ))}
        </Grid>
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: '20px', mt: 2 }} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 1, md: 3 }, mb: { xs: 10, md: 4 }, px: { xs: 2, md: 3 } }}>
      {/* Header Card */}
      <MobileCard sx={{ mb: 3, background: '#1976d2', color: 'white' }}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar
              sx={{
                width: { xs: 50, md: 60 },
                height: { xs: 50, md: 60 },
                bgcolor: 'rgba(255,255,255,0.2)',
                border: '3px solid rgba(255,255,255,0.3)',
              }}
            >
              <CalendarTodayIcon sx={{ fontSize: { xs: 28, md: 32 } }} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: '1.3rem', md: '1.75rem' } }}>
                My Attendance
              </Typography>
              {classDetails && (
                <Typography variant="body2" sx={{ opacity: 0.9, fontSize: { xs: '0.85rem', md: '0.95rem' } }}>
                  Class {classDetails.name} - {classDetails.section}
                </Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '2.5rem', md: '3rem' }, mb: 0.5 }}>
              {attendancePercentage}%
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Overall Attendance
            </Typography>
          </Box>
        </CardContent>
      </MobileCard>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <StatsCard bgcolor="#388e3c">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <CheckCircleIcon sx={{ fontSize: { xs: 32, md: 40 }, opacity: 0.9 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2rem' } }}>
              {presentDays}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
              Days Present
            </Typography>
          </StatsCard>
        </Grid>

        <Grid item xs={6} md={3}>
          <StatsCard bgcolor="#d32f2f">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <CancelIcon sx={{ fontSize: { xs: 32, md: 40 }, opacity: 0.9 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2rem' } }}>
              {absentDays}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
              Days Absent
            </Typography>
          </StatsCard>
        </Grid>

        <Grid item xs={6} md={3}>
          <StatsCard bgcolor="#1976d2">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <AssessmentIcon sx={{ fontSize: { xs: 32, md: 40 }, opacity: 0.9 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2rem' } }}>
              {totalDays}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
              Total Days
            </Typography>
          </StatsCard>
        </Grid>

        <Grid item xs={6} md={3}>
          <StatsCard bgcolor="#f57c00">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <TrendingUpIcon sx={{ fontSize: { xs: 32, md: 40 }, opacity: 0.9 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2rem' } }}>
              {attendancePercentage}%
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
              Percentage
            </Typography>
          </StatsCard>
        </Grid>
      </Grid>

      {/* Chart */}
      <ChartContainer>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#1976d2' }}>
          Attendance Distribution
        </Typography>
        <Box sx={{ maxWidth: { xs: '100%', md: '400px' }, mx: 'auto', py: 2 }}>
          <Pie data={pieData} options={pieOptions} />
        </Box>
      </ChartContainer>

      {/* Attendance Records */}
      <MobileCard>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#1976d2' }}>
            Attendance Records
          </Typography>

          {attendanceData.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CalendarTodayIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.3 }} />
              <Typography variant="body1" color="text.secondary">
                No attendance records found
              </Typography>
            </Box>
          ) : (
            <Box>
              {attendanceData.map((record, index) => (
                <AttendanceCard key={index} status={record.status}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: record.status === 'Present' ? '#4caf50' : '#f44336',
                        }}
                      >
                        {record.status === 'Present' ? (
                          <EventAvailableIcon sx={{ fontSize: 24 }} />
                        ) : (
                          <EventBusyIcon sx={{ fontSize: 24 }} />
                        )}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600, fontSize: { xs: '0.95rem', md: '1rem' } }}>
                          {dateConvert(record.date)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}
                        </Typography>
                      </Box>
                    </Box>

                    <Chip
                      label={record.status}
                      sx={{
                        fontWeight: 700,
                        fontSize: { xs: '0.75rem', md: '0.85rem' },
                        bgcolor: record.status === 'Present' ? '#4caf50' : '#f44336',
                        color: 'white',
                        px: 1,
                      }}
                    />
                  </Box>
                </AttendanceCard>
              ))}
            </Box>
          )}
        </CardContent>
      </MobileCard>

      {/* Progress Indicator */}
      {attendanceData.length > 0 && (
        <MobileCard>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
              Attendance Goal: 75%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={Math.min(attendancePercentage, 100)}
              sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  background: attendancePercentage >= 75 ? '#388e3c' : '#f57c00',
                  borderRadius: 5,
                },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              {attendancePercentage >= 75
                ? '✓ You meet the minimum attendance requirement'
                : `${(75 - attendancePercentage).toFixed(1)}% more needed to meet requirement`}
            </Typography>
          </CardContent>
        </MobileCard>
      )}
    </Container>
  );
};

export default AttendanceStudent;
