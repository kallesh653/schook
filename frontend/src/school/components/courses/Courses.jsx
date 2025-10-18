import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardActions,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Chip,
    IconButton,
    Alert,
    Snackbar,
    CircularProgress,
    Divider,
    Stack
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    People as PeopleIcon,
    Category as CategoryIcon,
    AttachMoney as MoneyIcon,
    School as SchoolIcon,
    Close as CloseIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import axios from 'axios';
import { baseUrl } from '../../../environment';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const [formData, setFormData] = useState({
        courseName: '',
        courseCode: '',
        description: '',
        duration: '',
        category: '',
        customCategory: '',
        totalFees: '',
        eligibilityCriteria: '',
        maxStudents: ''
    });

    const durationOptions = [
        '6 Months', '1 Year', '2 Years', '3 Years', '4 Years', '5 Years', 'Other'
    ];

    const categoryOptions = [
        'Science', 'Commerce', 'Arts', 'Engineering', 'Medical', 'Technology',
        'Management', 'Vocational', 'Language', 'Creative Arts', 'Sports', 'Custom'
    ];

    // Course templates for quick adding
    const courseTemplates = [
        {
            name: 'Science Stream',
            courseName: 'Science',
            courseCode: 'SCI',
            category: 'Science',
            duration: '2 Years',
            description: 'Physics, Chemistry, Mathematics, Biology',
            totalFees: 50000
        },
        {
            name: 'Commerce Stream',
            courseName: 'Commerce',
            courseCode: 'COM',
            category: 'Commerce',
            duration: '2 Years',
            description: 'Accountancy, Business Studies, Economics',
            totalFees: 40000
        },
        {
            name: 'Arts Stream',
            courseName: 'Arts',
            courseCode: 'ART',
            category: 'Arts',
            duration: '2 Years',
            description: 'History, Geography, Political Science, English',
            totalFees: 30000
        },
        {
            name: 'Computer Science',
            courseName: 'Computer Science Engineering',
            courseCode: 'CSE',
            category: 'Engineering',
            duration: '4 Years',
            description: 'Programming, Data Structures, Algorithms, Software Engineering',
            totalFees: 200000
        },
        {
            name: 'Medical (MBBS)',
            courseName: 'Bachelor of Medicine',
            courseCode: 'MBBS',
            category: 'Medical',
            duration: '5 Years',
            description: 'Anatomy, Physiology, Pathology, Medicine, Surgery',
            totalFees: 500000
        }
    ];

    useEffect(() => {
        fetchCourses();
    }, []);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        return token ? { 'Authorization': token } : {};
    };

    const getSchoolId = () => {
        // Get schoolId from user object stored in localStorage
        const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                return user.id; // School admin's ID is the schoolId
            } catch (e) {
                console.error('Error parsing user:', e);
            }
        }
        return null;
    };

    const fetchCourses = async () => {
        try {
            setPageLoading(true);
            const schoolId = getSchoolId();

            if (!schoolId) {
                showSnackbar('School ID not found. Please login again.', 'error');
                setPageLoading(false);
                return;
            }

            const headers = getAuthHeaders();
            const response = await axios.get(`${baseUrl}/course/school/${schoolId}`, { headers });

            if (response.data.success) {
                setCourses(response.data.courses || []);
            } else {
                setCourses([]);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Error fetching courses';
            showSnackbar(errorMsg, 'error');
            setCourses([]);
        } finally {
            setPageLoading(false);
        }
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleTemplateSelect = (template) => {
        setFormData({
            courseName: template.courseName,
            courseCode: template.courseCode,
            description: template.description,
            duration: template.duration,
            category: template.category,
            customCategory: '',
            totalFees: template.totalFees.toString(),
            eligibilityCriteria: '',
            maxStudents: ''
        });
        setOpen(true);
    };

    const handleSubmit = async () => {
        try {
            if (!formData.courseName.trim()) {
                showSnackbar('Course name is required', 'error');
                return;
            }

            setLoading(true);
            const headers = getAuthHeaders();

            // Build course data - only include fields that have values
            const courseData = {
                courseName: formData.courseName.trim()
            };

            // Add optional fields only if they have values
            if (formData.courseCode && formData.courseCode.trim()) {
                courseData.courseCode = formData.courseCode.trim().toUpperCase();
            }
            if (formData.description && formData.description.trim()) {
                courseData.description = formData.description.trim();
            }
            if (formData.duration) {
                courseData.duration = formData.duration;
            }
            if (formData.category) {
                courseData.category = formData.category === 'Custom' ? formData.customCategory : formData.category;
            }
            if (formData.totalFees) {
                courseData.totalFees = parseFloat(formData.totalFees);
            }
            if (formData.eligibilityCriteria && formData.eligibilityCriteria.trim()) {
                courseData.eligibilityCriteria = formData.eligibilityCriteria.trim();
            }
            if (formData.maxStudents) {
                courseData.maxStudents = parseInt(formData.maxStudents);
            }

            console.log('Submitting course data:', courseData);

            if (editingCourse) {
                const response = await axios.put(
                    `${baseUrl}/course/${editingCourse._id}`,
                    courseData,
                    { headers }
                );
                showSnackbar(response.data.message || 'Course updated successfully', 'success');
            } else {
                const response = await axios.post(
                    `${baseUrl}/course/create`,
                    courseData,
                    { headers }
                );
                showSnackbar(response.data.message || 'Course created successfully', 'success');
            }

            setOpen(false);
            resetForm();
            fetchCourses();
        } catch (error) {
            console.error('Error saving course:', error);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Error saving course';
            showSnackbar(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
        const isCustomCategory = course.category && !categoryOptions.slice(0, -1).includes(course.category);
        setFormData({
            courseName: course.courseName || '',
            courseCode: course.courseCode || '',
            description: course.description || '',
            duration: course.duration || '',
            category: isCustomCategory ? 'Custom' : (course.category || ''),
            customCategory: isCustomCategory ? course.category : '',
            totalFees: course.totalFees?.toString() || '',
            eligibilityCriteria: course.eligibilityCriteria || '',
            maxStudents: course.maxStudents?.toString() || ''
        });
        setOpen(true);
    };

    const handleDelete = async (courseId) => {
        if (!window.confirm('Are you sure you want to delete this course?')) {
            return;
        }

        try {
            setLoading(true);
            const headers = getAuthHeaders();
            const response = await axios.delete(`${baseUrl}/course/${courseId}`, { headers });
            showSnackbar(response.data.message || 'Course deleted successfully', 'success');
            fetchCourses();
        } catch (error) {
            console.error('Error deleting course:', error);
            showSnackbar(error.response?.data?.message || 'Error deleting course', 'error');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            courseName: '',
            courseCode: '',
            description: '',
            duration: '',
            category: '',
            customCategory: '',
            totalFees: '',
            eligibilityCriteria: '',
            maxStudents: ''
        });
        setEditingCourse(null);
    };

    const handleClose = () => {
        setOpen(false);
        resetForm();
    };

    if (pageLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#333' }}>
                    Course Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpen(true)}
                    sx={{
                        background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                        color: 'white',
                        fontWeight: 600,
                        padding: '12px 24px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #5568d3 30%, #6a4093 90%)',
                            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                            transform: 'translateY(-2px)',
                        }
                    }}
                >
                    Add Custom Course
                </Button>
            </Box>

            {/* Quick Course Templates */}
            <Box mb={4}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                    Quick Add - Course Templates
                </Typography>
                <Grid container spacing={2}>
                    {courseTemplates.map((template, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                            <Card
                                sx={{
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    borderRadius: '16px',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: 8
                                    }
                                }}
                                onClick={() => handleTemplateSelect(template)}
                            >
                                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                    <SchoolIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                                    <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, mb: 1 }}>
                                        {template.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                        {template.duration}
                                    </Typography>
                                    <Chip
                                        label={template.category}
                                        size="small"
                                        sx={{ mt: 1 }}
                                        color="primary"
                                        variant="outlined"
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Existing Courses */}
            <Box mb={2}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Existing Courses ({courses.length})
                </Typography>
            </Box>

            {courses.length === 0 ? (
                <Box
                    sx={{
                        textAlign: 'center',
                        py: 8,
                        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                        borderRadius: '16px'
                    }}
                >
                    <SchoolIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
                    <Typography variant="h5" gutterBottom color="text.secondary">
                        No Courses Yet
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Start by adding a course using templates or create a custom course
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpen(true)}
                        sx={{
                            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                        }}
                    >
                        Add Your First Course
                    </Button>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {courses.map((course) => (
                        <Grid item xs={12} sm={6} md={4} key={course._id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: '16px',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        boxShadow: 6,
                                        transform: 'translateY(-4px)'
                                    }
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#333' }}>
                                            {course.courseName}
                                        </Typography>
                                        {course.courseCode && (
                                            <Chip
                                                label={course.courseCode}
                                                size="small"
                                                sx={{
                                                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                                                    color: 'white',
                                                    fontWeight: 600
                                                }}
                                            />
                                        )}
                                    </Box>

                                    <Stack spacing={1.5} mb={2}>
                                        {(course.category || course.duration) && (
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <CategoryIcon fontSize="small" color="action" />
                                                <Typography variant="body2" color="text.secondary">
                                                    {course.category || 'N/A'} {course.duration && `• ${course.duration}`}
                                                </Typography>
                                            </Box>
                                        )}

                                        {course.totalFees > 0 && (
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <MoneyIcon fontSize="small" color="action" />
                                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                    ₹{course.totalFees.toLocaleString('en-IN')}
                                                </Typography>
                                            </Box>
                                        )}

                                        {course.maxStudents && (
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <PeopleIcon fontSize="small" color="action" />
                                                <Typography variant="body2" color="text.secondary">
                                                    {course.currentEnrollment || 0}/{course.maxStudents} students
                                                </Typography>
                                            </Box>
                                        )}
                                    </Stack>

                                    {course.description && (
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                            }}
                                        >
                                            {course.description}
                                        </Typography>
                                    )}
                                </CardContent>

                                <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
                                    <Button
                                        size="small"
                                        startIcon={<EditIcon />}
                                        onClick={() => handleEdit(course)}
                                        sx={{ color: '#667eea', fontWeight: 600 }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="small"
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => handleDelete(course._id)}
                                        sx={{ fontWeight: 600 }}
                                    >
                                        Delete
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Add/Edit Course Dialog */}
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        boxShadow: 24
                    }
                }}
            >
                <DialogTitle sx={{
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: 600,
                    py: 2
                }}>
                    {editingCourse ? 'Edit Course' : 'Add New Course'}
                    <IconButton onClick={handleClose} sx={{ color: 'white' }} disabled={loading}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ mt: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Course Name"
                                value={formData.courseName}
                                onChange={(e) => setFormData({...formData, courseName: e.target.value})}
                                required
                                error={!formData.courseName}
                                helperText={!formData.courseName ? "Required" : ""}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Course Code (Optional)"
                                value={formData.courseCode}
                                onChange={(e) => setFormData({...formData, courseCode: e.target.value.toUpperCase()})}
                                placeholder="e.g., CSE, MBBS"
                                helperText="Unique identifier for the course"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Duration (Optional)</InputLabel>
                                <Select
                                    value={formData.duration}
                                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                                    label="Duration (Optional)"
                                >
                                    <MenuItem value="">None</MenuItem>
                                    {durationOptions.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Category (Optional)</InputLabel>
                                <Select
                                    value={formData.category}
                                    onChange={(e) => {
                                        setFormData({...formData, category: e.target.value, customCategory: ''});
                                    }}
                                    label="Category (Optional)"
                                >
                                    <MenuItem value="">None</MenuItem>
                                    {categoryOptions.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {formData.category === 'Custom' && (
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Custom Category"
                                    value={formData.customCategory}
                                    onChange={(e) => setFormData({...formData, customCategory: e.target.value})}
                                    placeholder="Enter your custom category"
                                    helperText="Define your own course category"
                                />
                            </Grid>
                        )}

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Total Fees (Optional)"
                                type="number"
                                value={formData.totalFees}
                                onChange={(e) => setFormData({...formData, totalFees: e.target.value})}
                                placeholder="Enter fees amount"
                                InputProps={{
                                    startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Max Students (Optional)"
                                type="number"
                                value={formData.maxStudents}
                                onChange={(e) => setFormData({...formData, maxStudents: e.target.value})}
                                placeholder="Maximum enrollment capacity"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description (Optional)"
                                multiline
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                placeholder="Brief description of the course"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Eligibility Criteria (Optional)"
                                multiline
                                rows={2}
                                value={formData.eligibilityCriteria}
                                onChange={(e) => setFormData({...formData, eligibilityCriteria: e.target.value})}
                                placeholder="e.g., 10+2 with Science background"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ p: 3, gap: 1 }}>
                    <Button
                        onClick={handleClose}
                        disabled={loading}
                        variant="outlined"
                        sx={{ borderRadius: '8px' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={loading || !formData.courseName}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
                        sx={{
                            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                            color: 'white',
                            fontWeight: 600,
                            padding: '10px 24px',
                            borderRadius: '8px',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #5568d3 30%, #6a4093 90%)',
                            },
                            '&:disabled': {
                                background: '#cccccc',
                                color: '#666666'
                            }
                        }}
                    >
                        {loading ? 'Saving...' : editingCourse ? 'Update Course' : 'Create Course'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Courses;
