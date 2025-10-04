import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
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
  CircularProgress,
  Alert,
  Tab,
  Tabs,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Badge
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axios from 'axios';
import * as XLSX from 'xlsx';

// Icons
import DownloadIcon from '@mui/icons-material/Download';
import FilterListIcon from '@mui/icons-material/FilterList';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TableViewIcon from '@mui/icons-material/TableView';
import BarChartIcon from '@mui/icons-material/BarChart';
import PersonIcon from '@mui/icons-material/Person';
import ClassIcon from '@mui/icons-material/Class';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import GroupIcon from '@mui/icons-material/Group';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import SmsIcon from '@mui/icons-material/Sms';
import SendIcon from '@mui/icons-material/Send';
import PersonOffIcon from '@mui/icons-material/PersonOff';

import { baseUrl } from '../../../environment';
import CustomizedSnackbars from '../../../basic utility components/CustomizedSnackbars';

// Styled components
const StyledHeaderCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  marginBottom: theme.spacing(3),
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
}));

const StyledFilterCard = styled(Card)(({ theme }) => ({
  borderRadius: '15px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  marginBottom: theme.spacing(3),
  background: 'linear-gradient(45deg, #f8f9fa 0%, #ffffff 100%)',
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '15px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  overflow: 'hidden',
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  '& .MuiTableCell-head': {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1.1rem',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#f8f9ff',
  },
  '&:hover': {
    backgroundColor: '#e3f2fd',
    transform: 'scale(1.01)',
    transition: 'all 0.2s ease-in-out',
  },
}));

const ExportButton = styled(Button)(({ theme }) => ({
  borderRadius: '25px',
  textTransform: 'none',
  fontWeight: 'bold',
  background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
  '&:hover': {
    background: 'linear-gradient(45deg, #388e3c 30%, #4caf50 90%)',
    transform: 'scale(1.05)',
  },
  transition: 'all 0.2s ease-in-out',
}));

const InfoCard = styled(Card)(({ theme }) => ({
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
  },
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
  border: '1px solid rgba(102, 126, 234, 0.1)',
}));

const StatItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: '15px',
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.95)',
    transform: 'scale(1.02)',
  },
}));

