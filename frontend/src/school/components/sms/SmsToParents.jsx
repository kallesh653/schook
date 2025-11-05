import React, { useState, useEffect } from 'react';
import {
    Box, Container, Typography, Card, CardContent, Button, TextField,
    Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl,
    InputLabel, Chip, Alert, IconButton, Checkbox, Avatar, Divider,
    List, ListItem, ListItemText, ListItemIcon, ListItemAvatar, CircularProgress,
    Accordion, AccordionSummary, AccordionDetails, Tooltip, Badge, Snackbar,
    FormControlLabel, RadioGroup, Radio, TablePagination, InputAdornment,
    Stepper, Step, StepLabel, StepContent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

// Icons
import SmsIcon from '@mui/icons-material/Sms';
import SendIcon from '@mui/icons-material/Send';
import ClassIcon from '@mui/icons-material/Class';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import PreviewIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import TemplateIcon from '@mui/icons-material/Article';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

import { baseUrl } from '../../../environment';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: '20px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    overflow: 'visible',
    '&:hover': {
        boxShadow: '0 15px 50px rgba(0,0,0,0.15)',
    },
}));

const StepCard = styled(Card)(({ theme, active }) => ({
    borderRadius: '15px',
    padding: theme.spacing(3),
    border: active ? `2px solid ${theme.palette.primary.main}` : '2px solid #e0e0e0',
    background: active ? 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)' : '#fff',
    transition: 'all 0.3s ease',
}));

const StudentCard = styled(Card)(({ theme, selected }) => ({
    borderRadius: '12px',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
    border: selected ? `2px solid ${theme.palette.primary.main}` : '1px solid #e0e0e0',
    background: selected ? '#f0f4ff' : '#fff',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    '&:hover': {
        transform: 'translateX(5px)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    },
}));

const TemplateCard = styled(Card)(({ theme, selected }) => ({
    borderRadius: '12px',
    padding: theme.spacing(2),
    border: selected ? `3px solid ${theme.palette.primary.main}` : '1px solid #e0e0e0',
    background: selected ? 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)' : '#fff',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
    },
}));

