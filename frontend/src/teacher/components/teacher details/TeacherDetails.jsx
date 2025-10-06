import React, { useEffect, useState } from 'react';
import {
    Box, Container, Card, CardContent, Typography, Grid, Avatar,
    Chip, Button, IconButton, Paper, LinearProgress, Badge,
    useTheme, useMediaQuery, Fab, Skeleton
} from "@mui/material";
import { styled } from '@mui/material/styles';
import axios from "axios";
import { baseUrl } from "../../../environment";

// Icons
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import CakeIcon from '@mui/icons-material/Cake';
import WcIcon from '@mui/icons-material/Wc';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ClassIcon from '@mui/icons-material/Class';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AssignmentIcon from '@mui/icons-material/Assignment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import GradeIcon from '@mui/icons-material/Grade';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';

// Styled Components
const StyledHeaderCard = styled(Card)(({ theme }) => ({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    marginBottom: theme.spacing(3),
    overflow: 'visible',
    position: 'relative',
}));

const StyledDashboardCard = styled(Card)(({ theme }) => ({
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    transition: 'all 0.3s ease-in-out',
    height: '100%',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
    },
}));

const StatsCard = styled(Card)(({ theme, color }) => ({
    background: `linear-gradient(135deg, ${color}20 0%, ${color}40 100%)`,
    border: `2px solid ${color}30`,
    borderRadius: '16px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: `0 8px 25px ${color}40`,
    },
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
    width: 120,
    height: 120,
    border: '4px solid white',
    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
    position: 'absolute',
    top: -60,
    left: '50%',
    transform: 'translateX(-50%)',
    [theme.breakpoints.down('sm')]: {
        width: 100,
        height: 100,
        top: -50,
    },
}));

const InfoChip = styled(Chip)(({ theme }) => ({
    borderRadius: '12px',
    fontWeight: 600,
    fontSize: '0.9rem',
    padding: '8px 4px',
    height: 'auto',
    '& .MuiChip-icon': {
        fontSize: '1.2rem',
    },
}));

const QuickAccessCard = styled(Card)(({ theme, bgGradient }) => ({
    borderRadius: '16px',
    padding: theme.spacing(2),
    textAlign: 'center',
    background: bgGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
    },
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1.5),
    },
}));