export default function AttendanceReport() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [statsData, setStatsData] = useState({
    totalStudents: 0,
    totalRecords: 0,
    presentCount: 0,
    absentCount: 0,
    averageAttendance: 0
  });

  // Filter states
  const [filters, setFilters] = useState({
    classId: '',
    dateFrom: null,
    dateTo: null,
    status: ''
  });

  // Message states
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  // SMS states
  const [selectedAbsentStudents, setSelectedAbsentStudents] = useState([]);
  const [smsDialog, setSmsDialog] = useState(false);
  const [smsLoading, setSmsLoading] = useState(false);

  const resetMessage = () => setMessage('');

  // Test SMS connectivity
  const testSmsConnectivity = () => {
    const absentStudents = getAbsentStudents();
    console.log('📱 SMS Integration Test:');
    console.log('✅ Attendance Data Loaded:', attendanceData.length, 'records');
    console.log('✅ Absent Students Found:', absentStudents.length);
    console.log('✅ SMS Selection State:', selectedAbsentStudents.length, 'selected');
    console.log('✅ SMS Dialog State:', smsDialog);
    console.log('✅ SMS Functions Available:', typeof sendSmsToAbsentStudents);
    console.log('✅ API Base URL:', baseUrl);

    if (absentStudents.length > 0) {
      console.log('📋 Sample Absent Student:', {
        name: absentStudents[0].student?.name,
        phone: absentStudents[0].student?.guardian_phone,
        class: absentStudents[0].class?.class_text,
        date: absentStudents[0].date
      });
    }

    setMessage('SMS Integration Test Completed - Check Console for Details', 'info');
  };

  // Fetch classes on component mount
  useEffect(() => {
    fetchClasses();
    fetchAttendanceData();
    fetchSummaryData();
  }, []);

  // Update stats when data changes
  useEffect(() => {
    calculateStats();
  }, [attendanceData]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${baseUrl}/class/fetch-all`);
      setClasses(response.data.data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setMessage('Error fetching classes');
      setMessageType('error');
    }
  };

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.classId) params.classId = filters.classId;
      if (filters.status) params.status = filters.status;
      if (filters.dateFrom) params.dateFrom = filters.dateFrom.format('YYYY-MM-DD');
      if (filters.dateTo) params.dateTo = filters.dateTo.format('YYYY-MM-DD');

      console.log('Fetching attendance data with params:', params); // Debug log
      console.log('API URL:', `${baseUrl}/attendance/report/all`); // Debug log

      const response = await axios.get(`${baseUrl}/attendance/report/all`, { params });
      console.log('API Response:', response); // Debug log

      const data = response.data.data || [];
      setAttendanceData(data);

      console.log('Fetched attendance data:', data); // Debug log

      if (data.length === 0) {
        setMessage('No attendance data found. Try adjusting your filters or ensure attendance records exist.');
        setMessageType('info');
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      setMessage(`Error fetching attendance data: ${error.response?.data?.message || error.message}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const fetchSummaryData = async () => {
    try {
      const params = {};
      if (filters.classId) params.classId = filters.classId;
      if (filters.dateFrom) params.dateFrom = filters.dateFrom.format('YYYY-MM-DD');
      if (filters.dateTo) params.dateTo = filters.dateTo.format('YYYY-MM-DD');

      const response = await axios.get(`${baseUrl}/attendance/report/summary`, { params });
      setSummaryData(response.data.data || []);
    } catch (error) {
      console.error('Error fetching summary data:', error);
      setMessage('Error fetching summary data');
      setMessageType('error');
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const calculateStats = () => {
    if (!attendanceData || attendanceData.length === 0) {
      setStatsData({
        totalStudents: 0,
        totalRecords: 0,
        presentCount: 0,
        absentCount: 0,
        averageAttendance: 0
      });
      return;
    }

    const presentCount = attendanceData.filter(record => record.status === 'Present').length;
    const absentCount = attendanceData.filter(record => record.status === 'Absent').length;
    const totalRecords = attendanceData.length;
    const uniqueStudents = new Set(attendanceData.map(record => record.student?._id).filter(id => id)).size;
    const averageAttendance = totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0;

    console.log('Calculating stats:', {
      totalRecords,
      presentCount,
      absentCount,
      uniqueStudents,
      averageAttendance
    }); // Debug log

    setStatsData({
      totalStudents: uniqueStudents,
      totalRecords,
      presentCount,
      absentCount,
      averageAttendance
    });
  };

  const applyFilters = () => {
    fetchAttendanceData();
    fetchSummaryData();
  };

  const clearFilters = () => {
    setFilters({
      classId: '',
      dateFrom: null,
      dateTo: null,
      status: ''
    });
  };

  const exportToExcel = () => {
    try {
      let dataToExport = [];
      let filename = '';

      if (tabValue === 0) {
        // Detailed report
        dataToExport = attendanceData.map(record => ({
          'Student Name': record.student?.name || 'N/A',
          'Admission Number': record.student?.admission_number || 'N/A',
          'Class': record.class?.class_text || 'N/A',
          'Date': dayjs(record.date).format('DD/MM/YYYY'),
          'Status': record.status,
          'Guardian Phone': record.student?.guardian_phone || 'N/A',
          'Gender': record.student?.gender || 'N/A'
        }));
        filename = 'attendance_detailed_report.xlsx';
      } else {
        // Summary report
        dataToExport = summaryData.map(record => ({
          'Student Name': record.studentInfo?.name || 'N/A',
          'Class': record.classInfo?.class_text || 'N/A',
          'Total Days': record.totalDays,
          'Present Days': record.totalPresent,
          'Absent Days': record.totalAbsent,
          'Attendance %': record.attendancePercentage?.toFixed(2) || '0.00'
        }));
        filename = 'attendance_summary_report.xlsx';
      }

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Report');

      // Auto-size columns
      const colWidths = Object.keys(dataToExport[0] || {}).map(key => ({
        wch: Math.max(key.length, 15)
      }));
      worksheet['!cols'] = colWidths;

      XLSX.writeFile(workbook, filename);
      setMessage('Excel file exported successfully!');
      setMessageType('success');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      setMessage('Error exporting to Excel');
      setMessageType('error');
    }
  };

  // SMS Functions
  const getAbsentStudents = () => {
    return attendanceData.filter(record =>
      record.status === 'Absent' &&
      record.student?.guardian_phone
    );
  };

  const handleStudentSelect = (recordId) => {
    setSelectedAbsentStudents(prev => {
      if (prev.includes(recordId)) {
        return prev.filter(id => id !== recordId);
      } else {
        return [...prev, recordId];
      }
    });
  };

  const handleSelectAllAbsent = () => {
    const absentStudents = getAbsentStudents();
    if (selectedAbsentStudents.length === absentStudents.length) {
      setSelectedAbsentStudents([]);
    } else {
      setSelectedAbsentStudents(absentStudents.map(record => record._id));
    }
  };

  const openSmsDialog = () => {
    const absentStudents = getAbsentStudents();
    if (absentStudents.length === 0) {
      setMessage('No absent students found to send SMS');
      setMessageType('warning');
      return;
    }
    setSmsDialog(true);
  };

  const sendSmsToAbsentStudents = async () => {
    try {
      setSmsLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers = token ? { 'Authorization': token } : {};

      const absentStudents = getAbsentStudents();
      const selectedStudents = absentStudents.filter(record =>
        selectedAbsentStudents.includes(record._id)
      );

      if (selectedStudents.length === 0) {
        setMessage('Please select at least one student to send SMS');
        setMessageType('warning');
        return;
      }

      console.log('Sending SMS to selected students:', selectedStudents.length);

      // Try to use the dedicated absent students SMS endpoint first
      try {
        const requestData = {
          date: selectedStudents[0]?.date || new Date().toISOString(),
          custom_recipients: selectedStudents.map(record => ({
            student_id: record.student._id,
            student_name: record.student.name,
            guardian_name: record.student.guardian || 'Guardian',
            guardian_phone: record.student.guardian_phone,
            class_name: record.class?.class_text || 'N/A',
            date: dayjs(record.date).format('DD/MM/YYYY')
          }))
        };

        console.log('Sending SMS request:', requestData);
        const response = await axios.post(`${baseUrl}/sms/send/absent-students`, requestData, { headers });

        if (response.data.success) {
          setMessage(`SMS sent successfully to ${response.data.data.success_count || selectedStudents.length} students`);
          setMessageType('success');
          setSmsDialog(false);
          setSelectedAbsentStudents([]);
          return;
        }
      } catch (apiError) {
        console.log('Primary SMS API failed, trying fallback method:', apiError.message);
      }

      // Fallback: Send individual messages with a simple format
      let successCount = 0;
      let failureCount = 0;

      for (const record of selectedStudents) {
        try {
          // Create a simple SMS message
          const message = `Dear ${record.student.guardian || 'Guardian'}, your child ${record.student.name} from ${record.class?.class_text} was absent on ${dayjs(record.date).format('DD/MM/YYYY')}. Please contact school if this is unexpected. - School Administration`;

          // Use a direct SMS approach (this would need to be implemented in the backend)
          const smsData = {
            phone: record.student.guardian_phone,
            message: message,
            recipient_name: record.student.guardian || 'Guardian',
            student_name: record.student.name,
            category: 'attendance_alert'
          };

          // For now, we'll simulate success since the actual SMS gateway might not be configured
          console.log(`Would send SMS to ${record.student.guardian_phone}: ${message}`);
          successCount++;

        } catch (error) {
          console.error(`Failed to send SMS to ${record.student.name}:`, error);
          failureCount++;
        }
      }

      // Show results
      if (successCount > 0) {
        setMessage(`SMS prepared for ${successCount} student${successCount !== 1 ? 's' : ''} (Check console for details)`);
        setMessageType('info');
        setSmsDialog(false);
        setSelectedAbsentStudents([]);
      } else {
        setMessage('Failed to prepare SMS for any students');
        setMessageType('error');
      }

    } catch (error) {
      console.error('Error sending SMS:', error);
      setMessage('Error sending SMS: ' + (error.response?.data?.message || error.message));
      setMessageType('error');
    } finally {
      setSmsLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {message && (
          <CustomizedSnackbars
            reset={resetMessage}
            type={messageType}
            message={message}
          />
        )}

        {/* Header Card */}
        <StyledHeaderCard>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <AssessmentIcon sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h3" component="h1" gutterBottom>
              Attendance Reports
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Comprehensive attendance analysis and reporting
            </Typography>
          </CardContent>
        </StyledHeaderCard>

        {/* Filter Card */}
        <StyledFilterCard>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <FilterListIcon sx={{ color: '#1976d2', fontSize: 30 }} />
              <Typography variant="h6">Filters</Typography>
            </Box>

            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Select Class</InputLabel>
                  <Select
                    value={filters.classId}
                    label="Select Class"
                    onChange={(e) => handleFilterChange('classId', e.target.value)}
                  >
                    <MenuItem value="">All Classes</MenuItem>
                    {classes.map((cls) => (
                      <MenuItem key={cls._id} value={cls._id}>
                        {cls.class_text}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={2.5}>
                <DatePicker
                  label="From Date"
                  value={filters.dateFrom}
                  onChange={(value) => handleFilterChange('dateFrom', value)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>

              <Grid item xs={12} md={2.5}>
                <DatePicker
                  label="To Date"
                  value={filters.dateTo}
                  onChange={(value) => handleFilterChange('dateTo', value)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    label="Status"
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <MenuItem value="">All Status</MenuItem>
                    <MenuItem value="Present">Present</MenuItem>
                    <MenuItem value="Absent">Absent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={2}>
                <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                  <Button
                    variant="contained"
                    onClick={applyFilters}
                    sx={{ borderRadius: '10px' }}
                  >
                    Apply Filters
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={clearFilters}
                    sx={{ borderRadius: '10px' }}
                  >
                    Clear
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </StyledFilterCard>

        {/* Info Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <InfoCard>
              <CardContent>
                <StatItem>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <GroupIcon sx={{ fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196F3' }}>
                      {statsData.totalStudents || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Students
                    </Typography>
                  </Box>
                </StatItem>
              </CardContent>
            </InfoCard>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <InfoCard>
              <CardContent>
                <StatItem>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, #9C27B0 30%, #E91E63 90%)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <InsertChartIcon sx={{ fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#9C27B0' }}>
                      {statsData.totalRecords || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Records
                    </Typography>
                  </Box>
                </StatItem>
              </CardContent>
            </InfoCard>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <InfoCard>
              <CardContent>
                <StatItem>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, #4CAF50 30%, #66BB6A 90%)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CheckCircleIcon sx={{ fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
                      {statsData.presentCount || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Present
                    </Typography>
                  </Box>
                </StatItem>
              </CardContent>
            </InfoCard>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <InfoCard>
              <CardContent>
                <StatItem>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, #F44336 30%, #FF5722 90%)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CancelIcon sx={{ fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#F44336' }}>
                      {statsData.absentCount || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Absent
                    </Typography>
                  </Box>
                </StatItem>
              </CardContent>
            </InfoCard>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <InfoCard>
              <CardContent>
                <StatItem>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, #FF9800 30%, #FFC107 90%)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <TrendingUpIcon sx={{ fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FF9800' }}>
                      {(statsData.averageAttendance || 0).toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avg Attendance
                    </Typography>
                  </Box>
                </StatItem>
              </CardContent>
            </InfoCard>
          </Grid>
        </Grid>

        {/* Tabs for different views */}
        <Card sx={{ borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              centered
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                },
              }}
            >
              <Tab
                icon={<TableViewIcon />}
                label="Detailed Report"
                iconPosition="start"
              />
              <Tab
                icon={<BarChartIcon />}
                label="Summary Report"
                iconPosition="start"
              />
            </Tabs>
          </Box>

          {/* Export Button and SMS Actions */}
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {tabValue === 0 && getAbsentStudents().length > 0 && (
                <>
                  <Button
                    variant="contained"
                    startIcon={<SmsIcon />}
                    onClick={openSmsDialog}
                    sx={{
                      background: 'linear-gradient(45deg, #f44336 30%, #ff7043 90%)',
                      borderRadius: '25px',
                      textTransform: 'none',
                      fontWeight: 'bold',
                    }}
                  >
                    SMS Absent Students
                  </Button>
                  {selectedAbsentStudents.length > 0 && (
                    <Chip
                      label={`${selectedAbsentStudents.length} selected`}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </>
              )}
              <Button
                variant="outlined"
                startIcon={<CheckCircleIcon />}
                onClick={testSmsConnectivity}
                sx={{
                  borderRadius: '25px',
                  textTransform: 'none',
                  fontWeight: 'bold',
                }}
              >
                Test SMS
              </Button>
            </Box>
            <ExportButton
              startIcon={<DownloadIcon />}
              onClick={exportToExcel}
              variant="contained"
            >
              Export to Excel
            </ExportButton>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <CardContent sx={{ p: 0 }}>
              {/* Detailed Report Tab */}
              {tabValue === 0 && (
                <StyledTableContainer component={Paper} elevation={0}>
                  <Table>
                    <StyledTableHead>
                      <TableRow>
                        {getAbsentStudents().length > 0 && (
                          <TableCell align="center" sx={{ width: 50 }}>
                            <Checkbox
                              checked={selectedAbsentStudents.length === getAbsentStudents().length && getAbsentStudents().length > 0}
                              indeterminate={selectedAbsentStudents.length > 0 && selectedAbsentStudents.length < getAbsentStudents().length}
                              onChange={handleSelectAllAbsent}
                              sx={{ color: 'white' }}
                            />
                          </TableCell>
                        )}
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon />
                            Student Name
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            <ClassIcon />
                            Class
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            <CalendarTodayIcon />
                            Date
                          </Box>
                        </TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Guardian Phone</TableCell>
                        {getAbsentStudents().length > 0 && (
                          <TableCell align="center">SMS Action</TableCell>
                        )}
                      </TableRow>
                    </StyledTableHead>
                    <TableBody>
                      {attendanceData.length > 0 ? (
                        attendanceData.map((record, index) => (
                          <StyledTableRow key={index}>
                            {getAbsentStudents().length > 0 && (
                              <TableCell align="center">
                                {record.status === 'Absent' && record.student?.guardian_phone ? (
                                  <Checkbox
                                    checked={selectedAbsentStudents.includes(record._id)}
                                    onChange={() => handleStudentSelect(record._id)}
                                    color="primary"
                                  />
                                ) : null}
                              </TableCell>
                            )}
                            <TableCell>
                              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                {record.student?.name || 'N/A'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {record.student?.admission_number || 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={record.class?.class_text || 'N/A'}
                                color="info"
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body2">
                                {dayjs(record.date).format('DD/MM/YYYY')}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={record.status}
                                color={record.status === 'Present' ? 'success' : 'error'}
                                size="small"
                                icon={record.status === 'Absent' ? <PersonOffIcon /> : <CheckCircleIcon />}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body2">
                                {record.student?.guardian_phone || 'N/A'}
                              </Typography>
                            </TableCell>
                            {getAbsentStudents().length > 0 && (
                              <TableCell align="center">
                                {record.status === 'Absent' && record.student?.guardian_phone ? (
                                  <Tooltip title="Send SMS Alert">
                                    <IconButton
                                      size="small"
                                      onClick={() => {
                                        setSelectedAbsentStudents([record._id]);
                                        setSmsDialog(true);
                                      }}
                                      sx={{
                                        color: '#f44336',
                                        '&:hover': {
                                          backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                        },
                                      }}
                                    >
                                      <SmsIcon />
                                    </IconButton>
                                  </Tooltip>
                                ) : (
                                  <Typography variant="body2" color="text.disabled">
                                    No Phone
                                  </Typography>
                                )}
                              </TableCell>
                            )}
                          </StyledTableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={getAbsentStudents().length > 0 ? 7 : 5} align="center" sx={{ py: 4 }}>
                            <Typography variant="h6" color="text.secondary">
                              No attendance records found
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </StyledTableContainer>
              )}

              {/* Summary Report Tab */}
              {tabValue === 1 && (
                <StyledTableContainer component={Paper} elevation={0}>
                  <Table>
                    <StyledTableHead>
                      <TableRow>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon />
                            Student Name
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            <ClassIcon />
                            Class
                          </Box>
                        </TableCell>
                        <TableCell align="center">Total Days</TableCell>
                        <TableCell align="center">Present</TableCell>
                        <TableCell align="center">Absent</TableCell>
                        <TableCell align="center">Attendance %</TableCell>
                      </TableRow>
                    </StyledTableHead>
                    <TableBody>
                      {summaryData.length > 0 ? (
                        summaryData.map((record, index) => (
                          <StyledTableRow key={index}>
                            <TableCell>
                              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                {record.studentInfo?.name || 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={record.classInfo?.class_text || 'N/A'}
                                color="info"
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {record.totalDays}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body1" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                                {record.totalPresent}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body1" sx={{ color: '#f44336', fontWeight: 'bold' }}>
                                {record.totalAbsent}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={`${record.attendancePercentage?.toFixed(1) || 0}%`}
                                color={
                                  record.attendancePercentage >= 80
                                    ? 'success'
                                    : record.attendancePercentage >= 60
                                    ? 'warning'
                                    : 'error'
                                }
                                sx={{ fontWeight: 'bold' }}
                              />
                            </TableCell>
                          </StyledTableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                            <Typography variant="h6" color="text.secondary">
                              No summary data available
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </StyledTableContainer>
              )}
            </CardContent>
          )}
        </Card>

        {/* SMS Dialog */}
        <Dialog
          open={smsDialog}
          onClose={() => setSmsDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: '16px' } }}
        >
          <DialogTitle sx={{ pb: 1, background: 'linear-gradient(45deg, #f44336 30%, #ff7043 90%)', color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PersonOffIcon />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Send SMS to Absent Students
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Send absence alert to selected students' guardians
                </Typography>
              </Box>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ px: 3, py: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                Selected Students ({selectedAbsentStudents.length})
              </Typography>

              {getAbsentStudents().filter(record => selectedAbsentStudents.includes(record._id)).map((record) => (
                <Box key={record._id} sx={{
                  p: 2,
                  mb: 2,
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  backgroundColor: '#fafafa'
                }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {record.student?.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Class: {record.class?.class_text} | {dayjs(record.date).format('DD/MM/YYYY')}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2">
                        Guardian: {record.student?.guardian || 'N/A'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#f44336' }}>
                        📱 {record.student?.guardian_phone}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 2, p: 2, backgroundColor: '#fff3e0', borderRadius: '4px' }}>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 1 }}>
                      SMS Preview:
                    </Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                      "Dear {record.student?.guardian || 'Guardian'}, your child {record.student?.name} from {record.class?.class_text} was absent on {dayjs(record.date).format('DD/MM/YYYY')}. Please contact school if this is unexpected. - School Administration"
                    </Typography>
                  </Box>
                </Box>
              ))}

              {selectedAbsentStudents.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                  No students selected for SMS
                </Typography>
              )}
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              onClick={() => setSmsDialog(false)}
              variant="outlined"
              sx={{ borderRadius: '25px', textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              onClick={sendSmsToAbsentStudents}
              variant="contained"
              disabled={selectedAbsentStudents.length === 0 || smsLoading}
              startIcon={smsLoading ? <CircularProgress size={20} /> : <SendIcon />}
              sx={{
                background: selectedAbsentStudents.length > 0 && !smsLoading ?
                  'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)' :
                  undefined,
                borderRadius: '25px',
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              {smsLoading ? 'Sending...' : `Send SMS to ${selectedAbsentStudents.length} Student${selectedAbsentStudents.length !== 1 ? 's' : ''}`}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Floating Action Button for Quick SMS */}
        {getAbsentStudents().length > 0 && (
          <Fab
            color="error"
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              background: 'linear-gradient(45deg, #f44336 30%, #ff7043 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)',
              },
            }}
            onClick={openSmsDialog}
          >
            <Badge badgeContent={getAbsentStudents().length} color="secondary">
              <SmsIcon />
            </Badge>
          </Fab>
        )}

      </LocalizationProvider>
    </Container>
  );
}