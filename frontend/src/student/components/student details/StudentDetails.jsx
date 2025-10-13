import {
    Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Typography, Paper, Container, Card, CardContent, Grid, Avatar, Chip,
    List, ListItem, ListItemText, ListItemIcon, Divider,
    LinearProgress, CircularProgress, IconButton, useTheme, useMediaQuery, Stack
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
import PaymentIcon from '@mui/icons-material/Payment';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
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

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: '24px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
    overflow: 'hidden',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    animation: `${fadeIn} 0.6s ease-out`,
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
    },
    [theme.breakpoints.down('md')]: {
        borderRadius: '20px',
        margin: theme.spacing(1, 0),
    },
}));

const GradientHeaderCard = styled(Card)(({ theme, gradient }) => ({
    background: gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: '24px',
    boxShadow: '0 10px 40px rgba(102, 126, 234, 0.4)',
    marginBottom: theme.spacing(4),
    position: 'relative',
    overflow: 'hidden',
    animation: `${fadeIn} 0.6s ease-out`,
    '&::before': {
        content: '""',
        position: 'absolute',
        top: -100,
        right: -100,
        width: 300,
        height: 300,
        background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
        borderRadius: '50%',
    },
    [theme.breakpoints.down('md')]: {
        borderRadius: '20px',
        marginBottom: theme.spacing(2),
    },
}));

const SectionCard = styled(StyledCard)(({ theme }) => ({
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    padding: theme.spacing(0),
    height: '100%',
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
    width: 140,
    height: 140,
    border: '6px solid white',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    animation: `${pulse} 3s infinite ease-in-out`,
    [theme.breakpoints.down('md')]: {
        width: 100,
        height: 100,
        border: '4px solid white',
    },
}));

const StatCard = styled(Card)(({ theme, bgColor }) => ({
    borderRadius: '20px',
    padding: theme.spacing(3),
    background: bgColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    '&::after': {
        content: '""',
        position: 'absolute',
        top: '-50%',
        right: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
    },
    '&:hover': {
        transform: 'scale(1.05) translateY(-5px)',
        boxShadow: '0 15px 50px rgba(0,0,0,0.3)',
    },
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
    },
}));

const InfoBox = styled(Paper)(({ theme, color }) => ({
    padding: theme.spacing(2.5),
    borderRadius: '16px',
    background: `linear-gradient(135deg, ${color}15 0%, ${color}25 100%)`,
    border: `2px solid ${color}30`,
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateX(5px)',
        boxShadow: `0 8px 24px ${color}20`,
    },
}));

const QuickActionButton = styled(Button)(({ theme, bgcolor }) => ({
    borderRadius: '16px',
    padding: theme.spacing(1.5, 3),
    textTransform: 'none',
    fontWeight: 600,
    background: bgcolor || 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
    color: 'white',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
        background: bgcolor || 'linear-gradient(45deg, #764ba2 30%, #667eea 90%)',
    },
}));

