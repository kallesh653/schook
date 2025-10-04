/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Container, Button, Select, MenuItem, InputLabel, FormControl, TextField, Typography, FormControlLabel, Switch, Box } from '@mui/material';
import axios from 'axios';
import { baseUrl } from '../../../environment';

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

const AssignPeriod2 = ({classId,isEdit, periodId, close}) => {
  const [teachers, setTeachers] = useState([]);
//   const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teacher, setTeacher] = useState('');
  const [subject, setSubject] = useState('');
//   const [classId, setClassId] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [date, setDate] = useState(new Date());
  const [useCustomTime, setUseCustomTime] = useState(false);
  const [customStartTime, setCustomStartTime] = useState('07:00');
  const [customEndTime, setCustomEndTime] = useState('08:00');
  
  const [message, setMessage] = useState("");
  const [type,  setType] = useState("success")

  useEffect(() => {
    // Fetch teachers, classes, and subjects
    const fetchData = async () => {
      const teacherResponse = await axios.get(`${baseUrl}/teacher/fetch-with-query`, { params: {} });
      const classResponse = await axios.get(`${baseUrl}/class/fetch-all`);
      const subjectResponse = await axios.get(`${baseUrl}/subject/fetch-all`, { params: {} });
      setSubjects(subjectResponse.data.data);
      setTeachers(teacherResponse.data.data);
    //   setClasses(classResponse.data.data);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!useCustomTime && !selectedPeriod) {
      alert('Please select a period or enable custom time');
      return;
    }
    
    if (useCustomTime && (!customStartTime || !customEndTime)) {
      alert('Please set both start and end times');
      return;
    }

    try {
      await axios.post(`${baseUrl}/period/create`, {
        teacher,
        subject,
        classId,
        startTime: useCustomTime ? date+" "+customStartTime : date+" "+selectedPeriod.startTime,
        endTime: useCustomTime ? date+" "+customEndTime : date+" "+ selectedPeriod.endTime,
      });
      alert('Period assigned successfully');
      setMessage("Perid assigned Successfully.");
      close()
    } catch (error) {
      console.error('Error assigning period:', error);
      setMessage("Error in Assigning.")
    }
  };

  const handleUpdateEvent = async () => {
    try {
      await axios.put(`${baseUrl}/period/update/${periodId}`, {
        teacher,
        subject,
        classId,
        startTime: useCustomTime ? date+" "+customStartTime : date+" "+selectedPeriod.startTime,
        endTime: useCustomTime ? date+" "+customEndTime : date+" "+ selectedPeriod.endTime,
      });
      alert('Period updated successfully');
      setMessage('Period updated successfully');
      close()
    } catch (error) {
      console.error('Error updating period:', error);
      setMessage("Period update Error.")
    }
  };

  const handleDeleteEvent = async () => {
    try {
      await axios.delete(`${baseUrl}/period/delete/${periodId}`);
      alert('Period deleted successfully');
      setMessage("Period deleted successfully.")
      close()
    } catch (error) {
      console.error('Error deleting period:', error);
      setMessage("Error in period delete.")
    }
  };

  // Fetch the period details if editing
  const fetchPeriodsWithId = async (periodId) => {
    try {
      const response = await axios.get(`${baseUrl}/period/${periodId}`);
      const periodData = response.data.period;
      const startTime  = new Date(periodData.startTime).getHours();
    //   console.log(new Date(periodData.startTime),"periodic data")
      setTeacher(periodData.teacher._id);
      setSubject(periodData.subject._id);
      const matchedPeriod = periods.find(p => p.startTime === `${startTime}:00`);
      if (matchedPeriod) {
        setSelectedPeriod(matchedPeriod);
        setUseCustomTime(false);
      } else {
        // If no predefined period matches, use custom time
        setUseCustomTime(true);
        const startTimeStr = new Date(periodData.startTime).toTimeString().substring(0, 5);
        const endTimeStr = new Date(periodData.endTime).toTimeString().substring(0, 5);
        setCustomStartTime(startTimeStr);
        setCustomEndTime(endTimeStr);
      }
      setDate(periodData.startTime.substring(0, 10)); // date part of startTime
    } catch (error) {
      console.error('Error fetching period details:', error);
    }
  };

  useEffect(() => {
    if (isEdit && periodId) {
      fetchPeriodsWithId(periodId);
    }

  }, [isEdit, periodId,message]);



  return (
    <Container>
      <h2>Assign Period to Teacher</h2>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Teacher</InputLabel>
          <Select label={"Teacher"} value={teacher} onChange={(e) => setTeacher(e.target.value)} required>
            {teachers.map((teacher) => (
              <MenuItem key={teacher._id} value={teacher._id}>{teacher.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Subject</InputLabel>
          <Select label={"Subject"} value={subject} onChange={(e) => setSubject(e.target.value)} required>
            {subjects.map((sbj) => (
              <MenuItem key={sbj._id} value={sbj._id}>{sbj.subject_name}</MenuItem>
            ))}
          </Select>
        </FormControl>


        {/* Toggle between predefined periods and custom time */}
        <FormControlLabel
          control={
            <Switch
              checked={useCustomTime}
              onChange={(e) => setUseCustomTime(e.target.checked)}
              disabled={isEdit}
            />
          }
          label="Use Custom Time"
        />

        {!useCustomTime ? (
          /* Select predefined periods */
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Period</InputLabel>
            <Select 
              value={selectedPeriod?selectedPeriod.id:""}
              label="Select Period"
              onChange={(e) => setSelectedPeriod(periods.find(p => p.id === e.target.value))}
              disabled={isEdit}
              required={!useCustomTime}
            >
              {periods.map((period) => (
                <MenuItem key={period.id} value={period.id}>
                  {period.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          /* Custom time inputs */
          <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
            <TextField
              label="Start Time"
              type="time"
              value={customStartTime}
              onChange={(e) => setCustomStartTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }} // 5 min intervals
              required={useCustomTime}
              fullWidth
            />
            <TextField
              label="End Time"
              type="time"
              value={customEndTime}
              onChange={(e) => setCustomEndTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }} // 5 min intervals
              required={useCustomTime}
              fullWidth
            />
          </Box>
        )}
        
      

        <TextField
          label="Date"
          type="date"
          fullWidth
          // InputLabelProps={{ shrink: true }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          disabled={isEdit?true:false}
          required
        />

       
        {isEdit?<>
            <Button onClick={handleDeleteEvent} color="secondary">
            Delete
          </Button>
          <Button onClick={handleUpdateEvent} color="primary">
            Update
          </Button>
          </>:
           <Button type="submit" variant="contained" color="primary">
           Assign Period
         </Button>
         }
      </form>
    </Container>
  );
};

export default AssignPeriod2;
