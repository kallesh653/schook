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
    Fab,
    Tooltip,
    Stack,
    Divider
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    People as PeopleIcon,
    Category as CategoryIcon,
    AttachMoney as MoneyIcon,
    School as SchoolIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../../environment';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
    const navigate = useNavigate();

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
        'Science', 'Commerce', 'Arts', 'Engineering', 'Medical', 'Technology', 'Management', 'Vocational', 'Language', 'Creative Arts', 'Sports', 'Custom'
    ];

    // Different course templates for quick adding
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

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const schoolId = localStorage.getItem('schoolId') || '66e0e5fcb543e2e1cb54df19';
            const response = await axios.get(`${baseUrl}/course/school/${schoolId}`);
            setCourses(response.data.courses);
        } catch (error) {
            showAlert('Error fetching courses', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showAlert = (message, type = 'success') => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 3000);
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
            setLoading(true);
            const schoolId = localStorage.getItem('schoolId') || '66e0e5fcb543e2e1cb54df19';

            // Build course data with only provided fields
            const courseData = {
                courseName: formData.courseName.trim(),
                school: schoolId
            };

            // Add optional fields only if they have values
            if (formData.courseCode?.trim()) {
                courseData.courseCode = formData.courseCode.trim();
            }
            if (formData.description?.trim()) {
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
            if (formData.eligibilityCriteria?.trim()) {
                courseData.eligibilityCriteria = formData.eligibilityCriteria.trim();
            }
            if (formData.maxStudents) {
                courseData.maxStudents = parseInt(formData.maxStudents);
            }

            if (editingCourse) {
                await axios.put(`${baseUrl}/course/${editingCourse._id}`, courseData);
                showAlert('Course updated successfully');
            } else {
                await axios.post(`${baseUrl}/course/create`, courseData);
                showAlert('Course created successfully');
            }

            setOpen(false);
            resetForm();
            fetchCourses();
        } catch (error) {
            showAlert(error.response?.data?.message || 'Error saving course', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
        const isCustomCategory = course.category && !categoryOptions.slice(0, -1).includes(course.category);
        setFormData({
            courseName: course.courseName,
            courseCode: course.courseCode,
            description: course.description || '',
            duration: course.duration,
            category: isCustomCategory ? 'Custom' : (course.category || ''),
            customCategory: isCustomCategory ? course.category : '',
            totalFees: course.totalFees?.toString() || '',
            eligibilityCriteria: course.eligibilityCriteria || '',
            maxStudents: course.maxStudents?.toString() || ''
        });
        setOpen(true);
    };

    const handleDelete = async (courseId) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                setLoading(true);
                await axios.delete(`${baseUrl}/course/${courseId}`);
                showAlert('Course deleted successfully');
                fetchCourses();
            } catch (error) {
                showAlert(error.response?.data?.message || 'Error deleting course', 'error');
            } finally {
                setLoading(false);
            }
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

    return (
        <Box sx={{ p: 3 }}>
            {alert.show && (
                <Alert severity={alert.type} sx={{ mb: 2 }}>
                    {alert.message}
                </Alert>
            )}

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" gutterBottom>
                    Course Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpen(true)}
                    sx={{
                        background: 'linear-gradient(45deg, #4caf50 30%, #2e7d32 90%)',
                        color: 'white',
                        fontWeight: 600,
                        padding: '12px 24px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #43a047 30%, #1b5e20 90%)',
                            boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
                            transform: 'translateY(-2px)',
                        }
                    }}
                >
                    Add Custom Course
                </Button>
            </Box>

            {/* Quick Course Templates */}
            <Box mb={4}>
                <Typography variant="h6" gutterBottom>
                    Quick Add - Course Templates
                </Typography>
                <Grid container spacing={2}>
                    {courseTemplates.map((template, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                            <Card
                                sx={{
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: 6
                                    }
                                }}
                                onClick={() => handleTemplateSelect(template)}
                            >
                                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                    <SchoolIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                                    <Typography variant="h6" sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                                        {template.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {template.duration}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Existing Courses */}
            <Typography variant="h6" gutterBottom>
                Existing Courses ({courses.length})
            </Typography>

            <Grid container spacing={3}>
                {courses.map((course) => (
                    <Grid item xs={12} sm={6} md={4} key={course._id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                                    <Typography variant="h6" gutterBottom>
                                        {course.courseName}
                                    </Typography>
                                    <Chip
                                        label={course.courseCode}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                    />
                                </Box>

                                <Stack spacing={1} mb={2}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <CategoryIcon fontSize="small" color="action" />
                                        <Typography variant="body2">
                                            {course.category} • {course.duration}
                                        </Typography>
                                    </Box>

                                    <Box display="flex" alignItems="center" gap={1}>
                                        <MoneyIcon fontSize="small" color="action" />
                                        <Typography variant="body2">
                                            ₹{course.totalFees.toLocaleString()}
                                        </Typography>
                                    </Box>

                                    {course.maxStudents && (
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <PeopleIcon fontSize="small" color="action" />
                                            <Typography variant="body2">
                                                {course.currentEnrollment || 0}/{course.maxStudents} students
                                            </Typography>
                                        </Box>
                                    )}
                                </Stack>

                                {course.description && (
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        {course.description}
                                    </Typography>
                                )}
                            </CardContent>

                            <CardActions>
                                <Button
                                    size="small"
                                    startIcon={<EditIcon />}
                                    onClick={() => handleEdit(course)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size="small"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    onClick={() => handleDelete(course._id)}
                                >
                                    Delete
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Add/Edit Course Dialog */}
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        boxShadow: 24
                    }
                }}
            >
                <DialogTitle sx={{
                    background: 'linear-gradient(45deg, #4caf50 30%, #2e7d32 90%)',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: 600
                }}>
                    {editingCourse ? 'Edit Course' : 'Add New Course'}
                    <IconButton onClick={handleClose} sx={{ color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Course Name"
                                value={formData.courseName}
                                onChange={(e) => setFormData({...formData, courseName: e.target.value})}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Course Code (Optional)"
                                value={formData.courseCode}
                                onChange={(e) => setFormData({...formData, courseCode: e.target.value.toUpperCase()})}
                                placeholder="e.g., CSE, MBBS"
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
                                    {categoryOptions.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {formData.category === 'Custom' && (
                            <Grid item xs={12} sm={6}>
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
                                    startAdornment: '₹'
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Max Students"
                                type="number"
                                value={formData.maxStudents}
                                onChange={(e) => setFormData({...formData, maxStudents: e.target.value})}
                                placeholder="Optional"
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

                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={loading || !formData.courseName}
                        sx={{
                            background: 'linear-gradient(45deg, #4caf50 30%, #2e7d32 90%)',
                            color: 'white',
                            fontWeight: 600,
                            padding: '10px 20px',
                            borderRadius: '8px',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #43a047 30%, #1b5e20 90%)',
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
        </Box>
    );
};

export default Courses;