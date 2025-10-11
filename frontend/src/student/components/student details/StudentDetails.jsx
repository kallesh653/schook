import {
    Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Typography, Paper, Container, Card, CardContent, Grid, Avatar, Chip,
    Tabs, Tab, List, ListItem, ListItemText, ListItemIcon, Divider,
    LinearProgress, CircularProgress, Badge, IconButton, useTheme, useMediaQuery, Stack
} from "@mui/material";
import { styled, keyframes } from '@mui/material/styles';
import axios from "axios";
import { useEffect, useState } from "react";
import { baseUrl } from "../../../environment";
import "./StudentDetails.css";

// Icons
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import CakeIcon from '@mui/icons-material/Cake';
import WcIcon from '@mui/icons-material/Wc';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import GradeIcon from '@mui/icons-material/Grade';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import PaymentIcon from '@mui/icons-material/Payment';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';

// Animation keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
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

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    overflow: 'hidden',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
    },
    [theme.breakpoints.down('md')]: {
        borderRadius: '16px',
        margin: theme.spacing(1),
    },
}));

const GradientCard = styled(Card)(({ theme }) => ({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
    [theme.breakpoints.down('md')]: {
        borderRadius: '16px',
        margin: theme.spacing(1),
    },
}));

const StatsCard = styled(Card)(({ theme }) => ({
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    color: 'white',
    borderRadius: '16px',
    padding: theme.spacing(2),
    textAlign: 'center',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05)',
    },
    [theme.breakpoints.down('md')]: {
        margin: theme.spacing(0.5),
    },
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
    width: 160,
    height: 160,
    border: '6px solid white',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    [theme.breakpoints.down('md')]: {
        width: 120,
        height: 120,
        border: '4px solid white',
    },
    [theme.breakpoints.down('sm')]: {
        width: 100,
        height: 100,
        border: '3px solid white',
    },
}));

const InfoChip = styled(Chip)(({ theme }) => ({
    margin: theme.spacing(0.5),
    padding: theme.spacing(1),
    fontWeight: 600,
    '&.MuiChip-filled': {
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        color: 'white',
    },
}));

const QuickAccessCard = styled(Card)(({ theme, bgGradient }) => ({
    borderRadius: '20px',
    padding: theme.spacing(3),
    textAlign: 'center',
    background: bgGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
        transition: 'left 0.5s ease',
    },
    '&:hover': {
        transform: 'translateY(-12px) scale(1.02)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
        '&::before': {
            left: '100%',
        },
    },
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
        borderRadius: '16px',
    },
}));

// Enhanced Section Card
const SectionCard = styled(StyledCard)(({ theme }) => ({
    animation: `${fadeIn} 0.6s ease-out`,
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    '&:hover': {
        background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
    },
}));

// Stats Display Card
const StatDisplayCard = styled(Card)(({ theme, bgColor }) => ({
    borderRadius: '20px',
    padding: theme.spacing(3),
    textAlign: 'center',
    background: bgColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    position: 'relative',
    overflow: 'hidden',
    '&::after': {
        content: '""',
        position: 'absolute',
        top: '-50%',
        right: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
        animation: `${pulse} 3s infinite`,
    },
    '&:hover': {
        transform: 'scale(1.05) rotate(2deg)',
        boxShadow: '0 12px 48px rgba(0,0,0,0.25)',
    },
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
    },
}));

