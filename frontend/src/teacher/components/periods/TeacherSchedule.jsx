/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import {
  Paper,
  Container,
  Typography,
  Alert,
} from '@mui/material';
import { baseUrl } from '../../../environment';

const localizer = momentLocalizer(moment);

const eventStyleGetter = (event) => {
  const style = {
    backgroundColor: event.bgColor || '#4CAF50',
    color: 'white',
    borderRadius: '4px',
    padding: '5px',
    border: 'none',
  };
  return {
    style,
  };
};

const Schedule = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch teacher's own periods
  useEffect(() => {
    const fetchTeacherPeriods = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');

        if (!token) {
          setError('Please login again');
          setLoading(false);
          return;
        }

        const headers = { Authorization: token };
        const response = await axios.get(`${baseUrl}/period/fetch-own`, { headers });
        const periods = response.data.data || [];

        if (periods.length === 0) {
          setError('No periods assigned yet');
          setLoading(false);
          return;
        }

        // Convert periods to calendar events
        const eventsData = periods.map((period) => {
          const today = moment();
          const startOfWeek = today.clone().startOf('week');
          const periodDate = startOfWeek.clone().add(period.dayOfWeek, 'days');

          const parseTime = (timeStr) => {
            const cleaned = (timeStr || '').replace(/[^0-9:]/g, '');
            const parts = cleaned.split(':');
            return { hour: parseInt(parts[0] || 0), minute: parseInt(parts[1] || 0) };
          };

          const startParsed = parseTime(period.startTime);
          const endParsed = parseTime(period.endTime);

          const start = periodDate.clone().set({ hour: startParsed.hour, minute: startParsed.minute, second: 0 }).toDate();
          const end = periodDate.clone().set({ hour: endParsed.hour, minute: endParsed.minute, second: 0 }).toDate();

          const subjectName = period.subject?.subject_name || 'No Subject';
          const className = period.class?.class_text || 'No Class';

          return {
            id: period._id,
            title: `${subjectName} - ${className}`,
            start,
            end,
            resource: period
          };
        });

        setEvents(eventsData);
        setError(null);
      } catch (error) {
        console.error('Error fetching periods:', error);
        if (error.response?.status === 403 || error.response?.status === 401) {
          setError('Authentication error. Please login again.');
        } else {
          setError(`Error: ${error.response?.data?.message || error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherPeriods();
  }, []);

  if (loading) {
    return (
      <Container>
        <Paper sx={{ margin: '10px', padding: '20px', textAlign: 'center' }}>
          <Typography>Loading schedule...</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>My Weekly Schedule</Typography>

      {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}
      {!error && events.length > 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Showing {events.length} period(s) assigned to you
        </Alert>
      )}

      <Paper sx={{ padding: '20px', minHeight: '600px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          defaultView="week"
          views={['week', 'day']}
          step={30}
          timeslots={1}
          min={new Date(1970, 1, 1, 7, 0, 0)}
          max={new Date(1970, 1, 1, 18, 0, 0)}
          defaultDate={new Date()}
          showMultiDayTimes
          style={{ height: '600px', width: '100%' }}
          formats={{ timeGutterFormat: 'hh:mm A' }}
          eventPropGetter={eventStyleGetter}
        />
      </Paper>
    </Container>
  );
};

export default Schedule;
