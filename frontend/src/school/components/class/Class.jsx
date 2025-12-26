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
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Table,
  TableContainer,
  IconButton,
} from "@mui/material";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { baseUrl } from "../../../environment";
import CustomizedSnackbars from "../../../basic utility components/CustomizedSnackbars";
import { studentSchema } from "../../../yupSchema/studentSchema";
import StudentCardAdmin from "../../utility components/student card/StudentCard";
import { classSchema } from "../../../yupSchema/classSchema";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Class() {
  const { isSuperAdmin, hasPermission } = useContext(AuthContext);
  const canDelete = isSuperAdmin() || hasPermission('can_delete_records');

  const [studentClass, setStudentClass] = useState([]);
  const [isEdit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);






  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete?")) {
      // Get authentication token
      const token = sessionStorage.getItem("token") || localStorage.getItem("token");
      if (!token) {
        setMessage("Authentication token not found. Please login again.");
        setType("error");
        return;
      }
      
      axios
        .delete(`${baseUrl}/class/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((resp) => {
          setMessage(resp.data.message);
          setType("success");
          fetchstudentsClass(); // Refresh the class list
        })
        .catch((e) => {
          setMessage(e.response?.data?.message || "Error deleting class");
          setType("error");
          console.log("Error, deleting", e);
        });
    }
  };
  const handleEdit = (id) => {
    console.log("Handle  Edit is called", id);
    setEdit(true);
    
    // Get authentication token
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    if (!token) {
      setMessage("Authentication token not found. Please login again.");
      setType("error");
      return;
    }
    
    axios
      .get(`${baseUrl}/class/fetch-single/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((resp) => {
        console.log("Class edit data fetched:", resp.data);
        if (resp.data && resp.data.data) {
          Formik.setFieldValue("class_num", resp.data.data.class_num);
          Formik.setFieldValue("class_text", resp.data.data.class_text);
          setEditId(resp.data.data._id);
        } else {
          setMessage("Class data not found");
          setType("error");
          setEdit(false);
        }
      })
      .catch((e) => {
        console.log("Error in fetching edit data:", e);
        setMessage(e.response?.data?.message || "Error fetching class data");
        setType("error");
        setEdit(false);
      });
  };

  const cancelEdit = () => {
    setEdit(false);
    Formik.resetForm()
  };

  //   MESSAGE
  const [message, setMessage] = useState("");
  const [type, setType] = useState("succeess");

  const resetMessage = () => {
    setMessage("");
  };

  const initialValues = {
    class_num: "",
    class_text:""
  };
  const Formik = useFormik({
    initialValues: initialValues,
    validationSchema: classSchema,
    onSubmit: (values) => {
      // Get authentication token
      const token = sessionStorage.getItem("token") || localStorage.getItem("token");
      if (!token) {
        setMessage("Authentication token not found. Please login again.");
        setType("error");
        return;
      }
      
      if (isEdit) {
        console.log("edit id", editId);
        axios
          .patch(`${baseUrl}/class/update/${editId}`, {
            ...values,
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then((resp) => {
            console.log("Edit submit", resp);
            setMessage(resp.data.message);
            setType("success");
            cancelEdit();
            fetchstudentsClass(); // Refresh the class list
          })
          .catch((e) => {
            setMessage(e.response?.data?.message || "Error updating class");
            setType("error");
            console.log("Error, edit casting submit", e);
          });
      } else {
        // Check for duplicate class before creating
        const isDuplicate = studentClass.some(
          existingClass => 
            existingClass.class_num === parseInt(values.class_num) && 
            existingClass.class_text.toLowerCase() === values.class_text.toLowerCase()
        );
        
        if (isDuplicate) {
          setMessage("This class already exists! Class number and text combination must be unique.");
          setType("error");
          return;
        }
      
        axios
          .post(`${baseUrl}/class/create`,{...values}, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then((resp) => {
            console.log("Response after submitting admin casting", resp);
            setMessage(resp.data.message);
            setType("success");
            fetchstudentsClass(); // Refresh the class list
          })
          .catch((e) => {
            setMessage(e.response?.data?.message || "Error creating class");
            setType("error");
            console.log("Error, response admin casting calls", e);
          });
        Formik.resetForm();
        
      }
    },
  });

  const [month, setMonth] = useState([]);
  const [year, setYear] = useState([]);
  const fetchStudentClass = () => {
    // axios
    //   .get(`${baseUrl}/casting/get-month-year`)
    //   .then((resp) => {
    //     console.log("Fetching month and year.", resp);
    //     setMonth(resp.data.month);
    //     setYear(resp.data.year);
    //   })
    //   .catch((e) => {
    //     console.log("Error in fetching month and year", e);
    //   });
  };

  const fetchstudentsClass = () => {
    axios
      .get(`${baseUrl}/class/fetch-all`)
      .then((resp) => {
        console.log("Fetching data in  Casting Calls  admin.", resp);
        setStudentClass(resp.data.data);
      })
      .catch((e) => {
        console.log("Error in fetching casting calls admin data", e);
      });
  };
  useEffect(() => {
    fetchstudentsClass();
    fetchStudentClass();
  }, [message]);
  return (
    <>
      {message && (
        <CustomizedSnackbars
          reset={resetMessage}
          type={type}
          message={message}
        />
      )}
      <Box
        sx={{ 
          padding: "40px 20px 20px 20px",
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          minHeight: '100vh'
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          component={"div"}
        >
          <Typography 
            className="text-beautify2 hero-text" 
            variant="h2"
            sx={{
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: 3,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            📚 Class Management
          </Typography>
        </Box>

        <Box component={"div"} sx={{ padding: "20px" }}>
          <Paper
            sx={{ 
              padding: "30px", 
              margin: "20px auto",
              maxWidth: "800px",
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            {isEdit ? (
              <Typography
                variant="h4"
                sx={{ 
                  fontWeight: "700", 
                  textAlign: "center",
                  color: '#667eea',
                  marginBottom: 3
                }}
              >
                ✏️ Edit Class
              </Typography>
            ) : (
              <Typography
                variant="h4"
                sx={{ 
                  fontWeight: "700", 
                  textAlign: "center",
                  color: '#667eea',
                  marginBottom: 3
                }}
              >
                ➕ Add New Class
              </Typography>
            )}{" "}
            <Box
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={Formik.handleSubmit}
            >
              

              <TextField
                fullWidth
                sx={{ 
                  marginTop: "20px",
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#667eea',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#667eea',
                  }
                }}
                id="filled-basic"
                label="📝 Class Text"
                variant="outlined"
                name="class_text"
                value={Formik.values.class_text}
                onChange={Formik.handleChange}
                onBlur={Formik.handleBlur}
              />
              {Formik.touched.class_text && Formik.errors.class_text && (
                <p style={{ color: "red", textTransform: "capitalize" }}>
                  {Formik.errors.class_text}
                </p>
              )}


              <TextField
                fullWidth
                sx={{ 
                  marginTop: "20px",
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#667eea',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#667eea',
                  }
                }}
                id="filled-basic"
                label="🔢 Class Number"
                variant="outlined"
                name="class_num"
                value={Formik.values.class_num}
                onChange={Formik.handleChange}
                onBlur={Formik.handleBlur}
              />
              {Formik.touched.class_num && Formik.errors.class_num && (
                <p style={{ color: "red", textTransform: "capitalize" }}>
                  {Formik.errors.class_num}
                </p>
              )}

           
         





              <Box sx={{ marginTop: "30px", display: 'flex', gap: 2 }} component={"div"}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    borderRadius: '12px',
                    padding: '12px 30px',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                    }
                  }}
                >
                  {isEdit ? '✅ Update Class' : '➕ Add Class'}
                </Button>
                {isEdit && (
                  <Button
                    variant="outlined"
                    onClick={cancelEdit}
                    sx={{
                      borderColor: '#667eea',
                      color: '#667eea',
                      borderRadius: '12px',
                      padding: '12px 30px',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: '#5a6fd8',
                        color: '#5a6fd8',
                        background: 'rgba(102, 126, 234, 0.1)',
                      }
                    }}
                  >
                    ❌ Cancel Edit
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        </Box>

      

        <Box sx={{ padding: '20px' }}>
          <Typography 
            variant="h4" 
            sx={{ 
              textAlign: 'center', 
              marginBottom: 3,
              color: '#667eea',
              fontWeight: 600
            }}
          >
            📋 Class List
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
            gap: 3,
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {studentClass.map((value,i) => (
              <Paper 
                key={value._id} 
                sx={{ 
                  p: 3, 
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.25)',
                  }
                }}
              >
                <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: '#667eea', 
                      fontWeight: 700,
                      marginBottom: 1
                    }}
                  >
                    📚 {value.class_text}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#764ba2', 
                      fontWeight: 500,
                      background: 'linear-gradient(45deg, #667eea20, #764ba220)',
                      padding: '8px 16px',
                      borderRadius: '12px',
                      display: 'inline-block'
                    }}
                  >
                    Class {value.class_num}
                  </Typography>
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: 2,
                  marginTop: 2
                }}>
                  <IconButton
                    onClick={() => handleEdit(value._id)}
                    sx={{
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      color: 'white',
                      borderRadius: '12px',
                      padding: '12px',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                        transform: 'scale(1.1)',
                      }
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  {canDelete && (
                    <IconButton
                      onClick={() => handleDelete(value._id)}
                      sx={{
                        background: 'linear-gradient(45deg, #ff6b6b 30%, #ee5a52 90%)',
                        color: 'white',
                        borderRadius: '12px',
                        padding: '12px',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #ff5252 30%, #d32f2f 90%)',
                          transform: 'scale(1.1)',
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
}
