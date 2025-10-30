import React, { useState, useEffect } from 'react';
import {
    Box, Container, Typography, Card, CardContent, Button, TextField,
    Grid, FormControl, InputLabel, Select, MenuItem, Chip, Alert,
    Dialog, DialogTitle, DialogContent, DialogActions, Checkbox,
    List, ListItem, ListItemText, ListItemIcon, Divider, Tab, Tabs,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Tooltip, Switch, FormControlLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

// Icons
import SmsIcon from '@mui/icons-material/Sms';
import SendIcon from '@mui/icons-material/Send';
import TemplateIcon from '@mui/icons-material/Article';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SchoolIcon from '@mui/icons-material/School';

import { baseUrl } from '../../../environment';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    marginBottom: theme.spacing(3)
}));

const StatsCard = styled(Card)(({ theme, bgcolor }) => ({
    background: bgcolor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: '16px',
    padding: theme.spacing(3),
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
    }
}));

const SmsManagementNew = () => {
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');

    // Template States
    const [templates, setTemplates] = useState([]);
    const [templateDialog, setTemplateDialog] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [templateForm, setTemplateForm] = useState({
        template_name: '',
        template_code: '',
        template_type: 'general',
        message_template: '',
        variables: [],
        is_active: true
    });

    // Send SMS States
    const [sendDialog, setSendDialog] = useState(false);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [selectedTemplateForSend, setSelectedTemplateForSend] = useState('');
    const [customMessage, setCustomMessage] = useState('');

    // SMS Logs
    const [smsLogs, setSmsLogs] = useState([]);

    // Fetch templates
    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${baseUrl}/sms/templates`);
            if (response.data.success) {
                setTemplates(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching templates:', error);
            setMessage('Error fetching templates');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    // Fetch classes
    const fetchClasses = async () => {
        try {
            const response = await axios.get(`${baseUrl}/class/fetch-with-query`);
            setClasses(response.data.data || []);
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    // Fetch students by class
    const fetchStudentsByClass = async (classId) => {
        try {
            setLoading(true);
            const response = await axios.get(`${baseUrl}/student/fetch-with-query`, {
                params: { student_class: classId }
            });
            setStudents(response.data.data || []);
            setSelectedStudents([]); // Reset selection
        } catch (error) {
            console.error('Error fetching students:', error);
            setMessage('Error fetching students');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    // Fetch SMS logs
    const fetchSmsLogs = async () => {
        try {
            const response = await axios.get(`${baseUrl}/sms/logs`);
            if (response.data.success) {
                setSmsLogs(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching SMS logs:', error);
        }
    };

    useEffect(() => {
        fetchTemplates();
        fetchClasses();
        fetchSmsLogs();
    }, []);

    useEffect(() => {
        if (selectedClass) {
            fetchStudentsByClass(selectedClass);
        } else {
            setStudents([]);
            setSelectedStudents([]);
        }
    }, [selectedClass]);

    // Handle create/update template
    const handleSaveTemplate = async () => {
        try {
            setLoading(true);
            if (selectedTemplate) {
                // Update
                await axios.put(`${baseUrl}/sms/template/${selectedTemplate._id}`, templateForm);
                setMessage('Template updated successfully');
            } else {
                // Create
                await axios.post(`${baseUrl}/sms/template`, templateForm);
                setMessage('Template created successfully');
            }
            setMessageType('success');
            setTemplateDialog(false);
            fetchTemplates();
            resetTemplateForm();
        } catch (error) {
            console.error('Error saving template:', error);
            setMessage(error.response?.data?.message || 'Error saving template');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    // Handle delete template
    const handleDeleteTemplate = async (id) => {
        if (!window.confirm('Are you sure you want to delete this template?')) return;

        try {
            await axios.delete(`${baseUrl}/sms/template/${id}`);
            setMessage('Template deleted successfully');
            setMessageType('success');
            fetchTemplates();
        } catch (error) {
            console.error('Error deleting template:', error);
            setMessage('Error deleting template');
            setMessageType('error');
        }
    };

    // Handle send SMS
    const handleSendSMS = async () => {
        if (selectedStudents.length === 0) {
            setMessage('Please select at least one student');
            setMessageType('warning');
            return;
        }

        if (!selectedTemplateForSend && !customMessage) {
            setMessage('Please select a template or enter custom message');
            setMessageType('warning');
            return;
        }

        try {
            setLoading(true);
            await axios.post(`${baseUrl}/sms/send`, {
                template_id: selectedTemplateForSend || null,
                custom_message: customMessage || null,
                student_ids: selectedStudents,
                class_id: selectedClass
            });
            setMessage(`SMS sent successfully to ${selectedStudents.length} students`);
            setMessageType('success');
            setSendDialog(false);
            fetchSmsLogs();
            resetSendForm();
        } catch (error) {
            console.error('Error sending SMS:', error);
            setMessage(error.response?.data?.message || 'Error sending SMS');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    const resetTemplateForm = () => {
        setTemplateForm({
            template_name: '',
            template_code: '',
            template_type: 'general',
            message_template: '',
            variables: [],
            is_active: true
        });
        setSelectedTemplate(null);
    };

    const resetSendForm = () => {
        setSelectedClass('');
        setStudents([]);
        setSelectedStudents([]);
        setSelectedTemplateForSend('');
        setCustomMessage('');
    };

    const handleStudentSelect = (studentId) => {
        setSelectedStudents(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleSelectAllStudents = () => {
        if (selectedStudents.length === students.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(students.map(s => s._id));
        }
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {message && (
                <Alert severity={messageType} onClose={() => setMessage('')} sx={{ mb: 3 }}>
                    {message}
                </Alert>
            )}

            {/* Header */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <SmsIcon sx={{ fontSize: 60, color: '#667eea', mb: 2 }} />
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                    SMS Management System
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Send SMS to students with professional templates
                </Typography>
            </Box>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <StatsCard bgcolor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                        <Typography variant="h4" fontWeight="bold">{templates.length}</Typography>
                        <Typography variant="body1">Total Templates</Typography>
                    </StatsCard>
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatsCard bgcolor="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
                        <Typography variant="h4" fontWeight="bold">{smsLogs.length}</Typography>
                        <Typography variant="body1">Messages Sent</Typography>
                    </StatsCard>
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatsCard bgcolor="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
                        <Typography variant="h4" fontWeight="bold">{classes.length}</Typography>
                        <Typography variant="body1">Total Classes</Typography>
                    </StatsCard>
                </Grid>
            </Grid>

            {/* Tabs */}
            <StyledCard>
                <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tab label="Send SMS" icon={<SendIcon />} iconPosition="start" />
                    <Tab label="Templates" icon={<TemplateIcon />} iconPosition="start" />
                </Tabs>

                {/* Send SMS Tab */}
                {tabValue === 0 && (
                    <CardContent>
                        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h5" fontWeight="bold">Send SMS to Students</Typography>
                            <Button
                                variant="contained"
                                startIcon={<SendIcon />}
                                onClick={() => setSendDialog(true)}
                                disabled={loading}
                                sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    '&:hover': { background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)' }
                                }}
                            >
                                Send New SMS
                            </Button>
                        </Box>

                        {/* Recent SMS Logs */}
                        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Recent SMS Logs</Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                                    <TableRow>
                                        <TableCell><strong>Date/Time</strong></TableCell>
                                        <TableCell><strong>Template</strong></TableCell>
                                        <TableCell><strong>Recipients</strong></TableCell>
                                        <TableCell><strong>Status</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {smsLogs.slice(0, 10).map((log) => (
                                        <TableRow key={log._id}>
                                            <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                                            <TableCell>{log.template_name || 'Custom Message'}</TableCell>
                                            <TableCell>{log.recipient_count} students</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={log.status}
                                                    color={log.status === 'sent' ? 'success' : 'warning'}
                                                    size="small"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {smsLogs.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">
                                                <Typography color="text.secondary">No SMS logs yet</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                )}

                {/* Templates Tab */}
                {tabValue === 1 && (
                    <CardContent>
                        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h5" fontWeight="bold">SMS Templates</Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => {
                                    resetTemplateForm();
                                    setTemplateDialog(true);
                                }}
                                sx={{
                                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                    '&:hover': { background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)' }
                                }}
                            >
                                Create Template
                            </Button>
                        </Box>

                        <Grid container spacing={3}>
                            {templates.map((template) => (
                                <Grid item xs={12} md={6} key={template._id}>
                                    <Card sx={{ height: '100%', borderRadius: '12px', border: '1px solid #e0e0e0' }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                                                <Box>
                                                    <Typography variant="h6" fontWeight="bold">{template.template_name}</Typography>
                                                    <Chip label={template.template_type} size="small" color="primary" sx={{ mt: 1 }} />
                                                </Box>
                                                <Box>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => {
                                                            setSelectedTemplate(template);
                                                            setTemplateForm(template);
                                                            setTemplateDialog(true);
                                                        }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleDeleteTemplate(template._id)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                <strong>Code:</strong> {template.template_code}
                                            </Typography>
                                            <Typography variant="body2" sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: '8px' }}>
                                                {template.message_template}
                                            </Typography>
                                            {template.variables && template.variables.length > 0 && (
                                                <Box sx={{ mt: 2 }}>
                                                    <Typography variant="caption" fontWeight="bold">Variables:</Typography>
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                                                        {template.variables.map((v, i) => (
                                                            <Chip key={i} label={`{{${v.variable_name}}}`} size="small" variant="outlined" />
                                                        ))}
                                                    </Box>
                                                </Box>
                                            )}
                                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Chip
                                                    label={template.is_active ? 'Active' : 'Inactive'}
                                                    color={template.is_active ? 'success' : 'default'}
                                                    size="small"
                                                />
                                                <Typography variant="caption" color="text.secondary">
                                                    Used: {template.usage_count || 0} times
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                            {templates.length === 0 && (
                                <Grid item xs={12}>
                                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                                        <TemplateIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
                                        <Typography variant="h6" color="text.secondary">
                                            No templates created yet
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            startIcon={<AddIcon />}
                                            onClick={() => setTemplateDialog(true)}
                                            sx={{ mt: 2 }}
                                        >
                                            Create Your First Template
                                        </Button>
                                    </Paper>
                                </Grid>
                            )}
                        </Grid>
                    </CardContent>
                )}
            </StyledCard>

            {/* Send SMS Dialog */}
            <Dialog open={sendDialog} onClose={() => setSendDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SendIcon color="primary" />
                        <Typography variant="h6">Send SMS to Students</Typography>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={3}>
                        {/* Class Selection */}
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Select Class</InputLabel>
                                <Select
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                    label="Select Class"
                                >
                                    <MenuItem value="">
                                        <em>Select a class</em>
                                    </MenuItem>
                                    {classes.map((cls) => (
                                        <MenuItem key={cls._id} value={cls._id}>
                                            {cls.class_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Student List */}
                        {students.length > 0 && (
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        Select Students ({selectedStudents.length}/{students.length})
                                    </Typography>
                                    <Button size="small" onClick={handleSelectAllStudents}>
                                        {selectedStudents.length === students.length ? 'Deselect All' : 'Select All'}
                                    </Button>
                                </Box>
                                <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto' }}>
                                    <List dense>
                                        {students.map((student) => (
                                            <ListItem
                                                key={student._id}
                                                button
                                                onClick={() => handleStudentSelect(student._id)}
                                            >
                                                <ListItemIcon>
                                                    <Checkbox
                                                        checked={selectedStudents.includes(student._id)}
                                                        edge="start"
                                                        tabIndex={-1}
                                                        disableRipple
                                                    />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={student.name}
                                                    secondary={student.email}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper>
                            </Grid>
                        )}

                        {/* Template Selection */}
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Select Template (Optional)</InputLabel>
                                <Select
                                    value={selectedTemplateForSend}
                                    onChange={(e) => setSelectedTemplateForSend(e.target.value)}
                                    label="Select Template (Optional)"
                                >
                                    <MenuItem value="">
                                        <em>None - Use custom message</em>
                                    </MenuItem>
                                    {templates.filter(t => t.is_active).map((template) => (
                                        <MenuItem key={template._id} value={template._id}>
                                            {template.template_name} - {template.template_type}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Custom Message */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Custom Message (if not using template)"
                                value={customMessage}
                                onChange={(e) => setCustomMessage(e.target.value)}
                                placeholder="Enter your custom message here..."
                                disabled={!!selectedTemplateForSend}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSendDialog(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSendSMS}
                        disabled={loading || selectedStudents.length === 0}
                        startIcon={<SendIcon />}
                    >
                        Send SMS
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Template Dialog */}
            <Dialog open={templateDialog} onClose={() => setTemplateDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    {selectedTemplate ? 'Edit Template' : 'Create New Template'}
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Template Name"
                                value={templateForm.template_name}
                                onChange={(e) => setTemplateForm({ ...templateForm, template_name: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Template Code"
                                value={templateForm.template_code}
                                onChange={(e) => setTemplateForm({ ...templateForm, template_code: e.target.value.toUpperCase() })}
                                required
                                helperText="Unique code (e.g., FEE_REMINDER)"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Template Type</InputLabel>
                                <Select
                                    value={templateForm.template_type}
                                    onChange={(e) => setTemplateForm({ ...templateForm, template_type: e.target.value })}
                                    label="Template Type"
                                >
                                    <MenuItem value="attendance">Attendance</MenuItem>
                                    <MenuItem value="fees">Fees</MenuItem>
                                    <MenuItem value="exam">Exam</MenuItem>
                                    <MenuItem value="general">General</MenuItem>
                                    <MenuItem value="emergency">Emergency</MenuItem>
                                    <MenuItem value="event">Event</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Message Template"
                                value={templateForm.message_template}
                                onChange={(e) => setTemplateForm({ ...templateForm, message_template: e.target.value })}
                                placeholder="Dear {{guardian_name}}, your child {{student_name}}..."
                                helperText="Use {{variable_name}} for dynamic content"
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={templateForm.is_active}
                                        onChange={(e) => setTemplateForm({ ...templateForm, is_active: e.target.checked })}
                                    />
                                }
                                label="Active Template"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setTemplateDialog(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveTemplate}
                        disabled={loading || !templateForm.template_name || !templateForm.template_code || !templateForm.message_template}
                    >
                        {selectedTemplate ? 'Update' : 'Create'} Template
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default SmsManagementNew;
