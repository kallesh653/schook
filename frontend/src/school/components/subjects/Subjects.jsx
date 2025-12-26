/* eslint-disable react-hooks/exhaustive-deps */
import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
    TableBody,
    TableCell,
    TableRow,
    TableHead,
    Table,
    TableContainer,
  } from "@mui/material";
  import dayjs from "dayjs";
  import { useFormik } from "formik";
  import { useEffect, useState, useContext } from "react";
  import axios from "axios";
  import { baseUrl } from "../../../environment";
  import CustomizedSnackbars from "../../../basic utility components/CustomizedSnackbars";
  import { subjectSchema } from "../../../yupSchema/subjectSchema";
  import { AuthContext } from "../../../context/AuthContext";
  
  export default function Subject() {
    const { isSuperAdmin, hasPermission } = useContext(AuthContext);
    const canDelete = isSuperAdmin() || hasPermission('can_delete_records');

    const [studentSubject, setStudentSubject] = useState([]);
    const [isEdit, setEdit] = useState(false);
    const [editId, setEditId] = useState(null);
  
  
   
  
    
  
    const handleDelete = (id) => {
      if (confirm("Are you sure you want to delete?")) {
        axios
          .delete(`${baseUrl}/subject/delete/${id}`)
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
      
      // Get authentication token
      const token = sessionStorage.getItem("token") || localStorage.getItem("token");
      if (!token) {
        setMessage("Authentication token not found. Please login again.");
        setType("error");
        return;
      }
      
      axios.get(`${baseUrl}/subject/fetch-single/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((resp) => {
          console.log("Subject edit data fetched:", resp.data);
          if (resp.data && resp.data.data) {
            Formik.setFieldValue("subject_name", resp.data.data.subject_name);
            Formik.setFieldValue("subject_codename", resp.data.data.subject_codename);
            setEditId(resp.data.data._id);
          } else {
            setMessage("Subject data not found");
            setType("error");
            setEdit(false);
          }
        })
        .catch((e) => {
          console.log("Error in fetching edit data:", e);
          setMessage(e.response?.data?.message || "Error fetching subject data");
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
      subject_name: "",
      subject_codename:""
    };
    const Formik = useFormik({
      initialValues: initialValues,
      validationSchema: subjectSchema,
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
            .patch(`${baseUrl}/subject/update/${editId}`, {
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
              fetchstudentssubject(); // Refresh the subject list
            })
            .catch((e) => {
              setMessage(e.response?.data?.message || "Error updating subject");
              setType("error");
              console.log("Error, edit casting submit", e);
            });
        } else {
        
            axios
              .post(`${baseUrl}/subject/create`,{...values}, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              })
              .then((resp) => {
                console.log("Response after submitting admin casting", resp);
                setMessage(resp.data.message);
                setType("success");
                fetchstudentssubject(); // Refresh the subject list
              })
              .catch((e) => {
                setMessage(e.response?.data?.message || "Error creating subject");
                setType("error");
                console.log("Error, response admin casting calls", e);
              });
            Formik.resetForm();
          
        }
      },
    });
  
    const [month, setMonth] = useState([]);
    const [year, setYear] = useState([]);
    const fetchStudentSubject = () => {
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
  
    const fetchstudentssubject = () => {
      axios
        .get(`${baseUrl}/subject/fetch-all`)
        .then((resp) => {
          console.log("Fetching data in  Casting Calls  admin.", resp);
          setStudentSubject(resp.data.data);
        })
        .catch((e) => {
          console.log("Error in fetching casting calls admin data", e);
        });
    };
    useEffect(() => {
      fetchstudentssubject();
      fetchStudentSubject();
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
              className="hero-text" 
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
              📖 Subject Management
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
                  ✏️ Edit Subject
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
                  ➕ Add New Subject
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
                  label="📚 Subject Name"
                  variant="outlined"
                  name="subject_name"
                  value={Formik.values.subject_name}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                />
                {Formik.touched.subject_name && Formik.errors.subject_name && (
                  <p style={{ color: "red", textTransform: "capitalize" }}>
                    {Formik.errors.subject_name}
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
                  label="🔤 Subject Code"
                  variant="outlined"
                  name="subject_codename"
                  value={Formik.values.subject_codename}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                />
                {Formik.touched.subject_codename && Formik.errors.subject_codename && (
                  <p style={{ color: "red", textTransform: "capitalize" }}>
                    {Formik.errors.subject_codename}
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
                    {isEdit ? '✅ Update Subject' : '➕ Add Subject'}
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
              📋 Subject List
            </Typography>
            
            <TableContainer 
              component={Paper}
              sx={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                maxWidth: '1200px',
                margin: '0 auto'
              }}
            >
              <Table sx={{ minWidth: 650 }} aria-label="subjects table">
                <TableHead>
                  <TableRow sx={{ background: 'linear-gradient(45deg, #667eea20, #764ba220)' }}>
                    <TableCell 
                      component="th" 
                      scope="row"
                      sx={{ 
                        fontWeight: 700, 
                        color: '#667eea',
                        fontSize: '1.1rem'
                      }}
                    >
                      📚 Subject Name
                    </TableCell>
                    <TableCell 
                      align="right"
                      sx={{ 
                        fontWeight: 700, 
                        color: '#667eea',
                        fontSize: '1.1rem'
                      }}
                    >
                      🔤 Code
                    </TableCell>
                    <TableCell 
                      align="right"
                      sx={{ 
                        fontWeight: 700, 
                        color: '#667eea',
                        fontSize: '1.1rem'
                      }}
                    >
                      📄 Details
                    </TableCell>
                    <TableCell 
                      align="right"
                      sx={{ 
                        fontWeight: 700, 
                        color: '#667eea',
                        fontSize: '1.1rem'
                      }}
                    >
                      ⚡ Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentSubject.map((value,i) => (
                    <TableRow
                      key={i}
                      sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        '&:hover': {
                          background: 'rgba(102, 126, 234, 0.05)',
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <TableCell 
                        component="th" 
                        scope="row"
                        sx={{ 
                          fontWeight: 600,
                          color: '#333',
                          fontSize: '1rem'
                        }}
                      >
                        {value.subject_name}
                      </TableCell>
                      <TableCell 
                        align="right"
                        sx={{ 
                          fontWeight: 500,
                          color: '#764ba2',
                          fontSize: '0.95rem'
                        }}
                      >
                        {value.subject_codename}
                      </TableCell>
                      <TableCell 
                        align="right"
                        sx={{ 
                          color: '#666',
                          fontSize: '0.9rem'
                        }}
                      >
                        View Details
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'end', gap: 1 }}>
                          <Button
                            variant='contained'
                            size="small"
                            sx={{
                              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                              borderRadius: '8px',
                              textTransform: 'none',
                              fontWeight: 600,
                              '&:hover': {
                                background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                                transform: 'scale(1.05)',
                              }
                            }}
                            onClick={() => handleEdit(value._id)}
                          >
                            ✏️ Edit
                          </Button>
                          {canDelete && (
                            <Button
                              variant='contained'
                              size="small"
                              sx={{
                                background: 'linear-gradient(45deg, #ff6b6b 30%, #ee5a52 90%)',
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': {
                                  background: 'linear-gradient(45deg, #ff5252 30%, #d32f2f 90%)',
                                  transform: 'scale(1.05)',
                                }
                              }}
                              onClick={() => handleDelete(value._id)}
                            >
                              🗑️ Delete
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </>
    );
  }