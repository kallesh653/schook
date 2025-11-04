import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Paper, CardMedia, IconButton, TextField, Button, Card, CardContent, Chip } from "@mui/material";
import Grid2 from "@mui/material/Grid2"; // Importing Grid2
import axios from "axios";
import { Bar, Doughnut } from "react-chartjs-2";
import PreviewIcon from '@mui/icons-material/Preview';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TodayIcon from '@mui/icons-material/Today';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

// ChartJS setup
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { baseUrl } from "../../../environment";
import styled from "@emotion/styled";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from '@mui/icons-material/Visibility';

import CustomizedSnackbars from "../../../basic utility components/CustomizedSnackbars";
import { useDashboard } from '../../../context/DashboardContext';
import { useNavigate } from "react-router-dom";
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import GradingIcon from '@mui/icons-material/Grading';
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import ExplicitIcon from '@mui/icons-material/Explicit';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import LogoutIcon from '@mui/icons-material/Logout';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import WebIcon from '@mui/icons-material/Web';
import PaymentIcon from '@mui/icons-material/Payment';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SchoolIcon from '@mui/icons-material/School';
import SmsIcon from '@mui/icons-material/Sms';
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ArcElement);
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  minWidth: "400px",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

const SchoolDashboard = () => {
  const navigate = useNavigate();
  const { refreshTrigger } = useDashboard();
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [schoolDetails, setSchoolDetails] = useState(null);
  const [schoolName, setSchoolName] = useState('');
  const [schooImage, setSchoolImage] = useState('');
  const [schoolEdit, setSchoolEdit] = useState(false);
  const [preview, setPreview] = useState(false);
  
  // New state for enhanced dashboard - Initialize with zeros to show real data
  const [feesStats, setFeesStats] = useState({
    totalFees: 0,
    collectedFees: 0,
    todayCollected: 0,
    balanceFees: 0
  });
  const [attendanceStats, setAttendanceStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
    attendancePercentage: 0
  });
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");
  const resetMessage = () => setMessage("");

  // Function to calculate proper fee statistics from students
  const calculateFeesFromStudents = (students) => {
    if (!students || students.length === 0) {
      return {
        totalFees: 0,
        collectedFees: 0,
        todayCollected: 0,
        balanceFees: 0
      };
    }

    let totalFees = 0;
    let collectedFees = 0;
    let todayCollected = 0;

    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    students.forEach(student => {
      if (student.fees) {
        // Use fees structure from student.model.js
        totalFees += (student.fees.total_fees || 0);
        collectedFees += (student.fees.paid_fees || 0);

        // Calculate today's collection from payment history if it exists
        if (student.fees.fee_payment_history && student.fees.fee_payment_history.length > 0) {
          student.fees.fee_payment_history.forEach(payment => {
            const paymentDate = new Date(payment.payment_date);
            if (paymentDate >= todayStart && paymentDate < new Date(todayStart.getTime() + 24*60*60*1000)) {
              todayCollected += payment.amount || 0;
            }
          });
        }
      }
    });

    const balanceFees = totalFees - collectedFees;

    return {
      totalFees,
      collectedFees,
      todayCollected,
      balanceFees: Math.max(0, balanceFees) // Ensure balance is not negative
    };
  };

  // Dummy Data
  const dummyData = {
    totalStudents: 120,
    totalTeachers: 15,
    classes: [
      { _id: "1", class_text: "Class 1" },
      { _id: "2", class_text: "Class 2" },
      { _id: "3", class_text: "Class 3" },
      { _id: "4", class_text: "Class 4" },
    ],
    subjects: [
      { _id: "1", subject_name: "Mathematics" },
      { _id: "2", subject_name: "Science" },
      { _id: "3", subject_name: "History" },
      { _id: "4", subject_name: "Geography" },
    ],
  };

  // Fetch data from the backend
  const fetchData = async () => {
      setLoading(true);
      try {
        // Get authorization token
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // Fetch all data in parallel - now using Students collection
        const [studentsRes, teacherRes, classesRes, subjectsRes, schoolData, attendanceRes] = await Promise.all([
          axios.get(`${baseUrl}/student/fetch-all?status=Active&limit=1000`, {headers}),
          axios.get(`${baseUrl}/teacher/fetch-with-query`, {params:{}, headers}),
          axios.get(`${baseUrl}/class/fetch-all`, {headers}),
          axios.get(`${baseUrl}/subject/fetch-all`, {headers}),
          axios.get(`${baseUrl}/school/fetch-single`, {headers}),
          axios.get(`${baseUrl}/attendance`, {headers}).catch(() => ({data: {data: []}}))
        ]);

        // Set school details
        setSchoolDetails(schoolData.data.data);
        setSchoolName(schoolData.data.data.school_name);
        setSchoolImage(schoolData.data.data.school_image);

        // Get students data
        const students = studentsRes.data.data || [];
        console.log('🔍 Students from Students collection:', students.length);

        // Set basic counts from Students collection
        setTotalStudents(students.length);
        setTotalTeachers(teacherRes.data.data.length);
        setClasses(classesRes.data.data || dummyData.classes);
        setSubjects(subjectsRes.data.data || dummyData.subjects);

        // Calculate fees from Students collection
        const calculatedStats = calculateFeesFromStudents(students);
        console.log('💰 Calculated Fee Stats from Students:', calculatedStats);

        setFeesStats(calculatedStats);

        // Calculate real attendance from attendance records
        const attendanceRecords = attendanceRes.data.data || [];
        const today = new Date().toISOString().split('T')[0];

        // Filter today's attendance
        const todayAttendance = attendanceRecords.filter(record => {
          const recordDate = new Date(record.date).toISOString().split('T')[0];
          return recordDate === today;
        });

        // Count present and absent
        let presentToday = 0;
        let absentToday = 0;

        if (todayAttendance.length > 0) {
          todayAttendance.forEach(record => {
            if (record.present === true || record.status === 'Present') {
              presentToday++;
            } else if (record.present === false || record.status === 'Absent') {
              absentToday++;
            }
          });
        }

        const attendancePercentage = students.length > 0 && presentToday > 0
          ? Math.round((presentToday / students.length) * 100)
          : 0;

        setAttendanceStats({
          totalStudents: students.length,
          presentToday: presentToday,
          absentToday: absentToday,
          attendancePercentage: attendancePercentage
        });

        console.log('📊 Attendance Stats:', {
          totalStudents: students.length,
          presentToday,
          absentToday,
          attendancePercentage
        });

      } catch (error) {
        console.log('Dashboard fetch error:', error);
        // Fallback to dummy data
        setTotalStudents(dummyData.totalStudents);
        setTotalTeachers(dummyData.totalTeachers);
        setClasses(dummyData.classes);
        setSubjects(dummyData.subjects);

        // Set fallback fee stats - zeros to indicate no data available
        setFeesStats({
          totalFees: 0,
          collectedFees: 0,
          todayCollected: 0,
          balanceFees: 0
        });

        setAttendanceStats({
          totalStudents: 0,
          presentToday: 0,
          absentToday: 0,
          attendancePercentage: 0
        });
      } finally {
        setLoading(false);
      }
    };

  // useEffect to fetch data on component mount and when message changes
  useEffect(() => {
    fetchData();
  }, [message]);

  // useEffect to refresh data when dashboard refresh is triggered
  useEffect(() => {
    if (refreshTrigger > 0) {
      console.log('🔔 Dashboard refreshing due to external trigger...');
      fetchData();
    }
  }, [refreshTrigger]);

  // Auto-refresh fees data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing dashboard fees data...');
      fetchData();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Refresh data when window becomes visible (user returns to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('📱 Window became visible, refreshing dashboard data...');
        fetchData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Data for Classes and Subjects Chart
  const classesData = {
    labels: classes.map((classObj) => classObj.class_text),
    datasets: [
      {
        label: "Classes",
        data: classes.map(() => 1),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const subjectsData = {
    labels: subjects.map((subject) => subject.subject_name),
    datasets: [
      {
        label: "Subjects",
        data: subjects.map(() => 1),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const handleSchoolEdit = ()=>{
    setSchoolEdit(true)
    setImageUrl(null)
  }


  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null); // Independent state for image preview

  // Handle image file selection
  const addImage = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImageUrl(URL.createObjectURL(selectedFile));
    }
  };


  const fileInputRef = useRef(null);
  const handleClearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input
    }
    setFile(null); // Reset the file state
    // setImageUrl(null); // Clear the image preview
  };

  const navArr = [
    { link: "/school", component: "Dashboard", icon: DashboardIcon },
    // Front Page and Public Home removed from Quick Access as requested
    // { link: "/school/front-page", component: "Front Page", icon: WebIcon },
    // { link: "/school/public-home", component: "Public Home", icon: WebIcon },
    { link: "/school/courses", component: "Courses", icon: SchoolIcon },
    { link: "/school/class", component: "Classes", icon:FormatListNumberedIcon },
    { link: "/school/subject", component: "Subjects", icon: MenuBookIcon },
    { link: "/school/students", component: "Students", icon: GroupIcon },
    { link: "/school/teachers", component: "Teachers", icon: GroupIcon },
    { link: "/school/student-records", component: "Student Records", icon: AssignmentIndIcon },
    { link: "/school/fees", component: "Fees Mgt", icon: PaymentIcon },
    { link: "/school/periods", component: "Schedule", icon: CalendarMonthIcon },
    { link: "/school/attendance", component: "Attendance", icon: RecentActorsIcon },
    { link: "/school/attendance-report", component: "Attd. Reports", icon: AssessmentIcon },
    { link: "/school/examinations", component: "Examinations", icon: ExplicitIcon },
    { link: "/school/marksheets", component: "Marksheets", icon: GradingIcon },
    { link: "/school/notice", component: "Notices", icon:CircleNotificationsIcon },
    { link: "/school/sms", component: "SMS Mgt", icon:SmsIcon },
    { link: "/logout", component: "Log Out", icon:LogoutIcon }
  ];

  const QuickAccessCard = ({ title, icon, link }) => (
    <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }} >
      <Card 
        sx={{ 
          minHeight: 120, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2)',
          borderRadius: '20px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 40px rgba(102, 126, 234, 0.3)',
          }
        }}
        onClick={() => navigate(link)}
      >
        <CardContent>
          <IconButton sx={{ fontSize: 40, color: '#667eea' }}>
            {React.createElement(icon, { sx: { fontSize: 40 } })}
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>{title}</Typography>
        </CardContent>
      </Card>
    </Grid2>
  );

  const handleSubmit = (e)=>{
    e.preventDefault();
    const fd = new FormData();
    fd.append("school_name", schoolName)
    if (file) {
      fd.append("image", file, file.name);
    }

    axios
      .patch(`${baseUrl}/school/update`, fd)
      .then((resp) => {
        setMessage(resp.data.message);
        setType("success");
        handleClearFile();
        setSchoolEdit(false)
        console.log("Response", resp)
      })
      .catch((e) => {
        setMessage(e.response.data.message);
        setType("error");
      });
  
}
  return (
    <Box sx={{ p: 3 }}>
       {message && (
        <CustomizedSnackbars
          reset={resetMessage}
          type={type}
          message={message}
        />
      )}
      {schoolEdit && 
      <Paper sx={{maxWidth:'780px', margin:"auto",padding:"10px", marginTop:"120px"}} >
       <Box
       component="form"
       noValidate
       autoComplete="off" >
       <Box
         sx={{
          display:'flex',
          flexDirection:'column'
         }}
       >
         <Typography sx={{ marginRight: "50px" }} variant="h4"> School Pic </Typography>

         <TextField
           name="file"
           type="file"
           onChange={addImage}
           inputRef={fileInputRef}
         />
         {imageUrl &&  
             <CardMedia
               component="img"
               sx={{marginTop:'10px'}}
               image={imageUrl}
               height="440px"
             /> 
         }
       </Box>
        <TextField
         fullWidth
         sx={{ marginTop: "10px" }}
         value={schoolName}
         id="filled-basic"
         label="School Name "
         variant="outlined"
         onChange={e=>{setSchoolName(e.target.value)}}
       />
       <Box>
       <Button
           onClick={handleSubmit} 
           variant="outlined" 
           sx={{ marginTop: "10px",marginRight:'5px' }} >
          Submit
         </Button>

         <Button
           onClick={()=>{setSchoolEdit(false)}}
           variant="outlined"
           sx={{ marginTop: "10px" }}
         >
          Cancel
         </Button>
       </Box>
       

       </Box>

      </Paper>

      }
    
      {schoolDetails && (
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Dashboard [{schoolDetails.school_name}]
          </Typography>
          <IconButton onClick={handleSchoolEdit} color="primary" sx={{ bgcolor: 'primary.light' }}>
            <EditIcon />
          </IconButton>
        </Box>
      )}

      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#667eea', textAlign: 'center', mb: 3 }}>
          Quick Access
        </Typography>
        <Grid2 container spacing={3}>
          {navArr.map((item, index) => (
            <QuickAccessCard key={index} title={item.component} icon={item.icon} link={item.link} />
          ))}
        </Grid2>
      </Box>






      <Grid2 container spacing={3}>
        {/* Student Statistics Row */}
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">{totalStudents}</Typography>
                  <Typography variant="body2">Total Students</Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">{totalTeachers}</Typography>
                  <Typography variant="body2">Total Teachers</Typography>
                </Box>
                <PersonIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">{attendanceStats.presentToday}</Typography>
                  <Typography variant="body2">Present Today</Typography>
                  <Chip 
                    label={`${attendanceStats.attendancePercentage}%`} 
                    size="small" 
                    sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                </Box>
                <CheckCircleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">{attendanceStats.absentToday}</Typography>
                  <Typography variant="body2">Absent Today</Typography>
                </Box>
                <CancelIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        {/* Fees Management Row */}
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', color: '#333' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {feesStats.totalFees > 0 ? `₹${feesStats.totalFees.toLocaleString()}` : '₹0'}
                  </Typography>
                  <Typography variant="body2">
                    Total Fees {feesStats.totalFees === 0 && '(No Data)'}
                  </Typography>
                </Box>
                <AttachMoneyIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ background: 'linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)', color: '#333' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {feesStats.collectedFees > 0 ? `₹${feesStats.collectedFees.toLocaleString()}` : '₹0'}
                  </Typography>
                  <Typography variant="body2">
                    Collected Fees {feesStats.collectedFees === 0 && '(No Data)'}
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', color: '#333' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {feesStats.todayCollected > 0 ? `₹${feesStats.todayCollected.toLocaleString()}` : '₹0'}
                  </Typography>
                  <Typography variant="body2">
                    Today Collected {feesStats.todayCollected === 0 && '(No Data)'}
                  </Typography>
                </Box>
                <TodayIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', color: '#333' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {feesStats.balanceFees > 0 ? `₹${feesStats.balanceFees.toLocaleString()}` : '₹0'}
                  </Typography>
                  <Typography variant="body2">
                    Balance Fees {feesStats.balanceFees === 0 && '(No Data)'}
                  </Typography>
                </Box>
                <AccountBalanceIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        {/* Charts Row */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '400px' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Attendance Overview</Typography>
              <Box sx={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Doughnut 
                  data={{
                    labels: ['Present', 'Absent'],
                    datasets: [{
                      data: [attendanceStats.presentToday, attendanceStats.absentToday],
                      backgroundColor: ['#4CAF50', '#f44336'],
                      borderWidth: 0
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '400px' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Fees Collection Status</Typography>
              <Box sx={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Doughnut 
                  data={{
                    labels: ['Collected', 'Balance'],
                    datasets: [{
                      data: [feesStats.collectedFees, feesStats.balanceFees],
                      backgroundColor: ['#2196F3', '#FF9800'],
                      borderWidth: 0
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        {/* Classes and Subjects Charts */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Classes Overview</Typography>
              <Bar data={classesData} options={{ responsive: true }} />
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Subjects Overview</Typography>
              <Bar data={subjectsData} options={{ responsive: true }} />
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default SchoolDashboard;