export default function TeacherDetails() {
    const [teacher, setTeacher] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(false);
    const [dashboardStats, setDashboardStats] = useState({
        totalClasses: 0,
        totalStudents: 0,
        todayPeriods: 0,
        pendingTasks: 0
    });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();

    const refreshDashboard = async () => {
        setStatsLoading(true);
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const headers = token ? { 'Authorization': token } : {};
        await fetchDashboardStats(headers);
        setStatsLoading(false);
    };

    const getTeacherDetails = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const headers = token ? { 'Authorization': token } : {};

            // Fetch teacher details
            const response = await axios.get(`${baseUrl}/teacher/fetch-own`, { headers });
            setTeacher(response.data.data);
            console.log("Teacher Details:", response.data.data);

            // Fetch real dashboard statistics
            await fetchDashboardStats(headers);
        } catch (error) {
            console.log("Error fetching teacher details:", error);
            // Set default values if API fails
            setDashboardStats({
                totalClasses: 0,
                totalStudents: 0,
                todayPeriods: 0,
                pendingTasks: 0
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchDashboardStats = async (headers) => {
        try {
            // Fetch teacher's assigned classes and subjects
            const classesResponse = await fetchTeacherClasses(headers);
            const periodsResponse = await fetchTodayPeriods(headers);
            const examsResponse = await fetchPendingExaminations(headers);

            setDashboardStats({
                totalClasses: classesResponse.totalClasses,
                totalStudents: classesResponse.totalStudents,
                todayPeriods: periodsResponse.todayPeriods,
                pendingTasks: examsResponse.pendingTasks
            });
        } catch (error) {
            console.log("Error fetching dashboard stats:", error);
            setDashboardStats({
                totalClasses: 0,
                totalStudents: 0,
                todayPeriods: 0,
                pendingTasks: 0
            });
        }
    };

    const fetchTeacherClasses = async (headers) => {
        try {
            // Try to fetch teacher's assigned periods/subjects to get class info
            const periodsResponse = await axios.get(`${baseUrl}/period/fetch-own`, { headers });
            const periods = periodsResponse.data.data || [];

            // Get unique classes from periods
            const uniqueClasses = new Set();
            let totalStudents = 0;

            for (const period of periods) {
                if (period.class && period.class._id) {
                    uniqueClasses.add(period.class._id);
                    // Try to get student count for each class
                    try {
                        const studentsResponse = await axios.get(`${baseUrl}/student/fetch-class/${period.class._id}`, { headers });
                        totalStudents += (studentsResponse.data.data || []).length;
                    } catch (error) {
                        console.log(`Error fetching students for class ${period.class._id}:`, error);
                    }
                }
            }

            return {
                totalClasses: uniqueClasses.size,
                totalStudents: totalStudents
            };
        } catch (error) {
            console.log("Error fetching teacher classes:", error);
            return { totalClasses: 0, totalStudents: 0 };
        }
    };

    const fetchTodayPeriods = async (headers) => {
        try {
            // Get today's date
            const today = new Date();
            const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const todayName = dayNames[dayOfWeek];

            // Fetch teacher's periods for today
            const response = await axios.get(`${baseUrl}/period/fetch-own`, { headers });
            const periods = response.data.data || [];

            // Filter periods for today
            const todayPeriods = periods.filter(period =>
                period.day && period.day.toLowerCase() === todayName.toLowerCase()
            );

            return { todayPeriods: todayPeriods.length };
        } catch (error) {
            console.log("Error fetching today's periods:", error);
            return { todayPeriods: 0 };
        }
    };

    const fetchPendingExaminations = async (headers) => {
        try {
            // Fetch teacher's classes first
            const periodsResponse = await axios.get(`${baseUrl}/period/fetch-own`, { headers });
            const periods = periodsResponse.data.data || [];

            let pendingExams = 0;
            const uniqueClasses = new Set();

            // Get unique classes taught by teacher
            periods.forEach(period => {
                if (period.class && period.class._id) {
                    uniqueClasses.add(period.class._id);
                }
            });

            // Check pending examinations for each class
            for (const classId of uniqueClasses) {
                try {
                    const examResponse = await axios.get(`${baseUrl}/examination/fetch-class/${classId}`, { headers });
                    const exams = examResponse.data.data || [];

                    // Count upcoming exams
                    const upcomingExams = exams.filter(exam => {
                        const examDate = new Date(exam.examDate);
                        const today = new Date();
                        return examDate >= today;
                    });

                    pendingExams += upcomingExams.length;
                } catch (error) {
                    console.log(`Error fetching exams for class ${classId}:`, error);
                }
            }

            return { pendingTasks: pendingExams };
        } catch (error) {
            console.log("Error fetching pending examinations:", error);
            return { pendingTasks: 0 };
        }
    };

    useEffect(() => {
        getTeacherDetails();
    }, []);

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: '20px' }} />
                    </Grid>
                    {[...Array(6)].map((_, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: '16px' }} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 1, md: 4 }, px: { xs: 0.5, md: 3 } }}>
            {/* Header Profile Card */}
            <StyledHeaderCard>
                <CardContent sx={{ pt: { xs: 6, md: 8 }, pb: 4, textAlign: 'center', position: 'relative' }}>
                    <ProfileAvatar
                        src={teacher?.teacher_image ? `/images/uploaded/teacher/${teacher.teacher_image}` : undefined}
                        alt={teacher?.name}
                    >
                        {!teacher?.teacher_image && <PersonIcon sx={{ fontSize: 60 }} />}
                    </ProfileAvatar>

                    <Box sx={{ mt: { xs: 6, md: 8 } }}>
                        <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 'bold', mb: 1 }}>
                            🍎 Welcome back, {teacher?.name || 'Teacher'}!
                        </Typography>
                        <Typography variant={isMobile ? "body1" : "h6"} sx={{ opacity: 0.9, mb: 2 }}>
                            {teacher?.qualification || 'Educator'} • {teacher?.email}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <InfoChip
                                icon={<CakeIcon />}
                                label={`${teacher?.age || 'N/A'} years old`}
                                variant="outlined"
                                sx={{ color: 'white', borderColor: 'white' }}
                            />
                            <InfoChip
                                icon={<WcIcon />}
                                label={teacher?.gender || 'N/A'}
                                variant="outlined"
                                sx={{ color: 'white', borderColor: 'white' }}
                            />
                        </Box>
                    </Box>

                    <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
                        <IconButton
                            sx={{
                                color: 'white',
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
                            }}
                            onClick={refreshDashboard}
                            disabled={statsLoading}
                        >
                            <RefreshIcon />
                        </IconButton>
                        <IconButton
                            sx={{
                                color: 'white',
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
                            }}
                            onClick={() => navigate('/teacher/details/edit')}
                        >
                            <EditIcon />
                        </IconButton>
                    </Box>
                </CardContent>
            </StyledHeaderCard>

            {/* Quick Access Section */}
            <Box sx={{ mb: 4 }}>
                <Typography variant={isMobile ? "h6" : "h5"} sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
                    ⚡ Quick Access
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6} sm={4} md={3}>
                        <QuickAccessCard bgGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" onClick={() => navigate('/teacher/periods')}>
                            <CalendarTodayIcon sx={{ fontSize: { xs: 40, md: 50 }, mb: 1 }} />
                            <Typography variant={isMobile ? "body2" : "h6"} sx={{ fontWeight: 600 }}>
                                My Schedule
                            </Typography>
                        </QuickAccessCard>
                    </Grid>
                    <Grid item xs={6} sm={4} md={3}>
                        <QuickAccessCard bgGradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" onClick={() => navigate('/teacher/attendance')}>
                            <AssignmentIcon sx={{ fontSize: { xs: 40, md: 50 }, mb: 1 }} />
                            <Typography variant={isMobile ? "body2" : "h6"} sx={{ fontWeight: 600 }}>
                                Attendance
                            </Typography>
                        </QuickAccessCard>
                    </Grid>
                    <Grid item xs={6} sm={4} md={3}>
                        <QuickAccessCard bgGradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" onClick={() => navigate('/teacher/examinations')}>
                            <GradeIcon sx={{ fontSize: { xs: 40, md: 50 }, mb: 1 }} />
                            <Typography variant={isMobile ? "body2" : "h6"} sx={{ fontWeight: 600 }}>
                                Examinations
                            </Typography>
                        </QuickAccessCard>
                    </Grid>
                    <Grid item xs={6} sm={4} md={3}>
                        <QuickAccessCard bgGradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)" onClick={() => navigate('/teacher/notices')}>
                            <AnnouncementIcon sx={{ fontSize: { xs: 40, md: 50 }, mb: 1 }} />
                            <Typography variant={isMobile ? "body2" : "h6"} sx={{ fontWeight: 600 }}>
                                Notices
                            </Typography>
                        </QuickAccessCard>
                    </Grid>
                </Grid>
            </Box>

            {/* Dashboard Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={6} sm={3}>
                    <StatsCard color="#3f51b5" onClick={() => navigate('/teacher/periods')}>
                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <ClassIcon sx={{ fontSize: 40, color: '#3f51b5', mb: 1 }} />
                            {statsLoading ? (
                                <CircularProgress size={32} sx={{ color: '#3f51b5' }} />
                            ) : (
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
                                    {dashboardStats.totalClasses}
                                </Typography>
                            )}
                            <Typography variant="body2" color="textSecondary">
                                My Classes
                            </Typography>
                        </CardContent>
                    </StatsCard>
                </Grid>

                <Grid item xs={6} sm={3}>
                    <StatsCard color="#4caf50" onClick={() => navigate('/teacher/attendance')}>
                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <PeopleIcon sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                            {statsLoading ? (
                                <CircularProgress size={32} sx={{ color: '#4caf50' }} />
                            ) : (
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                                    {dashboardStats.totalStudents}
                                </Typography>
                            )}
                            <Typography variant="body2" color="textSecondary">
                                Students
                            </Typography>
                        </CardContent>
                    </StatsCard>
                </Grid>

                <Grid item xs={6} sm={3}>
                    <StatsCard color="#ff9800" onClick={() => navigate('/teacher/periods')}>
                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <CalendarTodayIcon sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
                            {statsLoading ? (
                                <CircularProgress size={32} sx={{ color: '#ff9800' }} />
                            ) : (
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                                    {dashboardStats.todayPeriods}
                                </Typography>
                            )}
                            <Typography variant="body2" color="textSecondary">
                                Today's Classes
                            </Typography>
                        </CardContent>
                    </StatsCard>
                </Grid>

                <Grid item xs={6} sm={3}>
                    <StatsCard color="#f44336" onClick={() => navigate('/teacher/examinations')}>
                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <Badge badgeContent={!statsLoading ? dashboardStats.pendingTasks : 0} color="error">
                                <AssignmentIcon sx={{ fontSize: 40, color: '#f44336', mb: 1 }} />
                            </Badge>
                            {statsLoading ? (
                                <CircularProgress size={32} sx={{ color: '#f44336' }} />
                            ) : (
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                                    {dashboardStats.pendingTasks}
                                </Typography>
                            )}
                            <Typography variant="body2" color="textSecondary">
                                Pending Tasks
                            </Typography>
                        </CardContent>
                    </StatsCard>
                </Grid>
            </Grid>

            {/* Quick Actions */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <StyledDashboardCard>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center' }}>
                                <TrendingUpIcon sx={{ mr: 1, color: '#3f51b5' }} />
                                Quick Actions
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<EventNoteIcon />}
                                        onClick={() => navigate('/teacher/attendance')}
                                        sx={{
                                            background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
                                            borderRadius: '12px',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            py: 1.5,
                                        }}
                                    >
                                        Mark Attendance
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<AssignmentIcon />}
                                        onClick={() => navigate('/teacher/examinations')}
                                        sx={{
                                            background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
                                            borderRadius: '12px',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            py: 1.5,
                                        }}
                                    >
                                        Grade Exams
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<CalendarTodayIcon />}
                                        onClick={() => navigate('/teacher/periods')}
                                        sx={{
                                            background: 'linear-gradient(45deg, #ff9800 30%, #ffb74d 90%)',
                                            borderRadius: '12px',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            py: 1.5,
                                        }}
                                    >
                                        View Schedule
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<NotificationsIcon />}
                                        onClick={() => navigate('/teacher/notice')}
                                        sx={{
                                            background: 'linear-gradient(45deg, #9c27b0 30%, #ba68c8 90%)',
                                            borderRadius: '12px',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            py: 1.5,
                                        }}
                                    >
                                        Notices
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </StyledDashboardCard>
                </Grid>

                <Grid item xs={12} md={4}>
                    <StyledDashboardCard>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center' }}>
                                <PersonIcon sx={{ mr: 1, color: '#4caf50' }} />
                                Profile Information
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <EmailIcon sx={{ color: '#666' }} />
                                    <Box>
                                        <Typography variant="caption" color="textSecondary">Email</Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {teacher?.email || 'N/A'}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <SchoolIcon sx={{ color: '#666' }} />
                                    <Box>
                                        <Typography variant="caption" color="textSecondary">Qualification</Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {teacher?.qualification || 'N/A'}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <CakeIcon sx={{ color: '#666' }} />
                                    <Box>
                                        <Typography variant="caption" color="textSecondary">Age</Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {teacher?.age || 'N/A'} years
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <WcIcon sx={{ color: '#666' }} />
                                    <Box>
                                        <Typography variant="caption" color="textSecondary">Gender</Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {teacher?.gender || 'N/A'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </CardContent>
                    </StyledDashboardCard>
                </Grid>
            </Grid>

            {/* Floating Action Button for mobile */}
            {isMobile && (
                <Fab
                    color="primary"
                    sx={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    }}
                    onClick={() => navigate('/teacher/periods')}
                >
                    <CalendarTodayIcon />
                </Fab>
            )}
        </Container>
    );
}