const SmsToParents = () => {
    const [loading, setLoading] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Step 1: Class Selection
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');

    // Step 2: Student Selection
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Step 3: Template & Message
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [messageType, setMessageType] = useState('template'); // 'template' or 'custom'
    const [customMessage, setCustomMessage] = useState('');
    const [customData, setCustomData] = useState({});

    // Step 4: Preview & Send
    const [previewMessages, setPreviewMessages] = useState([]);
    const [sendResult, setSendResult] = useState(null);
    const [sendDialogOpen, setSendDialogOpen] = useState(false);

    // Available template variables
    const availableVariables = [
        { name: '{{guardian_name}}', description: 'Parent/Guardian name' },
        { name: '{{student_name}}', description: 'Student name' },
        { name: '{{class}}', description: 'Student class' },
        { name: '{{school_name}}', description: 'School name' },
        { name: '{{date}}', description: 'Current date' },
        { name: '{{time}}', description: 'Current time' },
    ];

    useEffect(() => {
        fetchClasses();
        fetchTemplates();
    }, []);

    useEffect(() => {
        if (selectedClass) {
            fetchStudentsByClass();
        }
    }, [selectedClass]);

    useEffect(() => {
        if (selectedStudents.length > 0 && (selectedTemplate || customMessage)) {
            generatePreview();
        }
    }, [selectedStudents, selectedTemplate, customMessage, customData]);

    const fetchClasses = async () => {
        try {
            const response = await axios.get(`${baseUrl}/sms/classes-with-students`);
            if (response.data.success) {
                setClasses(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
            showSnackbar('Error fetching classes: ' + (error.response?.data?.message || error.message), 'error');
        }
    };

    const fetchStudentsByClass = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${baseUrl}/sms/students-by-class`, {
                params: { class_id: selectedClass }
            });
            if (response.data.success) {
                setStudents(response.data.data.students);
                setSelectedStudents([]);
                setSelectAll(false);
            }
        } catch (error) {
            showSnackbar('Error fetching students', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchTemplates = async () => {
        try {
            const response = await axios.get(`${baseUrl}/sms/templates`);
            if (response.data.success) {
                const activeTemplates = response.data.data.filter(t => t.is_active);
                setTemplates(activeTemplates);
                console.log('Loaded templates:', activeTemplates.length);
            }
        } catch (error) {
            console.error('Error fetching templates:', error);
            showSnackbar('Error fetching templates: ' + (error.response?.data?.message || error.message), 'error');
        }
    };

    const handleSelectAllStudents = () => {
        if (selectAll) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(filteredStudents.map(s => s._id));
        }
        setSelectAll(!selectAll);
    };

    const handleStudentToggle = (studentId) => {
        const isSelected = selectedStudents.includes(studentId);
        if (isSelected) {
            setSelectedStudents(selectedStudents.filter(id => id !== studentId));
        } else {
            setSelectedStudents([...selectedStudents, studentId]);
        }
    };

    const filteredStudents = students.filter(student =>
        student.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.guardian_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.guardian_phone?.includes(searchTerm)
    );

    const paginatedStudents = filteredStudents.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const generatePreview = () => {
        const previews = students
            .filter(s => selectedStudents.includes(s._id))
            .map(student => {
                let message = '';

                if (messageType === 'template' && selectedTemplate) {
                    message = selectedTemplate.message_template
                        .replace(/\{\{guardian_name\}\}/g, student.guardian_name || 'Parent')
                        .replace(/\{\{student_name\}\}/g, student.student_name)
                        .replace(/\{\{class\}\}/g, student.class)
                        .replace(/\{\{school_name\}\}/g, customData.school_name || 'Our School')
                        .replace(/\{\{date\}\}/g, new Date().toLocaleDateString())
                        .replace(/\{\{time\}\}/g, new Date().toLocaleTimeString());

                    // Replace any custom variables
                    Object.keys(customData).forEach(key => {
                        message = message.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), customData[key]);
                    });
                } else if (messageType === 'custom') {
                    message = customMessage
                        .replace(/\{\{guardian_name\}\}/g, student.guardian_name || 'Parent')
                        .replace(/\{\{student_name\}\}/g, student.student_name)
                        .replace(/\{\{class\}\}/g, student.class)
                        .replace(/\{\{school_name\}\}/g, customData.school_name || 'Our School')
                        .replace(/\{\{date\}\}/g, new Date().toLocaleDateString())
                        .replace(/\{\{time\}\}/g, new Date().toLocaleTimeString());
                }

                return {
                    student_id: student._id,
                    student_name: student.student_name,
                    guardian_name: student.guardian_name,
                    phone: student.guardian_phone,
                    message: message,
                    char_count: message.length
                };
            });

        setPreviewMessages(previews);
    };

    const handleSendSms = async () => {
        try {
            setLoading(true);

            const payload = {
                student_ids: selectedStudents,
                template_id: messageType === 'template' ? selectedTemplate?._id : null,
                custom_message: messageType === 'custom' ? customMessage : null,
                custom_data: customData
            };

            const response = await axios.post(`${baseUrl}/sms/send/custom-to-parents`, payload);

            if (response.data.success) {
                setSendResult(response.data.data);
                setSendDialogOpen(true);
                showSnackbar(`SMS sent to ${response.data.data.success_count} recipients successfully!`, 'success');

                // Reset form
                setActiveStep(0);
                setSelectedClass('');
                setSelectedStudents([]);
                setSelectedTemplate(null);
                setCustomMessage('');
                setCustomData({});
            }
        } catch (error) {
            showSnackbar(error.response?.data?.message || 'Error sending SMS', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleNext = () => {
        // Validation before moving to next step
        if (activeStep === 0 && !selectedClass) {
            showSnackbar('Please select a class', 'warning');
            return;
        }
        if (activeStep === 1 && selectedStudents.length === 0) {
            showSnackbar('Please select at least one student', 'warning');
            return;
        }
        if (activeStep === 2 && !selectedTemplate && !customMessage) {
            showSnackbar('Please select a template or write a custom message', 'warning');
            return;
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const steps = ['Select Class', 'Select Students', 'Compose Message', 'Review & Send'];

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: '#667eea' }}>
                    <SmsIcon sx={{ fontSize: 35, mr: 1, verticalAlign: 'middle' }} />
                    Send SMS to Parents
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Select class, choose students, and send personalized messages to parents
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Stepper */}
                <Grid item xs={12}>
                    <StyledCard>
                        <CardContent>
                            <Stepper activeStep={activeStep} orientation="horizontal">
                                {steps.map((label, index) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </CardContent>
                    </StyledCard>
                </Grid>

                {/* Step Content */}
                <Grid item xs={12}>
                    {/* STEP 1: SELECT CLASS */}
                    {activeStep === 0 && (
                        <StepCard active={true}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                                <ClassIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Step 1: Select Class
                            </Typography>

                            <Grid container spacing={2}>
                                {classes.map((cls) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={cls._id}>
                                        <TemplateCard
                                            selected={selectedClass === cls._id}
                                            onClick={() => setSelectedClass(cls._id)}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Box>
                                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                        {cls.class_text}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {cls.section || 'All Sections'}
                                                    </Typography>
                                                </Box>
                                                {selectedClass === cls._id && (
                                                    <CheckCircleIcon color="primary" sx={{ fontSize: 30 }} />
                                                )}
                                            </Box>
                                        </TemplateCard>
                                    </Grid>
                                ))}
                            </Grid>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    disabled={!selectedClass}
                                    size="large"
                                    endIcon={<SendIcon />}
                                >
                                    Next: Select Students
                                </Button>
                            </Box>
                        </StepCard>
                    )}

                    {/* STEP 2: SELECT STUDENTS */}
                    {activeStep === 1 && (
                        <StepCard active={true}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    <PeopleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Step 2: Select Students ({selectedStudents.length} selected)
                                </Typography>
                                <Button
                                    variant="outlined"
                                    startIcon={<RefreshIcon />}
                                    onClick={fetchStudentsByClass}
                                >
                                    Refresh
                                </Button>
                            </Box>

                            {/* Search and Select All */}
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={12} md={8}>
                                    <TextField
                                        fullWidth
                                        placeholder="Search by student name, parent name, or phone..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Button
                                        fullWidth
                                        variant={selectAll ? "contained" : "outlined"}
                                        startIcon={selectAll ? <CheckCircleIcon /> : <GroupAddIcon />}
                                        onClick={handleSelectAllStudents}
                                        sx={{ height: '56px' }}
                                    >
                                        {selectAll ? 'Deselect All' : 'Select All Students'}
                                    </Button>
                                </Grid>
                            </Grid>

                            {/* Student List */}
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <>
                                    <Paper sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                                        {paginatedStudents.map((student) => (
                                            <StudentCard
                                                key={student._id}
                                                selected={selectedStudents.includes(student._id)}
                                                onClick={() => handleStudentToggle(student._id)}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Checkbox
                                                        checked={selectedStudents.includes(student._id)}
                                                        onChange={() => handleStudentToggle(student._id)}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                    <Avatar
                                                        src={student.student_image}
                                                        sx={{ width: 50, height: 50 }}
                                                    >
                                                        <PersonIcon />
                                                    </Avatar>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                            {student.student_name}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Roll No: {student.roll_number} • Class: {student.class}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ textAlign: 'right' }}>
                                                        <Chip
                                                            icon={<PhoneIcon />}
                                                            label={student.guardian_phone}
                                                            size="small"
                                                            sx={{ mb: 0.5 }}
                                                        />
                                                        <Typography variant="caption" display="block" color="text.secondary">
                                                            {student.guardian_name}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </StudentCard>
                                        ))}
                                    </Paper>

                                    <TablePagination
                                        component="div"
                                        count={filteredStudents.length}
                                        page={page}
                                        onPageChange={(e, newPage) => setPage(newPage)}
                                        rowsPerPage={rowsPerPage}
                                        onRowsPerPageChange={(e) => {
                                            setRowsPerPage(parseInt(e.target.value, 10));
                                            setPage(0);
                                        }}
                                    />
                                </>
                            )}

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                                <Button onClick={handleBack} size="large">
                                    Back
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    disabled={selectedStudents.length === 0}
                                    size="large"
                                    endIcon={<SendIcon />}
                                >
                                    Next: Compose Message ({selectedStudents.length})
                                </Button>
                            </Box>
                        </StepCard>
                    )}

                    {/* STEP 3: COMPOSE MESSAGE */}
                    {activeStep === 2 && (
                        <StepCard active={true}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                                <TemplateIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Step 3: Compose Message
                            </Typography>

                            {/* Message Type Selection */}
                            <FormControl component="fieldset" sx={{ mb: 3 }}>
                                <RadioGroup
                                    row
                                    value={messageType}
                                    onChange={(e) => setMessageType(e.target.value)}
                                >
                                    <FormControlLabel
                                        value="template"
                                        control={<Radio />}
                                        label="Use Template"
                                    />
                                    <FormControlLabel
                                        value="custom"
                                        control={<Radio />}
                                        label="Write Custom Message"
                                    />
                                </RadioGroup>
                            </FormControl>

                            {/* Template Selection */}
                            {messageType === 'template' && (
                                <Box>
                                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                                        Select a Template:
                                    </Typography>
                                    {templates.length === 0 ? (
                                        <Alert severity="info" sx={{ mb: 2 }}>
                                            No templates available. Please create templates first or use custom message option.
                                        </Alert>
                                    ) : (
                                        <Grid container spacing={2}>
                                            {templates.map((template) => (
                                            <Grid item xs={12} md={6} key={template._id}>
                                                <TemplateCard
                                                    selected={selectedTemplate?._id === template._id}
                                                    onClick={() => setSelectedTemplate(template)}
                                                >
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                            {template.template_name}
                                                        </Typography>
                                                        <Chip
                                                            label={template.template_type}
                                                            size="small"
                                                            color="primary"
                                                            variant="outlined"
                                                        />
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                        {template.message_template.substring(0, 100)}...
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Used {template.usage_count || 0} times
                                                    </Typography>
                                                </TemplateCard>
                                            </Grid>
                                        ))}
                                        </Grid>
                                    )}

                                    {/* Template Variables */}
                                    {selectedTemplate && selectedTemplate.variables && (
                                        <Box sx={{ mt: 3 }}>
                                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                                                Fill Template Variables:
                                            </Typography>
                                            <Grid container spacing={2}>
                                                {selectedTemplate.variables.map((variable, index) => (
                                                    <Grid item xs={12} md={6} key={index}>
                                                        <TextField
                                                            fullWidth
                                                            label={variable.description}
                                                            placeholder={variable.example}
                                                            value={customData[variable.variable_name] || ''}
                                                            onChange={(e) => setCustomData({
                                                                ...customData,
                                                                [variable.variable_name]: e.target.value
                                                            })}
                                                            helperText={`Use {{${variable.variable_name}}} in template`}
                                                        />
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Box>
                                    )}
                                </Box>
                            )}

                            {/* Custom Message */}
                            {messageType === 'custom' && (
                                <Box>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={6}
                                        label="Custom Message"
                                        placeholder="Type your message here..."
                                        value={customMessage}
                                        onChange={(e) => setCustomMessage(e.target.value)}
                                        helperText={`${customMessage.length} characters`}
                                    />

                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                                            Available Variables (click to insert):
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {availableVariables.map((variable, index) => (
                                                <Chip
                                                    key={index}
                                                    label={variable.name}
                                                    onClick={() => setCustomMessage(customMessage + ' ' + variable.name)}
                                                    clickable
                                                    size="small"
                                                />
                                            ))}
                                        </Box>
                                    </Box>

                                    <Alert severity="info" sx={{ mt: 2 }}>
                                        Variables will be automatically replaced with actual student/parent data when sent
                                    </Alert>
                                </Box>
                            )}

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                                <Button onClick={handleBack} size="large">
                                    Back
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    disabled={!selectedTemplate && !customMessage}
                                    size="large"
                                    endIcon={<PreviewIcon />}
                                >
                                    Preview & Send
                                </Button>
                            </Box>
                        </StepCard>
                    )}

                    {/* STEP 4: PREVIEW & SEND */}
                    {activeStep === 3 && (
                        <StepCard active={true}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                                <PreviewIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Step 4: Review & Send
                            </Typography>

                            {/* Summary */}
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={12} md={4}>
                                    <Paper sx={{ p: 2, textAlign: 'center', borderRadius: '12px', bgcolor: '#f0f4ff' }}>
                                        <PeopleIcon sx={{ fontSize: 40, color: '#667eea', mb: 1 }} />
                                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                                            {selectedStudents.length}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Recipients
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Paper sx={{ p: 2, textAlign: 'center', borderRadius: '12px', bgcolor: '#fff4e6' }}>
                                        <SmsIcon sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
                                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                                            {previewMessages.length}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Messages
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Paper sx={{ p: 2, textAlign: 'center', borderRadius: '12px', bgcolor: '#e8f5e9' }}>
                                        <CheckCircleIcon sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                                            ₹{(selectedStudents.length * 0.5).toFixed(2)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Estimated Cost
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>

                            {/* Message Previews */}
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                                Message Previews:
                            </Typography>
                            <Paper sx={{ maxHeight: 400, overflow: 'auto', borderRadius: '12px' }}>
                                {previewMessages.slice(0, 5).map((preview, index) => (
                                    <Box key={index} sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                                {preview.student_name} ({preview.guardian_name})
                                            </Typography>
                                            <Chip label={preview.phone} size="small" icon={<PhoneIcon />} />
                                        </Box>
                                        <Paper sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: '8px' }}>
                                            <Typography variant="body2">{preview.message}</Typography>
                                        </Paper>
                                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                            {preview.char_count} characters • ~{Math.ceil(preview.char_count / 160)} SMS
                                        </Typography>
                                    </Box>
                                ))}
                                {previewMessages.length > 5 && (
                                    <Box sx={{ p: 2, textAlign: 'center' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            ... and {previewMessages.length - 5} more messages
                                        </Typography>
                                    </Box>
                                )}
                            </Paper>

                            <Alert severity="warning" sx={{ mt: 3 }}>
                                Please review all messages carefully before sending. Once sent, messages cannot be recalled.
                            </Alert>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                                <Button onClick={handleBack} size="large">
                                    Back
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleSendSms}
                                    disabled={loading}
                                    size="large"
                                    color="success"
                                    startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                                >
                                    {loading ? 'Sending...' : `Send ${selectedStudents.length} SMS`}
                                </Button>
                            </Box>
                        </StepCard>
                    )}
                </Grid>
            </Grid>

            {/* Send Result Dialog */}
            <Dialog
                open={sendDialogOpen}
                onClose={() => setSendDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6">SMS Sending Report</Typography>
                        <IconButton onClick={() => setSendDialogOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    {sendResult && (
                        <>
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={4}>
                                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e9' }}>
                                        <CheckCircleIcon sx={{ fontSize: 40, color: '#4caf50' }} />
                                        <Typography variant="h4" sx={{ color: '#4caf50' }}>
                                            {sendResult.success_count}
                                        </Typography>
                                        <Typography variant="body2">Sent Successfully</Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={4}>
                                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#ffebee' }}>
                                        <ErrorIcon sx={{ fontSize: 40, color: '#f44336' }} />
                                        <Typography variant="h4" sx={{ color: '#f44336' }}>
                                            {sendResult.failure_count}
                                        </Typography>
                                        <Typography variant="body2">Failed</Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={4}>
                                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f5f5f5' }}>
                                        <SmsIcon sx={{ fontSize: 40, color: '#757575' }} />
                                        <Typography variant="h4" sx={{ color: '#757575' }}>
                                            {sendResult.total}
                                        </Typography>
                                        <Typography variant="body2">Total</Typography>
                                    </Paper>
                                </Grid>
                            </Grid>

                            {sendResult.failed && sendResult.failed.length > 0 && (
                                <Box>
                                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: '#f44336' }}>
                                        Failed Messages:
                                    </Typography>
                                    <Paper sx={{ p: 2, maxHeight: 200, overflow: 'auto' }}>
                                        {sendResult.failed.map((item, index) => (
                                            <Box key={index} sx={{ mb: 1 }}>
                                                <Typography variant="body2">
                                                    <strong>{item.student_name || item.guardian_name}</strong> ({item.phone})
                                                </Typography>
                                                <Typography variant="caption" color="error">
                                                    {item.error}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Paper>
                                </Box>
                            )}
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSendDialogOpen(false)} variant="contained">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default SmsToParents;
