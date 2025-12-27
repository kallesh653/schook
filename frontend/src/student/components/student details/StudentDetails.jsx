import {
    Box, Button, Typography, Container, Card, CardContent, Grid, Avatar, Chip,
    LinearProgress, CircularProgress, IconButton, useTheme, useMediaQuery,
    Stack, Skeleton, SwipeableDrawer, Divider, List, ListItem, ListItemText, ListItemIcon
} from "@mui/material";
import { styled, keyframes } from '@mui/material/styles';
import axios from "axios";
import { useEffect, useState } from "react";
import { baseUrl } from "../../../environment";
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import NotificationPermission from '../notifications/NotificationPermission';

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
import PaymentIcon from '@mui/icons-material/Payment';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InfoIcon from '@mui/icons-material/Info';
import SwipeIcon from '@mui/icons-material/Swipe';
import TouchAppIcon from '@mui/icons-material/TouchApp';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

// Mobile App Card - swipeable
const MobileCard = styled(Card)(({ theme }) => ({
  borderRadius: '24px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
  overflow: 'hidden',
  margin: theme.spacing(2, 2),
  background: '#ffffff',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:active': {
    transform: 'scale(0.98)',
  },
  [theme.breakpoints.up('md')]: {
    margin: theme.spacing(2, 0),
  },
}));

// Header Card
const HeaderCard = styled(Card)(({ theme }) => ({
  background: '#1976d2',
  color: 'white',
  borderRadius: '0 0 32px 32px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  position: 'relative',
  overflow: 'hidden',
}));

// Quick Action Button
const QuickActionCard = styled(Card)(({ theme, bgcolor }) => ({
  borderRadius: '20px',
  padding: theme.spacing(2),
  textAlign: 'center',
  background: bgcolor || '#1976d2',
  color: 'white',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  minHeight: '100px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  '&:active': {
    transform: 'scale(0.95)',
  },
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
  },
}));

// Info Card with Icon
const InfoCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  padding: theme.spacing(2),
  background: '#ffffff',
  border: '2px solid #e0e0e0',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: '#667eea',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.2)',
  },
}));

// Stats Card
const StatsCard = styled(Card)(({ theme, bgColor }) => ({
  borderRadius: '20px',
  padding: theme.spacing(2.5),
  textAlign: 'center',
  background: bgColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    right: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
}));

