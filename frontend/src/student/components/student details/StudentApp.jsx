import React, { useState, useEffect } from 'react';
import {
    Box, Container, Typography, Card, CardContent, Grid, Avatar, Chip,
    IconButton, LinearProgress, CircularProgress, Paper, Badge, Fab,
    Divider, Button, Dialog, DialogTitle, DialogContent, List, ListItem,
    ListItemIcon, ListItemText, ListItemButton, Tooltip, Stack, Alert
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import axios from 'axios';
import { baseUrl } from '../../../environment';
import { useNavigate } from 'react-router-dom';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GradeIcon from '@mui/icons-material/Grade';
import PaymentIcon from '@mui/icons-material/Payment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EventNoteIcon from '@mui/icons-material/EventNote';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import CakeIcon from '@mui/icons-material/Cake';
import WcIcon from '@mui/icons-material/Wc';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import NotificationPermission from '../notifications/NotificationPermission';

// Animations
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

const scaleIn = keyframes`
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

// Styled Components
const StyledCard = styled(Card)(({ theme, gradient }) => ({
    borderRadius: '24px',
    background: gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
    position: 'relative',
    animation: `${fadeIn} 0.6s ease-out`,
    '&:hover': {
        transform: 'translateY(-8px) scale(1.02)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
        transition: 'left 0.5s',
    },
    '&:hover::before': {
        left: '100%',
    },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
    borderRadius: '20px',
    padding: theme.spacing(3),
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    border: '2px solid transparent',
    animation: `${scaleIn} 0.5s ease-out`,
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
        borderColor: theme.palette.primary.main,
    },
}));

const ProfileCard = styled(Paper)(({ theme }) => ({
    borderRadius: '24px',
    padding: theme.spacing(4),
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
    marginBottom: theme.spacing(3),
    position: 'relative',
    overflow: 'hidden',
    '&::after': {
        content: '""',
        position: 'absolute',
        top: -50,
        right: -50,
        width: 200,
        height: 200,
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
        borderRadius: '50%',
    },
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
    width: 120,
    height: 120,
    border: '6px solid white',
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    animation: `${pulse} 3s infinite ease-in-out`,
}));

const StatCard = styled(Paper)(({ theme, color }) => ({
    borderRadius: '16px',
    padding: theme.spacing(2.5),
    background: `linear-gradient(135deg, ${color}20 0%, ${color}40 100%)`,
    border: `2px solid ${color}60`,
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: `0 8px 25px ${color}40`,
    },
}));

const ModernChip = styled(Chip)(({ theme }) => ({
    borderRadius: '12px',
    fontWeight: 600,
    padding: theme.spacing(0.5, 1),
    '&.MuiChip-filled': {
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        color: 'white',
    },
}));

export default function StudentApp() {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedFeature, setSelectedFeature] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStudentData();
    }, []);

    const fetchStudentData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const headers = token ? { 'Authorization': token } : {};

            const response = await axios.get(`${baseUrl}/student/fetch-own`, { headers });

            if (response.data) {
                setStudent(response.data);
            }
        } catch (error) {
            console.error('Error fetching student data:', error);
        } finally {
            setLoading(false);
        }
    };

    const features = [
        {
            id: 'attendance',
            title: 'My Attendance',
            description: 'View your attendance records and statistics',
            icon: CalendarTodayIcon,
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#667eea',
            route: '/student/attendance',
            stats: student ? `${student.attendancePercentage || 0}%` : '0%'
        },
        {
            id: 'schedule',
            title: 'Class Schedule',
            description: 'Check your daily class timetable',
            icon: EventNoteIcon,
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: '#f093fb',
            route: '/student/periods',
            stats: 'Today\'s Classes'
        },
        {
            id: 'exams',
            title: 'Examinations',
            description: 'View exam schedules and results',
            icon: AssignmentIcon,
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: '#4facfe',
            route: '/student/examinations',
            stats: 'Upcoming'
        },
        {
            id: 'grades',
            title: 'My Grades',
            description: 'Check your academic performance',
            icon: GradeIcon,
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: '#43e97b',
            stats: 'View Results'
        },
        {
            id: 'fees',
            title: 'Fee Details',
            description: 'View fee structure and payments',
            icon: PaymentIcon,
            gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: '#fa709a',
            stats: student?.fees ? `₹${student.fees.balance_fees}` : '₹0'
        },
        {
            id: 'notices',
            title: 'Notices',
            description: 'Important announcements and updates',
            icon: NotificationsIcon,
            gradient: 'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
            color: '#fccb90',
            route: '/student/notice',
            badge: 3
        },
        {
            id: 'subjects',
            title: 'My Subjects',
            description: 'View subjects and teachers',
            icon: MenuBookIcon,
            gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            color: '#a8edea',
            stats: 'View All'
        },
        {
            id: 'profile',
            title: 'My Profile',
            description: 'View and update your information',
            icon: PersonIcon,
            gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
            color: '#ff9a9e',
        }
    ];

    const handleFeatureClick = (feature) => {
        if (feature.route) {
            navigate(feature.route);
        } else {
            setSelectedFeature(feature);
        }
    };

    const handleCloseDialog = () => {
        setSelectedFeature(null);
    };

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '80vh',
                flexDirection: 'column',
                gap: 2
            }}>
                <CircularProgress size={60} thickness={4} />
                <Typography variant="h6" color="textSecondary">
                    Loading your dashboard...
                </Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            {/* Push Notification Permission */}
            <NotificationPermission />

            {/* Profile Header Card */}
            <ProfileCard elevation={0}>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md="auto" sx={{ display: 'flex', justifyContent: 'center' }}>
                        <ProfileAvatar
                            src={student?.student_image}
                            alt={student?.name}
                        >
                            {student?.name?.charAt(0)?.toUpperCase()}
                        </ProfileAvatar>
                    </Grid>
                    <Grid item xs={12} md>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                            Welcome Back, {student?.name?.split(' ')[0]}! 👋
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                            {student?.name}
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            <ModernChip
                                icon={<SchoolIcon />}
                                label={student?.student_class?.class_text || 'N/A'}
                                color="primary"
                            />
                            <ModernChip
                                icon={<EmailIcon />}
                                label={student?.email}
                                variant="outlined"
                                sx={{ borderColor: 'white', color: 'white' }}
                            />
                        </Stack>
                    </Grid>
                </Grid>
            </ProfileCard>

            {/* Quick Stats */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={6} sm={3}>
                    <StatCard color="#667eea">
                        <Box sx={{ textAlign: 'center' }}>
                            <TrendingUpIcon sx={{ fontSize: 40, color: '#667eea', mb: 1 }} />
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>
                                {student?.attendancePercentage || 0}%
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Attendance
                            </Typography>
                        </Box>
                    </StatCard>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <StatCard color="#43e97b">
                        <Box sx={{ textAlign: 'center' }}>
                            <GradeIcon sx={{ fontSize: 40, color: '#43e97b', mb: 1 }} />
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#43e97b' }}>
                                A+
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Grade
                            </Typography>
                        </Box>
                    </StatCard>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <StatCard color="#fa709a">
                        <Box sx={{ textAlign: 'center' }}>
                            <PaymentIcon sx={{ fontSize: 40, color: '#fa709a', mb: 1 }} />
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#fa709a' }}>
                                ₹{student?.fees?.balance_fees || 0}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Due Fees
                            </Typography>
                        </Box>
                    </StatCard>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <StatCard color="#fccb90">
                        <Box sx={{ textAlign: 'center' }}>
                            <NotificationsIcon sx={{ fontSize: 40, color: '#fccb90', mb: 1 }} />
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#fccb90' }}>
                                3
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Notices
                            </Typography>
                        </Box>
                    </StatCard>
                </Grid>
            </Grid>

            {/* Features Grid */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#333' }}>
                    📚 Quick Access
                </Typography>
                <Grid container spacing={3}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={feature.id}>
                            <FeatureCard
                                elevation={0}
                                onClick={() => handleFeatureClick(feature)}
                                sx={{
                                    animationDelay: `${index * 0.1}s`,
                                }}
                            >
                                <Box sx={{ position: 'relative' }}>
                                    {feature.badge && (
                                        <Badge
                                            badgeContent={feature.badge}
                                            color="error"
                                            sx={{ position: 'absolute', top: -10, right: -10 }}
                                        />
                                    )}
                                    <Box
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: '16px',
                                            background: feature.gradient,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: 2,
                                            boxShadow: `0 4px 20px ${feature.color}40`,
                                        }}
                                    >
                                        <feature.icon sx={{ fontSize: 30, color: 'white' }} />
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#333' }}>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                        {feature.description}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Chip
                                            label={feature.stats}
                                            size="small"
                                            sx={{
                                                background: `${feature.color}20`,
                                                color: feature.color,
                                                fontWeight: 600,
                                            }}
                                        />
                                        <ArrowForwardIcon sx={{ color: feature.color }} />
                                    </Box>
                                </Box>
                            </FeatureCard>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Feature Detail Dialog */}
            <Dialog
                open={Boolean(selectedFeature)}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '24px',
                        background: selectedFeature?.gradient,
                    },
                }}
            >
                {selectedFeature && (
                    <>
                        <DialogTitle sx={{
                            background: 'rgba(255,255,255,0.95)',
                            borderBottom: `3px solid ${selectedFeature.color}`
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar
                                        sx={{
                                            background: selectedFeature.gradient,
                                            width: 50,
                                            height: 50,
                                        }}
                                    >
                                        <selectedFeature.icon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                            {selectedFeature.title}
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            {selectedFeature.description}
                                        </Typography>
                                    </Box>
                                </Box>
                                <IconButton onClick={handleCloseDialog}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        </DialogTitle>
                        <DialogContent sx={{ p: 3, background: 'white' }}>
                            {selectedFeature.id === 'profile' && student && (
                                <List>
                                    <ListItem>
                                        <ListItemIcon><PersonIcon /></ListItemIcon>
                                        <ListItemText primary="Full Name" secondary={student.name} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon><EmailIcon /></ListItemIcon>
                                        <ListItemText primary="Email" secondary={student.email} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon><SchoolIcon /></ListItemIcon>
                                        <ListItemText primary="Class" secondary={student.student_class?.class_text || 'N/A'} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon><CakeIcon /></ListItemIcon>
                                        <ListItemText primary="Age" secondary={`${student.age} years`} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon><WcIcon /></ListItemIcon>
                                        <ListItemText primary="Gender" secondary={student.gender} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon><FamilyRestroomIcon /></ListItemIcon>
                                        <ListItemText primary="Guardian" secondary={student.guardian} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon><PhoneIcon /></ListItemIcon>
                                        <ListItemText primary="Guardian Phone" secondary={student.guardian_phone} />
                                    </ListItem>
                                </List>
                            )}
                            {selectedFeature.id === 'fees' && student?.fees && (
                                <Box>
                                    <Paper sx={{ p: 2, mb: 2, background: '#f5f5f5' }}>
                                        <Typography variant="body2" color="textSecondary">Total Fees</Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                            ₹{student.fees.total_fees}
                                        </Typography>
                                    </Paper>
                                    <Paper sx={{ p: 2, mb: 2, background: '#e8f5e9' }}>
                                        <Typography variant="body2" color="textSecondary">Paid</Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#43e97b' }}>
                                            ₹{student.fees.paid_fees}
                                        </Typography>
                                    </Paper>
                                    <Paper sx={{ p: 2, background: '#ffebee' }}>
                                        <Typography variant="body2" color="textSecondary">Balance</Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#fa709a' }}>
                                            ₹{student.fees.balance_fees}
                                        </Typography>
                                    </Paper>
                                </Box>
                            )}
                            {selectedFeature.id === 'grades' && (
                                <Alert severity="info" icon={<InfoIcon />}>
                                    Your grade details and academic performance will be displayed here once exams are completed.
                                </Alert>
                            )}
                            {selectedFeature.id === 'subjects' && (
                                <Alert severity="info" icon={<MenuBookIcon />}>
                                    Your subject list and teacher information will be shown here.
                                </Alert>
                            )}
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </Container>
    );
}
