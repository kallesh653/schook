/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import {
  FormControl,
  MenuItem,
  Paper,
  Select,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme,
  useMediaQuery,
  IconButton,
  Fab
} from "@mui/material";
import { styled } from '@mui/material/styles';
import { baseUrl } from "../../../environment";

// Icons
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import ListIcon from '@mui/icons-material/List';
import EventIcon from '@mui/icons-material/Event';

const localizer = momentLocalizer(moment);

// Styled Components for Mobile App Experience
const StyledHeaderCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  marginBottom: theme.spacing(3),
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
  [theme.breakpoints.down('md')]: {
    borderRadius: '16px',
    margin: theme.spacing(1, 0, 2, 0),
  },
}));

const MobileScheduleCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease-in-out',
  marginBottom: theme.spacing(2),
  background: 'linear-gradient(45deg, #ffffff 0%, #f8f9ff 100%)',
  border: '1px solid rgba(102, 126, 234, 0.1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 30px rgba(102, 126, 234, 0.15)',
  },
}));

const TimeSlotCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
  color: 'white',
  padding: theme.spacing(1),
  margin: theme.spacing(0.5, 0),
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const SubjectChip = styled(Chip)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  color: 'white',
  fontWeight: 600,
  padding: theme.spacing(0.5, 1),
  '& .MuiChip-label': {
    fontSize: '0.85rem',
  }
}));

const ViewToggleFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
  color: 'white',
  zIndex: 1000,
  '&:hover': {
    background: 'linear-gradient(45deg, #FF6B6B 50%, #4ECDC4 100%)',
    transform: 'scale(1.1)',
  },
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}));

