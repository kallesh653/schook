import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, Box, Paper, Card, CardContent, Grid, Chip } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import {Chart, ArcElement} from 'chart.js'
import { styled } from '@mui/material/styles';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonIcon from '@mui/icons-material/Person';

import axios from 'axios';
import { baseUrl } from '../../../environment';

// Styled components for beautiful design
const StyledHeaderCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  marginBottom: theme.spacing(3),
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
}));

const StyledStatsCard = styled(Card)(({ theme }) => ({
  borderRadius: '15px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
  },
}));

const StyledTableContainer = styled(Paper)(({ theme }) => ({
  borderRadius: '15px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  overflow: 'hidden',
  marginTop: theme.spacing(2),
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
  cursor: 'pointer',
}));

const AttendanceChip = styled(Chip)(({ status }) => ({
  fontWeight: 'bold',
  ...(status === 'Present' && {
    backgroundColor: '#4caf50',
    color: 'white',
  }),
  ...(status === 'Absent' && {
    backgroundColor: '#f44336',
    color: 'white',
  }),
}));

const AttendanceStudent = () => {
  Chart.register(ArcElement);

  const [attendanceData, setAttendanceData] = useState([]);
  const [chartData,  setChartData] = useState([0,0]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState(null);
  const [classDetails, setClassDetails] = useState(null);

 
 const dateConvert = (date)=>{
    const dateData  = new Date(date);
    return dateData.getDate()+"-"+ (+dateData.getMonth()+1) + "-" + dateData.getFullYear();
 }


  const chartDataFunc=(data)=>{
     
    data.forEach(data=>{
       
        if(data.status==='Present'){
          setChartData(x=>[x[0]+1,x[1]])
        }else if(data.status==='Absent'){
            setChartData(x=>[x[0],x[1]+1])
        }
    
    })
  }

  
  // Fetch attendance data for the specific student
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/attendance/${studentId}`);
        console.log(response,"attendance data")
        setAttendanceData(response.data);
        chartDataFunc(response.data)
        setLoading(false);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        setLoading(false);
      }
    };
  
    if(studentId){
      fetchAttendanceData();
    }
   
  }, [studentId]);

  // Calculate attendance summary for the chart
//   const attendanceSummary = attendanceData.reduce(
//     (summary, record) => {
//       if (record.status === 'Present') summary.present++;
//       if (record.status === 'Absent') summary.absent++;
//       return summary;
//     },
//     { present: 0, absent: 0 }
//   );

  // Data for the chart
  const data = {
    datasets: [
      {
        data:chartData, // 1 for Present, 0 for Absent
        backgroundColor: [
            '#4caf50',
            '#f44336'
          ],
        borderWidth: 3,
        borderColor: '#ffffff',
        hoverOffset: 15,
        hoverBorderWidth: 5,
      },
    ],
    labels: ['Present', 'Absent'],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      }
    }
  };


  const getStudentDetails = ()=>{
    axios.get(`${baseUrl}/student/fetch-own`).then(resp=>{
        // fetchExaminations(resp.data.data.student_class._id);
        setStudentId(resp.data.data._id)
        setClassDetails({id:resp.data.data.student_class._id, class:resp.data.data.student_class.class_text})
console.log("student",  resp)
    }).catch(e=>{
        console.log("Error in student", e)
    })
}

useEffect(()=>{
getStudentDetails();
 
},[])


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  const totalDays = chartData[0] + chartData[1];
  const attendancePercentage = totalDays > 0 ? ((chartData[0] / totalDays) * 100).toFixed(1) : 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Card */}
      <StyledHeaderCard>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <PersonIcon sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom>
            My Attendance
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Class: {classDetails && classDetails.class}
          </Typography>
        </CardContent>
      </StyledHeaderCard>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StyledStatsCard>
            <CardContent sx={{ textAlign: 'center' }}>
              <EventAvailableIcon sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
              <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                {chartData[0]}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Days Present
              </Typography>
            </CardContent>
          </StyledStatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledStatsCard>
            <CardContent sx={{ textAlign: 'center' }}>
              <EventBusyIcon sx={{ fontSize: 40, color: '#f44336', mb: 1 }} />
              <Typography variant="h4" sx={{ color: '#f44336', fontWeight: 'bold' }}>
                {chartData[1]}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Days Absent
              </Typography>
            </CardContent>
          </StyledStatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledStatsCard>
            <CardContent sx={{ textAlign: 'center' }}>
              <CalendarTodayIcon sx={{ fontSize: 40, color: '#2196f3', mb: 1 }} />
              <Typography variant="h4" sx={{ color: '#2196f3', fontWeight: 'bold' }}>
                {totalDays}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Days
              </Typography>
            </CardContent>
          </StyledStatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledStatsCard>
            <CardContent sx={{ textAlign: 'center' }}>
              <AssessmentIcon sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
              <Typography variant="h4" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                {attendancePercentage}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Attendance Rate
              </Typography>
            </CardContent>
          </StyledStatsCard>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Attendance Chart */}
        <Grid item xs={12} md={5}>
          <StyledStatsCard>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
                <AssessmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Attendance Summary
              </Typography>
              <Box sx={{ height: 300, position: 'relative' }}>
                <Pie data={data} options={chartOptions} />
              </Box>
            </CardContent>
          </StyledStatsCard>
        </Grid>

        {/* Attendance Records */}
        <Grid item xs={12} md={7}>
          <StyledTableContainer>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                <CalendarTodayIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Attendance Records
              </Typography>
            </Box>
            <Table>
              <StyledTableHead>
                <TableRow>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarTodayIcon />
                      Date
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <AssessmentIcon />
                      Status
                    </Box>
                  </TableCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {attendanceData && attendanceData.length > 0 ? (
                  attendanceData.map((record) => (
                    <StyledTableRow key={record._id}>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {dateConvert(record.date)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <AttendanceChip 
                          label={record.status}
                          status={record.status}
                          icon={record.status === 'Present' ? <EventAvailableIcon /> : <EventBusyIcon />}
                          size="medium"
                        />
                      </TableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
                      <Typography variant="h6" color="text.secondary">
                        No attendance records found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AttendanceStudent;
