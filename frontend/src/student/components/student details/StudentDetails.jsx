import {
    Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Typography, Paper, Container, Card, CardContent, Grid, Avatar, Chip,
    Tabs, Tab, List, ListItem, ListItemText, ListItemIcon, Divider,
    LinearProgress, CircularProgress, Badge, IconButton, useTheme, useMediaQuery
} from "@mui/material";
import { styled } from '@mui/material/styles';
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

export default function StudentDetails(){
    const [student, setStudent] = useState(null);
    const [marks, setMarks] = useState([]);
    const [marksheets, setMarksheets] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

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

    useEffect(()=>{
        getStudentDetails();
    },[])
    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress size={60} />
            </Container>
        );
    }

    return(
        <Container maxWidth="lg" sx={{ py: { xs: 1, md: 4 }, px: { xs: 0.5, md: 3 } }}>
            {/* Header Section */}
            <GradientCard sx={{ mb: { xs: 2, md: 4 }, mx: { xs: 1, md: 0 } }}>
                <CardContent sx={{ textAlign: 'center', py: { xs: 2, md: 4 } }}>
                    <Typography variant={isSmall ? "h5" : isMobile ? "h4" : "h2"} component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        📚 Student Dashboard
                    </Typography>
                    <Typography variant={isSmall ? "body1" : "h6"} sx={{ opacity: 0.9 }}>
                        Welcome back, {student?.name}! 🎯
                    </Typography>
                </CardContent>
            </GradientCard>

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
                                <StyledCard>
                                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                        <ProfileAvatar
                                            src={`/images/uploaded/student/${student.student_image}`}
                                            alt={student.name}
                                        />
                                        <Typography variant={isMobile ? "h5" : "h4"} sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                                            {student.name}
                                        </Typography>
                                        <InfoChip
                                            icon={<SchoolIcon />}
                                            label={student.student_class.class_text}
                                            variant="filled"
                                        />
                                        <Box sx={{ mt: 2 }}>
                                            <Button
                                                variant="contained"
                                                startIcon={<EditIcon />}
                                                sx={{
                                                    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                                                    borderRadius: '25px',
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                }}
                                                fullWidth={isMobile}
                                            >
                                                Edit Profile
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </StyledCard>
                            </Grid>

                            {/* Details Card */}
                            <Grid item xs={12} md={8}>
                                <StyledCard>
                                    <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                                        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
                                            Personal Information
                                        </Typography>
                                        <List>
                                            <ListItem>
                                                <ListItemIcon><EmailIcon color="primary" /></ListItemIcon>
                                                <ListItemText
                                                    primary="Email"
                                                    secondary={student.email}
                                                    primaryTypographyProps={{ fontWeight: 600 }}
                                                />
                                            </ListItem>
                                            <Divider />
                                            <ListItem>
                                                <ListItemIcon><PersonIcon color="primary" /></ListItemIcon>
                                                <ListItemText
                                                    primary="Full Name"
                                                    secondary={student.name}
                                                    primaryTypographyProps={{ fontWeight: 600 }}
                                                />
                                            </ListItem>
                                            <Divider />
                                            <ListItem>
                                                <ListItemIcon><CakeIcon color="primary" /></ListItemIcon>
                                                <ListItemText
                                                    primary="Age"
                                                    secondary={`${student.age} years old`}
                                                    primaryTypographyProps={{ fontWeight: 600 }}
                                                />
                                            </ListItem>
                                            <Divider />
                                            <ListItem>
                                                <ListItemIcon><WcIcon color="primary" /></ListItemIcon>
                                                <ListItemText
                                                    primary="Gender"
                                                    secondary={student.gender}
                                                    primaryTypographyProps={{ fontWeight: 600 }}
                                                />
                                            </ListItem>
                                            <Divider />
                                            <ListItem>
                                                <ListItemIcon><FamilyRestroomIcon color="primary" /></ListItemIcon>
                                                <ListItemText
                                                    primary="Guardian"
                                                    secondary={student.guardian}
                                                    primaryTypographyProps={{ fontWeight: 600 }}
                                                />
                                            </ListItem>
                                            {student.guardian_phone && (
                                                <>
                                                    <Divider />
                                                    <ListItem>
                                                        <ListItemIcon><PhoneIcon color="primary" /></ListItemIcon>
                                                        <ListItemText
                                                            primary="Guardian Phone"
                                                            secondary={student.guardian_phone}
                                                            primaryTypographyProps={{ fontWeight: 600 }}
                                                        />
                                                    </ListItem>
                                                </>
                                            )}
                                        </List>
                                    </CardContent>
                                </StyledCard>
                            </Grid>
                        </Grid>
                    )}

                    {/* Marks Tab */}
                    {tabValue === 1 && (
                        <Grid container spacing={3}>
                            {/* Overall Performance Card */}
                            <Grid item xs={12} md={4}>
                                <StatsCard>
                                    <Typography variant="h6" gutterBottom>Overall Performance</Typography>
                                    <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        {calculateOverallPercentage()}%
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={calculateOverallPercentage()}
                                        sx={{
                                            height: 8,
                                            borderRadius: 4,
                                            backgroundColor: 'rgba(255,255,255,0.3)',
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: 'white',
                                            }
                                        }}
                                    />
                                </StatsCard>
                            </Grid>

                            {/* Subject Stats */}
                            <Grid item xs={12} md={8}>
                                <Grid container spacing={2}>
                                    {marks.slice(0, 4).map((mark, index) => (
                                        <Grid item xs={6} sm={3} key={index}>
                                            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: '12px' }}>
                                                <Typography variant="caption" color="textSecondary">
                                                    {mark.subject}
                                                </Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: getGradeColor(mark.grade) }}>
                                                    {mark.grade}
                                                </Typography>
                                                <Typography variant="body2">
                                                    {mark.marks}/{mark.totalMarks}
                                                </Typography>
                                            </Paper>
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
                            <Grid item xs={12} md={6}>
                                <StyledCard>
                                    <CardContent>
                                        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                                            Fee Information
                                        </Typography>
                                        {student.fees ? (
                                            <List>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Total Fees"
                                                        secondary={`₹${student.fees.total_fees || 0}`}
                                                        primaryTypographyProps={{ fontWeight: 600 }}
                                                    />
                                                </ListItem>
                                                <Divider />
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Paid Fees"
                                                        secondary={`₹${student.fees.paid_fees || 0}`}
                                                        primaryTypographyProps={{ fontWeight: 600 }}
                                                    />
                                                </ListItem>
                                                <Divider />
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Balance Fees"
                                                        secondary={`₹${student.fees.balance_fees || 0}`}
                                                        primaryTypographyProps={{ fontWeight: 600 }}
                                                        secondaryTypographyProps={{
                                                            color: student.fees.balance_fees > 0 ? 'error.main' : 'success.main',
                                                            fontWeight: 600
                                                        }}
                                                    />
                                                </ListItem>
                                            </List>
                                        ) : (
                                            <Typography variant="body1" color="textSecondary">
                                                No fee information available
                                            </Typography>
                                        )}
                                    </CardContent>
                                </StyledCard>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <StyledCard>
                                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                        <PaymentIcon sx={{ fontSize: 60, color: '#4caf50', mb: 2 }} />
                                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                            Online Payment
                                        </Typography>
                                        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                                            Pay your fees securely online
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                background: 'linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)',
                                                borderRadius: '25px',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                px: 4
                                            }}
                                        >
                                            Pay Now
                                        </Button>
                                    </CardContent>
                                </StyledCard>
                            </Grid>
                        </Grid>
                    )}
                </>
            )}
        </Container>
    )
}