const ScheduleStudent = () => {
  const [events, setEvents] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [periods, setPeriods] = useState([]);
  const [viewMode, setViewMode] = useState('mobile'); // 'mobile' or 'calendar'
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const getStudentDetails = () => {
    axios.get(`${baseUrl}/student/fetch-own`).then(resp=>{
        // setStudent(resp.data.data)
        setSelectedClass({
          id: resp.data.data.student_class._id,
          class: resp.data.data.student_class.class_text,
        });
        console.log("student", resp);
      })
      .catch((e) => {
        console.log("Error in student", e);
      });
  };

  useEffect(() => {
    getStudentDetails();
  }, []);

  // Fetch periods for the selected class
  useEffect(() => {
    const fetchClassPeriods = async () => {
      if (!selectedClass) return;
      try {
        const response = await axios.get(
          `${baseUrl}/period/class/${selectedClass.id}`
        );
        const periodsData = response.data.periods;
        setPeriods(periodsData);

        const eventsData = periodsData.map((period) => ({
          id: period._id,
          title: `${period.subject.subject_name} By ${period.teacher.name}`,
          start: new Date(period.startTime),
          end: new Date(period.endTime),
        }));
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching periods:", error);
      }
    };
    if (selectedClass) {
      fetchClassPeriods();
    }
  }, [selectedClass]);

  // Group periods by day
  const groupPeriodsByDay = () => {
    const grouped = {};
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    days.forEach(day => {
      grouped[day] = [];
    });

    periods.forEach(period => {
      const dayName = moment(period.startTime).format('dddd');
      if (grouped[dayName]) {
        grouped[dayName].push(period);
      }
    });

    // Sort periods by start time for each day
    Object.keys(grouped).forEach(day => {
      grouped[day].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    });

    return grouped;
  };

  const formatTime = (dateString) => {
    return moment(dateString).format('h:mm A');
  };

  const getTodaySchedule = () => {
    const today = moment().format('dddd');
    const groupedPeriods = groupPeriodsByDay();
    return groupedPeriods[today] || [];
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'mobile' ? 'calendar' : 'mobile');
  };

  const renderMobileView = () => {
    const groupedPeriods = groupPeriodsByDay();
    const todaySchedule = getTodaySchedule();
    const today = moment().format('dddd');

    return (
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, md: 3 } }}>
        {/* Header Card */}
        <StyledHeaderCard>
          <CardContent sx={{ textAlign: 'center', py: { xs: 3, md: 4 } }}>
            <CalendarTodayIcon sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              My Schedule
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Class: {selectedClass && selectedClass.class}
            </Typography>
          </CardContent>
        </StyledHeaderCard>

        {/* Today's Schedule Highlight */}
        {todaySchedule.length > 0 && (
          <MobileScheduleCard sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EventIcon sx={{ color: '#4caf50', mr: 1, fontSize: '1.5rem' }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Today's Classes ({today})
                </Typography>
              </Box>
              <Grid container spacing={2}>
                {todaySchedule.map((period, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <TimeSlotCard>
                      <Box sx={{ p: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                          {period.subject.subject_name}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                          {formatTime(period.startTime)} - {formatTime(period.endTime)}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          🧑‍🏫 {period.teacher.name}
                        </Typography>
                      </Box>
                    </TimeSlotCard>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </MobileScheduleCard>
        )}

        {/* Weekly Schedule */}
        <Grid container spacing={3}>
          {Object.entries(groupedPeriods).map(([day, dayPeriods]) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={day}>
              <MobileScheduleCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: day === today ? '#4caf50' : '#2196F3',
                        width: 32,
                        height: 32,
                        mr: 1.5,
                        fontSize: '0.8rem'
                      }}
                    >
                      {day.substring(0, 3)}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                      {day}
                    </Typography>
                    {day === today && (
                      <Chip
                        label="Today"
                        size="small"
                        sx={{ ml: 'auto', bgcolor: '#4caf50', color: 'white' }}
                      />
                    )}
                  </Box>

                  {dayPeriods.length > 0 ? (
                    <List dense>
                      {dayPeriods.map((period, index) => (
                        <React.Fragment key={index}>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              <AccessTimeIcon sx={{ color: '#666', fontSize: '1rem' }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Box>
                                  <SubjectChip
                                    label={period.subject.subject_name}
                                    size="small"
                                  />
                                  <Typography variant="body2" sx={{ mt: 0.5, color: '#666' }}>
                                    {formatTime(period.startTime)} - {formatTime(period.endTime)}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: '#888' }}>
                                    🧑‍🏫 {period.teacher.name}
                                  </Typography>
                                </Box>
                              }
                            />
                          </ListItem>
                          {index < dayPeriods.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                      <Typography variant="body2" color="textSecondary">
                        No classes scheduled
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </MobileScheduleCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  };

  const renderCalendarView = () => (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <StyledHeaderCard sx={{ mb: 3 }}>
        <CardContent sx={{ textAlign: 'center', py: 3 }}>
          <CalendarTodayIcon sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Weekly Schedule Calendar
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Class: {selectedClass && selectedClass.class}
          </Typography>
        </CardContent>
      </StyledHeaderCard>

      <Paper sx={{ p: 2, borderRadius: '16px', overflow: 'hidden' }}>
        <Calendar
          localizer={localizer}
          events={events}
          defaultView="week"
          views={["week"]}
          step={30}
          timeslots={1}
          min={new Date(1970, 1, 1, 10, 0, 0)}
          startAccessor="start"
          endAccessor="end"
          max={new Date(1970, 1, 1, 17, 0, 0)}
          defaultDate={new Date()}
          showMultiDayTimes
          style={{ height: 600, width: "100%" }}
          formats={{ timeGutterFormat: "hh:mm A" }}
        />
      </Paper>
    </Container>
  );

  return (
    <>
      {isMobile || viewMode === 'mobile' ? renderMobileView() : renderCalendarView()}

      {/* View Toggle FAB */}
      <ViewToggleFab
        onClick={toggleViewMode}
        size="medium"
      >
        {viewMode === 'mobile' ? <ViewWeekIcon /> : <ListIcon />}
      </ViewToggleFab>
    </>
  );
};

export default ScheduleStudent;