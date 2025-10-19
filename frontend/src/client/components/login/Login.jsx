import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import { Form, useFormik } from "formik";
import { loginSchema } from "../../../yupSchema/loginSchema";
import axios from "axios";
import { baseUrl } from "../../../environment";
import CustomizedSnackbars from "../../../basic utility components/CustomizedSnackbars";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Login.css"
import { AuthContext } from "../../../context/AuthContext";

export default function Login() {
    const { authenticated, login } = useContext(AuthContext);

    const [loginType, setLoginType] =useState("school_owner")
    const [message, setMessage] =  useState("");
    const [type, setType]= useState("succeess");

    const navigate = useNavigate()


    const resetMessage  =()=>{
        setMessage("")
    }
    
    const handleSelection = (e)=>{
        setLoginType(e.target.value)
        resetInitialValue();
      
    }

    const resetInitialValue=()=>{
        Formik.setFieldValue("email","");
        Formik.setFieldValue("password","")
    }

    const initialValues = {
        email: "",
        password:""
    }
    const Formik = useFormik({
        initialValues: initialValues,
        validationSchema: loginSchema,
        onSubmit: (values) => {
            console.log("=== LOGIN ATTEMPT ===")
            console.log("Login values:", values)
            console.log("Login type:", loginType)
            console.log("Base URL:", baseUrl)

            let url;
            let navUrl;
            if(loginType=="school_owner"){
             url = `${baseUrl}/school/login`;
             navUrl='/school'
            }else if(loginType=="teacher"){
                url = `${baseUrl}/teacher/login`
                navUrl='/teacher'
            }else if(loginType=="student"){
                url = `${baseUrl}/student/login`
                navUrl='/student'
            }

                console.log("Full Login URL:", url)

                axios.post(url, {...values}, { withCredentials: true }).then(resp=>{
                    console.log("✅ Login successful:", resp.data)
                    setMessage(resp.data.message)
                    setType("success")
                    let token = resp.headers.authorization || resp.headers.Authorization;
                    if(resp.data.success){
                        if(token){
                            localStorage.setItem("token", token);
                        }
                        localStorage.setItem("user", JSON.stringify(resp.data.user));
                        navigate(navUrl)
                      login(resp.data.user)
                    }
                    Formik.resetForm();
                }).catch(e=>{
                    console.error("❌ Login error:", e)
                    if(e.response){
                        console.error("Error response:", e.response.data)
                        setMessage(e.response.data.message);
                        setType("error")
                    } else if(e.request){
                        console.error("No response received:", e.request)
                        setMessage("Cannot connect to server. Please check if server is running.");
                        setType("error")
                    } else {
                        console.error("Error message:", e.message)
                        setMessage("Network error: " + e.message);
                        setType("error")
                    }
                })
            
           
        }
    })

    return (<Box component={'div'} className="login-container">

 {message && <CustomizedSnackbars reset={resetMessage} type={type} message={message}/>}
   
<Box component={'div'} className="login-content"> 
        <Box className="login-header" component={'div'}>
            <Typography variant="h2" className="login-title">Welcome Back</Typography>
            <Typography variant="body1" className="login-subtitle">Sign in to your account</Typography>
        </Box>
        <Paper className="login-form-paper">
            <Box
                component="form"
                noValidate
                autoComplete="off"
                onSubmit={Formik.handleSubmit}
            >
                 <FormControl sx={{ minWidth: "120px", padding: "5px" }}>
                    <InputLabel id="demo-simple-select-label" >User Type</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Age"
                        value={loginType}
                        onChange={handleSelection}
                    >
                         <MenuItem  value={'school_owner'}>Admin</MenuItem>
                         <MenuItem  value={'teacher'}>Teacher</MenuItem>
                    </Select>
                </FormControl>
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

        
                <Box sx={{ marginTop: "10px" }} component={'div'}>
                    <Button type="submit" sx={{ marginRight: "10px" }} variant="contained">Submit</Button>
                </Box>
            </Box>
        </Paper>
        </Box>
    </Box>)
}