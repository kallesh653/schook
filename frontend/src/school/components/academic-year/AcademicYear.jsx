import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    Tooltip,
    Alert,
    Snackbar,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Avatar,
    ToggleButton,
    ToggleButtonGroup,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    CheckCircle as CheckCircleIcon,
    School as SchoolIcon,
    TrendingUp as TrendingUpIcon,
    EventNote as EventNoteIcon,
    SwapHoriz as SwapHorizIcon,
    People as PeopleIcon,
    CalendarToday as CalendarIcon,
    Person as PersonIcon,
    Groups as GroupsIcon
} from '@mui/icons-material';
import axios from 'axios';
import { baseUrl } from '../../../environment';
import { useFormik } from 'formik';
import * as yup from 'yup';

// Styled components
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
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
    '&:hover': {
        transform: 'scale(1.1)',
        transition: 'transform 0.2s'
    }
}));

const validationSchema = yup.object({
    year: yup.string()
        .matches(/^\d{4}-\d{4}$/, 'Format must be YYYY-YYYY (e.g., 2024-2025)')
        .required('Academic year is required'),
    startDate: yup.date().required('Start date is required'),
    endDate: yup.date()
        .min(yup.ref('startDate'), 'End date must be after start date')
        .required('End date is required'),
    description: yup.string()
});

