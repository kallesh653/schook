/* eslint-disable react-hooks/exhaustive-deps */
import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Button,
    CardMedia,
    Paper,
    TextField,
    Typography,
    TableCell,
    TableRow,
    TableBody,
    TableHead,
    Table,
    TableContainer,
    Container,
    Card,
    CardContent,
    Grid,
    Chip,
    Avatar,
  } from "@mui/material";
  import { styled } from '@mui/material/styles';
  import PeopleIcon from '@mui/icons-material/People';
  import ClassIcon from '@mui/icons-material/Class';
  import SearchIcon from '@mui/icons-material/Search';
  import VisibilityIcon from '@mui/icons-material/Visibility';
  import PersonIcon from '@mui/icons-material/Person';
  import PhoneIcon from '@mui/icons-material/Phone';
  import dayjs from "dayjs";
  import { useFormik } from "formik";
  import { useEffect, useState } from "react";
  import axios from "axios";
  import { baseUrl } from "../../../environment";
  import CustomizedSnackbars from "../../../basic utility components/CustomizedSnackbars";
import { Link } from "react-router-dom";
  
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
    cursor: 'pointer',
  }));

  const StyledViewButton = styled(Button)(({ theme }) => ({
    borderRadius: '20px',
    textTransform: 'none',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
    '&:hover': {
      background: 'linear-gradient(45deg, #388e3c 30%, #4caf50 90%)',
      transform: 'scale(1.05)',
    },
    transition: 'all 0.2s ease-in-out',
  }));

  export default function Attendance() {
    const [studentClass, setStudentClass] = useState([]);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] =useState([])
  
    
    const [params, setParams] = useState({});
    const handleClass = (e) => {
      let newParam;
      if (e.target.value !== "") {
        newParam = { ...params, student_class: e.target.value };
      } else {
        newParam = { ...params };
        delete newParam["student_class"];
      }
  
      setParams(newParam);
    };
  
    const handleSearch = (e) => {
      let newParam;
      if (e.target.value !== "") {
        newParam = { ...params, search: e.target.value };
      } else {
        newParam = { ...params };
        delete newParam["search"];
      }
  
      setParams(newParam);
    };

 
 
    //   MESSAGE
    const [message, setMessage] = useState("");
    const [type, setType] = useState("succeess");
  
    const resetMessage = () => {
      setMessage("");
    };
  
    
    const fetchAttendanceData = async (studentId) => {
 
        Promise.resolve(await axios.get(`${baseUrl}/attendance/${studentId}`)).then(res=>{
            console.log(res)
            return "Hello"
        })

        // try {
        //   const response = 
        //   console.log(response,"attendance data")
        //   setAttendanceData(response.data);
        //   chartDataFunc(response.data)
        //   setLoading(false);
        // return 2
        // } catch (error) {
        //   console.error("Error fetching attendance data:", error);
        // //   setLoading(false);
        // }
    }

    useEffect(() => {
        const fetchDetailedData = async () => {
          try {
            const detailedDataPromises = students.map(student => 
              axios.get(`${baseUrl}/attendance/${student._id}`) // Fetch details for each item by id
            );
    
            const detailedDataResponses = await Promise.all(detailedDataPromises);
           
            const detailedData = detailedDataResponses.map(response => response.data); // Extract the data from responses
            console.log(detailedData, "Detailed Data")
            setAttendance(detailedData); // Set the detailed data
          } catch (error) {
            console.error('Error fetching detailed data:', error);
          }
        };
    
        if (students.length > 0) {
          fetchDetailedData(); // Trigger the second API call only when the initial list is ready
        }
      }, [students]);

    const fetchStudentClass = () => {
      axios
      .get(`${baseUrl}/class/fetch-all`)
      .then((resp) => {
        setStudentClass(resp.data.data)
      console.log("Class",resp.data)
      })
      .catch((e) => {
        console.log("Error in fetching student Class", e);
      });
    };
  
    const fetchStudents = () => {
      axios
        .get(`${baseUrl}/student/fetch-with-query`, { params: params })
        .then((resp) => {
          console.log("Fetching data in  Students.", resp);
          setStudents(resp.data.data);
        })
        .catch((e) => {
          console.log("Error in fetching casting calls admin data", e);
        });
    };
    
    useEffect(() => {
      fetchStudents();
      fetchStudentClass();
    }, [message, params]);
    
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {message && (
          <CustomizedSnackbars
            reset={resetMessage}
            type={type}
            message={message}
          />
        )}
        
        {/* Header Card */}
        <StyledHeaderCard>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <PeopleIcon sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h3" component="h1" gutterBottom>
              Student Attendance
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Track and manage student attendance records
            </Typography>
          </CardContent>
        </StyledHeaderCard>

        {/* Control Card */}
        <StyledControlCard>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <ClassIcon sx={{ color: '#1976d2', fontSize: 30 }} />
                  <FormControl fullWidth>
                    <InputLabel>Select Class</InputLabel>
                    <Select
                      label="Select Class"
                      onChange={handleClass}
                      defaultValue=""
                    >
                      <MenuItem value="">All Classes</MenuItem>
                      {studentClass &&
                        studentClass.map((value, i) => (
                          <MenuItem key={i} value={value._id}>
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
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <SearchIcon sx={{ color: '#1976d2', fontSize: 30 }} />
                  <TextField
                    fullWidth
                    label="Search Student Name"
                    onChange={handleSearch}
                    variant="outlined"
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                  <PeopleIcon sx={{ color: '#1976d2' }} />
                  <Typography variant="body1" color="text.secondary">
                    {students.length} students found
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </StyledControlCard>

        {/* Students Table */}
        <StyledTableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="students table">
            <StyledTableHead>
              <TableRow>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon />
                    Student Name
                  </Box>
                </TableCell>
                <TableCell align="center">Gender</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <PhoneIcon />
                    Guardian Phone
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
                    <VisibilityIcon />
                    Actions
                  </Box>
                </TableCell>
              </TableRow>
            </StyledTableHead>
          <TableBody>
            {students && students.length > 0 ? (
              students.map((student, i) => (
                <StyledTableRow key={i}>
                  <TableCell component="th" scope="row">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: '#1976d2' }}>
                        {student.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {student.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={student.gender}
                      color={student.gender === 'Male' ? 'primary' : 'secondary'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 'medium' }}>
                      {student.guardian_phone}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={student.student_class.class_text}
                      color="info"
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <StyledViewButton
                      component={Link}
                      to={`/school/attendance-student/${student._id}`}
                      variant="contained"
                      size="small"
                      startIcon={<VisibilityIcon />}
                    >
                      View Attendance
                    </StyledViewButton>
                  </TableCell>
                </StyledTableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    No students found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </Container>
  );
}