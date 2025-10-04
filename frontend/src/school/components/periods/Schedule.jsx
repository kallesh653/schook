/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import { baseUrl } from '../../../environment';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Fab,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ClassIcon from '@mui/icons-material/Class';
import AddIcon from '@mui/icons-material/Add';
import CalendarViewWeekIcon from '@mui/icons-material/CalendarViewWeek';
import AssignPeriod2 from '../../../school/components/assign period/AssignPeriod2';

// Styled components for beautiful design
const StyledHeaderCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  marginBottom: theme.spacing(3),
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
}));

const StyledControlCard = styled(Card)(({ theme }) => ({
  borderRadius: '15px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  marginBottom: theme.spacing(3),
  background: 'linear-gradient(45deg, #f8f9fa 0%, #ffffff 100%)',
}));

const StyledCalendarContainer = styled(Box)(({ theme }) => ({
  borderRadius: '15px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  overflow: 'hidden',
  backgroundColor: 'white',
  '& .rbc-calendar': {
    borderRadius: '15px',
  },
  '& .rbc-header': {
    backgroundColor: '#f8f9ff',
    fontWeight: 'bold',
    color: '#1976d2',
    padding: '15px 10px',
    borderBottom: '2px solid #e3f2fd',
  },
  '& .rbc-time-view .rbc-time-gutter': {
    backgroundColor: '#f8f9ff',
    borderRight: '2px solid #e3f2fd',
  },
  '& .rbc-time-slot': {
    borderTop: '1px solid #e8eaf6',
  },
  '& .rbc-event': {
    borderRadius: '8px',
    border: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  '& .rbc-day-slot .rbc-time-slot': {
    borderTop: '1px solid #f0f0f0',
  },
  '& .rbc-timeslot-group': {
    borderBottom: '1px solid #e8eaf6',
  },
}));

const StyledFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  '&:hover': {
    background: 'linear-gradient(45deg, #1976D2 30%, #1BA3D3 90%)',
    transform: 'scale(1.1)',
  },
  transition: 'all 0.2s ease-in-out',
}));

const localizer = momentLocalizer(moment);
const eventStyleGetter = (event, start, end, isSelected) => {
  // Generate different colors for different subjects/teachers
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];
  
  const colorIndex = event.title ? event.title.length % colors.length : 0;
  
  const style = {
    backgroundColor: colors[colorIndex],
    color: 'white',
    borderRadius: '8px',
    padding: '8px',
    border: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    fontSize: '0.85rem',
    fontWeight: '500',
  };
  return {
    style,
  };
};


const periods = [
  { id: 1, label: 'Period 1 (7:00 AM - 8:00 AM)', startTime: '07:00', endTime: '08:00' },
  { id: 2, label: 'Period 2 (8:00 AM - 9:00 AM)', startTime: '08:00', endTime: '09:00' },
  { id: 3, label: 'Period 3 (9:00 AM - 10:00 AM)', startTime: '09:00', endTime: '10:00' },
  { id: 4, label: 'Period 4 (10:00 AM - 11:00 AM)', startTime: '10:00', endTime: '11:00' },
  { id: 5, label: 'Period 5 (11:00 AM - 12:00 PM)', startTime: '11:00', endTime: '12:00' },
  { id: 6, label: 'Lunch Break (12:00 PM - 1:00 PM)', startTime: '12:00', endTime: '13:00' }, // break
  { id: 7, label: 'Period 6 (1:00 PM - 2:00 PM)', startTime: '13:00', endTime: '14:00' },
  { id: 8, label: 'Period 7 (2:00 PM - 3:00 PM)', startTime: '14:00', endTime: '15:00' },
  { id: 9, label: 'Period 8 (3:00 PM - 4:00 PM)', startTime: '15:00', endTime: '16:00' },
  { id: 10, label: 'Period 9 (4:00 PM - 5:00 PM)', startTime: '16:00', endTime: '17:00' },
  { id: 11, label: 'Period 10 (5:00 PM - 6:00 PM)', startTime: '17:00', endTime: '18:00' },
  { id: 12, label: 'Period 11 (6:00 PM - 7:00 PM)', startTime: '18:00', endTime: '19:00' },
];

