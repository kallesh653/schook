require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser  = require("cookie-parser");
const mongoose = require("mongoose");

// ROUTERS
const schoolRouter = require("./router/school.router")
const studentRouter = require("./router/student.router")
const classRouter = require("./router/class.router")
const subjectRouter = require("./router/subject.router")
const courseRouter = require("./router/course.router")
const teacherRouter = require('./router/teacher.router')
const examRouter =  require('./router/examination.router')
const attendanceRoutes = require('./router/attendance.router');
const periodRoutes = require("./router/period.router");
const noticeRoutes = require("./router/notice.router");
const feesRoutes = require("./router/fees.router");
const studentRecordRouter = require('./router/studentRecord.router');
const frontPageRouter = require('./router/frontPage.router');
const marksheetRouter = require('./router/marksheet.router');
const smsRouter = require('./router/sms.router');
const authMiddleware = require("./auth/auth");
const { authCheck } = require("./controller/auth.controller");

const app = express();

// middleware 
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
  exposedHeaders: ["Authorization"]
}
app.use(cors(corsOptions));

// MONGODB CONNECTION
mongoose.connect(process.env.MONGODB_URI).then(db=>{
    console.log("MongoDB Atlas is Connected Successfully.")
}).catch(e=>{
    console.log("MongoDB Connection Error:",e)
})



app.use("/api/school", schoolRouter)
app.use("/api/student", studentRouter)
app.use("/api/teacher", teacherRouter)
app.use("/api/class", classRouter)
app.use("/api/subject", subjectRouter)
app.use("/api/course", courseRouter)

app.use('/api/examination', examRouter)
app.use('/api/attendance', attendanceRoutes)
app.use('/api/period',  periodRoutes)
app.use('/api/notices', noticeRoutes)
app.use('/api/fees', feesRoutes)
app.use("/api/student-records", studentRecordRouter);
app.use("/api/front-page", frontPageRouter);
app.use("/api/marksheets", marksheetRouter);
app.use("/api/sms", smsRouter);

app.get('/api/auth/check',authCheck)


const PORT = 9000;
app.listen(PORT, ()=>{
    console.log("Server is running at port =>",PORT)
})