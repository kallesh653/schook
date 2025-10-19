import React, { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, Button, TextField, Dialog, DialogTitle,
    DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Grid, Select, MenuItem, FormControl,
    InputLabel, Chip
} from '@mui/material';
import {
    Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
    School as SchoolIcon
} from '@mui/icons-material';
import axios from 'axios';
import { baseUrl } from '../../../environment';
import CustomizedSnackbars from '../../../basic utility components/CustomizedSnackbars';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentCourse, setCurrentCourse] = useState({
        courseName: '',
        courseCode: '',
        description: '',
        duration: '',
        fees: '',
        eligibility: '',
        totalSeats: '',
        availableSeats: '',
        startDate: '',
        endDate: '',
        status: 'Active'
    });
    const [message, setMessage] = useState('');
    const [type, setType] = useState('success');
    const [pageLoading, setPageLoading] = useState(true);

    const resetMessage = () => setMessage('');

    const getSchoolId = () => {
        const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                return user.id;
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

            const response = await axios.get(`${baseUrl}/course/school/${schoolId}`);
            if (response.data.success) {
                setCourses(response.data.courses);
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

    useEffect(() => {
        fetchCourses();
    }, []);

    const showSnackbar = (msg, severity) => {
        setMessage(msg);
        setType(severity);
    };

    const handleOpenDialog = (course = null) => {
        if (course) {
            setEditMode(true);
            setCurrentCourse({
                _id: course._id,
                courseName: course.courseName || '',
                courseCode: course.courseCode || '',
                description: course.description || '',
                duration: course.duration || '',
                fees: course.fees || '',
                eligibility: course.eligibility || '',
                totalSeats: course.totalSeats || '',
                availableSeats: course.availableSeats || '',
                startDate: course.startDate ? course.startDate.split('T')[0] : '',
                endDate: course.endDate ? course.endDate.split('T')[0] : '',
                status: course.status || 'Active'
            });
        } else {
            setEditMode(false);
            setCurrentCourse({
                courseName: '',
                courseCode: '',
                description: '',
                duration: '',
                fees: '',
                eligibility: '',
                totalSeats: '',
                availableSeats: '',
                startDate: '',
                endDate: '',
                status: 'Active'
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentCourse({
            courseName: '',
            courseCode: '',
            description: '',
            duration: '',
            fees: '',
            eligibility: '',
            totalSeats: '',
            availableSeats: '',
            startDate: '',
            endDate: '',
            status: 'Active'
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentCourse(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            if (!currentCourse.courseName.trim()) {
                showSnackbar('Course name is required', 'error');
                return;
            }

            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            if (editMode) {
                const response = await axios.put(
                    `${baseUrl}/course/${currentCourse._id}`,
                    currentCourse,
                    config
                );
                if (response.data.success) {
                    showSnackbar('Course updated successfully', 'success');
                    fetchCourses();
                    handleCloseDialog();
                }
            } else {
                const response = await axios.post(
                    `${baseUrl}/course/create`,
                    currentCourse,
                    config
                );
                if (response.data.success) {
                    showSnackbar('Course created successfully', 'success');
                    fetchCourses();
                    handleCloseDialog();
                }
            }
        } catch (error) {
            console.error('Error saving course:', error);
            showSnackbar(
                error.response?.data?.message || 'Error saving course',
                'error'
            );
        }
    };

    const handleDelete = async (courseId) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };

                const response = await axios.delete(
                    `${baseUrl}/course/${courseId}`,
                    config
                );

                if (response.data.success) {
                    showSnackbar('Course deleted successfully', 'success');
                    fetchCourses();
                }
            } catch (error) {
                console.error('Error deleting course:', error);
                showSnackbar(
                    error.response?.data?.message || 'Error deleting course',
                    'error'
                );
            }
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            {message && <CustomizedSnackbars reset={resetMessage} type={type} message={message} />}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SchoolIcon /> Courses Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                        }
                    }}
                >
                    Add Course
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                <Table>
                    <TableHead sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Course Name</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Course Code</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Duration</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fees</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Seats</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pageLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">Loading...</TableCell>
                            </TableRow>
                        ) : courses.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">No courses found. Click "Add Course" to create one.</TableCell>
                            </TableRow>
                        ) : (
                            courses.map((course) => (
                                <TableRow key={course._id} hover>
                                    <TableCell>{course.courseName}</TableCell>
                                    <TableCell>{course.courseCode || '-'}</TableCell>
                                    <TableCell>{course.duration || '-'}</TableCell>
                                    <TableCell>₹{course.fees || 0}</TableCell>
                                    <TableCell>{course.availableSeats || 0}/{course.totalSeats || 0}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={course.status}
                                            color={course.status === 'Active' ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleOpenDialog(course)}
                                            size="small"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDelete(course._id)}
                                            size="small"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {editMode ? 'Edit Course' : 'Add New Course'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Course Name"
                                name="courseName"
                                value={currentCourse.courseName}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Course Code"
                                name="courseCode"
                                value={currentCourse.courseCode}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Description"
                                name="description"
                                value={currentCourse.description}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Duration"
                                name="duration"
                                placeholder="e.g., 2 Years, 6 Months"
                                value={currentCourse.duration}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Fees"
                                name="fees"
                                value={currentCourse.fees}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Eligibility"
                                name="eligibility"
                                placeholder="e.g., 10th Pass, 12th Pass"
                                value={currentCourse.eligibility}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Total Seats"
                                name="totalSeats"
                                value={currentCourse.totalSeats}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Available Seats"
                                name="availableSeats"
                                value={currentCourse.availableSeats}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Start Date"
                                name="startDate"
                                value={currentCourse.startDate}
                                onChange={handleInputChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="End Date"
                                name="endDate"
                                value={currentCourse.endDate}
                                onChange={handleInputChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    name="status"
                                    value={currentCourse.status}
                                    onChange={handleInputChange}
                                    label="Status"
                                >
                                    <MenuItem value="Active">Active</MenuItem>
                                    <MenuItem value="Inactive">Inactive</MenuItem>
                                    <MenuItem value="Completed">Completed</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                            }
                        }}
                    >
                        {editMode ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Courses;
