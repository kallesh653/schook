/* eslint-disable react/no-children-prop */
import("./css/button.css");
import("./css/text.css");
import("./css/mobile.css");

import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import Client from "./client/Client";
import Contact from "./client/components/contact/Contact";
import Login from "./client/components/login/Login";
import StudentLogin from "./client/components/login/StudentLogin";
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
import QuestionPaperGenerator from "./teacher/components/exam/QuestionPaperGenerator";
import TeacherMarksEntry from "./teacher/components/marks/TeacherMarksEntry";
import StudentResults from "./student/components/results/StudentResults";
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
import PublicHomePage from "./client/components/public-home/PublicHomePage";
import ProtectedWebsiteBuilder from "./website-builder/ProtectedWebsiteBuilder";
import TransportFees from "./school/components/transport/TransportFees";
import MarkSheetGenerator from "./school/components/marksheet/MarkSheetGenerator";
import FinalMarkSheet from "./school/components/marksheet/FinalMarkSheet";
import SmsManagement from "./school/components/sms/SmsManagement";
import SmsToParents from "./school/components/sms/SmsToParents";
import AcademicYear from "./school/components/academic-year/AcademicYear";
import AdminManagement from "./school/components/admin-management/AdminManagement";
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
            
          <Route path="school"  element={<ProtectedRoute allowedRoles={['SCHOOL', 'SUPER_ADMIN', 'ADMIN']}><School/></ProtectedRoute>}>
              <Route index element={<SchoolDashboard />} />
              <Route path="courses" element={<Courses />} />
              <Route path="class" element={<Class />} />
              <Route path="class-details" element={<ClassDetails />} />
              <Route path="subject" element={<Subject />} />
              <Route path="students" element={<Students />} />
              <Route path="teachers" element={<Teachers />} />
              <Route path="assign-period" element={<AssignPeriod2 />} />
              <Route path="periods" element={<Schedule />} />
              <Route path="attendance" element={<StudentAttendanceList />} />
              <Route path="attendance-report" element={<AttendanceReport />} />
              <Route path="attendance-student/:studentId" element={<AttendanceDetails />} />
              <Route path="examinations" element={<Examinations />} />
              <Route path="transport-fees" element={<TransportFees />} />
              <Route path="marksheets" element={<MarkSheetGenerator />} />
              <Route path="final-marksheet" element={<FinalMarkSheet />} />
              <Route path="sms" element={<SmsManagement />} />
              <Route path="sms-to-parents" element={<SmsToParents />} />
              <Route path="notice" element={<NoticeSchool/>} />
              <Route path="academic-year" element={<AcademicYear />} />
              <Route path="admin-management" element={<AdminManagement />} />
            </Route>
  
            <Route path="student"  element={<ProtectedRoute allowedRoles={['STUDENT']}><Student/></ProtectedRoute>}>
              <Route index element={<StudentDetails />}/>
              <Route path="student-details" element={<StudentDetails />} />
              <Route path="app" element={<StudentApp />} />
              <Route path="examinations" element={<StudentExaminations />} />
              <Route path="results" element={<StudentResults />} />
              <Route path='periods' element={<ScheduleStudent/>} />
              <Route path="attendance" element={<AttendanceStudent />} />
              <Route path="notice" element={<NoticeStudent/>} />
            </Route>
  
            <Route path="teacher"  element={<ProtectedRoute allowedRoles={['TEACHER']}><Teacher/></ProtectedRoute>}>
              <Route index element={<TeacherDetails />}/>
              <Route path="details" element={<TeacherDetails />} />
              <Route path="examinations" element={<TeacherExaminations />} />
              <Route path="marks-entry" element={<TeacherMarksEntry />} />
              <Route path="question-paper" element={<QuestionPaperGenerator />} />
              <Route path="periods" element={<TeacherSchedule />} />
              {/* <Route path='sub-teach' element={<StudentSubjectTeacher/>} /> */}
              <Route path="attendance" element={<AttendanceTeacher />} />
              <Route path="notice" element={<NoticeTeacher/>} />
            </Route>
  
            {/* Standalone Website Builder with Login Protection */}
            <Route path="/website-builder" element={<ProtectedWebsiteBuilder />} />

            {/* Public routes with Client wrapper (includes Navbar) */}
            <Route path="/" element={<Client />}>
              <Route index element={<Navigate to="/home" replace />} />
              <Route path="home" element={<PublicHomePage />} />
              <Route path="contact" element={<Contact />} />
              <Route path="login" element={<Login />} />
              <Route path="student-login" element={<StudentLogin />} />
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
