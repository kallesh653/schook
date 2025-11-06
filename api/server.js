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
// const feesRoutes = require("./router/fees.router"); // REMOVED - Fees management completely removed
const transportFeesRouter = require('./routes/transportFees.routes');
const frontPageRouter = require('./router/frontPage.router');
const publicHomePageRouter = require('./router/publicHomePage.router');
const marksheetRouter = require('./router/marksheet.router');
const smsRouter = require('./router/sms.router');
const academicYearRouter = require('./router/academicYear.router');
const adminUserRouter = require("./router/adminUser.router");
const authMiddleware = require("./auth/auth");
const { authCheck } = require("./controller/auth.controller");

const app = express();

// middleware - increased payload size for image and video uploads
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(cookieParser());
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:3000',
    'http://schoolm.gentime.in',
    'https://schoolm.gentime.in',
    'http://www.schoolm.gentime.in',
    'https://www.schoolm.gentime.in',
    'http://api.gentime.in',
    'https://api.gentime.in',
    'http://72.60.202.218',
    process.env.FRONTEND_URL || 'http://localhost:5173',
    process.env.PRODUCTION_URL || 'http://localhost:5173'
  ],
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
// app.use('/api/fees', feesRoutes) // REMOVED - Fees management completely removed
app.use('/api/transport-fees', transportFeesRouter)
app.use("/api/front-page", frontPageRouter);
app.use("/api/public-home", publicHomePageRouter);
app.use("/api/marksheets", marksheetRouter);
app.use("/api/sms", smsRouter);
app.use("/api/academic-year", academicYearRouter);
app.use("/api/admin", adminUserRouter);

// Serve static files for uploads
app.use('/uploads', express.static('uploads'));

app.get('/api/auth/check',authCheck)


const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log("Server is running at port =>",PORT)
    console.log("✅ All routes loaded with updated permissions")
})