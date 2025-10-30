import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  CardMedia,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Container,
} from "@mui/material";
import { useFormik } from "formik";
import axios from "axios";
import { baseUrl } from "../../../environment";
import CustomizedSnackbars from "../../../basic utility components/CustomizedSnackbars";
import { studentSchema } from "../../../yupSchema/studentSchema";
import StudentCardAdmin from "../../utility components/student card/StudentCard";
import { styled } from '@mui/material/styles';

// Icons
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SchoolIcon from '@mui/icons-material/School';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import TableViewIcon from '@mui/icons-material/TableView';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

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
  [theme.breakpoints.down('md')]: {
    overflowX: 'auto',
    '&::-webkit-scrollbar': {
      height: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#888',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#555',
    },
  },
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

const ActionButton = styled(IconButton)(({ theme, color }) => ({
  borderRadius: '10px',
  margin: theme.spacing(0.5),
  '&:hover': {
    transform: 'scale(1.1)',
    backgroundColor: color === 'error' ? '#ffebee' : '#e3f2fd',
  },
  transition: 'all 0.2s ease-in-out',
}));

export default function Students() {
  const [studentClass, setStudentClass] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [transportFees, setTransportFees] = useState([]);
  const [isEdit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [feesStats, setFeesStats] = useState({
    totalStudents: 0,
    totalFees: 0,
    feesCollected: 0,
    balanceFees: 0
  });

  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const addImage = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImageUrl(URL.createObjectURL(selectedFile));
    }
  };

  const [params, setParams] = useState({});
  const handleClass = (e) => {
    setParams((prevParams) => ({
      ...prevParams,
      student_class: e.target.value || undefined,
    }));
  };

  const handleSearch = (e) => {
    setParams((prevParams) => ({
      ...prevParams,
      search: e.target.value || undefined,
    }));
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete?")) {
      axios
        .delete(`${baseUrl}/student/delete/${id}`)
        .then((resp) => {
          setMessage(resp.data.message);
          setType("success");
        })
        .catch((e) => {
          setMessage(e.response.data.message);
          setType("error");
        });
    }
  };

  const handleEdit = (id) => {
    setEdit(true);
    axios
      .get(`${baseUrl}/student/fetch-single/${id}`)
      .then((resp) => {
        const data = resp.data.data;
        Formik.setValues({
          email: data.email,
          name: data.name,
          student_class: data.student_class._id,
          course: data.course?._id || "",
          gender: data.gender,
          age: data.age,
          guardian: data.guardian,
          guardian_phone: data.guardian_phone,
          aadhaar_number: data.aadhaar_number || "",
          password: data.password,
          transport_fees: data.transport_fees?._id || "",
        });
        setImageUrl(data.image);
        setEditId(data._id);
      })
      .catch(() => console.log("Error in fetching edit data."));
  };

  const cancelEdit = () => {
    setEdit(false);
    Formik.resetForm();
  };

  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");
  const resetMessage = () => setMessage("");

  const initialValues = {
    name: "",
    email: "",
    student_class: "",
    course: "",
    gender: "",
    date_of_birth: "",
    date_of_admission: new Date().toISOString().split('T')[0],
    age: "",
    guardian: "",
    guardian_phone: "",
    aadhaar_number: "",
    password: "",
    transport_fees: "",
    total_fees: "",
    advance_fees: "",
  };

  // Function to calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  // Handle date of birth change and auto-calculate age
  const handleDateOfBirthChange = (e) => {
    const dob = e.target.value;
    Formik.setFieldValue('date_of_birth', dob);

    const calculatedAge = calculateAge(dob);
    if (calculatedAge !== "") {
      Formik.setFieldValue('age', calculatedAge);

      // Check if age is less than 4 years
      if (calculatedAge < 4) {
        setMessage("Student must be at least 4 years old");
        setType("error");
      }
    }
  };

  const Formik = useFormik({
    initialValues,
    validationSchema: studentSchema,
    onSubmit: (values) => {
      if (isEdit) {
        const fd = new FormData();
        Object.keys(values).forEach((key) => fd.append(key, values[key]));
        if (file) {
          fd.append("image", file, file.name);
        }

        axios
          .patch(`${baseUrl}/student/update/${editId}`, fd)
          .then((resp) => {
            setMessage(resp.data.message);
            setType("success");
            handleClearFile();
            cancelEdit();
          })
          .catch((e) => {
            setMessage(e.response.data.message);
            setType("error");
          });
      } else {
        if (file) {
          const fd = new FormData();
          fd.append("image", file, file.name);
          Object.keys(values).forEach((key) => {
            if (key !== 'transport_fees') {
              fd.append(key, values[key]);
            }
          });

          if (values.transport_fees) {
            fd.append("transport_fees", values.transport_fees);
          }

          axios
            .post(`${baseUrl}/student/register`, fd)
            .then(async (resp) => {
              setMessage(resp.data.message);
              setType("success");
              Formik.resetForm();
              handleClearFile();
            })
            .catch((e) => {
              setMessage(e.response.data.message);
              setType("error");
            });
        } else {
          // Submit without image - image is now optional
          const fd = new FormData();
          Object.keys(values).forEach((key) => {
            if (key !== 'transport_fees') {
              fd.append(key, values[key]);
            }
          });

          if (values.transport_fees) {
            fd.append("transport_fees", values.transport_fees);
          }

          axios
            .post(`${baseUrl}/student/register`, fd)
            .then(async (resp) => {
              setMessage(resp.data.message);
              setType("success");
              Formik.resetForm();
            })
            .catch((e) => {
              setMessage(e.response?.data?.message || 'Registration failed');
              setType("error");
            });
        }
      }
    },
  });

  const fetchStudentClass = () => {
    axios
      .get(`${baseUrl}/class/fetch-all`)
      .then((resp) => {
        setStudentClass(resp.data.data);
      })
      .catch(() => console.log("Error in fetching student Class"));
  };

  const fetchCourses = () => {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const schoolId = user.id; // School admin's ID is the schoolId

        console.log('Fetching courses for school:', schoolId);

        axios
          .get(`${baseUrl}/course/school/${schoolId}`)
          .then((resp) => {
            console.log('Courses fetched:', resp.data);
            setCourses(resp.data.courses || []);
          })
          .catch((error) => {
            console.error("Error in fetching courses:", error);
            setCourses([]);
          });
      } catch (e) {
        console.error('Error parsing user:', e);
        setCourses([]);
      }
    } else {
      console.error('No user found in storage');
      setCourses([]);
    }
  };

  const fetchTransportFees = () => {
    const token = localStorage.getItem('token');
    axios
      .get(`${baseUrl}/transport-fees/fetch-active`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((resp) => {
        setTransportFees(resp.data.data);
      })
      .catch(() => console.log("Error in fetching transport fees"));
  };

  const fetchStudents = () => {
    axios
      .get(`${baseUrl}/student/fetch-with-query`, { params })
      .then((resp) => {
        const studentsData = resp.data.data;
        setStudents(studentsData);

        // Calculate fees statistics
        const stats = studentsData.reduce((acc, student) => {
          const totalFees = student.fees?.total_fees || 0;
          const advanceFees = student.fees?.advance_fees || 0;
          const balanceFees = student.fees?.balance_fees || 0;

          return {
            totalStudents: acc.totalStudents + 1,
            totalFees: acc.totalFees + totalFees,
            feesCollected: acc.feesCollected + advanceFees,
            balanceFees: acc.balanceFees + balanceFees
          };
        }, { totalStudents: 0, totalFees: 0, feesCollected: 0, balanceFees: 0 });

        setFeesStats(stats);
      })
      .catch(() => console.log("Error in fetching students data"));
  };

  useEffect(() => {
    fetchStudents();
    fetchStudentClass();
    fetchCourses();
    fetchTransportFees();
  }, [message, params]);

  const fileInputRef = useRef(null);
  const handleClearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFile(null);
    setImageUrl(null);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {message && (
        <CustomizedSnackbars
          reset={resetMessage}
          type={type}
          message={message}
        />
      )}

      {/* Dashboard Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total Students Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            height: '100%',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 20px rgba(102, 126, 234, 0.4)' }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    Total Students
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                    {feesStats.totalStudents}
                  </Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Enrolled in school
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Fees Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            height: '100%',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 20px rgba(240, 147, 251, 0.4)' }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    Total Fees
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                    ₹{feesStats.totalFees.toLocaleString()}
                  </Typography>
                </Box>
                <AttachMoneyIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Overall fees amount
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Fees Collected Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            height: '100%',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 20px rgba(79, 172, 254, 0.4)' }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    Fees Collected
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                    ₹{feesStats.feesCollected.toLocaleString()}
                  </Typography>
                </Box>
                <AccountBalanceWalletIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {feesStats.totalFees > 0 ? `${((feesStats.feesCollected / feesStats.totalFees) * 100).toFixed(1)}%` : '0%'} collected
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Balance Fees Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white',
            height: '100%',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 20px rgba(250, 112, 154, 0.4)' }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    Balance Fees
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                    ₹{feesStats.balanceFees.toLocaleString()}
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Pending collection
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Student Form */}
      <StyledFilterCard>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <AddIcon sx={{ color: '#1976d2', fontSize: 30 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {isEdit ? "Edit Student" : "Add New Student"}
            </Typography>
          </Box>

          <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={Formik.handleSubmit}
          >
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", mb: 3 }}>
              <Typography sx={{ marginRight: "50px" }} variant="h6">
                Student Picture
              </Typography>
              <TextField
                sx={{ marginTop: "10px" }}
                variant="outlined"
                name="file"
                type="file"
                onChange={addImage}
                inputRef={fileInputRef}
              />
              {imageUrl && (
                <Box sx={{ position: "relative", ml: 2 }}>
                  <CardMedia
                    component="img"
                    image={imageUrl}
                    height="120px"
                    sx={{ borderRadius: '10px' }}
                  />
                </Box>
              )}
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  name="email"
                  value={Formik.values.email}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                />
                {Formik.touched.email && Formik.errors.email && (
                  <Typography variant="caption" color="error">
                    {Formik.errors.email}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  variant="outlined"
                  name="name"
                  value={Formik.values.name}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                />
                {Formik.touched.name && Formik.errors.name && (
                  <Typography variant="caption" color="error">
                    {Formik.errors.name}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Course</InputLabel>
                  <Select
                    label="Course"
                    name="course"
                    onChange={Formik.handleChange}
                    onBlur={Formik.handleBlur}
                    value={Formik.values.course}
                  >
                    {courses &&
                      courses.map((course, i) => (
                        <MenuItem key={i} value={course._id}>
                          {course.courseName} ({course.courseCode})
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                {Formik.touched.course && Formik.errors.course && (
                  <Typography variant="caption" color="error">
                    {Formik.errors.course}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Class</InputLabel>
                  <Select
                    label="Class"
                    name="student_class"
                    onChange={Formik.handleChange}
                    onBlur={Formik.handleBlur}
                    value={Formik.values.student_class}
                  >
                    {studentClass &&
                      studentClass.map((value, i) => (
                        <MenuItem key={i} value={value._id}>
                          {value.class_text}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                {Formik.touched.student_class && Formik.errors.student_class && (
                  <Typography variant="caption" color="error">
                    {Formik.errors.student_class}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    label="Gender"
                    name="gender"
                    onChange={Formik.handleChange}
                    onBlur={Formik.handleBlur}
                    value={Formik.values.gender}
                  >
                    <MenuItem value={""}>Select Gender</MenuItem>
                    <MenuItem value={"male"}>Male</MenuItem>
                    <MenuItem value={"female"}>Female</MenuItem>
                    <MenuItem value={"other"}>Other</MenuItem>
                  </Select>
                </FormControl>
                {Formik.touched.gender && Formik.errors.gender && (
                  <Typography variant="caption" color="error">
                    {Formik.errors.gender}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  variant="outlined"
                  type="date"
                  name="date_of_birth"
                  value={Formik.values.date_of_birth}
                  onChange={handleDateOfBirthChange}
                  onBlur={Formik.handleBlur}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    max: new Date().toISOString().split('T')[0]
                  }}
                />
                {Formik.touched.date_of_birth && Formik.errors.date_of_birth && (
                  <Typography variant="caption" color="error">
                    {Formik.errors.date_of_birth}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Age (Auto-calculated)"
                  variant="outlined"
                  name="age"
                  value={Formik.values.age}
                  InputProps={{ readOnly: true }}
                  disabled
                  helperText={Formik.values.age && Formik.values.age < 4 ? "Student must be at least 4 years old" : ""}
                  error={Formik.values.age && Formik.values.age < 4}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Date of Admission"
                  variant="outlined"
                  type="date"
                  name="date_of_admission"
                  value={Formik.values.date_of_admission}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    max: new Date().toISOString().split('T')[0]
                  }}
                />
                {Formik.touched.date_of_admission && Formik.errors.date_of_admission && (
                  <Typography variant="caption" color="error">
                    {Formik.errors.date_of_admission}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Guardian"
                  variant="outlined"
                  name="guardian"
                  value={Formik.values.guardian}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                />
                {Formik.touched.guardian && Formik.errors.guardian && (
                  <Typography variant="caption" color="error">
                    {Formik.errors.guardian}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Guardian Phone"
                  variant="outlined"
                  name="guardian_phone"
                  value={Formik.values.guardian_phone}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                />
                {Formik.touched.guardian_phone && Formik.errors.guardian_phone && (
                  <Typography variant="caption" color="error">
                    {Formik.errors.guardian_phone}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Aadhaar Number"
                  variant="outlined"
                  name="aadhaar_number"
                  value={Formik.values.aadhaar_number}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  inputProps={{ maxLength: 12 }}
                  placeholder="Enter 12-digit Aadhaar number"
                />
                {Formik.touched.aadhaar_number && Formik.errors.aadhaar_number && (
                  <Typography variant="caption" color="error">
                    {Formik.errors.aadhaar_number}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="transport-fees-label">Transport Fees (Optional)</InputLabel>
                  <Select
                    labelId="transport-fees-label"
                    label="Transport Fees (Optional)"
                    name="transport_fees"
                    value={Formik.values.transport_fees}
                    onChange={Formik.handleChange}
                    onBlur={Formik.handleBlur}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {transportFees && transportFees.map((location) => (
                      <MenuItem key={location._id} value={location._id}>
                        {location.location_name} - ₹{location.monthly_fee}/month
                        {location.distance && ` (${location.distance})`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Total Fees"
                  variant="outlined"
                  name="total_fees"
                  type="number"
                  value={Formik.values.total_fees}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  error={Formik.touched.total_fees && Boolean(Formik.errors.total_fees)}
                  helperText={Formik.touched.total_fees && Formik.errors.total_fees}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Advance Fees Paid"
                  variant="outlined"
                  name="advance_fees"
                  type="number"
                  value={Formik.values.advance_fees}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  error={Formik.touched.advance_fees && Boolean(Formik.errors.advance_fees)}
                  helperText={Formik.touched.advance_fees && Formik.errors.advance_fees}
                />
              </Grid>

              {!isEdit && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Password"
                    variant="outlined"
                    name="password"
                    type="password"
                    value={Formik.values.password}
                    onChange={Formik.handleChange}
                    onBlur={Formik.handleBlur}
                  />
                  {Formik.touched.password && Formik.errors.password && (
                    <Typography variant="caption" color="error">
                      {Formik.errors.password}
                    </Typography>
                  )}
                </Grid>
              )}

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ marginRight: 2, borderRadius: '10px' }}
                >
                  {isEdit ? "Update Student" : "Register Student"}
                </Button>
                {isEdit && (
                  <Button
                    onClick={cancelEdit}
                    variant="outlined"
                    sx={{ borderRadius: '10px' }}
                  >
                    Cancel
                  </Button>
                )}
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </StyledFilterCard>

      {/* Filter and View Controls */}
      <StyledFilterCard>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FilterListIcon sx={{ color: '#1976d2', fontSize: 30 }} />
                <FormControl fullWidth>
                  <InputLabel>Filter by Class</InputLabel>
                  <Select
                    label="Filter by Class"
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                <Typography variant="body1" color="text.secondary" sx={{ mr: 2 }}>
                  View Mode:
                </Typography>
                <Tabs
                  value={viewMode}
                  onChange={(e, newValue) => setViewMode(newValue)}
                  indicatorColor="primary"
                  textColor="primary"
                >
                  <Tab
                    icon={<TableViewIcon />}
                    label="Table"
                    value="table"
                    sx={{ minWidth: 100 }}
                  />
                  <Tab
                    icon={<ViewModuleIcon />}
                    label="Cards"
                    value="cards"
                    sx={{ minWidth: 100 }}
                  />
                </Tabs>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </StyledFilterCard>

      {/* Students Display */}
      {viewMode === 'table' ? (
        <StyledTableContainer component={Paper}>
          <Table sx={{
            minWidth: 650,
            '@media (max-width: 768px)': {
              minWidth: 1000, // Force horizontal scroll on mobile
            }
          }}>
            <StyledTableHead>
              <TableRow>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon />
                    Student Details
                  </Box>
                </TableCell>
                <TableCell align="center">Course</TableCell>
                <TableCell align="center">Class</TableCell>
                <TableCell align="center">Age & Gender</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <PhoneIcon />
                    Guardian Info
                  </Box>
                </TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {students && students.length > 0 ? (
                students.map((student, index) => (
                  <StyledTableRow key={index}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={`/images/uploaded/student/${student.student_image}`}
                          alt={student.name}
                          sx={{
                            width: 60,
                            height: 60,
                            border: '3px solid #1976d2',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                          }}
                        />
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                            {student.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EmailIcon sx={{ fontSize: 16, color: '#666' }} />
                            <Typography variant="body2" color="text.secondary">
                              {student.email}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell align="center">
                      <Chip
                        label={student.course?.courseName || 'No Course'}
                        color="secondary"
                        variant="outlined"
                        sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}
                      />
                      {student.course && (
                        <Typography variant="caption" display="block" color="text.secondary">
                          {student.course.courseCode}
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell align="center">
                      <Chip
                        label={student.student_class?.class_text || 'N/A'}
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {student.age} years
                        </Typography>
                        <Chip
                          label={student.gender}
                          color={student.gender === 'male' ? 'info' : student.gender === 'female' ? 'secondary' : 'default'}
                          size="small"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </TableCell>

                    <TableCell align="center">
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                          {student.guardian}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                          <PhoneIcon sx={{ fontSize: 14, color: '#666' }} />
                          <Typography variant="body2" color="text.secondary">
                            {student.guardian_phone}
                          </Typography>
                        </Box>
                        {student.aadhaar_number && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.75rem' }}>
                            Aadhaar: {student.aadhaar_number}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>

                    <TableCell align="center">
                      <Box>
                        <Tooltip title="Edit Student">
                          <ActionButton
                            color="primary"
                            onClick={() => handleEdit(student._id)}
                          >
                            <EditIcon />
                          </ActionButton>
                        </Tooltip>
                        <Tooltip title="Delete Student">
                          <ActionButton
                            color="error"
                            onClick={() => handleDelete(student._id)}
                          >
                            <DeleteIcon sx={{ color: '#f44336' }} />
                          </ActionButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                      No students found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
      ) : (
        <Grid container spacing={3}>
          {students.length > 0 ? (
            students.map((value, i) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                <StudentCardAdmin
                  student={value}
                  handleDelete={handleDelete}
                  handleEdit={handleEdit}
                />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  No students found
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
}