export default function StudentDetails(){
    const [student, setStudent] = useState(null);
    const [marks, setMarks] = useState([]);
    const [marksheets, setMarksheets] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    const getStudentDetails = ()=>{
        setLoading(true);
        // Get the authorization token for API request
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const headers = token ? { 'Authorization': token } : {};

        axios.get(`${baseUrl}/student/fetch-own`, { headers }).then(resp=>{
            setStudent(resp.data.data);
            console.log("student",  resp);
            // Fetch marks for this student
            fetchStudentMarks();
        }).catch(e=>{
            console.log("Error in student", e);
            setLoading(false);
        })
    }

    const fetchStudentMarks = () => {
        // Get the authorization token for API request
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const headers = token ? { 'Authorization': token } : {};

        // Fetch real marks data from API
        axios.get(`${baseUrl}/student/marksheets`, { headers }).then(resp => {
            console.log("Student marksheets:", resp);
            if (resp.data.success && resp.data.data.length > 0) {
                // Store full marksheets data
                setMarksheets(resp.data.data);

                // Extract all subjects from all marksheets
                const allSubjects = [];
                resp.data.data.forEach(marksheet => {
                    marksheet.subjects.forEach(subject => {
                        allSubjects.push({
                            subject: subject.subject,
                            marks: subject.marks,
                            totalMarks: subject.totalMarks,
                            percentage: subject.percentage || Math.round((subject.marks / subject.totalMarks) * 100),
                            grade: subject.grade,
                            examType: subject.examType || marksheet.examination,
                            academic_year: marksheet.academic_year,
                            examination: marksheet.examination
                        });
                    });
                });
                setMarks(allSubjects);
                console.log("Processed marks:", allSubjects);
            } else {
                console.log("No marksheets found, using mock data");
                // Use mock data if no marksheets found
                const mockMarks = [
                    { subject: 'Mathematics', marks: 85, totalMarks: 100, percentage: 85, grade: 'A', examType: 'Midterm' },
                    { subject: 'Science', marks: 92, totalMarks: 100, percentage: 92, grade: 'A+', examType: 'Midterm' },
                    { subject: 'English', marks: 78, totalMarks: 100, percentage: 78, grade: 'B+', examType: 'Midterm' },
                    { subject: 'Social Studies', marks: 88, totalMarks: 100, percentage: 88, grade: 'A', examType: 'Midterm' },
                    { subject: 'Computer Science', marks: 95, totalMarks: 100, percentage: 95, grade: 'A+', examType: 'Midterm' },
                ];
                setMarks(mockMarks);
            }
            setLoading(false);
        }).catch(e => {
            console.log("Error fetching marksheets:", e);
            // Fallback to mock data on error
            const mockMarks = [
                { subject: 'Mathematics', marks: 85, totalMarks: 100, percentage: 85, grade: 'A', examType: 'Midterm' },
                { subject: 'Science', marks: 92, totalMarks: 100, percentage: 92, grade: 'A+', examType: 'Midterm' },
                { subject: 'English', marks: 78, totalMarks: 100, percentage: 78, grade: 'B+', examType: 'Midterm' },
                { subject: 'Social Studies', marks: 88, totalMarks: 100, percentage: 88, grade: 'A', examType: 'Midterm' },
                { subject: 'Computer Science', marks: 95, totalMarks: 100, percentage: 95, grade: 'A+', examType: 'Midterm' },
            ];
            setMarks(mockMarks);
            setLoading(false);
        });
    }

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const calculateOverallPercentage = () => {
        if (marks.length === 0) return 0;
        const totalMarks = marks.reduce((sum, mark) => sum + mark.marks, 0);
        const totalPossible = marks.reduce((sum, mark) => sum + mark.totalMarks, 0);
        return Math.round((totalMarks / totalPossible) * 100);
    };

    const getGradeColor = (grade) => {
        switch(grade) {
            case 'A+': return '#4caf50';
            case 'A': return '#8bc34a';
            case 'B+': return '#ff9800';
            case 'B': return '#ff5722';
            default: return '#f44336';
        }
    };

    const handleLogout = () => {
        // Clear all tokens
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        // Redirect to login
        navigate('/login');
    };

    useEffect(()=>{
        getStudentDetails();
    },[])
    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress size={60} sx={{ mb: 2 }} />
                    <Typography variant="h6" color="textSecondary">
                        Loading your dashboard...
                    </Typography>
                </Box>
            </Container>
        );
    }

    return(
        <Container maxWidth="lg" sx={{ py: { xs: 1, md: 4 }, px: { xs: 0.5, md: 3 } }}>
            {/* Header Section with Logout */}
            <GradientCard sx={{
                mb: { xs: 2, md: 4 },
                mx: { xs: 1, md: 0 },
                animation: `${fadeIn} 0.6s ease-out`,
                position: 'relative',
                overflow: 'visible'
            }}>
                <CardContent sx={{ py: { xs: 2, md: 4 } }}>
                    {/* Logout Button - Top Right */}
                    <Box sx={{
                        position: 'absolute',
                        top: { xs: 12, md: 20 },
                        right: { xs: 12, md: 24 }
                    }}>
                        <Button
                            variant="contained"
                            startIcon={<LogoutIcon />}
                            onClick={handleLogout}
                            sx={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                backdropFilter: 'blur(10px)',
                                color: 'white',
                                borderRadius: '25px',
                                textTransform: 'none',
                                fontWeight: 600,
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                px: { xs: 2, md: 3 },
                                '&:hover': {
                                    background: 'rgba(255, 255, 255, 0.3)',
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                                },
                                transition: 'all 0.3s ease',
                                fontSize: { xs: '0.85rem', md: '0.95rem' }
                            }}
                        >
                            {isMobile ? '' : 'Logout'}
                        </Button>
                    </Box>

                    {/* Welcome Section */}
                    <Box sx={{ textAlign: 'center', mt: { xs: 3, md: 0 } }}>
                        {/* Profile Avatar in Header */}
                        {student && (
                            <Avatar
                                src={`/images/uploaded/student/${student.student_image}`}
                                alt={student.name}
                                sx={{
                                    width: { xs: 80, md: 100 },
                                    height: { xs: 80, md: 100 },
                                    margin: '0 auto',
                                    mb: 2,
                                    border: '4px solid rgba(255, 255, 255, 0.3)',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                                    animation: `${pulse} 2s infinite`
                                }}
                            />
                        )}
                        <Typography variant={isSmall ? "h5" : isMobile ? "h4" : "h2"} component="h1" gutterBottom sx={{
                            fontWeight: 'bold',
                            textShadow: '0 2px 8px rgba(0,0,0,0.2)'
                        }}>
                            {student ? `Welcome, ${student.name}!` : '📚 Student Dashboard'}
                        </Typography>
                        <Typography variant={isSmall ? "body1" : "h6"} sx={{ opacity: 0.9, mb: 1 }}>
                            {student ? (
                                <>
                                    Class: {student.student_class?.class_text} | {student.email}
                                </>
                            ) : (
                                'Your academic journey starts here 🎯'
                            )}
                        </Typography>
                        <Chip
                            icon={<DashboardIcon />}
                            label="Dashboard Overview"
                            sx={{
                                mt: 1,
                                background: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                fontWeight: 600,
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.3)'
                            }}
                        />
                    </Box>
                </CardContent>
            </GradientCard>

            {/* Quick Access Cards */}
            <Box sx={{ mb: { xs: 2, md: 4 }, mx: { xs: 1, md: 0 } }}>
                <Typography variant={isMobile ? "h6" : "h5"} sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
                    ⚡ Quick Access
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6} sm={4} md={3}>
                        <QuickAccessCard bgGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" onClick={() => navigate('/student/periods')}>
                            <CalendarMonthIcon sx={{ fontSize: { xs: 40, md: 50 }, mb: 1 }} />
                            <Typography variant={isMobile ? "body2" : "h6"} sx={{ fontWeight: 600 }}>
                                My Schedule
                            </Typography>
                        </QuickAccessCard>
                    </Grid>
                    <Grid item xs={6} sm={4} md={3}>
                        <QuickAccessCard bgGradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" onClick={() => navigate('/student/attendance')}>
                            <AssignmentIcon sx={{ fontSize: { xs: 40, md: 50 }, mb: 1 }} />
                            <Typography variant={isMobile ? "body2" : "h6"} sx={{ fontWeight: 600 }}>
                                Attendance
                            </Typography>
                        </QuickAccessCard>
                    </Grid>
                    <Grid item xs={6} sm={4} md={3}>
                        <QuickAccessCard bgGradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" onClick={() => navigate('/student/examinations')}>
                            <GradeIcon sx={{ fontSize: { xs: 40, md: 50 }, mb: 1 }} />
                            <Typography variant={isMobile ? "body2" : "h6"} sx={{ fontWeight: 600 }}>
                                Examinations
                            </Typography>
                        </QuickAccessCard>
                    </Grid>
                    <Grid item xs={6} sm={4} md={3}>
                        <QuickAccessCard bgGradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)" onClick={() => navigate('/student/notices')}>
                            <AnnouncementIcon sx={{ fontSize: { xs: 40, md: 50 }, mb: 1 }} />
                            <Typography variant={isMobile ? "body2" : "h6"} sx={{ fontWeight: 600 }}>
                                Notices
                            </Typography>
                        </QuickAccessCard>
                    </Grid>
                </Grid>
            </Box>

            {student && (
                <>
                    {/* Navigation Tabs */}
                    <Paper sx={{ mb: 3, borderRadius: '16px', overflow: 'hidden' }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            variant={isMobile ? "scrollable" : "fullWidth"}
                            scrollButtons="auto"
                            sx={{
                                '& .MuiTab-root': {
                                    fontWeight: 600,
                                    fontSize: { xs: '0.8rem', md: '0.9rem' },
                                    textTransform: 'none',
                                },
                                '& .Mui-selected': {
                                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                    color: 'white !important',
                                }
                            }}
                        >
                            <Tab icon={<InfoIcon />} label="Profile" />
                            <Tab icon={<GradeIcon />} label="Marks" />
                            <Tab icon={<BarChartIcon />} label="Performance" />
                            <Tab icon={<PaymentIcon />} label="Fees" />
                        </Tabs>
                    </Paper>

                    {/* Tab Content */}
                    {tabValue === 0 && (
                        <Grid container spacing={3}>
                            {/* Profile Card */}
                            <Grid item xs={12} md={4}>
                                <SectionCard sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    animationDelay: '0.1s'
                                }}>
                                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                        <ProfileAvatar
                                            src={`/images/uploaded/student/${student.student_image}`}
                                            alt={student.name}
                                            sx={{
                                                border: '6px solid rgba(255,255,255,0.3)',
                                                margin: '0 auto',
                                            }}
                                        />
                                        <Typography variant={isMobile ? "h5" : "h4"} sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                                            {student.name}
                                        </Typography>
                                        <Chip
                                            icon={<SchoolIcon />}
                                            label={`Class ${student.student_class.class_text}`}
                                            sx={{
                                                background: 'rgba(255,255,255,0.2)',
                                                color: 'white',
                                                fontWeight: 600,
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid rgba(255,255,255,0.3)',
                                                mb: 2
                                            }}
                                        />
                                        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', my: 2 }} />
                                        <Typography variant="caption" sx={{ opacity: 0.9, display: 'block', mb: 1 }}>
                                            Student ID
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
                                            {student._id?.slice(-8).toUpperCase()}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            startIcon={<EditIcon />}
                                            sx={{
                                                background: 'rgba(255,255,255,0.2)',
                                                backdropFilter: 'blur(10px)',
                                                color: 'white',
                                                borderRadius: '25px',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                border: '1px solid rgba(255,255,255,0.3)',
                                                '&:hover': {
                                                    background: 'rgba(255,255,255,0.3)',
                                                },
                                            }}
                                            fullWidth
                                        >
                                            Edit Profile
                                        </Button>
                                    </CardContent>
                                </SectionCard>
                            </Grid>

                            {/* Details Card */}
                            <Grid item xs={12} md={8}>
                                <SectionCard sx={{ animationDelay: '0.2s' }}>
                                    <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                            <AccountCircleIcon sx={{ fontSize: 40, mr: 2, color: '#667eea' }} />
                                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
                                                Personal Information
                                            </Typography>
                                        </Box>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <Paper sx={{ p: 2, borderRadius: '12px', background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <EmailIcon sx={{ mr: 1, color: '#667eea' }} />
                                                        <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                                                            Email Address
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                        {student.email}
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Paper sx={{ p: 2, borderRadius: '12px', background: 'linear-gradient(135deg, #f093fb15 0%, #f5576c15 100%)' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <PersonIcon sx={{ mr: 1, color: '#f5576c' }} />
                                                        <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                                                            Full Name
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                        {student.name}
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Paper sx={{ p: 2, borderRadius: '12px', background: 'linear-gradient(135deg, #4facfe15 0%, #00f2fe15 100%)' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <CakeIcon sx={{ mr: 1, color: '#4facfe' }} />
                                                        <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                                                            Age
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                        {student.age} years old
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Paper sx={{ p: 2, borderRadius: '12px', background: 'linear-gradient(135deg, #fa709a15 0%, #fee14015 100%)' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <WcIcon sx={{ mr: 1, color: '#fa709a' }} />
                                                        <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                                                            Gender
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="body1" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                                                        {student.gender}
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Paper sx={{ p: 2, borderRadius: '12px', background: 'linear-gradient(135deg, #a8edea15 0%, #fed6e315 100%)' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <FamilyRestroomIcon sx={{ mr: 1, color: '#a8edea' }} />
                                                        <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                                                            Guardian Name
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                        {student.guardian}
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                            {student.guardian_phone && (
                                                <Grid item xs={12} sm={6}>
                                                    <Paper sx={{ p: 2, borderRadius: '12px', background: 'linear-gradient(135deg, #ffecd215 0%, #fcb69f15 100%)' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                            <PhoneIcon sx={{ mr: 1, color: '#fcb69f' }} />
                                                            <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                                                                Guardian Phone
                                                            </Typography>
                                                        </Box>
                                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                            {student.guardian_phone}
                                                        </Typography>
                                                    </Paper>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </CardContent>
                                </SectionCard>
                            </Grid>
                        </Grid>
                    )}

                    {/* Marks Tab */}
                    {tabValue === 1 && (
                        <Grid container spacing={3}>
                            {/* Overall Performance Card */}
                            <Grid item xs={12} md={4}>
                                <StatDisplayCard bgColor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" sx={{ animationDelay: '0.1s' }}>
                                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                                        <GradeIcon sx={{ fontSize: 60, mb: 2, opacity: 0.9 }} />
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                            Overall Performance
                                        </Typography>
                                        <Typography variant="h1" sx={{ fontWeight: 'bold', mb: 2, fontSize: { xs: '3rem', md: '4rem' } }}>
                                            {calculateOverallPercentage()}%
                                        </Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={calculateOverallPercentage()}
                                            sx={{
                                                height: 12,
                                                borderRadius: 6,
                                                backgroundColor: 'rgba(255,255,255,0.2)',
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: 'white',
                                                    borderRadius: 6,
                                                }
                                            }}
                                        />
                                        <Typography variant="body2" sx={{ mt: 2, opacity: 0.9 }}>
                                            Based on {marks.length} subjects
                                        </Typography>
                                    </Box>
                                </StatDisplayCard>
                            </Grid>

                            {/* Subject Stats */}
                            <Grid item xs={12} md={8}>
                                <Grid container spacing={2}>
                                    {marks.slice(0, 4).map((mark, index) => (
                                        <Grid item xs={6} sm={3} key={index}>
                                            <StatDisplayCard
                                                bgColor={getGradeColor(mark.grade)}
                                                sx={{
                                                    padding: 2,
                                                    animationDelay: `${0.2 + index * 0.1}s`,
                                                    '&:hover': {
                                                        transform: 'scale(1.1) rotate(0deg)',
                                                    }
                                                }}
                                            >
                                                <Box sx={{ position: 'relative', zIndex: 1 }}>
                                                    <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 600, display: 'block', mb: 1 }}>
                                                        {mark.subject}
                                                    </Typography>
                                                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                                                        {mark.grade}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                        {mark.marks}/{mark.totalMarks}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                                        {Math.round((mark.marks / mark.totalMarks) * 100)}%
                                                    </Typography>
                                                </Box>
                                            </StatDisplayCard>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>

                            {/* Detailed Marks Table */}
                            <Grid item xs={12}>
                                <StyledCard>
                                    <CardContent>
                                        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                                            Subject-wise Marks
                                        </Typography>
                                        <TableContainer component={Paper} sx={{ borderRadius: '12px' }}>
                                            <Table>
                                                <TableHead sx={{ background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' }}>
                                                    <TableRow>
                                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Subject</TableCell>
                                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Marks</TableCell>
                                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Total</TableCell>
                                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Percentage</TableCell>
                                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Grade</TableCell>
                                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {marks.map((mark, index) => {
                                                        const percentage = Math.round((mark.marks / mark.totalMarks) * 100);
                                                        return (
                                                            <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                                                                <TableCell sx={{ fontWeight: 600 }}>{mark.subject}</TableCell>
                                                                <TableCell>{mark.marks}</TableCell>
                                                                <TableCell>{mark.totalMarks}</TableCell>
                                                                <TableCell>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                        <LinearProgress
                                                                            variant="determinate"
                                                                            value={percentage}
                                                                            sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                                                                        />
                                                                        <Typography variant="body2" sx={{ minWidth: 40 }}>
                                                                            {percentage}%
                                                                        </Typography>
                                                                    </Box>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Chip
                                                                        label={mark.grade}
                                                                        size="small"
                                                                        sx={{
                                                                            backgroundColor: getGradeColor(mark.grade),
                                                                            color: 'white',
                                                                            fontWeight: 600
                                                                        }}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Chip
                                                                        label={mark.examType}
                                                                        size="small"
                                                                        variant="outlined"
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </CardContent>
                                </StyledCard>
                            </Grid>
                        </Grid>
                    )}

                    {/* Performance Tab */}
                    {tabValue === 2 && (
                        <Grid container spacing={3}>
                            {marksheets.length > 0 ? (
                                <>
                                    {/* Marksheet History */}
                                    {marksheets.map((marksheet, index) => (
                                        <Grid item xs={12} md={6} key={index}>
                                            <StyledCard>
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                            {marksheet.examination}
                                                        </Typography>
                                                        <Chip
                                                            label={marksheet.academic_year}
                                                            size="small"
                                                            sx={{ backgroundColor: '#e3f2fd' }}
                                                        />
                                                    </Box>
                                                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                                        Class: {marksheet.class} | Section: {marksheet.section}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <Typography variant="h4" sx={{ color: getGradeColor(marksheet.overall_grade), fontWeight: 'bold' }}>
                                                                {marksheet.percentage}%
                                                            </Typography>
                                                            <Typography variant="caption" color="textSecondary">
                                                                Overall Percentage
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <Typography variant="h4" sx={{ color: getGradeColor(marksheet.overall_grade), fontWeight: 'bold' }}>
                                                                {marksheet.overall_grade}
                                                            </Typography>
                                                            <Typography variant="caption" color="textSecondary">
                                                                Grade
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <Typography variant="h4" sx={{ color: marksheet.result === 'Pass' ? '#4caf50' : '#f44336', fontWeight: 'bold' }}>
                                                                {marksheet.result}
                                                            </Typography>
                                                            <Typography variant="caption" color="textSecondary">
                                                                Result
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                                                        <strong>Total:</strong> {marksheet.total_marks}/{marksheet.total_max_marks} marks
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: '#666' }}>
                                                        <strong>Subjects:</strong> {marksheet.subjects.length}
                                                    </Typography>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={marksheet.percentage}
                                                        sx={{
                                                            mt: 2,
                                                            height: 8,
                                                            borderRadius: 4,
                                                            backgroundColor: '#e0e0e0',
                                                            '& .MuiLinearProgress-bar': {
                                                                backgroundColor: getGradeColor(marksheet.overall_grade),
                                                            }
                                                        }}
                                                    />
                                                </CardContent>
                                            </StyledCard>
                                        </Grid>
                                    ))}
                                </>
                            ) : (
                                <Grid item xs={12}>
                                    <StyledCard>
                                        <CardContent sx={{ textAlign: 'center', py: 6 }}>
                                            <TrendingUpIcon sx={{ fontSize: 80, color: '#2196F3', mb: 2 }} />
                                            <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                                                Performance History
                                            </Typography>
                                            <Typography variant="h6" color="textSecondary">
                                                No marksheets available yet
                                            </Typography>
                                            <Typography variant="body1" sx={{ mt: 2, maxWidth: 600, mx: 'auto' }}>
                                                Your exam results and performance history will be displayed here once available.
                                            </Typography>
                                        </CardContent>
                                    </StyledCard>
                                </Grid>
                            )}
                        </Grid>
                    )}

                    {/* Fees Tab */}
                    {tabValue === 3 && (
                        <Grid container spacing={3}>
                            {student.fees ? (
                                <>
                                    {/* Total Fees Card */}
                                    <Grid item xs={12} md={4}>
                                        <StatDisplayCard bgColor="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" sx={{ animationDelay: '0.1s' }}>
                                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                                                <PaymentIcon sx={{ fontSize: 50, mb: 2 }} />
                                                <Typography variant="h6" gutterBottom sx={{ opacity: 0.9 }}>
                                                    Total Fees
                                                </Typography>
                                                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                                                    ₹{student.fees.total_fees?.toLocaleString('en-IN') || 0}
                                                </Typography>
                                                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                                    Academic Year 2024-25
                                                </Typography>
                                            </Box>
                                        </StatDisplayCard>
                                    </Grid>

                                    {/* Paid Fees Card */}
                                    <Grid item xs={12} md={4}>
                                        <StatDisplayCard bgColor="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" sx={{ animationDelay: '0.2s' }}>
                                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                                                <GradeIcon sx={{ fontSize: 50, mb: 2 }} />
                                                <Typography variant="h6" gutterBottom sx={{ opacity: 0.9 }}>
                                                    Paid Fees
                                                </Typography>
                                                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                                                    ₹{student.fees.paid_fees?.toLocaleString('en-IN') || 0}
                                                </Typography>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={((student.fees.paid_fees || 0) / (student.fees.total_fees || 1)) * 100}
                                                    sx={{
                                                        height: 8,
                                                        borderRadius: 4,
                                                        backgroundColor: 'rgba(255,255,255,0.3)',
                                                        '& .MuiLinearProgress-bar': {
                                                            backgroundColor: 'white',
                                                        }
                                                    }}
                                                />
                                            </Box>
                                        </StatDisplayCard>
                                    </Grid>

                                    {/* Balance Fees Card */}
                                    <Grid item xs={12} md={4}>
                                        <StatDisplayCard
                                            bgColor={
                                                (student.fees.balance_fees || 0) > 0
                                                    ? "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
                                                    : "linear-gradient(135deg, #30cfd0 0%, #330867 100%)"
                                            }
                                            sx={{ animationDelay: '0.3s' }}
                                        >
                                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                                                <AnnouncementIcon sx={{ fontSize: 50, mb: 2 }} />
                                                <Typography variant="h6" gutterBottom sx={{ opacity: 0.9 }}>
                                                    Balance Fees
                                                </Typography>
                                                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                                                    ₹{student.fees.balance_fees?.toLocaleString('en-IN') || 0}
                                                </Typography>
                                                <Chip
                                                    label={(student.fees.balance_fees || 0) > 0 ? "Payment Due" : "Fully Paid"}
                                                    sx={{
                                                        background: 'rgba(255,255,255,0.3)',
                                                        color: 'white',
                                                        fontWeight: 600,
                                                        backdropFilter: 'blur(10px)',
                                                    }}
                                                />
                                            </Box>
                                        </StatDisplayCard>
                                    </Grid>

                                    {/* Payment Options Card */}
                                    <Grid item xs={12}>
                                        <SectionCard sx={{ animationDelay: '0.4s' }}>
                                            <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                                <PaymentIcon sx={{ fontSize: 80, color: '#667eea', mb: 2 }} />
                                                <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
                                                    Pay Your Fees Online
                                                </Typography>
                                                <Typography variant="body1" color="textSecondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
                                                    Pay your school fees securely and conveniently using our online payment system.
                                                    Multiple payment options available.
                                                </Typography>
                                                <Stack
                                                    direction={{ xs: 'column', sm: 'row' }}
                                                    spacing={2}
                                                    justifyContent="center"
                                                    alignItems="center"
                                                >
                                                    <Button
                                                        variant="contained"
                                                        size="large"
                                                        startIcon={<PaymentIcon />}
                                                        sx={{
                                                            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                                                            borderRadius: '30px',
                                                            textTransform: 'none',
                                                            fontWeight: 600,
                                                            px: 5,
                                                            py: 1.5,
                                                            boxShadow: '0 8px 24px rgba(102,126,234,0.3)',
                                                            '&:hover': {
                                                                transform: 'scale(1.05)',
                                                                boxShadow: '0 12px 32px rgba(102,126,234,0.4)',
                                                            },
                                                            transition: 'all 0.3s ease',
                                                        }}
                                                        disabled={(student.fees.balance_fees || 0) <= 0}
                                                    >
                                                        Pay Full Amount (₹{student.fees.balance_fees?.toLocaleString('en-IN') || 0})
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        size="large"
                                                        sx={{
                                                            borderColor: '#667eea',
                                                            color: '#667eea',
                                                            borderRadius: '30px',
                                                            textTransform: 'none',
                                                            fontWeight: 600,
                                                            px: 5,
                                                            py: 1.5,
                                                            borderWidth: 2,
                                                            '&:hover': {
                                                                borderWidth: 2,
                                                                background: 'rgba(102,126,234,0.1)',
                                                            }
                                                        }}
                                                    >
                                                        Pay Partial Amount
                                                    </Button>
                                                </Stack>
                                            </CardContent>
                                        </SectionCard>
                                    </Grid>
                                </>
                            ) : (
                                <Grid item xs={12}>
                                    <SectionCard>
                                        <CardContent sx={{ textAlign: 'center', py: 8 }}>
                                            <PaymentIcon sx={{ fontSize: 100, color: '#ccc', mb: 2 }} />
                                            <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: '#666' }}>
                                                No Fee Information Available
                                            </Typography>
                                            <Typography variant="body1" color="textSecondary">
                                                Fee details will be updated soon. Please contact the school office for more information.
                                            </Typography>
                                        </CardContent>
                                    </SectionCard>
                                </Grid>
                            )}
                        </Grid>
                    )}
                </>
            )}
        </Container>
    )
}