const AcademicYearImproved = () => {
    const [academicYears, setAcademicYears] = useState([]);
    const [students, setStudents] = useState([]);
    const [allStudents, setAllStudents] = useState([]); // For single student promotion
    const [classes, setClasses] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openPromoteDialog, setOpenPromoteDialog] = useState(false);
    const [promotionMode, setPromotionMode] = useState('bulk'); // 'bulk' or 'single'
    const [editingYear, setEditingYear] = useState(null);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [singleStudentData, setSingleStudentData] = useState({
        studentId: '',
        toClass: ''
    });
    const [classMapping, setClassMapping] = useState({});
    const [fromYear, setFromYear] = useState('');
    const [toYear, setToYear] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAcademicYears();
        fetchClasses();
        fetchAllStudents();
    }, []);

    const fetchAcademicYears = async () => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await axios.get(`${baseUrl}/academic-year`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAcademicYears(response.data.data || []);
        } catch (error) {
            console.error('Error fetching academic years:', error);
            showSnackbar('Error fetching academic years', 'error');
        }
    };

    const fetchClasses = async () => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await axios.get(`${baseUrl}/class/fetch-all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setClasses(response.data.data || []);
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const fetchAllStudents = async () => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await axios.get(`${baseUrl}/student/fetch-with-query`, {
                params: { status: 'Active', limit: 1000 },
                headers: { Authorization: `Bearer ${token}` }
            });
            setAllStudents(response.data.data || []);
        } catch (error) {
            console.error('Error fetching all students:', error);
        }
    };

    const fetchStudentsByYear = async (year) => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await axios.get(`${baseUrl}/student/fetch-with-query`, {
                params: { academic_year: year, status: 'Active' },
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudents(response.data.data || []);
        } catch (error) {
            console.error('Error fetching students:', error);
            showSnackbar('Error fetching students', 'error');
        }
    };

    const formik = useFormik({
        initialValues: {
            year: '',
            startDate: '',
            endDate: '',
            description: '',
            isCurrent: false
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                if (editingYear) {
                    await axios.put(`${baseUrl}/academic-year/${editingYear._id}`, values, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    showSnackbar('Academic year updated successfully', 'success');
                } else {
                    await axios.post(`${baseUrl}/academic-year`, values, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    showSnackbar('Academic year created successfully', 'success');
                }
                fetchAcademicYears();
                handleCloseDialog();
            } catch (error) {
                console.error('Error saving academic year:', error);
                showSnackbar(error.response?.data?.message || 'Error saving academic year', 'error');
            } finally {
                setLoading(false);
            }
        }
    });

    const handleOpenDialog = (year = null) => {
        if (year) {
            setEditingYear(year);
            formik.setValues({
                year: year.year,
                startDate: year.startDate.split('T')[0],
                endDate: year.endDate.split('T')[0],
                description: year.description || '',
                isCurrent: year.isCurrent || false
            });
        } else {
            setEditingYear(null);
            formik.resetForm();
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingYear(null);
        formik.resetForm();
    };

    const handleSetCurrent = async (yearId) => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            await axios.put(`${baseUrl}/academic-year/${yearId}/set-current`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showSnackbar('Current academic year set successfully', 'success');
            fetchAcademicYears();
        } catch (error) {
            console.error('Error setting current year:', error);
            showSnackbar('Error setting current year', 'error');
        }
    };

    const handleDelete = async (yearId) => {
        if (!window.confirm('Are you sure you want to delete this academic year?')) return;

        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            await axios.delete(`${baseUrl}/academic-year/${yearId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showSnackbar('Academic year deleted successfully', 'success');
            fetchAcademicYears();
        } catch (error) {
            console.error('Error deleting academic year:', error);
            showSnackbar(error.response?.data?.message || 'Error deleting academic year', 'error');
        }
    };

    const handleOpenPromoteDialog = async (year) => {
        setFromYear(year);
        await fetchStudentsByYear(year);
        setPromotionMode('bulk');
        setSelectedStudents([]);
        setSingleStudentData({ studentId: '', toClass: '' });
        setOpenPromoteDialog(true);
    };

    const handlePromoteStudents = async () => {
        if (promotionMode === 'single') {
            // Single student promotion
            if (!singleStudentData.studentId) {
                showSnackbar('Please select a student', 'warning');
                return;
            }
            if (!toYear) {
                showSnackbar('Please select target academic year', 'warning');
                return;
            }

            setLoading(true);
            try {
                const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                const classPromotions = singleStudentData.toClass ? [{
                    fromClassId: allStudents.find(s => s._id === singleStudentData.studentId)?.student_class?._id || allStudents.find(s => s._id === singleStudentData.studentId)?.student_class,
                    toClassId: singleStudentData.toClass
                }] : [];

                await axios.post(`${baseUrl}/academic-year/promote-students`, {
                    studentIds: [singleStudentData.studentId],
                    fromAcademicYear: fromYear,
                    toAcademicYear: toYear,
                    classPromotions
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                showSnackbar('Student promoted successfully', 'success');
                setOpenPromoteDialog(false);
                setSingleStudentData({ studentId: '', toClass: '' });
                fetchAcademicYears();
                fetchAllStudents();
            } catch (error) {
                console.error('Error promoting student:', error);
                showSnackbar(error.response?.data?.message || 'Error promoting student', 'error');
            } finally {
                setLoading(false);
            }
        } else {
            // Bulk promotion
            if (selectedStudents.length === 0) {
                showSnackbar('Please select students to promote', 'warning');
                return;
            }

            if (!toYear) {
                showSnackbar('Please select target academic year', 'warning');
                return;
            }

            setLoading(true);
            try {
                const token = localStorage.getItem('token') || sessionStorage.getItem('token');

                // Build class promotions array
                const classPromotions = Object.entries(classMapping)
                    .filter(([fromId, toId]) => toId)
                    .map(([fromClassId, toClassId]) => ({
                        fromClassId,
                        toClassId
                    }));

                await axios.post(`${baseUrl}/academic-year/promote-students`, {
                    studentIds: selectedStudents,
                    fromAcademicYear: fromYear,
                    toAcademicYear: toYear,
                    classPromotions
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                showSnackbar(`${selectedStudents.length} students promoted successfully`, 'success');
                setOpenPromoteDialog(false);
                setSelectedStudents([]);
                setClassMapping({});
                fetchAcademicYears();
                fetchAllStudents();
            } catch (error) {
                console.error('Error promoting students:', error);
                showSnackbar(error.response?.data?.message || 'Error promoting students', 'error');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleStudentSelect = (studentId) => {
        setSelectedStudents(prev => {
            if (prev.includes(studentId)) {
                return prev.filter(id => id !== studentId);
            } else {
                return [...prev, studentId];
            }
        });
    };

    const handleSelectAllStudents = () => {
        if (selectedStudents.length === students.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(students.map(s => s._id));
        }
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'success';
            case 'upcoming': return 'info';
            case 'completed': return 'default';
            default: return 'default';
        }
    };

    const selectedStudent = allStudents.find(s => s._id === singleStudentData.studentId);

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Header */}
            <StyledHeaderCard>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'white', color: '#667eea', width: 56, height: 56 }}>
                                <CalendarIcon fontSize="large" />
                            </Avatar>
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                    Academic Year Management
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    Manage academic years and promote students
                                </Typography>
                            </Box>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog()}
                            sx={{
                                bgcolor: 'white',
                                color: '#667eea',
                                '&:hover': { bgcolor: '#f5f5f5' },
                                borderRadius: '10px',
                                px: 3
                            }}
                        >
                            Add Academic Year
                        </Button>
                    </Box>
                </CardContent>
            </StyledHeaderCard>

            {/* Academic Years List */}
            <StyledCard>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Academic Years
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Academic Year</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Start Date</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>End Date</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Current</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {academicYears.length > 0 ? (
                                    academicYears.map((year) => (
                                        <TableRow key={year._id} hover>
                                            <TableCell sx={{ fontWeight: 'bold', color: '#667eea' }}>
                                                {year.year}
                                            </TableCell>
                                            <TableCell>{new Date(year.startDate).toLocaleDateString()}</TableCell>
                                            <TableCell>{new Date(year.endDate).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={year.status}
                                                    color={getStatusColor(year.status)}
                                                    size="small"
                                                    sx={{ textTransform: 'capitalize' }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {year.isCurrent ? (
                                                    <Chip
                                                        icon={<CheckCircleIcon />}
                                                        label="Current"
                                                        color="success"
                                                        size="small"
                                                    />
                                                ) : (
                                                    <Button
                                                        size="small"
                                                        onClick={() => handleSetCurrent(year._id)}
                                                    >
                                                        Set Current
                                                    </Button>
                                                )}
                                            </TableCell>
                                            <TableCell>{year.description || '-'}</TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                                    <Tooltip title="Promote Students">
                                                        <ActionButton
                                                            size="small"
                                                            sx={{ color: '#4caf50' }}
                                                            onClick={() => handleOpenPromoteDialog(year.year)}
                                                        >
                                                            <TrendingUpIcon />
                                                        </ActionButton>
                                                    </Tooltip>
                                                    <Tooltip title="Edit">
                                                        <ActionButton
                                                            size="small"
                                                            color="primary"
                                                            onClick={() => handleOpenDialog(year)}
                                                        >
                                                            <EditIcon />
                                                        </ActionButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <ActionButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handleDelete(year._id)}
                                                        >
                                                            <DeleteIcon />
                                                        </ActionButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                                                No academic years found. Create one to get started.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </StyledCard>

            {/* Add/Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingYear ? 'Edit Academic Year' : 'Add New Academic Year'}
                </DialogTitle>
                <form onSubmit={formik.handleSubmit}>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Academic Year"
                                    name="year"
                                    placeholder="2024-2025"
                                    value={formik.values.year}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.year && Boolean(formik.errors.year)}
                                    helperText={formik.touched.year && formik.errors.year}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Start Date"
                                    name="startDate"
                                    value={formik.values.startDate}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                                    helperText={formik.touched.startDate && formik.errors.startDate}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="End Date"
                                    name="endDate"
                                    value={formik.values.endDate}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                                    helperText={formik.touched.endDate && formik.errors.endDate}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Description"
                                    name="description"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                    helperText={formik.touched.description && formik.errors.description}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button type="submit" variant="contained" disabled={loading}>
                            {editingYear ? 'Update' : 'Create'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Promote Students Dialog - IMPROVED */}
            <Dialog open={openPromoteDialog} onClose={() => setOpenPromoteDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TrendingUpIcon color="primary" />
                        <Typography variant="h6">Promote Students to Next Year</Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Alert severity="info" sx={{ mb: 2 }}>
                                Promote students from <strong>{fromYear}</strong> to the next academic year
                            </Alert>
                        </Grid>

                        {/* Promotion Mode Selection */}
                        <Grid item xs={12}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Promotion Mode</FormLabel>
                                <RadioGroup
                                    row
                                    value={promotionMode}
                                    onChange={(e) => setPromotionMode(e.target.value)}
                                >
                                    <FormControlLabel
                                        value="single"
                                        control={<Radio />}
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <PersonIcon fontSize="small" />
                                                <span>Single Student</span>
                                            </Box>
                                        }
                                    />
                                    <FormControlLabel
                                        value="bulk"
                                        control={<Radio />}
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <GroupsIcon fontSize="small" />
                                                <span>Multiple Students</span>
                                            </Box>
                                        }
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="From Academic Year"
                                value={fromYear}
                                disabled
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>To Academic Year</InputLabel>
                                <Select
                                    value={toYear}
                                    onChange={(e) => setToYear(e.target.value)}
                                    label="To Academic Year"
                                >
                                    {academicYears
                                        .filter(y => y.year !== fromYear)
                                        .map(year => (
                                            <MenuItem key={year._id} value={year.year}>
                                                {year.year}
                                            </MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* SINGLE STUDENT PROMOTION */}
                        {promotionMode === 'single' && (
                            <>
                                <Grid item xs={12}>
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                                        Select Student
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>Student</InputLabel>
                                        <Select
                                            value={singleStudentData.studentId}
                                            onChange={(e) => setSingleStudentData({ ...singleStudentData, studentId: e.target.value })}
                                            label="Student"
                                        >
                                            {allStudents
                                                .filter(s => s.academic_year === fromYear)
                                                .map(student => (
                                                    <MenuItem key={student._id} value={student._id}>
                                                        {student.name} - Roll: {student.roll_number} - Class: {student.student_class?.class_text || 'N/A'}
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {singleStudentData.studentId && (
                                    <Grid item xs={12}>
                                        <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                                Current Class: <strong>{selectedStudent?.student_class?.class_text || 'N/A'}</strong>
                                            </Typography>
                                            <FormControl fullWidth sx={{ mt: 1 }}>
                                                <InputLabel>Promote to Class (Optional)</InputLabel>
                                                <Select
                                                    value={singleStudentData.toClass}
                                                    onChange={(e) => setSingleStudentData({ ...singleStudentData, toClass: e.target.value })}
                                                    label="Promote to Class (Optional)"
                                                >
                                                    <MenuItem value="">
                                                        <em>Keep same class</em>
                                                    </MenuItem>
                                                    {classes.map(cls => (
                                                        <MenuItem key={cls._id} value={cls._id}>
                                                            {cls.class_text}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Paper>
                                    </Grid>
                                )}
                            </>
                        )}

                        {/* BULK PROMOTION */}
                        {promotionMode === 'bulk' && (
                            <>
                                <Grid item xs={12}>
                                    <Divider sx={{ my: 1 }} />
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                            Select Students ({selectedStudents.length} selected)
                                        </Typography>
                                        <Button size="small" onClick={handleSelectAllStudents}>
                                            {selectedStudents.length === students.length ? 'Deselect All' : 'Select All'}
                                        </Button>
                                    </Box>

                                    <Paper sx={{ maxHeight: 300, overflow: 'auto', border: '1px solid #e0e0e0' }}>
                                        <List dense>
                                            {students.map((student) => (
                                                <ListItem
                                                    key={student._id}
                                                    button
                                                    onClick={() => handleStudentSelect(student._id)}
                                                >
                                                    <ListItemIcon>
                                                        <Checkbox
                                                            edge="start"
                                                            checked={selectedStudents.includes(student._id)}
                                                            tabIndex={-1}
                                                            disableRipple
                                                        />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={student.name}
                                                        secondary={`Roll: ${student.roll_number} | Class: ${student.student_class?.class_text}`}
                                                    />
                                                </ListItem>
                                            ))}
                                            {students.length === 0 && (
                                                <ListItem>
                                                    <ListItemText
                                                        primary="No students found in this academic year"
                                                        sx={{ textAlign: 'center', color: 'text.secondary' }}
                                                    />
                                                </ListItem>
                                            )}
                                        </List>
                                    </Paper>
                                </Grid>

                                {selectedStudents.length > 0 && (
                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 1 }} />
                                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                                            Class Promotion (Optional)
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                                            Map current classes to next year's classes. Leave empty to keep students in the same class.
                                        </Typography>

                                        <Grid container spacing={2}>
                                            {Array.from(new Set(students
                                                .filter(s => selectedStudents.includes(s._id))
                                                .map(s => s.student_class?._id || s.student_class)
                                                .filter(Boolean)))
                                                .map((classId) => {
                                                    const currentClass = classes.find(c => c._id === classId);
                                                    return (
                                                        <Grid item xs={12} sm={6} key={classId}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Typography variant="body2" sx={{ minWidth: 100 }}>
                                                                    {currentClass?.class_text}
                                                                </Typography>
                                                                <SwapHorizIcon fontSize="small" color="action" />
                                                                <FormControl fullWidth size="small">
                                                                    <Select
                                                                        value={classMapping[classId] || ''}
                                                                        onChange={(e) => setClassMapping({
                                                                            ...classMapping,
                                                                            [classId]: e.target.value
                                                                        })}
                                                                        displayEmpty
                                                                    >
                                                                        <MenuItem value="">
                                                                            <em>Keep same class</em>
                                                                        </MenuItem>
                                                                        {classes.map(cls => (
                                                                            <MenuItem key={cls._id} value={cls._id}>
                                                                                {cls.class_text}
                                                                            </MenuItem>
                                                                        ))}
                                                                    </Select>
                                                                </FormControl>
                                                            </Box>
                                                        </Grid>
                                                    );
                                                })
                                            }
                                        </Grid>
                                    </Grid>
                                )}
                            </>
                        )}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenPromoteDialog(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handlePromoteStudents}
                        disabled={loading || !toYear || (promotionMode === 'single' ? !singleStudentData.studentId : selectedStudents.length === 0)}
                        startIcon={<TrendingUpIcon />}
                    >
                        {promotionMode === 'single' ? 'Promote Student' : `Promote ${selectedStudents.length} Student(s)`}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AcademicYearImproved;
