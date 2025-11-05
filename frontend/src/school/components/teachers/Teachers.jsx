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
    Divider
  } from "@mui/material";

  import { useFormik } from "formik";
  import { useEffect, useRef, useState, useContext } from "react";
  import axios from "axios";
  import { baseUrl } from "../../../environment";
  import CustomizedSnackbars from "../../../basic utility components/CustomizedSnackbars";
  import { teacherSchema } from "../../../yupSchema/teacherSchemal";
import TeacherCardAdmin from "../../utility components/teacher card/TeacherCard";
import { AuthContext } from "../../../context/AuthContext";
import { styled } from '@mui/material/styles';
import * as XLSX from 'xlsx';

// Icons
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import WorkIcon from '@mui/icons-material/Work';
import TableViewIcon from '@mui/icons-material/TableView';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';

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

  export default function Teachers() {
    const { isSuperAdmin, hasPermission } = useContext(AuthContext);
    const canDelete = isSuperAdmin() || hasPermission('can_delete_records');

    const [teacherClass, setteacherClass] = useState([]);
    const [teachers, setteachers] = useState([]);
    const [isEdit, setEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

    const [date, setDate] = useState(null);
    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
  
    const addImage = (event) => {
      const file = event.target.files[0];
      setImageUrl(URL.createObjectURL(file));
      console.log("Image", file, event.target.value);
      setFile(file);
    };
  
    const [params, setParams] = useState({});

  
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
  
    const handleDelete = (id) => {
      if (confirm("Are you sure you want to delete?")) {
        axios
          .delete(`${baseUrl}/teacher/delete/${id}`)
          .then((resp) => {
            setMessage(resp.data.message);
            setType("success");
          })
          .catch((e) => {
            setMessage(e.response.data.message);
            setType("error");
            console.log("Error, deleting", e);
          });
      }
    };
    const handleEdit = (id) => {
      console.log("Handle  Edit is called", id);
      setEdit(true);
      axios
        .get(`${baseUrl}/teacher/fetch-single/${id}`)
        .then((resp) => {
          Formik.setFieldValue("email", resp.data.data.email);
          Formik.setFieldValue("name", resp.data.data.name);
          Formik.setFieldValue("qualification", resp.data.data.qualification)
          Formik.setFieldValue("gender", resp.data.data.gender)
          Formik.setFieldValue("age", resp.data.data.age);
          Formik.setFieldValue("password", resp.data.data.password)
          setEditId(resp.data.data._id);
        })
        .catch((e) => {
          console.log("Error  in fetching edit data.");
        });
    };
  
    const cancelEdit = () => {
      setEdit(false);
      Formik.resetForm()
    };

    //   CLEARING IMAGE FILE REFENCE FROM INPUT
  const fileInputRef = useRef(null);
  const handleClearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input
    }
    setFile(null); // Reset the file state
    setImageUrl(null); // Clear the image preview
  };

  // Excel Export Functions for Teachers
  const exportTeachersToExcel = () => {
    try {
      const exportData = teachers.map((teacher, index) => ({
        'S.No': index + 1,
        'Name': teacher.name || 'N/A',
        'Email': teacher.email || 'N/A',
        'Qualification': teacher.qualification || 'N/A',
        'Age': teacher.age || 'N/A',
        'Gender': teacher.gender || 'N/A',
        'Created Date': teacher.createdAt ? new Date(teacher.createdAt).toLocaleDateString() : 'N/A'
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();

      // Set column widths
      const columnWidths = [
        { wch: 8 },   // S.No
        { wch: 25 },  // Name
        { wch: 30 },  // Email
        { wch: 25 },  // Qualification
        { wch: 10 },  // Age
        { wch: 12 },  // Gender
        { wch: 15 }   // Created Date
      ];
      worksheet['!cols'] = columnWidths;

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Teachers');

      const fileName = `Teachers_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      setMessage(`Excel file exported successfully: ${fileName}`);
      setType("success");
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      setMessage('Error exporting to Excel');
      setType("error");
    }
  };

  const exportTeachersToExcelFiltered = (filterCriteria = {}) => {
    try {
      let filteredTeachers = teachers;

      // Apply filters
      if (filterCriteria.gender) {
        filteredTeachers = filteredTeachers.filter(teacher =>
          teacher.gender === filterCriteria.gender
        );
      }

      if (filterCriteria.qualification) {
        filteredTeachers = filteredTeachers.filter(teacher =>
          teacher.qualification.toLowerCase().includes(filterCriteria.qualification.toLowerCase())
        );
      }

      const exportData = filteredTeachers.map((teacher, index) => ({
        'S.No': index + 1,
        'Name': teacher.name || 'N/A',
        'Email': teacher.email || 'N/A',
        'Qualification': teacher.qualification || 'N/A',
        'Age': teacher.age || 'N/A',
        'Gender': teacher.gender || 'N/A',
        'Created Date': teacher.createdAt ? new Date(teacher.createdAt).toLocaleDateString() : 'N/A'
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();

      const columnWidths = [
        { wch: 8 }, { wch: 25 }, { wch: 30 }, { wch: 25 },
        { wch: 10 }, { wch: 12 }, { wch: 15 }
      ];
      worksheet['!cols'] = columnWidths;

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Filtered Teachers');

      const filterString = Object.entries(filterCriteria)
        .filter(([key, value]) => value)
        .map(([key, value]) => `${key}_${value}`)
        .join('_');

      const fileName = `Teachers_${filterString || 'All'}_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      setMessage(`Filtered Excel file exported: ${fileName}`);
      setType("success");
    } catch (error) {
      console.error('Error exporting filtered Excel:', error);
      setMessage('Error exporting filtered Excel');
      setType("error");
    }
  };

  // RDLC Report Function for Teachers
  const generateTeachersRDLCReport = () => {
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Teachers Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { color: #2196F3; margin: 0; }
            .header h2 { color: #666; margin: 5px 0; }
            .meta-info { margin: 20px 0; display: flex; justify-content: space-between; }
            .report-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .report-table th, .report-table td {
              border: 1px solid #ddd;
              padding: 10px;
              text-align: left;
              font-size: 12px;
            }
            .report-table th {
              background-color: #2196F3;
              color: white;
              font-weight: bold;
            }
            .report-table tr:nth-child(even) { background-color: #f9f9f9; }
            .summary { margin-top: 30px; }
            .summary-box {
              display: inline-block;
              margin: 10px;
              padding: 15px;
              border: 2px solid #2196F3;
              border-radius: 5px;
              text-align: center;
            }
            .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #666; }
            @media print {
              body { margin: 0; }
              .header h1 { font-size: 18px; }
              .header h2 { font-size: 14px; }
              .report-table th, .report-table td { font-size: 10px; padding: 6px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>TEACHERS REPORT</h1>
            <h2>Academic Year ${new Date().getFullYear()}</h2>
          </div>

          <div class="meta-info">
            <div><strong>Report Generated:</strong> ${new Date().toLocaleString()}</div>
            <div><strong>Total Teachers:</strong> ${teachers.length}</div>
            <div><strong>Generated By:</strong> School Management System</div>
          </div>

          <table class="report-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Qualification</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              ${teachers.map((teacher, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${teacher.name || 'N/A'}</td>
                  <td>${teacher.email || 'N/A'}</td>
                  <td>${teacher.qualification || 'N/A'}</td>
                  <td>${teacher.age || 'N/A'}</td>
                  <td>${teacher.gender || 'N/A'}</td>
                  <td>${teacher.createdAt ? new Date(teacher.createdAt).toLocaleDateString() : 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="summary">
            <h3>Summary Statistics</h3>
            <div class="summary-box">
              <strong>${teachers.length}</strong><br>Total Teachers
            </div>
            <div class="summary-box">
              <strong>${teachers.filter(t => t.gender === 'Male').length}</strong><br>Male Teachers
            </div>
            <div class="summary-box">
              <strong>${teachers.filter(t => t.gender === 'Female').length}</strong><br>Female Teachers
            </div>
            <div class="summary-box">
              <strong>${[...new Set(teachers.map(t => t.qualification))].length}</strong><br>Unique Qualifications
            </div>
          </div>

          <div class="footer">
            <p>This report was generated automatically by the School Management System</p>
            <p>Report Date: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}</p>
          </div>
        </body>
        </html>
      `;

      const printWindow = window.open('', '_blank', 'width=1200,height=800');
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 1000);
      };

      setMessage('RDLC Report generated and opened for printing');
      setType("success");
    } catch (error) {
      console.error('Error generating RDLC report:', error);
      setMessage('Error generating RDLC report');
      setType("error");
    }
  };

  
    //   MESSAGE
    const [message, setMessage] = useState("");
    const [type, setType] = useState("succeess");
  
    const resetMessage = () => {
      setMessage("");
    };
  
    const initialValues = {
        email: "",
        name:  "",
        qualification:  "",
        gender:  "",
        age: "",
        password: ""
    };

    const Formik = useFormik({
      initialValues: initialValues,
      validationSchema: teacherSchema,
      onSubmit: (values) => {
        console.log("teacher calls admin Formik values", values);
        if (isEdit) {

            const fd = new FormData();
            Object.keys(values).forEach((key) => fd.append(key, values[key]));
            if (file) {
              fd.append("image", file, file.name);
            }

            axios
              .patch(`${baseUrl}/teacher/update/${editId}`, fd)
              .then((resp) => {
                setMessage(resp.data.message);
                setType("success");
                handleClearFile();
                cancelEdit();
              })
              .catch((e) => {
                setMessage(e.response?.data?.message || 'Update failed');
                setType("error");
              });
          } else {
          // Image is now optional - submit with or without image
          const fd = new FormData();
          if (file) {
            fd.append("image", file, file.name);
          }
          Object.keys(values).forEach((key) => fd.append(key, values[key]));

          axios
            .post(`${baseUrl}/teacher/register`, fd)
            .then((resp) => {
              console.log("Response after submitting admin teacher", resp);
              setMessage(resp.data.message);
              setType("success");
              handleClearFile();
              Formik.resetForm();
              setFile(null);
            })
            .catch((e) => {
              setMessage(e.response?.data?.message || 'Registration failed');
              setType("error");
              console.log("Error, response admin teacher calls", e);
            });
        }
      },
    });
  
    const [month, setMonth] = useState([]);
    const [year, setYear] = useState([]);
    const fetchteacherClass = () => {
      // axios
      //   .get(`${baseUrl}/teacher/get-month-year`)
      //   .then((resp) => {
      //     console.log("Fetching month and year.", resp);
      //     setMonth(resp.data.month);
      //     setYear(resp.data.year);
      //   })
      //   .catch((e) => {
      //     console.log("Error in fetching month and year", e);
      //   });
    };
  
    const fetchteachers = () => {
      axios
        .get(`${baseUrl}/teacher/fetch-with-query`, { params: params })
        .then((resp) => {
          console.log("Fetching data in  teacher Calls  admin.", resp);
          setteachers(resp.data.data);
        })
        .catch((e) => {
          console.log("Error in fetching teacher calls admin data", e);
        });
    };
    useEffect(() => {
      fetchteachers();
      // fetchteacherClass();
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
            <WorkIcon sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h3" component="h1" gutterBottom>
              Teacher Management
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
              Manage and view all teacher information
            </Typography>

            {/* Export Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<FileDownloadIcon />}
                onClick={exportTeachersToExcel}
                sx={{
                  background: 'rgba(76, 175, 80, 0.9)',
                  color: 'white',
                  '&:hover': {
                    background: 'rgba(76, 175, 80, 1)',
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                Export to Excel
              </Button>

              <Button
                variant="contained"
                startIcon={<PrintIcon />}
                onClick={generateTeachersRDLCReport}
                sx={{
                  background: 'rgba(255, 152, 0, 0.9)',
                  color: 'white',
                  '&:hover': {
                    background: 'rgba(255, 152, 0, 1)',
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                Generate Report
              </Button>
            </Box>
          </CardContent>
        </StyledHeaderCard>
  
        {/* Add Teacher Form */}
        <StyledFilterCard>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <AddIcon sx={{ color: '#1976d2', fontSize: 30 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {isEdit ? "Edit Teacher" : "Add New Teacher"}
              </Typography>
            </Box>
              <Box
                component="form"
                noValidate
                autoComplete="off"
                onSubmit={Formik.handleSubmit}
              >
              
                  <Box
                    component={"div"}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <Typography style={{ marginRight: "50px" }} variant="h4">
                      teacher Pic
                    </Typography>
                    <TextField
                      sx={{ marginTop: "10px" }}
                      id=""
                      variant="outlined"
                      name="file"
                      type="file"
                      onChange={(event) => {
                        addImage(event);
                      }}
                      inputRef={fileInputRef}
                    />
  
                    {file && (
                      <Box sx={{ position: "relative" }} component={"div"}>
                        <CardMedia
                          component={"img"}
                          image={imageUrl}
                          height={"240px"}
                        />
                      </Box>
                    )}
                  </Box>
  
                <TextField
                  fullWidth
                  sx={{ marginTop: "10px" }}
                  id=""
                  label="Email "
                  variant="outlined"
                  name="email"
                  value={Formik.values.email}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                />
                {Formik.touched.email && Formik.errors.email && (
                  <p style={{ color: "red", textTransform: "capitalize" }}>
                    {Formik.errors.email}
                  </p>
                )}
  

                <TextField
                  fullWidth
                  sx={{ marginTop: "10px" }}
                  id=""
                  label="name "
                  variant="outlined"
                  name="name"
                  value={Formik.values.name}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                />
                {Formik.touched.name && Formik.errors.name && (
                  <p style={{ color: "red", textTransform: "capitalize" }}>
                    {Formik.errors.name}
                  </p>
                )}
  
  <TextField
                  fullWidth
                  sx={{ marginTop: "10px" }}
                  id=""
                  label="Qualification "
                  variant="outlined"
                  name="qualification"
                  value={Formik.values.qualification}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                />
                {Formik.touched.qualification && Formik.errors.qualification && (
                  <p style={{ color: "red", textTransform: "capitalize" }}>
                    {Formik.errors.qualification}
                  </p>
                )}
  
                <FormControl sx={{ minWidth: "220px", marginTop: "10px" }}>
                  <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
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
                  <p style={{ color: "red", textTransform: "capitalize" }}>
                    {Formik.errors.gender}
                  </p>
                )}
  
  
             <TextField
                  fullWidth
                  sx={{ marginTop: "10px" }}
                  id=""
                  label="Age "
                  variant="outlined"
                  name="age"
                  value={Formik.values.age}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                />
                {Formik.touched.age && Formik.errors.age && (
                  <p style={{ color: "red", textTransform: "capitalize" }}>
                    {Formik.errors.age}
                  </p>
                )}
  
  
           
             
  
                  {!isEdit && <>
                  
                <TextField
                  fullWidth
                  sx={{ marginTop: "10px" }}
                  id=""
                  label="Password "
                  variant="outlined"
                  name="password"
                  type="password"
                  value={Formik.values.password}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                />
                {Formik.touched.password && Formik.errors.password && (
                  <p style={{ color: "red", textTransform: "capitalize" }}>
                    {Formik.errors.password}
                  </p>
                )}
                  </>}
  
  
                <Box sx={{ marginTop: "10px" }} component={"div"}>
                  <Button
                    type="submit"
                    sx={{ marginRight: "10px" }}
                    variant="contained"
                  >
                    Submit
                  </Button>
                  {isEdit && (
                    <Button
                      sx={{ marginRight: "10px" }}
                      variant="outlined"
                      onClick={cancelEdit}
                    >
                      Cancel Edit
                    </Button>
                  )}
                </Box>
              </Box>
          </CardContent>
        </StyledFilterCard>

        {/* Filter and View Controls */}
        <StyledFilterCard>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <SearchIcon sx={{ color: '#1976d2', fontSize: 30 }} />
                  <TextField
                    fullWidth
                    label="Search Teacher Name"
                    onChange={handleSearch}
                    variant="outlined"
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
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

        {/* Teachers Display */}
        {viewMode === 'table' ? (
          /* Table View with Round Photos */
          <StyledTableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
              <StyledTableHead>
                <TableRow>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon />
                      Teacher Details
                    </Box>
                  </TableCell>
                  <TableCell align="center">Qualification</TableCell>
                  <TableCell align="center">Age & Gender</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <EmailIcon />
                      Contact Info
                    </Box>
                  </TableCell>
                  <TableCell align="center">Join Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {teachers && teachers.length > 0 ? (
                  teachers.map((teacher, index) => (
                    <StyledTableRow key={index}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            src={`/images/uploaded/teacher/${teacher.teacher_image}`}
                            alt={teacher.name}
                            sx={{
                              width: 60,
                              height: 60,
                              border: '3px solid #1976d2',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }}
                          />
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                              {teacher.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <EmailIcon sx={{ fontSize: 16, color: '#666' }} />
                              <Typography variant="body2" color="text.secondary">
                                {teacher.email}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell align="center">
                        <Chip
                          label={teacher.qualification || 'N/A'}
                          color="secondary"
                          variant="outlined"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </TableCell>

                      <TableCell align="center">
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {teacher.age} years
                          </Typography>
                          <Chip
                            label={teacher.gender}
                            color={teacher.gender === 'male' ? 'info' : teacher.gender === 'female' ? 'secondary' : 'default'}
                            size="small"
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      </TableCell>

                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                          <EmailIcon sx={{ fontSize: 14, color: '#666' }} />
                          <Typography variant="body2" color="text.secondary">
                            {teacher.email}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell align="center">
                        <Typography variant="body2">
                          {new Date(teacher.createdAt).toLocaleDateString('en-GB')}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        <Box>
                          <Tooltip title="Edit Teacher">
                            <ActionButton
                              color="primary"
                              onClick={() => handleEdit(teacher._id)}
                            >
                              <EditIcon />
                            </ActionButton>
                          </Tooltip>
                          {canDelete && (
                            <Tooltip title="Delete Teacher">
                              <ActionButton
                                color="error"
                                onClick={() => handleDelete(teacher._id)}
                              >
                                <DeleteIcon sx={{ color: '#f44336' }} />
                              </ActionButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="h6" color="text.secondary">
                        No teachers found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </StyledTableContainer>
        ) : (
          /* Cards View */
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {teachers &&
              teachers.map((teacher, i) => {
                return (
                  <TeacherCardAdmin
                    key={i}
                    handleEdit={handleEdit}
                    handleDelete={canDelete ? handleDelete : null}
                    teacher={teacher}
                    canDelete={canDelete}
                  />
                );
              })}
          </Box>
        )}
      </Container>
    );
  }
  