import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Card,
  CardContent,
  Alert,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';
import { baseUrl } from '../../../environment';
import AssignFixedPeriod from './AssignFixedPeriod';

const StyledHeaderCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  marginBottom: theme.spacing(3),
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '15px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  marginTop: theme.spacing(3),
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: '#f8f9ff',
  color: '#1976d2',
  borderBottom: '2px solid #e3f2fd',
}));

const PeriodCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1),
  minWidth: '150px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
}));

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PERIODS = [
  { num: 1, label: 'Period 1', startTime: '07:00', endTime: '08:00' },
  { num: 2, label: 'Period 2', startTime: '08:00', endTime: '09:00' },
  { num: 3, label: 'Period 3', startTime: '09:00', endTime: '10:00' },
  { num: 4, label: 'Period 4', startTime: '10:00', endTime: '11:00' },
  { num: 5, label: 'Period 5', startTime: '11:00', endTime: '12:00' },
  { num: 6, label: 'Lunch', startTime: '12:00', endTime: '13:00' },
  { num: 7, label: 'Period 6', startTime: '13:00', endTime: '14:00' },
  { num: 8, label: 'Period 7', startTime: '14:00', endTime: '15:00' },
  { num: 9, label: 'Period 8', startTime: '15:00', endTime: '16:00' },
  { num: 10, label: 'Period 9', startTime: '16:00', endTime: '17:00' },
  { num: 11, label: 'Period 10', startTime: '17:00', endTime: '18:00' },
  { num: 12, label: 'Period 11', startTime: '18:00', endTime: '19:00' },
];

const FixedSchedule = () => {
  const [allClasses, setAllClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [schedule, setSchedule] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentDayPeriod, setCurrentDayPeriod] = useState({ day: null, period: null });

  // Fetch all classes
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const headers = token ? { Authorization: token } : {};

    axios
      .get(`${baseUrl}/class/fetch-all`, { headers })
      .then((resp) => {
        setAllClasses(resp.data.data);
        if (resp.data.data.length > 0) {
          setSelectedClass(resp.data.data[0]._id);
        }
      })
      .catch((e) => {
        console.error('Error fetching classes:', e);
        if (e.response?.status === 403 || e.response?.status === 401) {
          alert('Authentication error. Please login again.');
        }
      });
  }, []);

  // Fetch schedule for selected class
  useEffect(() => {
    if (!selectedClass) return;

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const headers = token ? { Authorization: token } : {};

    axios
      .get(`${baseUrl}/period/schedule/week/${selectedClass}`, { headers })
      .then((resp) => {
        setSchedule(resp.data.schedule);
      })
      .catch((e) => {
        console.error('Error fetching schedule:', e);
        if (e.response?.status === 403 || e.response?.status === 401) {
          alert('Authentication error. Please login again.');
        }
      });
  }, [selectedClass, openDialog]);

  const handleCellClick = (dayOfWeek, periodNum) => {
    const existingPeriod = schedule[dayOfWeek]?.find(p => p.periodNumber === periodNum);

    if (existingPeriod) {
      setSelectedPeriod(existingPeriod);
      setEditMode(true);
    } else {
      setSelectedPeriod(null);
      setEditMode(false);
    }

    setCurrentDayPeriod({ day: dayOfWeek, period: periodNum });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPeriod(null);
    setEditMode(false);
  };

  const getPeriodData = (dayOfWeek, periodNum) => {
    return schedule[dayOfWeek]?.find(p => p.periodNumber === periodNum);
  };

  const renderPeriodContent = (periodData) => {
    if (!periodData) {
      return (
        <Box sx={{ textAlign: 'center', color: '#999' }}>
          <AddIcon fontSize="small" />
          <Typography variant="caption" display="block">Add Period</Typography>
        </Box>
      );
    }

    return (
      <Box>
        <Typography variant="body2" fontWeight="bold" color="primary">
          {periodData.subject?.subject_name || 'No Subject'}
        </Typography>
        <Chip
          icon={<PersonIcon />}
          label={periodData.teacher?.name || 'No Teacher'}
          size="small"
          sx={{ mt: 0.5 }}
          color="secondary"
        />
      </Box>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <StyledHeaderCard>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <SchoolIcon sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom>
            Fixed Weekly Schedule
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Set up once - stays permanent. Click any cell to add or edit.
          </Typography>
        </CardContent>
      </StyledHeaderCard>

      <Paper sx={{ p: 3, mb: 3, borderRadius: '15px' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Select Class</InputLabel>
              <Select
                value={selectedClass || ''}
                onChange={(e) => setSelectedClass(e.target.value)}
                label="Select Class"
              >
                {allClasses.map((cls) => (
                  <MenuItem key={cls._id} value={cls._id}>
                    {cls.class_text}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Alert severity="info">
              Click on any time slot to assign or edit a period
            </Alert>
          </Grid>
        </Grid>
      </Paper>

      {selectedClass && (
        <StyledTableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Period / Day</StyledTableCell>
                {DAYS.map((day, index) => (
                  <StyledTableCell key={index} align="center">
                    {day}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {PERIODS.map((period) => (
                <TableRow key={period.num}>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', bgcolor: '#fafafa' }}>
                    {period.label}
                    <Typography variant="caption" display="block" color="text.secondary">
                      {period.startTime} - {period.endTime}
                    </Typography>
                  </TableCell>
                  {DAYS.map((day, dayIndex) => {
                    const periodData = getPeriodData(dayIndex, period.num);
                    return (
                      <PeriodCell
                        key={dayIndex}
                        align="center"
                        onClick={() => handleCellClick(dayIndex, period.num)}
                        sx={{
                          bgcolor: periodData ? '#e3f2fd' : 'inherit',
                          border: periodData ? '2px solid #2196F3' : 'inherit',
                        }}
                      >
                        {renderPeriodContent(periodData)}
                      </PeriodCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      )}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '15px',
          }
        }}
      >
        <DialogTitle sx={{
          background: editMode
            ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
            : 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
          color: 'white',
          textAlign: 'center',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            {editMode ? <EditIcon /> : <AddIcon />}
            {editMode ? 'Edit Period' : 'Add New Period'}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 2 }}>
          <AssignFixedPeriod
            classId={selectedClass}
            dayOfWeek={currentDayPeriod.day}
            periodNumber={currentDayPeriod.period}
            isEdit={editMode}
            existingPeriod={selectedPeriod}
            onClose={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default FixedSchedule;
