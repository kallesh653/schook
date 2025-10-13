/* eslint-disable react/no-children-prop */
import("./css/button.css");
import("./css/text.css");
import("./css/mobile.css");

import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import Client from "./client/Client";
import Home from "./client/components/home/Home";
import Contact from "./client/components/contact/Contact";
import Login from "./client/components/login/Login";
import Register from "./client/components/register/Register";

import Logout from "./client/components/logout/Logout";
import School from "./school/School";
import SchoolDashboard from "./school/components/dashboard/SchoolDashboard";
import Class from "./school/components/class/Class";
import Students from "./school/components/students/Students";
import Teachers from "./school/components/teachers/Teachers";
import Subject from "./school/components/subjects/Subjects";
import Courses from "./school/components/courses/Courses";
import ClassDetails from "./school/components/class details/ClassDetails";
import StudentDetails from "./student/components/student details/StudentDetails";
import StudentApp from "./student/components/student details/StudentApp";
import Student from "./student/Student";
import StudentExaminations from "./student/components/examination/StudentExaminations";
import Teacher from "./teacher/Teacher";
import TeacherDetails from "./teacher/components/teacher details/TeacherDetails";
import TeacherExaminations from "./teacher/components/teacher examinations/TeacherExaminations";
import TeacherSchedule from "./teacher/components/periods/TeacherSchedule";
import AssignPeriod2 from "./school/components/assign period/AssignPeriod2";
import AttendanceDetails from "./school/components/attendance/attendance details/AttendanceDetails";
import StudentAttendanceList from "./school/components/attendance/StudentAttendanceList";
import AttendanceReport from "./school/components/attendance/AttendanceReport";
import Schedule from "./school/components/periods/Schedule";
import Examinations from "./school/components/examinations/Examinations";
import AttendanceTeacher from "./teacher/components/attendance/AttendanceTeacher";
import AttendanceStudent from "./student/components/attendance/AttendanceStudent";
import ScheduleStudent from "./student/components/schedule/ScheduleStudent";
import NoticeSchool from "./school/components/notice/NoticeSchool";
import NoticeTeacher from "./teacher/components/notice/Notice";
import NoticeStudent from "./student/components/notice/NoticeStudent";
import StudentRecords from "./school/components/student-records/StudentRecords";
import FrontPageManagement from "./school/components/front-page-management/FrontPageManagement";
import PublicHomePageManagement from "./school/components/public-home-management/PublicHomePageManagement";
import FeesManagement from "./school/components/fees/FeesManagement";
import MarkSheetGenerator from "./school/components/marksheet/MarkSheetGenerator";
import SmsManagement from "./school/components/sms/SmsManagement";
import ProtectedRoute from "./guards/ProtectedRoute";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "@emotion/react";
import lightTheme from "./basic utility components/lightTheme";
import { useContext, useEffect, useState } from "react";

function App() {
  const { authenticated, login } = useContext(AuthContext);

    return (
      <>
       <ThemeProvider theme={lightTheme}>
        <BrowserRouter>
          <Routes>
            
          <Route path="school"  element={<ProtectedRoute allowedRoles={['SCHOOL']}><School/></ProtectedRoute>}>
              <Route index element={<SchoolDashboard />} />
              <Route path="front-page" element={<FrontPageManagement />} />
              <Route path="public-home" element={<PublicHomePageManagement />} />
              <Route path="courses" element={<Courses />} />
              <Route path="class" element={<Class />} />
              <Route path="class-details" element={<ClassDetails />} />
              <Route path="subject" element={<Subject />} />
              <Route path="students" element={<Students />} />
              <Route path="teachers" element={<Teachers />} />
              <Route path="student-records" element={<StudentRecords />} />
              <Route path="assign-period" element={<AssignPeriod2 />} />
              <Route path="periods" element={<Schedule />} />
              <Route path="attendance" element={<StudentAttendanceList />} />
              <Route path="attendance-report" element={<AttendanceReport />} />
              <Route path="attendance-student/:studentId" element={<AttendanceDetails />} />
              <Route path="examinations" element={<Examinations />} />
              <Route path="fees" element={<FeesManagement />} />
              <Route path="marksheets" element={<MarkSheetGenerator />} />
              <Route path="sms" element={<SmsManagement />} />
              <Route path="notice" element={<NoticeSchool/>} />
            </Route>
  
            <Route path="student"  element={<ProtectedRoute allowedRoles={['STUDENT']}><Student/></ProtectedRoute>}>
              <Route index element={<StudentDetails />}/>
              <Route path="student-details" element={<StudentDetails />} />
              <Route path="app" element={<StudentApp />} />
              <Route path="examinations" element={<StudentExaminations />} />
              <Route path='periods' element={<ScheduleStudent/>} />
              <Route path="attendance" element={<AttendanceStudent />} />
              <Route path="notice" element={<NoticeStudent/>} />
            </Route>
  
            <Route path="teacher"  element={<ProtectedRoute allowedRoles={['TEACHER']}><Teacher/></ProtectedRoute>}>
              <Route index element={<TeacherDetails />}/>
              <Route path="details" element={<TeacherDetails />} />
              <Route path="examinations" element={<TeacherExaminations />} />
              <Route path="periods" element={<TeacherSchedule />} />
              {/* <Route path='sub-teach' element={<StudentSubjectTeacher/>} /> */}
              <Route path="attendance" element={<AttendanceTeacher />} />
              <Route path="notice" element={<NoticeTeacher/>} />
            </Route>
  
            <Route path="/" element={<Client />}>
              <Route index element={<Navigate to="/home" replace />} />
              <Route path="home" element={<Home />} />
              <Route path="contact" element={<Contact />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="logout" element={<Logout />} />
            </Route>
          </Routes>
        </BrowserRouter>
        </ThemeProvider>
      
      
      </>
    );
  
  }


export default App;