export default function StudentDetails(){
    const [student, setStudent] = useState(null);
    const [marks, setMarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
    const [selectedMarksheet, setSelectedMarksheet] = useState(null);
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
            console.log("Error:", e);
            setLoading(false);
        })
    }

    const fetchStudentMarks = () => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const headers = token ? { 'Authorization': token } : {};

        axios.get(`${baseUrl}/student/marksheets`, { headers }).then(resp => {
            if (resp.data.success && resp.data.data.length > 0) {
                const allSubjects = [];
                resp.data.data.forEach(marksheet => {
                    marksheet.subjects.forEach(subject => {
                        allSubjects.push({
                            subject: subject.subject,
                            marks: subject.marks,
                            totalMarks: subject.totalMarks,
                            percentage: subject.percentage || Math.round((subject.marks / subject.totalMarks) * 100),
                            grade: subject.grade,
                        });
                    });
                });
                setMarks(allSubjects);
            }
            setLoading(false);
        }).catch(e => {
            console.log("Error:", e);
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

    // Swipe handlers
    const handlers = useSwipeable({
        onSwipedLeft: () => setCurrentCardIndex(prev => Math.min(prev + 1, 2)),
        onSwipedRight: () => setCurrentCardIndex(prev => Math.max(prev - 1, 0)),
        trackMouse: true
    });

    useEffect(()=>{
        getStudentDetails();
    },[])

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Stack spacing={2}>
                    <Skeleton variant="rectangular" height={200} sx={{ borderRadius: '24px' }} />
                    <Grid container spacing={2}>
                        {[1,2,3,4].map((i) => (
                            <Grid item xs={6} key={i}>
                                <Skeleton variant="rectangular" height={100} sx={{ borderRadius: '20px' }} />
                            </Grid>
                        ))}
                    </Grid>
                </Stack>
            </Container>
        );
    }

    const quickActions = [
        { label: "Schedule", icon: <CalendarMonthIcon sx={{ fontSize: 40 }} />, route: "/student/periods", bgcolor: "#1976d2" },
        { label: "Attendance", icon: <AssignmentIcon sx={{ fontSize: 40 }} />, route: "/student/attendance", bgcolor: "#388e3c" },
        { label: "Exams", icon: <GradeIcon sx={{ fontSize: 40 }} />, route: "/student/examinations", bgcolor: "#f57c00" },
        { label: "Notices", icon: <AnnouncementIcon sx={{ fontSize: 40 }} />, route: "/student/notice", bgcolor: "#d32f2f" },
    ];

    return(
        <Box sx={{ minHeight: '100vh', pb: { xs: 2, md: 4 } }}>
            {/* Profile Header - Mobile Optimized */}
            <HeaderCard sx={{ mx: { xs: 0, md: 2 }, borderRadius: { xs: '0 0 32px 32px', md: '24px' } }}>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <Avatar
                            src={student?.student_image ? `${baseUrl.replace('/api', '')}/uploads/student/${student.student_image}` : undefined}
                            sx={{
                                width: { xs: 90, md: 110 },
                                height: { xs: 90, md: 110 },
                                margin: '0 auto',
                                mb: 2,
                                border: '4px solid rgba(255, 255, 255, 0.3)',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                                animation: `${float} 3s ease-in-out infinite`,
                            }}
                        >
                            {!student?.student_image && <PersonIcon sx={{ fontSize: 50 }} />}
                        </Avatar>
                        <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 'bold', mb: 0.5 }}>
                            {student?.name || 'Student'}
                        </Typography>
                        <Chip
                            icon={<SchoolIcon />}
                            label={student?.student_class?.class_text || 'Class'}
                            sx={{
                                background: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                fontWeight: 600,
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.3)',
                            }}
                        />
                    </Box>

                    {/* Quick Stats */}
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={4}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    {calculateOverallPercentage()}%
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                    Overall
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    {marks.length}
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                    Subjects
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    A+
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                    Grade
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </HeaderCard>

            <Container maxWidth="lg" sx={{ px: { xs: 0, md: 3 } }}>
                {/* Notification Permission Banner */}
                <Box sx={{ mx: { xs: 2, md: 0 }, mb: 2 }}>
                    <NotificationPermission />
                </Box>

                {/* Swipe Hint (Mobile Only) */}
                {isMobile && (
                    <Box sx={{ textAlign: 'center', py: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <SwipeIcon sx={{ fontSize: 20, color: '#667eea', animation: `${float} 2s ease-in-out infinite` }} />
                        <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                            Swipe to explore sections
                        </Typography>
                    </Box>
                )}

                {/* Quick Actions - Mobile Grid */}
                <Box sx={{ mb: 3, mx: { xs: 2, md: 0 } }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#333', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TouchAppIcon /> Quick Access
                    </Typography>
                    <Grid container spacing={2}>
                        {quickActions.map((action, index) => (
                            <Grid item xs={6} sm={3} key={index}>
                                <QuickActionCard
                                    bgcolor={action.bgcolor}
                                    onClick={() => navigate(action.route)}
                                    sx={{ animation: `${fadeIn} ${0.3 + index * 0.1}s ease-out` }}
                                >
                                    {action.icon}
                                    <Typography variant="body2" sx={{ fontWeight: 600, mt: 1 }}>
                                        {action.label}
                                    </Typography>
                                </QuickActionCard>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Performance Overview */}
                <MobileCard {...handlers} sx={{ animation: `${slideIn} 0.5s ease-out` }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <BarChartIcon /> Performance
                            </Typography>
                            <IconButton
                                size="small"
                                onClick={() => navigate('/student/results')}
                                sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                                    }
                                }}
                            >
                                <ChevronRightIcon />
                            </IconButton>
                        </Box>

                        <Grid container spacing={2}>
                            {marks.slice(0, 4).map((mark, index) => (
                                <Grid item xs={6} key={index}>
                                    <StatsCard bgColor={getGradeColor(mark.grade)}>
                                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                                            <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 600, display: 'block', mb: 0.5 }}>
                                                {mark.subject}
                                            </Typography>
                                            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                {mark.grade}
                                            </Typography>
                                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                                {mark.marks}/{mark.totalMarks}
                                            </Typography>
                                            <LinearProgress
                                                variant="determinate"
                                                value={mark.percentage}
                                                sx={{
                                                    mt: 1,
                                                    height: 4,
                                                    borderRadius: 2,
                                                    backgroundColor: 'rgba(255,255,255,0.3)',
                                                    '& .MuiLinearProgress-bar': {
                                                        backgroundColor: 'white',
                                                    }
                                                }}
                                            />
                                        </Box>
                                    </StatsCard>
                                </Grid>
                            ))}
                        </Grid>

                        {marks.length > 4 && (
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => navigate('/student/results')}
                                sx={{
                                    mt: 2,
                                    borderRadius: '12px',
                                    borderColor: '#667eea',
                                    color: '#667eea',
                                    fontWeight: 600,
                                    '&:hover': {
                                        borderColor: '#764ba2',
                                        background: 'rgba(102, 126, 234, 0.1)',
                                    }
                                }}
                            >
                                View All {marks.length} Subjects
                            </Button>
                        )}
                    </CardContent>
                </MobileCard>

                {/* Personal Information */}
                {student && (
                    <MobileCard sx={{ animation: `${slideIn} 0.6s ease-out` }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AccountCircleIcon /> Personal Info
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <InfoCard>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{
                                                p: 1.5,
                                                borderRadius: '12px',
                                                background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                                            }}>
                                                <EmailIcon sx={{ color: '#667eea', fontSize: 28 }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                                                    Email
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {student.email}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </InfoCard>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <InfoCard>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{
                                                p: 1.5,
                                                borderRadius: '12px',
                                                background: 'linear-gradient(135deg, #4facfe15 0%, #00f2fe15 100%)',
                                            }}>
                                                <CakeIcon sx={{ color: '#4facfe', fontSize: 28 }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                                                    Age
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {student.age} years
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </InfoCard>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <InfoCard>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{
                                                p: 1.5,
                                                borderRadius: '12px',
                                                background: 'linear-gradient(135deg, #fa709a15 0%, #fee14015 100%)',
                                            }}>
                                                <WcIcon sx={{ color: '#fa709a', fontSize: 28 }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                                                    Gender
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                                                    {student.gender}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </InfoCard>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <InfoCard>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{
                                                p: 1.5,
                                                borderRadius: '12px',
                                                background: 'linear-gradient(135deg, #a8edea15 0%, #fed6e315 100%)',
                                            }}>
                                                <FamilyRestroomIcon sx={{ color: '#a8edea', fontSize: 28 }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                                                    Guardian
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {student.guardian}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </InfoCard>
                                </Grid>

                                {student.guardian_phone && (
                                    <Grid item xs={12}>
                                        <InfoCard>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Box sx={{
                                                    p: 1.5,
                                                    borderRadius: '12px',
                                                    background: 'linear-gradient(135deg, #ffecd215 0%, #fcb69f15 100%)',
                                                }}>
                                                    <PhoneIcon sx={{ color: '#fcb69f', fontSize: 28 }} />
                                                </Box>
                                                <Box>
                                                    <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                                                        Guardian Phone
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                        {student.guardian_phone}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </InfoCard>
                                    </Grid>
                                )}
                            </Grid>
                        </CardContent>
                    </MobileCard>
                )}
            </Container>
        </Box>
    )
}