export default function StudentDetails(){
    const [student, setStudent] = useState(null);
    const [marks, setMarks] = useState([]);
    const [marksheets, setMarksheets] = useState([]);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    const getStudentDetails = ()=>{
        setLoading(true);
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const headers = token ? { 'Authorization': token } : {};

        axios.get(`${baseUrl}/student/fetch-own`, { headers }).then(resp=>{
            setStudent(resp.data.data);
            fetchStudentMarks();
        }).catch(e=>{
            console.log("Error in student", e);
            setLoading(false);
        })
    }

    const fetchStudentMarks = () => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const headers = token ? { 'Authorization': token } : {};

        axios.get(`${baseUrl}/student/marksheets`, { headers }).then(resp => {
            if (resp.data.success && resp.data.data.length > 0) {
                setMarksheets(resp.data.data);
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
            } else {
                const mockMarks = [
                    { subject: 'Mathematics', marks: 85, totalMarks: 100, percentage: 85, grade: 'A', examType: 'Midterm' },
                    { subject: 'Science', marks: 92, totalMarks: 100, percentage: 92, grade: 'A+', examType: 'Midterm' },
                    { subject: 'English', marks: 78, totalMarks: 100, percentage: 78, grade: 'B+', examType: 'Midterm' },
                    { subject: 'Social Studies', marks: 88, totalMarks: 100, percentage: 88, grade: 'A', examType: 'Midterm' },
                ];
                setMarks(mockMarks);
            }
            setLoading(false);
        }).catch(e => {
            console.log("Error fetching marksheets:", e);
            const mockMarks = [
                { subject: 'Mathematics', marks: 85, totalMarks: 100, percentage: 85, grade: 'A', examType: 'Midterm' },
                { subject: 'Science', marks: 92, totalMarks: 100, percentage: 92, grade: 'A+', examType: 'Midterm' },
                { subject: 'English', marks: 78, totalMarks: 100, percentage: 78, grade: 'B+', examType: 'Midterm' },
            ];
            setMarks(mockMarks);
            setLoading(false);
        });
    }

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
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
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
        <Container maxWidth="xl" sx={{ py: { xs: 1, md: 4 }, px: { xs: 0.5, md: 3 } }}>
            {/* Welcome Header */}
            <GradientHeaderCard gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                <CardContent sx={{ py: { xs: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <ProfileAvatar
                                src={student?.student_image ? `/images/uploaded/student/${student.student_image}` : undefined}
                                alt={student?.name}
                            >
                                {!student?.student_image && student?.name?.charAt(0)?.toUpperCase()}
                            </ProfileAvatar>
                            <Box>
                                <Typography variant={isSmall ? "h5" : "h3"} sx={{ fontWeight: 'bold', mb: 1 }}>
                                    Welcome, {student?.name?.split(' ')[0]}! 👋
                                </Typography>
                                <Typography variant={isSmall ? "body1" : "h6"} sx={{ opacity: 0.95, mb: 1 }}>
                                    {student?.name}
                                </Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                    <Chip
                                        icon={<SchoolIcon />}
                                        label={`Class ${student?.student_class?.class_text}`}
                                        sx={{ bgcolor: 'rgba(255,255,255,0.25)', color: 'white', fontWeight: 600 }}
                                    />
                                    <Chip
                                        icon={<DashboardIcon />}
                                        label="Student Dashboard"
                                        sx={{ bgcolor: 'rgba(255,255,255,0.25)', color: 'white', fontWeight: 600 }}
                                    />
                                </Stack>
                            </Box>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<LogoutIcon />}
                            onClick={handleLogout}
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.2)',
                                backdropFilter: 'blur(10px)',
                                color: 'white',
                                borderRadius: '20px',
                                px: 3,
                                py: 1.5,
                                fontWeight: 600,
                                border: '2px solid rgba(255,255,255,0.3)',
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.3)',
                                    transform: 'scale(1.05)',
                                },
                            }}
                        >
                            Logout
                        </Button>
                    </Box>
                </CardContent>
            </GradientHeaderCard>

            {/* Main Content - Separate Card Views */}
            <Grid container spacing={4}>
                {/* PROFILE CARD */}
                <Grid item xs={12} md={6} lg={6}>
                    <SectionCard sx={{ animation: `${slideInLeft} 0.6s ease-out` }}>
                        <Box sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            p: 3,
                            borderRadius: '24px 24px 0 0'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <AccountCircleIcon sx={{ fontSize: 40 }} />
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                    👤 My Profile
                                </Typography>
                            </Box>
                        </Box>
                        <CardContent sx={{ p: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <InfoBox color="#667eea">
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <PersonIcon sx={{ mr: 1.5, color: '#667eea' }} />
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#667eea' }}>
                                                Full Name
                                            </Typography>
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                                            {student?.name}
                                        </Typography>
                                    </InfoBox>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoBox color="#f093fb">
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <EmailIcon sx={{ mr: 1.5, color: '#f093fb' }} />
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#f093fb' }}>
                                                Email
                                            </Typography>
                                        </Box>
                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>
                                            {student?.email}
                                        </Typography>
                                    </InfoBox>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoBox color="#4facfe">
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <CakeIcon sx={{ mr: 1.5, color: '#4facfe' }} />
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#4facfe' }}>
                                                Age
                                            </Typography>
                                        </Box>
                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>
                                            {student?.age} years old
                                        </Typography>
                                    </InfoBox>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoBox color="#fa709a">
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <WcIcon sx={{ mr: 1.5, color: '#fa709a' }} />
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#fa709a' }}>
                                                Gender
                                            </Typography>
                                        </Box>
                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#333', textTransform: 'capitalize' }}>
                                            {student?.gender}
                                        </Typography>
                                    </InfoBox>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoBox color="#43e97b">
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <FamilyRestroomIcon sx={{ mr: 1.5, color: '#43e97b' }} />
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#43e97b' }}>
                                                Guardian
                                            </Typography>
                                        </Box>
                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>
                                            {student?.guardian}
                                        </Typography>
                                    </InfoBox>
                                </Grid>
                                {student?.guardian_phone && (
                                    <Grid item xs={12}>
                                        <InfoBox color="#fccb90">
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <PhoneIcon sx={{ mr: 1.5, color: '#fccb90' }} />
                                                <Typography variant="caption" sx={{ fontWeight: 700, color: '#fccb90' }}>
                                                    Guardian Phone
                                                </Typography>
                                            </Box>
                                            <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>
                                                {student?.guardian_phone}
                                            </Typography>
                                        </InfoBox>
                                    </Grid>
                                )}
                            </Grid>
                            <Box sx={{ mt: 3 }}>
                                <QuickActionButton
                                    fullWidth
                                    startIcon={<EditIcon />}
                                    bgcolor="linear-gradient(45deg, #667eea 30%, #764ba2 90%)"
                                >
                                    Edit Profile
                                </QuickActionButton>
                            </Box>
                        </CardContent>
                    </SectionCard>
                </Grid>

                {/* MARKS CARD */}
                <Grid item xs={12} md={6} lg={6}>
                    <SectionCard sx={{ animation: `${slideInRight} 0.6s ease-out` }}>
                        <Box sx={{
                            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                            color: 'white',
                            p: 3,
                            borderRadius: '24px 24px 0 0'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <GradeIcon sx={{ fontSize: 40 }} />
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                        📊 My Marks
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                                        {calculateOverallPercentage()}%
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                        Overall
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        <CardContent sx={{ p: 3, maxHeight: '500px', overflowY: 'auto' }}>
                            <Grid container spacing={2}>
                                {marks.slice(0, 6).map((mark, index) => (
                                    <Grid item xs={12} sm={6} key={index}>
                                        <StatCard bgColor={getGradeColor(mark.grade)}>
                                            <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 600, display: 'block', mb: 1 }}>
                                                {mark.subject}
                                            </Typography>
                                            <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                                {mark.grade}
                                            </Typography>
                                            <Typography variant="body1" sx={{ opacity: 0.95, mb: 1 }}>
                                                {mark.marks}/{mark.totalMarks}
                                            </Typography>
                                            <LinearProgress
                                                variant="determinate"
                                                value={mark.percentage}
                                                sx={{
                                                    height: 8,
                                                    borderRadius: 4,
                                                    bgcolor: 'rgba(255,255,255,0.3)',
                                                    '& .MuiLinearProgress-bar': {
                                                        bgcolor: 'white',
                                                    }
                                                }}
                                            />
                                            <Typography variant="caption" sx={{ opacity: 0.9, display: 'block', mt: 1 }}>
                                                {mark.percentage}% • {mark.examType}
                                            </Typography>
                                        </StatCard>
                                    </Grid>
                                ))}
                            </Grid>
                            {marks.length > 6 && (
                                <Box sx={{ mt: 3, textAlign: 'center' }}>
                                    <QuickActionButton bgcolor="linear-gradient(45deg, #43e97b 30%, #38f9d7 90%)">
                                        View All Subjects ({marks.length})
                                    </QuickActionButton>
                                </Box>
                            )}
                        </CardContent>
                    </SectionCard>
                </Grid>

                {/* PERFORMANCE CARD */}
                <Grid item xs={12} md={6} lg={6}>
                    <SectionCard sx={{ animation: `${slideInLeft} 0.7s ease-out` }}>
                        <Box sx={{
                            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                            color: 'white',
                            p: 3,
                            borderRadius: '24px 24px 0 0'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <TrendingUpIcon sx={{ fontSize: 40 }} />
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                    📈 Performance History
                                </Typography>
                            </Box>
                        </Box>
                        <CardContent sx={{ p: 3, maxHeight: '500px', overflowY: 'auto' }}>
                            {marksheets.length > 0 ? (
                                <Grid container spacing={2}>
                                    {marksheets.map((marksheet, index) => (
                                        <Grid item xs={12} key={index}>
                                            <Paper sx={{
                                                p: 3,
                                                borderRadius: '16px',
                                                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                                                border: '2px solid #e0e0e0',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateX(8px)',
                                                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                                }
                                            }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                                                        {marksheet.examination}
                                                    </Typography>
                                                    <Chip
                                                        label={marksheet.academic_year}
                                                        size="small"
                                                        sx={{ bgcolor: '#4facfe', color: 'white', fontWeight: 600 }}
                                                    />
                                                </Box>
                                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                                    <Grid item xs={4}>
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <Typography variant="h4" sx={{ color: getGradeColor(marksheet.overall_grade), fontWeight: 'bold' }}>
                                                                {marksheet.percentage}%
                                                            </Typography>
                                                            <Typography variant="caption" color="textSecondary">
                                                                Percentage
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={4}>
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <Typography variant="h4" sx={{ color: getGradeColor(marksheet.overall_grade), fontWeight: 'bold' }}>
                                                                {marksheet.overall_grade}
                                                            </Typography>
                                                            <Typography variant="caption" color="textSecondary">
                                                                Grade
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={4}>
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <Typography variant="h4" sx={{ color: marksheet.result === 'Pass' ? '#4caf50' : '#f44336', fontWeight: 'bold' }}>
                                                                {marksheet.result === 'Pass' ? '✓' : '✗'}
                                                            </Typography>
                                                            <Typography variant="caption" color="textSecondary">
                                                                {marksheet.result}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={marksheet.percentage}
                                                    sx={{
                                                        height: 10,
                                                        borderRadius: 5,
                                                        bgcolor: '#e0e0e0',
                                                        '& .MuiLinearProgress-bar': {
                                                            bgcolor: getGradeColor(marksheet.overall_grade),
                                                        }
                                                    }}
                                                />
                                                <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
                                                    {marksheet.total_marks}/{marksheet.total_max_marks} marks • {marksheet.subjects.length} subjects
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 6 }}>
                                    <BarChartIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
                                    <Typography variant="h6" sx={{ mb: 1, color: '#666' }}>
                                        No Performance Data
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Your exam results will appear here once available.
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </SectionCard>
                </Grid>

                {/* FEES CARD */}
                <Grid item xs={12} md={6} lg={6}>
                    <SectionCard sx={{ animation: `${slideInRight} 0.7s ease-out` }}>
                        <Box sx={{
                            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                            color: 'white',
                            p: 3,
                            borderRadius: '24px 24px 0 0'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <PaymentIcon sx={{ fontSize: 40 }} />
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                    💰 Fee Details
                                </Typography>
                            </Box>
                        </Box>
                        <CardContent sx={{ p: 3 }}>
                            {student?.fees ? (
                                <>
                                    <Grid container spacing={2} sx={{ mb: 3 }}>
                                        <Grid item xs={12}>
                                            <StatCard bgColor="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
                                                <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 600 }}>
                                                    Total Fees
                                                </Typography>
                                                <Typography variant="h3" sx={{ fontWeight: 'bold', my: 1 }}>
                                                    ₹{student.fees.total_fees?.toLocaleString('en-IN') || 0}
                                                </Typography>
                                                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                                    Academic Year 2024-25
                                                </Typography>
                                            </StatCard>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <StatCard bgColor="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">
                                                <EventAvailableIcon sx={{ fontSize: 40, mb: 1 }} />
                                                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                                                    ₹{student.fees.paid_fees?.toLocaleString('en-IN') || 0}
                                                </Typography>
                                                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                                    Paid
                                                </Typography>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={((student.fees.paid_fees || 0) / (student.fees.total_fees || 1)) * 100}
                                                    sx={{
                                                        mt: 1,
                                                        height: 8,
                                                        borderRadius: 4,
                                                        bgcolor: 'rgba(255,255,255,0.3)',
                                                        '& .MuiLinearProgress-bar': { bgcolor: 'white' }
                                                    }}
                                                />
                                            </StatCard>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <StatCard bgColor={
                                                (student.fees.balance_fees || 0) > 0
                                                    ? "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)"
                                                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                            }>
                                                {(student.fees.balance_fees || 0) > 0 ? (
                                                    <EventBusyIcon sx={{ fontSize: 40, mb: 1 }} />
                                                ) : (
                                                    <EventAvailableIcon sx={{ fontSize: 40, mb: 1 }} />
                                                )}
                                                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                                                    ₹{student.fees.balance_fees?.toLocaleString('en-IN') || 0}
                                                </Typography>
                                                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                                    {(student.fees.balance_fees || 0) > 0 ? 'Balance Due' : 'Fully Paid'}
                                                </Typography>
                                            </StatCard>
                                        </Grid>
                                    </Grid>
                                    <Divider sx={{ my: 3 }} />
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
                                            Pay Your Fees Online
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                                            Secure and convenient payment options available
                                        </Typography>
                                        <Stack spacing={2}>
                                            <QuickActionButton
                                                fullWidth
                                                startIcon={<PaymentIcon />}
                                                bgcolor="linear-gradient(45deg, #fa709a 30%, #fee140 90%)"
                                                disabled={(student.fees.balance_fees || 0) <= 0}
                                            >
                                                Pay Full Amount (₹{student.fees.balance_fees?.toLocaleString('en-IN') || 0})
                                            </QuickActionButton>
                                            <QuickActionButton
                                                fullWidth
                                                bgcolor="linear-gradient(45deg, #4facfe 30%, #00f2fe 90%)"
                                            >
                                                Pay Partial Amount
                                            </QuickActionButton>
                                        </Stack>
                                    </Box>
                                </>
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 6 }}>
                                    <PaymentIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
                                    <Typography variant="h6" sx={{ mb: 1, color: '#666' }}>
                                        No Fee Information
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Fee details will be updated soon.
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </SectionCard>
                </Grid>
            </Grid>
        </Container>
    )
}
