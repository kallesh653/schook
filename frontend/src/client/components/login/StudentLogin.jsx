import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { loginSchema } from "../../../yupSchema/loginSchema";
import axios from "axios";
import { baseUrl } from "../../../environment";
import CustomizedSnackbars from "../../../basic utility components/CustomizedSnackbars";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Login.css"
import { AuthContext } from "../../../context/AuthContext";

export default function StudentLogin() {
    const { authenticated, login } = useContext(AuthContext);

    const [message, setMessage] = useState("");
    const [type, setType] = useState("success");

    const navigate = useNavigate()

    const resetMessage = () => {
        setMessage("")
    }

    const initialValues = {
        email: "",
        password: ""
    }

    const Formik = useFormik({
        initialValues: initialValues,
        validationSchema: loginSchema,
        onSubmit: (values) => {
            console.log("Student Login Formik values", values)
            const url = `${baseUrl}/student/login`;
            const navUrl = '/student';

            axios.post(url, { ...values }, { withCredentials: true }).then(resp => {
                setMessage(resp.data.message)
                setType("success")
                let token = resp.headers.authorization || resp.headers.Authorization;
                if (resp.data.success) {
                    if (token) {
                        localStorage.setItem("token", token);
                    }
                    localStorage.setItem("user", JSON.stringify(resp.data.user));
                    navigate(navUrl)
                    login(resp.data.user)
                }
                Formik.resetForm();
            }).catch(e => {
                if (e.response) {
                    setMessage(e.response.data.message);
                    setType("error")
                    console.log("Error in student login submit", e.response.data.message)
                } else {
                    setMessage("Network error. Please check your connection.");
                    setType("error")
                    console.log("Network error in student login", e.message)
                }
            })
        }
    })

    return (
        <Box component={'div'} className="login-container">
            {message && <CustomizedSnackbars reset={resetMessage} type={type} message={message} />}

            <Box component={'div'} className="login-content">
                <Box className="login-header" component={'div'}>
                    <Typography variant="h2" className="login-title" sx={{
                        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Student Portal
                    </Typography>
                    <Typography variant="body1" className="login-subtitle">Sign in to access your account</Typography>
                </Box>
                <Paper className="login-form-paper">
                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                        onSubmit={Formik.handleSubmit}
                    >
                        <TextField fullWidth sx={{ marginTop: "10px" }} id="outlined-basic"
                            label="Email" variant="outlined"
                            name="email"
                            value={Formik.values.email}
                            onChange={Formik.handleChange}
                            onBlur={Formik.handleBlur} />
                        {Formik.touched.email && Formik.errors.email && <p style={{ color: "red", textTransform: "capitalize" }}>{Formik.errors.email}</p>}


                        <TextField fullWidth sx={{ marginTop: "10px" }} id="filled-basic"
                            label="Password"
                            type="password" variant="outlined" name="password"
                            value={Formik.values.password}
                            onChange={Formik.handleChange}
                            onBlur={Formik.handleBlur} />
                        {Formik.touched.password && Formik.errors.password && <p style={{ color: "red", textTransform: "capitalize" }}>{Formik.errors.password}</p>}


                        <Box sx={{ marginTop: "10px", display: 'flex', gap: 2 }} component={'div'}>
                            <Button type="submit" variant="contained" sx={{
                                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #38f9d7 0%, #43e97b 100%)',
                                }
                            }}>Submit</Button>
                            <Button variant="outlined" onClick={() => navigate('/')}>Back to Home</Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Box>
    )
}