const Schedule = () => {
  const [events, setEvents] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  // Fetch all classes
  const fetchAllClasses = () => {
    axios
      .get(`${baseUrl}/class/fetch-all`)
      .then((resp) => {
        setAllClasses(resp.data.data);
        setSelectedClass(resp.data.data[0]._id);
      })
      .catch((e) => {
        console.error('Error in fetching all Classes');
      });
  };

  

  useEffect(() => {
    fetchAllClasses();
    // fetchAllTeachers();
  }, []);

  // Fetch periods for the selected class
  useEffect(() => {
    const fetchClassPeriods = async () => {
      if (!selectedClass) return;
      try {
        const response = await axios.get(`${baseUrl}/period/class/${selectedClass}`);
        const periods = response.data.periods;
        console.log(periods)
        const eventsData = periods.map((period) => ({
          id: period._id,
          title:`${period.subject?period.subject.subject_name:""}, By ${period.teacher?period.teacher.name:""}`,
          start: new Date(period.startTime),
          end: new Date(period.endTime)
        }));
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching periods:', error);
      }
    };

    fetchClassPeriods();
  }, [selectedClass,openDialog,openAddDialog]);

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event.id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
  };

  const handleOpenAddDialog = () => {
    
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };


  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Card */}
      <StyledHeaderCard>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <ScheduleIcon sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom>
            Weekly Schedule
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Manage and view class periods
          </Typography>
        </CardContent>
      </StyledHeaderCard>

      {/* Class Selection Card */}
      <StyledControlCard>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <ClassIcon sx={{ color: '#1976d2', fontSize: 30 }} />
            <FormControl sx={{ minWidth: 250 }}>
              <InputLabel>Select Class</InputLabel>
              <Select 
                value={selectedClass} 
                onChange={handleClassChange} 
                onBlur={handleClassChange}
                label="Select Class"
              >
                {allClasses &&
                  allClasses.map((value) => (
                    <MenuItem key={value._id} value={value._id}>
                      <Chip 
                        label={value.class_text} 
                        variant="outlined" 
                        color="primary" 
                        size="small"
                      />
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
              <CalendarViewWeekIcon sx={{ color: '#1976d2' }} />
              <Typography variant="body1" color="text.secondary">
                {events.length} periods scheduled
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </StyledControlCard>

      {/* Calendar Container */}
      <StyledCalendarContainer>
        <Calendar
          localizer={localizer}
          events={events}
          defaultView="week"
          views={['week']}
          step={30}
          timeslots={1}
          min={new Date(1970, 1, 1, 7, 0, 0)}
          max={new Date(1970, 1, 1, 19, 0, 0)}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          defaultDate={new Date()}
          showMultiDayTimes
          style={{ height: '600px', width: '100%' }}
          formats={{ 
            timeGutterFormat: 'hh:mm A',
            eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
              localizer.format(start, 'h:mm A', culture) + ' - ' + 
              localizer.format(end, 'h:mm A', culture)
          }}
        />
      </StyledCalendarContainer>

      {/* Floating Action Button */}
      <StyledFab onClick={handleOpenAddDialog} aria-label="add period">
        <AddIcon />
      </StyledFab>

      {/* Modal for Editing Events */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          color: 'white',
          textAlign: 'center',
          py: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <ScheduleIcon />
            Edit Period
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <AssignPeriod2 classId={selectedClass} isEdit={true} periodId={selectedEvent} close={handleCloseDialog} />
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
          <Button 
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ borderRadius: '25px', px: 4 }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal for Adding New Period */}
      <Dialog 
        open={openAddDialog} 
        onClose={handleCloseAddDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
          color: 'white',
          textAlign: 'center',
          py: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <AddIcon />
            Add New Period
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <AssignPeriod2 classId={selectedClass} close={handleCloseAddDialog} />
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
          <Button 
            onClick={handleCloseAddDialog}
            variant="outlined"
            sx={{ borderRadius: '25px', px: 4 }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};


export default Schedule;
