/* eslint-disable react/prop-types */
import {
  Box,
  Button,
  CardMedia,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  styled,
  TextField,
  Typography,
  Card,
  CardContent,
  Chip,
  useMediaQuery,
  useTheme,
  Divider,
  IconButton
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday,
  Subject as SubjectIcon,
  Assessment as AssessmentIcon,
  Add as AddIcon
} from "@mui/icons-material";

import { useEffect, useState, useContext } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { baseUrl } from "../../../environment";
import { examSchema } from "../../../yupSchema/examinationSchema";
import { convertDate } from "../../../utilityFunctions";
import CustomizedSnackbars from "../../../basic utility components/CustomizedSnackbars";
import { AuthContext } from "../../../context/AuthContext";

export default function Examinations() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isSuperAdmin, hasPermission } = useContext(AuthContext);
  const canDelete = isSuperAdmin() || hasPermission('can_delete_records');
  const [isEditExam, setEditExam] = useState(false);
  const [examForm, setExamForm] = useState(false);
  const [examEditId, setExamEditId] = useState(null);

  const [allClasses, setAllClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [examinations, setExaminations] = useState([]);
 const [submitted,  setSubmitted] = useState("not submitted")
  const [allSubjects, setAllSubjects] = useState([]);


  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const resetMessage = () => {
    setMessage("");
  };
  
const handleMessage=(type, message)=>{
  console.log("Called")
setType(type);
setMessage(message)
}


  const handleNewExam = () => {
    cancelEditExam()
    setExamForm(true);
  };

  const handleEditExam = (id) => {
    setExamEditId(id);
    setEditExam(true);
    setExamForm(true);
    axios
      .get(`${baseUrl}/examination/single/${id}`)
      .then((resp) => {
        examFormik.setFieldValue("exam_date", dayjs(resp.data.data.examDate));
        examFormik.setFieldValue("subject", resp.data.data.subject);
        examFormik.setFieldValue("exam_type", resp.data.data.examType);
      })
      .catch((e) => {
        handleMessage("error", e.response.data.message);

      });
  };

  const handleDeleteExam = (id) => {
    if (confirm("Are you sure you want to delete?")) {
      axios
        .delete(`${baseUrl}/examination/delete/${id}`)
        .then((resp) => {
          handleMessage("success", resp.data.message);
        })
        .catch((e) => {
          handleMessage("error", e.response.data.message);
        });
    }
  };

  const cancelEditExam = () => {
    setExamForm(false);
    setExamEditId(null);
    examFormik.resetForm();
  };

  const examFormik = useFormik({
    initialValues: { exam_date: "", subject: "", exam_type: "" },
    validationSchema: examSchema,
    onSubmit: (values) => {
      if (isEditExam) {
        axios
          .patch(`${baseUrl}/examination/update/${examEditId}`, { ...values })
          .then((resp) => {
            handleMessage("success", resp.data.message);
          })
          .catch((e) => {
            handleMessage("error", e.response.data.message);
          });
      } else {
        console.log("Values", values)
        console.log("selected Class", selectedClass)
        axios
          .post(`${baseUrl}/examination/new`, {
            ...values,
            class_id: selectedClass,
          })
          .then((resp) => {
            handleMessage("success", resp.data.message);
            console.log("success", resp)
          })
          .catch((e) => {
          console.log(e,"error")
            handleMessage("error", e.response.data.message);
          });
      }
      cancelEditExam();
      setSubmitted("Submitted")
    },
  });

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  const fetchExaminations = () => {
    axios
      .get(`${baseUrl}/examination/fetch-class/${selectedClass}`)
      .then((resp) => {
        console.log("ALL Examination", resp);
        setExaminations(resp.data.data);
      })
      .catch((e) => {
        console.log("Error in fetching  Examinstions.");
      });
  };
  useEffect(() => {
    if (selectedClass) {
      fetchExaminations();
    }
  }, [selectedClass,message]);

  const fetchAllSubjects = () => {
    axios
      .get(`${baseUrl}/subject/fetch-all`, { params: {} })
      .then((resp) => {
        console.log("ALL subjects", resp);
        setAllSubjects(resp.data.data);
      })
      .catch((e) => {
        console.log("Error in fetching  all  Classes");
      });
  };

  const fetchStudentClass = () => {
    axios
      .get(`${baseUrl}/class/fetch-all`)
      .then((resp) => {
        setAllClasses(resp.data.data);
        console.log("Class", resp.data);
        setSelectedClass(resp.data.data[0]._id);
      })
      .catch((e) => {
        console.log("Error in fetching student Class", e);
      });
  };
  useEffect(() => {
    fetchStudentClass();
    fetchAllSubjects();
  }, []);

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, pb: { xs: 10, md: 3 } }}>
     {message && <CustomizedSnackbars reset={resetMessage} type={type} message={message}/>}
      <Typography
        className="hero-text"
        variant="h2"
        sx={{
          textAlign: "center",
          fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
          mb: { xs: 2, md: 3 },
          fontWeight: 700
        }}
      >
        Examinations
      </Typography>
      <Paper sx={{
        margin: { xs: "8px 0", md: "10px" },
        padding: { xs: "15px", md: "20px" },
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <FormControl sx={{ minWidth: { xs: "100%", sm: "220px" }, mb: 1 }}>
          <Typography sx={{ mb: 1, fontWeight: 600 }}>Select Class</Typography>
          <Select
            value={selectedClass}
            onChange={handleClassChange}
            onBlur={handleClassChange}
            sx={{ borderRadius: '10px' }}
          >
            {allClasses &&
              allClasses.map((value) => (
                <MenuItem key={value._id} value={value._id}>
                  {value.class_text}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Paper>

      {examForm && (
        <Paper sx={{
          padding: { xs: "15px", md: "20px" },
          margin: { xs: "8px 0", md: "10px" },
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <Typography
            sx={{
              textAlign: "center",
              textTransform: "capitalize",
              fontWeight: "700",
              mb: 2,
              fontSize: { xs: '1.2rem', md: '1.5rem' }
            }}
            variant="h6"
          >
            {isEditExam ? 'Edit Examination' : 'Assign Examination'}
          </Typography>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={examFormik.handleSubmit}
          >
            <Box component={"div"} sx={{ mb: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    label="Exam Date"
                    name="exam_date"
                    value={dayjs(examFormik.values.exam_date)}
                    onChange={(e) => {
                      examFormik.setFieldValue("exam_date", dayjs(e));
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: isMobile,
                        sx: { borderRadius: '10px' }
                      }
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Box>

            <FormControl sx={{ width: { xs: "100%", md: "220px" }, mb: 2 }}>
              <InputLabel>Subject</InputLabel>
              <Select
                label="Subject"
                name="subject"
                onChange={examFormik.handleChange}
                onBlur={examFormik.handleBlur}
                value={examFormik.values.subject}
                sx={{ borderRadius: '10px' }}
              >
                <MenuItem value={""}>Select Subject</MenuItem>
                {allSubjects &&
                  allSubjects.map((subject, i) => {
                    return (
                      <MenuItem key={i} value={subject._id}>
                        {subject.subject_name}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
            {examFormik.touched.subject && examFormik.errors.subject && (
              <Typography color="error" variant="caption" display="block" sx={{ mt: -1, mb: 1 }}>
                {examFormik.errors.subject}
              </Typography>
            )}

            <TextField
              fullWidth
              sx={{ mb: 2 }}
              label="Exam Type"
              variant="outlined"
              name="exam_type"
              value={examFormik.values.exam_type}
              onChange={examFormik.handleChange}
              onBlur={examFormik.handleBlur}
              placeholder="(1st Semester, 2nd Semester, Half yearly etc)"
              InputProps={{
                sx: { borderRadius: '10px' }
              }}
            />
            {examFormik.touched.exam_type && examFormik.errors.exam_type && (
              <Typography color="error" variant="caption" display="block" sx={{ mt: -1, mb: 1 }}>
                {examFormik.errors.exam_type}
              </Typography>
            )}

            <Box sx={{
              display: 'flex',
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              mt: 3
            }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth={isMobile}
                sx={{
                  borderRadius: '10px',
                  py: 1.2,
                  fontWeight: 600
                }}
              >
                {isEditExam ? 'Update' : 'Submit'}
              </Button>
              <Button
                variant="contained"
                fullWidth={isMobile}
                onClick={cancelEditExam}
                sx={{
                  background: "#f44336",
                  color: "#fff",
                  borderRadius: '10px',
                  py: 1.2,
                  fontWeight: 600,
                  '&:hover': {
                    background: "#d32f2f"
                  }
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      <Paper sx={{
        padding: { xs: "15px", md: "20px" },
        margin: { xs: "8px 0", md: "10px" },
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <Typography
          sx={{
            textAlign: "center",
            mb: 3,
            fontWeight: 700,
            fontSize: { xs: '1.3rem', md: '1.75rem' }
          }}
          variant="h5"
        >
          Scheduled Examinations
        </Typography>

        {/* DESKTOP TABLE VIEW */}
        {!isMobile ? (
          <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: 'none' }}>
            <Table sx={{ minWidth: 650 }} aria-label="examinations table">
              <TableHead>
                <TableRow sx={{ bgcolor: '#1976d2' }}>
                  <TableCell sx={{ fontWeight: "700", color: 'white' }} align="left">
                    Exam Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: "700", color: 'white' }} align="left">
                    Subject
                  </TableCell>
                  <TableCell sx={{ fontWeight: "700", color: 'white' }} align="center">
                    Exam Type
                  </TableCell>
                  <TableCell sx={{ fontWeight: "700", color: 'white' }} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {examinations && examinations.length > 0 ? (
                  examinations.map((examination, i) => (
                    <TableRow key={i} sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                      <TableCell component="th" scope="row">
                        {convertDate(examination.examDate)}
                      </TableCell>
                      <TableCell align="left">
                        {examination.subject?.subject_name || "Add One"}
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={examination.examType} color="primary" size="small" />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<EditIcon />}
                            sx={{
                              background: "#ff9800",
                              '&:hover': { background: "#f57c00" }
                            }}
                            onClick={() => handleEditExam(examination._id)}
                          >
                            Edit
                          </Button>
                          {canDelete && (
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<DeleteIcon />}
                              sx={{
                                background: "#f44336",
                                '&:hover': { background: "#d32f2f" }
                              }}
                              onClick={() => handleDeleteExam(examination._id)}
                            >
                              Delete
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No examinations scheduled yet
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          /* MOBILE CARD VIEW */
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {examinations && examinations.length > 0 ? (
              examinations.map((examination, i) => (
                <Card key={i} sx={{
                  borderRadius: '16px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '1px solid #e0e0e0'
                }}>
                  <CardContent>
                    {/* Date */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <CalendarToday sx={{ color: '#1976d2', fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        Exam Date
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1976d2' }}>
                      {convertDate(examination.examDate)}
                    </Typography>

                    <Divider sx={{ my: 1.5 }} />

                    {/* Subject */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <SubjectIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        Subject
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                      {examination.subject?.subject_name || "Add One"}
                    </Typography>

                    <Divider sx={{ my: 1.5 }} />

                    {/* Exam Type */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <AssessmentIcon sx={{ color: '#ff9800', fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        Exam Type
                      </Typography>
                    </Box>
                    <Chip
                      label={examination.examType}
                      color="primary"
                      sx={{ fontWeight: 600, mb: 2 }}
                    />

                    <Divider sx={{ my: 1.5 }} />

                    {/* Actions */}
                    <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', mt: 2 }}>
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<EditIcon />}
                        sx={{
                          background: "#ff9800",
                          borderRadius: '10px',
                          py: 1.2,
                          fontWeight: 600,
                          '&:hover': { background: "#f57c00" }
                        }}
                        onClick={() => handleEditExam(examination._id)}
                      >
                        Edit Exam
                      </Button>
                      {canDelete && (
                        <Button
                          variant="contained"
                          fullWidth
                          startIcon={<DeleteIcon />}
                          sx={{
                            background: "#f44336",
                            borderRadius: '10px',
                            py: 1.2,
                            fontWeight: 600,
                            '&:hover': { background: "#d32f2f" }
                          }}
                          onClick={() => handleDeleteExam(examination._id)}
                        >
                          Delete Exam
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card sx={{ borderRadius: '16px', textAlign: 'center', py: 4 }}>
                <CardContent>
                  <AssessmentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.3 }} />
                  <Typography variant="body1" color="text.secondary">
                    No examinations scheduled yet
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        )}

        {/* Add Exam Button */}
        <Box sx={{
          display: "flex",
          justifyContent: "center",
          mt: 3
        }}>
          <Button
            variant="contained"
            onClick={handleNewExam}
            startIcon={<AddIcon />}
            sx={{
              borderRadius: '10px',
              px: 4,
              py: 1.5,
              fontWeight: 600,
              fontSize: '1rem',
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
            }}
          >
            Add New Exam
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
