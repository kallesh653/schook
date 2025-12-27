import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Paper,
  Tabs,
  Tab,
  Autocomplete,
  Switch,
  FormControlLabel,
  CircularProgress,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Send as SendIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  EventBusy as AbsentIcon,
  Announcement as AnnouncementIcon,
  Grade as GradeIcon,
  History as HistoryIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import axios from 'axios';
import { baseUrl } from '../../../environment';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  overflow: 'hidden',
  animation: `${fadeIn} 0.5s ease-out`,
  marginBottom: theme.spacing(3)
}));

const HeaderCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
  marginBottom: theme.spacing(3),
  animation: `${fadeIn} 0.3s ease-out`
}));

const TemplateCard = styled(Card)(({ theme, selected }) => ({
  border: selected ? '3px solid #667eea' : '2px solid #e0e0e0',
  borderRadius: '16px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    borderColor: '#667eea'
  }
}));

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const NotificationControl = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [notificationHistory, setNotificationHistory] = useState([]);

  // Form states
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [notificationType, setNotificationType] = useState('general');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sendToAll, setSendToAll] = useState(false);

  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Templates
  const notificationTemplates = [
    {
      id: 'absent',
      type: 'absent',
      icon: <AbsentIcon />,
      title: 'Absence Alert',
      description: 'Send absence notification to student parents',
      color: '#f44336',
      defaultTitle: 'Student Absence Alert',
      defaultMessage: 'Your child was marked absent today. Please contact the school if this is unexpected.'
    },
    {
      id: 'notice',
      type: 'notice',
      icon: <AnnouncementIcon />,
      title: 'Notice/Announcement',
      description: 'Send important notices or announcements',
      color: '#2196f3',
      defaultTitle: 'Important Notice',
      defaultMessage: ''
    },
    {
      id: 'marks',
      type: 'marks',
      icon: <GradeIcon />,
      title: 'Marks Update',
      description: 'Notify students about new marks/results',
      color: '#4caf50',
      defaultTitle: 'Marks Updated',
      defaultMessage: 'Your examination marks have been updated. Check your results in the app.'
    },
    {
      id: 'general',
      type: 'general',
      icon: <NotificationsIcon />,
      title: 'General Message',
      description: 'Send custom notification',
      color: '#ff9800',
      defaultTitle: '',
      defaultMessage: ''
    }
  ];

  useEffect(() => {
    fetchStudents();
    fetchClasses();
    fetchNotificationHistory();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await axios.get(`${baseUrl}/student/fetch-all?limit=1000&status=Active`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        const studentsData = response.data.data || [];
        console.log('Fetched students:', studentsData.length);
        setStudents(studentsData);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    }
  };

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await axios.get(`${baseUrl}/class/fetch-all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setClasses(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchNotificationHistory = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await axios.get(`${baseUrl}/notification/history?limit=50`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setNotificationHistory(response.data.data?.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching notification history:', error);
      setNotificationHistory([]);
    }
  };

  const handleTemplateSelect = (template) => {
    setNotificationType(template.type);
    setTitle(template.defaultTitle);
    setMessage(template.defaultMessage);
  };

  const handleSendNotification = async () => {
    if (!title || !message) {
      setSnackbar({ open: true, message: 'Please fill in title and message', severity: 'error' });
      return;
    }

    if (!sendToAll && selectedStudents.length === 0) {
      setSnackbar({ open: true, message: 'Please select at least one student', severity: 'error' });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      const payload = {
        title,
        message,
        type: notificationType,
        sendToAll,
        studentIds: sendToAll ? [] : selectedStudents.map(s => s._id),
        classId: selectedClass || null
      };

      const response = await axios.post(
        `${baseUrl}/notification/send`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        const data = response.data.data;
        const successCount = data?.successCount || 0;
        const totalStudents = data?.totalStudents || 0;
        const studentsWithTokens = data?.studentsWithTokens || 0;
        const warning = data?.warning || response.data.message;

        let message = '';
        let severity = 'success';

        if (successCount > 0) {
          message = `✅ Push notification sent to ${successCount} student(s)!`;
        } else if (studentsWithTokens === 0 && totalStudents > 0) {
          message = `⚠️ Notification saved for ${totalStudents} student(s), but no push sent. Students need to login to the app and enable notifications first.`;
          severity = 'warning';
        } else {
          message = warning || 'Notification processed';
          severity = 'info';
        }

        setSnackbar({
          open: true,
          message,
          severity
        });

        // Reset form
        setTitle('');
        setMessage('');
        setSelectedStudents([]);
        setSelectedClass('');
        setSendToAll(false);

        // Refresh history
        fetchNotificationHistory();
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to send notification',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = selectedClass
    ? students.filter(s => s.student_class?._id === selectedClass)
    : students;

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 }, pb: { xs: 10, md: 4 } }}>
      {/* Header */}
      <HeaderCard>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: { xs: 56, md: 70 },
                height: { xs: 56, md: 70 },
                bgcolor: 'rgba(255,255,255,0.2)',
                animation: `${pulse} 2s infinite`
              }}
            >
              <NotificationsIcon sx={{ fontSize: { xs: 32, md: 40 } }} />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', md: '2rem' } }}>
                Notification Control Center
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                Send push notifications to students instantly
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </HeaderCard>

      {/* Info Banner */}
      <Alert severity="info" sx={{ mb: 3, borderRadius: '16px' }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
          📱 How Push Notifications Work
        </Typography>
        <Typography variant="caption" sx={{ display: 'block' }}>
          • Students must login to the mobile app and grant notification permissions
          <br />
          • Notifications are saved to history even if students haven't enabled push yet
          <br />
          • Push alerts are sent only to students who have enabled notifications
        </Typography>
      </Alert>

      {/* Tabs */}
      <Paper sx={{ borderRadius: '16px', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          variant={isMobile ? "fullWidth" : "standard"}
          sx={{
            '& .MuiTab-root': {
              fontWeight: 600,
              fontSize: { xs: '0.8rem', md: '1rem' }
            }
          }}
        >
          <Tab icon={<SendIcon />} label="Send Notification" />
          <Tab icon={<HistoryIcon />} label="History" />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* Templates */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              Choose Notification Template
            </Typography>
            <Grid container spacing={2}>
              {notificationTemplates.map((template) => (
                <Grid item xs={12} sm={6} md={3} key={template.id}>
                  <TemplateCard
                    selected={notificationType === template.type}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Avatar sx={{ bgcolor: template.color, width: 40, height: 40 }}>
                          {template.icon}
                        </Avatar>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {template.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {template.description}
                      </Typography>
                    </CardContent>
                  </TemplateCard>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Form */}
          <Grid item xs={12} md={8}>
            <StyledCard>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                  Notification Details
                </Typography>

                <TextField
                  fullWidth
                  label="Notification Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  sx={{ mb: 3 }}
                  required
                />

                <TextField
                  fullWidth
                  label="Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  multiline
                  rows={4}
                  sx={{ mb: 3 }}
                  required
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={sendToAll}
                      onChange={(e) => setSendToAll(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Send to All Students"
                  sx={{ mb: 2 }}
                />

                {!sendToAll && (
                  <>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel>Filter by Class (Optional)</InputLabel>
                      <Select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        label="Filter by Class (Optional)"
                      >
                        <MenuItem value="">All Classes</MenuItem>
                        {classes.map((cls) => (
                          <MenuItem key={cls._id} value={cls._id}>
                            {cls.class_text}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Autocomplete
                      multiple
                      options={filteredStudents}
                      getOptionLabel={(option) => {
                        const className = option.student_class?.class_text || option.class_name || 'N/A';
                        return `${option.name} - ${className} ${option.roll_number ? `(Roll: ${option.roll_number})` : ''}`;
                      }}
                      value={selectedStudents}
                      onChange={(e, newValue) => setSelectedStudents(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Students"
                          placeholder="Search students..."
                          helperText={`${students.length} students available`}
                        />
                      )}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            key={index}
                            label={`${option.name} (${option.roll_number || 'N/A'})`}
                            {...getTagProps({ index })}
                            size="small"
                          />
                        ))
                      }
                      noOptionsText="No students found"
                    />
                  </>
                )}

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                  onClick={handleSendNotification}
                  disabled={loading}
                  sx={{
                    mt: 3,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontWeight: 700,
                    fontSize: '1rem',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                    }
                  }}
                >
                  {loading ? 'Sending...' : 'Send Notification'}
                </Button>
              </CardContent>
            </StyledCard>
          </Grid>

          {/* Quick Stats */}
          <Grid item xs={12} md={4}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                  Quick Stats
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Students
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea' }}>
                      {students.length}
                    </Typography>
                  </Box>
                  <Divider />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Push Enabled
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#4caf50' }}>
                      {students.filter(s => s.fcmToken).length}
                    </Typography>
                  </Box>
                  <Divider />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Selected
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea' }}>
                      {sendToAll ? 'All' : selectedStudents.length}
                    </Typography>
                  </Box>
                  <Divider />
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Sent Today
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff9800' }}>
                      {notificationHistory.filter(n => {
                        const today = new Date().toDateString();
                        const nDate = new Date(n.createdAt).toDateString();
                        return today === nDate;
                      }).length}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <StyledCard>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
              Notification History
            </Typography>

            {notificationHistory.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <HistoryIcon sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No notifications sent yet
                </Typography>
              </Box>
            ) : (
              <List>
                {notificationHistory.map((notification, index) => (
                  <React.Fragment key={notification._id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: '#667eea' }}>
                          <NotificationsIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {notification.title}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              {notification.message}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                              <Chip
                                label={notification.type}
                                size="small"
                                color="primary"
                              />
                              <Chip
                                label={`${notification.recipientCount || 0} recipients`}
                                size="small"
                                icon={<GroupIcon />}
                              />
                              <Typography variant="caption" color="text.secondary">
                                {new Date(notification.createdAt).toLocaleString()}
                              </Typography>
                            </Box>
                          </>
                        }
                      />
                    </ListItem>
                    {index < notificationHistory.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </CardContent>
        </StyledCard>
      </TabPanel>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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

export default NotificationControl;
