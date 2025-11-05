import React, { useState, useEffect, useContext } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { baseUrl } from '../../../environment';
import { AuthContext } from '../../../context/AuthContext';

const PERIODS = [
  { num: 1, label: 'Period 1 (7:00 AM - 8:00 AM)', startTime: '07:00', endTime: '08:00' },
  { num: 2, label: 'Period 2 (8:00 AM - 9:00 AM)', startTime: '08:00', endTime: '09:00' },
  { num: 3, label: 'Period 3 (9:00 AM - 10:00 AM)', startTime: '09:00', endTime: '10:00' },
  { num: 4, label: 'Period 4 (10:00 AM - 11:00 AM)', startTime: '10:00', endTime: '11:00' },
  { num: 5, label: 'Period 5 (11:00 AM - 12:00 PM)', startTime: '11:00', endTime: '12:00' },
  { num: 6, label: 'Lunch Break (12:00 PM - 1:00 PM)', startTime: '12:00', endTime: '13:00' },
  { num: 7, label: 'Period 6 (1:00 PM - 2:00 PM)', startTime: '13:00', endTime: '14:00' },
  { num: 8, label: 'Period 7 (2:00 PM - 3:00 PM)', startTime: '14:00', endTime: '15:00' },
  { num: 9, label: 'Period 8 (3:00 PM - 4:00 PM)', startTime: '15:00', endTime: '16:00' },
  { num: 10, label: 'Period 9 (4:00 PM - 5:00 PM)', startTime: '16:00', endTime: '17:00' },
  { num: 11, label: 'Period 10 (5:00 PM - 6:00 PM)', startTime: '17:00', endTime: '18:00' },
  { num: 12, label: 'Period 11 (6:00 PM - 7:00 PM)', startTime: '18:00', endTime: '19:00' },
];

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const AssignFixedPeriod = ({ classId, dayOfWeek, periodNumber, isEdit, existingPeriod, onClose }) => {
  const { isSuperAdmin, hasPermission } = useContext(AuthContext);
  const canDelete = isSuperAdmin() || hasPermission('can_delete_records');

  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teacher, setTeacher] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [freeTeachers, setFreeTeachers] = useState([]);

  const selectedPeriod = PERIODS.find(p => p.num === periodNumber);

  useEffect(() => {
    // Fetch teachers and subjects
    const fetchData = async () => {
      try {
        const [teacherResponse, subjectResponse] = await Promise.all([
          axios.get(`${baseUrl}/teacher/fetch-with-query`, { params: {} }),
          axios.get(`${baseUrl}/subject/fetch-all`, { params: {} }),
        ]);

        setTeachers(teacherResponse.data.data);
        setSubjects(subjectResponse.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage({ type: 'error', text: 'Error loading teachers and subjects' });
      }
    };

    fetchData();
  }, []);

  // Fetch free teachers for this time slot
  useEffect(() => {
    if (dayOfWeek !== null && periodNumber !== null) {
      axios
        .get(`${baseUrl}/period/free-teachers/${dayOfWeek}/${periodNumber}`)
        .then((resp) => {
          setFreeTeachers(resp.data.freeTeachers);
        })
        .catch((e) => {
          console.error('Error fetching free teachers:', e);
        });
    }
  }, [dayOfWeek, periodNumber]);

  // Pre-fill form if editing
  useEffect(() => {
    if (isEdit && existingPeriod) {
      setTeacher(existingPeriod.teacher._id);
      setSubject(existingPeriod.subject?._id || '');
    }
  }, [isEdit, existingPeriod]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await axios.post(`${baseUrl}/period/create`, {
        teacher,
        subject,
        classId,
        dayOfWeek,
        periodNumber,
        startTime: selectedPeriod.startTime,
        endTime: selectedPeriod.endTime,
      });

      setMessage({ type: 'success', text: 'Fixed period assigned successfully!' });
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error assigning period',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await axios.put(`${baseUrl}/period/update/${existingPeriod._id}`, {
        teacher,
        subject,
      });

      setMessage({ type: 'success', text: 'Period updated successfully!' });
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error updating period',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this period?')) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await axios.delete(`${baseUrl}/period/delete/${existingPeriod._id}`);

      setMessage({ type: 'success', text: 'Period deleted successfully!' });
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error deleting period',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {message.text && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
        <Typography variant="body1" fontWeight="bold">
          Day: {DAYS[dayOfWeek]}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {selectedPeriod?.label}
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Teacher</InputLabel>
          <Select
            label="Teacher"
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
            disabled={loading}
          >
            {teachers.map((t) => {
              const isFree = freeTeachers.some(ft => ft._id === t._id);
              return (
                <MenuItem key={t._id} value={t._id}>
                  {t.name} {isFree && '(Free)'}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" required>
          <InputLabel>Subject</InputLabel>
          <Select
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={loading}
          >
            {subjects.map((s) => (
              <MenuItem key={s._id} value={s._id}>
                {s.subject_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {isEdit ? (
            <>
              {canDelete && (
                <Button
                  onClick={handleDelete}
                  color="error"
                  variant="outlined"
                  disabled={loading}
                >
                  Delete
                </Button>
              )}
              <Button
                onClick={handleUpdate}
                color="primary"
                variant="contained"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Update'}
              </Button>
            </>
          ) : (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Assign Period'}
            </Button>
          )}
        </Box>
      </form>
    </Box>
  );
};

export default AssignFixedPeriod;
