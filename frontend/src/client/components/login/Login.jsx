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

    const [loginType, setLoginType] =useState("student")
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
            console.log("Login Formik values", values)
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
                axios.post(url, {...values}, { withCredentials: true }).then(resp=>{
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
                    if(e.response){
                        setMessage(e.response.data.message);
                        setType("error")
                        console.log("Error in login submit", e.response.data.message)
                    } else {
                        setMessage("Network error. Please check your connection.");
                        setType("error")
                        console.log("Network error in login", e.message)
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
                       
                        <MenuItem value={"student"}>Student</MenuItem>
                         <MenuItem  value={'teacher'}>Teacher</MenuItem>
                         <MenuItem  value={'school_owner'}>School Owner</MenuItem>
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