# GENTIME SCHOOL MANAGEMENT SYSTEM
## COMPLETE TECHNICAL DOCUMENTATION
### By Kallesh SK

---

**Version:** 2.0.0
**Last Updated:** October 14, 2025
**Author:** Kallesh SK
**License:** MIT

---

## TABLE OF CONTENTS

### PART 1: PROJECT OVERVIEW
1.1 Introduction and Features
1.2 Technology Stack
1.3 System Architecture
1.4 Directory Structure
1.5 Live Deployment URLs

### PART 2: JAVASCRIPT FUNDAMENTALS
2.1 JavaScript Basics
2.2 ES6+ Features Used in Project
2.3 Asynchronous JavaScript
2.4 Module System (CommonJS vs ES6)
2.5 Promises and Async/Await

### PART 3: NODE.JS & EXPRESS BACKEND
3.1 What is Node.js?
3.2 Express.js Framework
3.3 Server Setup and Configuration
3.4 Middleware Explained
3.5 Request-Response Cycle
3.6 Environment Variables
3.7 File Upload Handling

### PART 4: REACT FRONTEND
4.1 What is React?
4.2 Components and JSX
4.3 Hooks (useState, useEffect, useContext)
4.4 React Router DOM
4.5 Context API for State Management
4.6 Material-UI (MUI) Components
4.7 Form Handling with Formik

### PART 5: MONGODB DATABASE
5.1 NoSQL Database Concepts
5.2 MongoDB vs SQL Databases
5.3 Mongoose ODM
5.4 Schema Definition
5.5 Model Methods
5.6 Relationships and Population
5.7 Indexes and Performance

### PART 6: BACKEND ARCHITECTURE IN DETAIL
6.1 MVC Pattern Implementation
6.2 All Database Models Explained
6.3 All Controllers Explained
6.4 All Routes Explained
6.5 Authentication System (JWT)
6.6 Authorization Middleware
6.7 CRUD Operations

### PART 7: FRONTEND ARCHITECTURE IN DETAIL
7.1 Component Hierarchy
7.2 Routing Structure
7.3 Protected Routes
7.4 Authentication Flow
7.5 API Integration (Axios)
7.6 Form Validation (Yup)
7.7 All Major Components Explained

### PART 8: FRONTEND-BACKEND CONNECTION
8.1 How Frontend Connects to Backend
8.2 API Calls with Axios
8.3 Request Interceptors
8.4 Token Management
8.5 CORS Configuration
8.6 Error Handling
8.7 Data Flow Diagrams

### PART 9: COMPLETE API DOCUMENTATION
9.1 Authentication Endpoints
9.2 School Management Endpoints
9.3 Student Management Endpoints
9.4 Teacher Management Endpoints
9.5 Class & Subject Endpoints
9.6 Attendance Endpoints
9.7 Examination Endpoints
9.8 Fees Management Endpoints
9.9 SMS Management Endpoints
9.10 Notice Board Endpoints

### PART 10: FEATURE MODULES EXPLAINED
10.1 User Authentication & Authorization
10.2 School Dashboard
10.3 Student Management
10.4 Teacher Management
10.5 Class & Subject Management
10.6 Attendance System
10.7 Examination System
10.8 Fees Management
10.9 Student Records
10.10 SMS Integration
10.11 Notice Board
10.12 Marksheet Generation

### PART 11: SQL DATABASE INTEGRATION GUIDE
11.1 SQL vs NoSQL Comparison
11.2 Installing MySQL/PostgreSQL
11.3 Sequelize ORM Setup
11.4 Converting MongoDB Schemas to SQL
11.5 Migration Strategy
11.6 Dual Database Support

### PART 12: AI FEATURES INTEGRATION
12.1 Python Integration with Node.js
12.2 Setting Up Python Virtual Environment
12.3 Flask API for Python
12.4 AI Feature Ideas for School Management
12.5 Student Performance Prediction
12.6 Attendance Pattern Analysis
12.7 Automated Report Generation
12.8 Chatbot Integration
12.9 Image Recognition for Attendance

### PART 13: FILE STRUCTURE & CONNECTIONS
13.1 Complete File Map
13.2 File Connection Diagrams
13.3 Function Call Flow
13.4 Data Flow Between Files
13.5 Component Dependencies

### PART 14: ADVANCED TOPICS
14.1 Security Best Practices
14.2 Performance Optimization
14.3 Error Handling Strategies
14.4 Testing (Unit & Integration)
14.5 Deployment Strategies
14.6 Scaling the Application

### PART 15: DEVELOPMENT WORKFLOW
15.1 Setting Up Development Environment
15.2 Running the Project Locally
15.3 Debugging Techniques
15.4 Git Workflow
15.5 Version Control Best Practices

### PART 16: REFERENCE & RESOURCES
16.1 Library Documentation Links
16.2 Common Error Solutions
16.3 Useful Commands Cheatsheet
16.4 Further Learning Resources

---

# PART 1: PROJECT OVERVIEW

## 1.1 Introduction and Features

**GenTime School Management System** is a full-stack MERN (MongoDB, Express, React, Node.js) web application designed to digitize and streamline school operations.

### Key Features:

**For School Administrators:**
- Dashboard with real-time statistics
- Student registration and management
- Teacher management
- Class and subject organization
- Course management
- Attendance tracking
- Examination management
- Fee collection and tracking
- Student records (comprehensive profiles)
- SMS notification system
- Notice board
- Marksheet generation
- Front-page management (public website)
- Public homepage customization

**For Teachers:**
- Personal dashboard
- View assigned classes and subjects
- Mark attendance
- Schedule management (periods)
- Examination management
- View and post notices
- Student information access

**For Students:**
- Personal profile dashboard
- View attendance records
- Check examination schedules
- View notices
- See class schedule/timetable
- View marksheets
- Fee status

### User Roles:
1. **SCHOOL** - School administrators/owners
2. **TEACHER** - Teaching staff
3. **STUDENT** - Students

## 1.2 Technology Stack

### Backend:
- **Runtime:** Node.js v18+
- **Framework:** Express.js v4.19.2
- **Database:** MongoDB Atlas (Cloud)
- **ODM:** Mongoose v8.6.1
- **Authentication:** JWT (jsonwebtoken v9.0.2)
- **Password Hashing:** bcryptjs v2.4.3
- **File Upload:** formidable v3.5.1
- **CORS:** cors v2.8.5
- **Environment:** dotenv v16.4.5
- **HTTP Client:** axios v1.12.1
- **Date/Time:** moment v2.30.1
- **Dev Server:** nodemon v3.1.4

### Frontend:
- **Framework:** React v18.3.1
- **Build Tool:** Vite v5.4.1
- **UI Library:** Material-UI (MUI) v6.0.1
- **Icons:** MUI Icons v6.0.1
- **Routing:** React Router DOM v6.26.1
- **State Management:** Redux Toolkit v2.2.7, React Redux v9.1.2
- **HTTP Client:** axios v1.7.7
- **Form Handling:** Formik v2.4.6
- **Form Validation:** Yup v1.4.0
- **Charts:** Chart.js v4.4.5, react-chartjs-2 v5.2.0
- **Date Picker:** MUI X Date Pickers v7.16.0
- **Calendar:** react-big-calendar v1.15.0
- **Excel Export:** xlsx v0.18.5
- **Date Library:** dayjs v1.11.13, moment v2.30.1

### Database:
- **MongoDB Atlas** (Cloud-hosted NoSQL database)
- Connection via Mongoose ODM

### Deployment:
- **VPS:** Ubuntu 24.04 LTS (IP: 72.60.202.218)
- **Process Manager:** PM2
- **Web Server:** Nginx
- **SSL:** Let's Encrypt (Certbot)
- **Domains:**
  - Frontend: https://www.schoolm.gentime.in
  - Backend API: https://api.gentime.in/api

## 1.3 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                          │
│                    (React SPA - Port 443)                       │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                      NGINX WEB SERVER                           │
│              (Reverse Proxy + SSL Termination)                  │
└─────────────┬───────────────────────────┬───────────────────────┘
              │                           │
    Frontend  │                           │  API Proxy
              ↓                           ↓
┌──────────────────────┐    ┌─────────────────────────────────────┐
│  Static Files        │    │   EXPRESS.JS BACKEND                │
│  (React Build)       │    │   (Node.js - Port 5000)             │
│  /var/www/schoolm/   │    │                                     │
│  frontend/dist/      │    │   ┌──────────────────────────────┐  │
└──────────────────────┘    │   │  MIDDLEWARE LAYER            │  │
                            │   │  - CORS                      │  │
                            │   │  - Body Parser               │  │
                            │   │  - Cookie Parser             │  │
                            │   │  - JWT Auth Middleware       │  │
                            │   └──────────┬───────────────────┘  │
                            │              ↓                      │
                            │   ┌──────────────────────────────┐  │
                            │   │  ROUTER LAYER                │  │
                            │   │  - School Routes             │  │
                            │   │  - Student Routes            │  │
                            │   │  - Teacher Routes            │  │
                            │   │  - Class Routes              │  │
                            │   │  - Attendance Routes         │  │
                            │   │  - etc...                    │  │
                            │   └──────────┬───────────────────┘  │
                            │              ↓                      │
                            │   ┌──────────────────────────────┐  │
                            │   │  CONTROLLER LAYER            │  │
                            │   │  - Business Logic            │  │
                            │   │  - Data Validation           │  │
                            │   │  - File Processing           │  │
                            │   └──────────┬───────────────────┘  │
                            │              ↓                      │
                            │   ┌──────────────────────────────┐  │
                            │   │  MODEL LAYER (Mongoose)      │  │
                            │   │  - Data Schemas              │  │
                            │   │  - Validation Rules          │  │
                            │   │  - Relationships             │  │
                            │   └──────────┬───────────────────┘  │
                            └──────────────┼───────────────────────┘
                                          │ MongoDB Driver
                                          ↓
                            ┌─────────────────────────────────────┐
                            │      MONGODB ATLAS                  │
                            │      (Cloud Database)               │
                            │                                     │
                            │  Collections:                       │
                            │  - schools                          │
                            │  - students                         │
                            │  - teachers                         │
                            │  - classes                          │
                            │  - subjects                         │
                            │  - courses                          │
                            │  - attendances                      │
                            │  - examinations                     │
                            │  - fees                             │
                            │  - notices                          │
                            │  - studentrecords                   │
                            │  - smstemplate, smslogs             │
                            │  - marksheets                       │
                            └─────────────────────────────────────┘
```

## 1.4 Directory Structure

```
school management system/
│
├── api/                          # Backend (Node.js/Express)
│   ├── auth/
│   │   └── auth.js              # JWT authentication middleware
│   ├── controller/              # Business logic layer
│   │   ├── school.controller.js
│   │   ├── student.controller.js
│   │   ├── teacher.controller.js
│   │   ├── class.controller.js
│   │   ├── subject.controller.js
│   │   ├── course.controller.js
│   │   ├── attendance.controller.js
│   │   ├── examination.controller.js
│   │   ├── fees.controller.js
│   │   ├── notice.controller.js
│   │   ├── period.controller.js
│   │   ├── studentRecord.controller.js
│   │   ├── frontPage.controller.js
│   │   ├── publicHomePage.controller.js
│   │   ├── marksheet.controller.js
│   │   ├── sms.controller.js
│   │   └── auth.controller.js
│   ├── model/                   # Database schemas
│   │   ├── school.model.js
│   │   ├── student.model.js
│   │   ├── teacher.model.js
│   │   ├── class.model.js
│   │   ├── subject.model.js
│   │   ├── course.model.js
│   │   ├── attendance.model.js
│   │   ├── examination.model.js
│   │   ├── fees.model.js
│   │   ├── notice.model.js
│   │   ├── period.model.js
│   │   ├── studentRecord.model.js
│   │   ├── frontPage.model.js
│   │   ├── publicHomePage.model.js
│   │   ├── marksheet.model.js
│   │   ├── smsTemplate.model.js
│   │   └── smsLog.model.js
│   ├── router/                  # API route definitions
│   │   ├── school.router.js
│   │   ├── student.router.js
│   │   ├── teacher.router.js
│   │   ├── class.router.js
│   │   ├── subject.router.js
│   │   ├── course.router.js
│   │   ├── attendance.router.js
│   │   ├── examination.router.js
│   │   ├── fees.router.js
│   │   ├── notice.router.js
│   │   ├── period.router.js
│   │   ├── studentRecord.router.js
│   │   ├── frontPage.router.js
│   │   ├── publicHomePage.router.js
│   │   ├── marksheet.router.js
│   │   └── sms.router.js
│   ├── .env                     # Environment variables
│   ├── package.json             # Backend dependencies
│   └── server.js                # Express server entry point
│
├── frontend/                     # Frontend (React/Vite)
│   ├── public/                  # Static assets
│   │   ├── images/
│   │   │   └── uploaded/        # User uploaded images
│   │   │       ├── school/
│   │   │       ├── student/
│   │   │       └── teacher/
│   │   └── manifest.json
│   ├── src/
│   │   ├── basic utility components/  # Reusable utilities
│   │   │   ├── CustomizedSnackbars.jsx
│   │   │   ├── darkTheme.jsx
│   │   │   ├── lightTheme.jsx
│   │   │   └── NoData.jsx
│   │   ├── client/              # Public-facing pages
│   │   │   ├── components/
│   │   │   │   ├── home/
│   │   │   │   │   ├── Home.jsx
│   │   │   │   │   ├── Hero.jsx
│   │   │   │   │   ├── Welcome.jsx
│   │   │   │   │   ├── Carousel.jsx
│   │   │   │   │   ├── Gallery.jsx
│   │   │   │   │   └── Promotion.jsx
│   │   │   │   ├── contact/
│   │   │   │   │   └── Contact.jsx
│   │   │   │   ├── login/
│   │   │   │   │   └── Login.jsx
│   │   │   │   ├── register/
│   │   │   │   │   └── Register.jsx
│   │   │   │   └── logout/
│   │   │   │       └── Logout.jsx
│   │   │   ├── utility components/
│   │   │   │   ├── app bar/
│   │   │   │   │   └── Navbar.jsx
│   │   │   │   └── footer/
│   │   │   │       └── Footer.jsx
│   │   │   └── Client.jsx
│   │   ├── school/              # School admin dashboard
│   │   │   ├── components/
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── SchoolDashboard.jsx
│   │   │   │   ├── students/
│   │   │   │   │   └── Students.jsx
│   │   │   │   ├── teachers/
│   │   │   │   │   └── Teachers.jsx
│   │   │   │   ├── class/
│   │   │   │   │   └── Class.jsx
│   │   │   │   ├── class details/
│   │   │   │   │   └── ClassDetails.jsx
│   │   │   │   ├── subjects/
│   │   │   │   │   └── Subjects.jsx
│   │   │   │   ├── courses/
│   │   │   │   │   └── Courses.jsx
│   │   │   │   ├── attendance/
│   │   │   │   │   ├── Attendance.jsx
│   │   │   │   │   ├── AttendanceDetails.jsx
│   │   │   │   │   ├── AttendanceReport.jsx
│   │   │   │   │   └── StudentAttendanceList.jsx
│   │   │   │   ├── examinations/
│   │   │   │   │   └── Examinations.jsx
│   │   │   │   ├── fees/
│   │   │   │   │   └── FeesManagement.jsx
│   │   │   │   ├── student-records/
│   │   │   │   │   └── StudentRecords.jsx
│   │   │   │   ├── notice/
│   │   │   │   │   └── NoticeSchool.jsx
│   │   │   │   ├── periods/
│   │   │   │   │   └── Schedule.jsx
│   │   │   │   ├── assign period/
│   │   │   │   │   └── AssignPeriod2.jsx
│   │   │   │   ├── marksheet/
│   │   │   │   │   └── MarkSheetGenerator.jsx
│   │   │   │   ├── sms/
│   │   │   │   │   └── SmsManagement.jsx
│   │   │   │   ├── front-page-management/
│   │   │   │   │   └── FrontPageManagement.jsx
│   │   │   │   └── public-home-management/
│   │   │   │       └── PublicHomePageManagement.jsx
│   │   │   ├── utility components/
│   │   │   │   ├── student card/
│   │   │   │   │   └── StudentCard.jsx
│   │   │   │   └── teacher card/
│   │   │   │       └── TeacherCard.jsx
│   │   │   └── School.jsx
│   │   ├── student/             # Student dashboard
│   │   │   ├── components/
│   │   │   │   ├── student details/
│   │   │   │   │   └── StudentDetails.jsx
│   │   │   │   ├── attendance/
│   │   │   │   │   └── AttendanceStudent.jsx
│   │   │   │   ├── examination/
│   │   │   │   │   └── StudentExaminations.jsx
│   │   │   │   ├── notice/
│   │   │   │   │   └── NoticeStudent.jsx
│   │   │   │   └── schedule/
│   │   │   │       └── ScheduleStudent.jsx
│   │   │   └── Student.jsx
│   │   ├── teacher/             # Teacher dashboard
│   │   │   ├── components/
│   │   │   │   ├── teacher details/
│   │   │   │   │   └── TeacherDetails.jsx
│   │   │   │   ├── attendance/
│   │   │   │   │   └── AttendanceTeacher.jsx
│   │   │   │   ├── teacher examinations/
│   │   │   │   │   └── TeacherExaminations.jsx
│   │   │   │   ├── notice/
│   │   │   │   │   └── Notice.jsx
│   │   │   │   └── periods/
│   │   │   │       └── TeacherSchedule.jsx
│   │   │   └── Teacher.jsx
│   │   ├── context/             # React Context for state
│   │   │   ├── AuthContext.jsx
│   │   │   └── DashboardContext.jsx
│   │   ├── guards/              # Route protection
│   │   │   └── ProtectedRoute.jsx
│   │   ├── state/               # Redux store (legacy)
│   │   │   ├── store.js
│   │   │   └── loginSlice.js
│   │   ├── yupSchema/           # Form validation schemas
│   │   │   ├── loginSchema.js
│   │   │   ├── registerSchema.js
│   │   │   ├── studentSchema.js
│   │   │   ├── teacherSchemal.js
│   │   │   ├── classSchema.js
│   │   │   ├── subjectSchema.js
│   │   │   ├── examinationSchema.js
│   │   │   └── contactSchema.js
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # React entry point
│   │   ├── environment.js       # API URL configuration
│   │   ├── utilityFunctions.js  # Helper functions
│   │   └── index.css            # Global styles
│   ├── .env.production          # Production environment
│   ├── package.json             # Frontend dependencies
│   └── vite.config.js           # Vite build configuration
│
├── ecosystem.config.js          # PM2 process configuration
├── README.md                    # Project documentation
└── COMPLETE_DEPLOYMENT_GUIDE.txt # Deployment instructions
```

## 1.5 Live Deployment URLs

- **Frontend:** https://www.schoolm.gentime.in
- **Backend API:** https://api.gentime.in/api
- **VPS Server:** 72.60.202.218

**Test Credentials:**
- Email: test@school.com
- Password: test123
- Role: School Owner

---

# PART 2: JAVASCRIPT FUNDAMENTALS

## 2.1 JavaScript Basics

JavaScript is a high-level, interpreted programming language primarily used for web development. It runs in browsers (client-side) and on servers (Node.js - server-side).

### Variables:

```javascript
// Three ways to declare variables:

// 1. var (old way, function-scoped)
var schoolName = "GenTime School";

// 2. let (modern, block-scoped, can be reassigned)
let studentCount = 100;
studentCount = 150; // Can change

// 3. const (modern, block-scoped, cannot be reassigned)
const API_URL = "https://api.gentime.in";
// API_URL = "new url"; // ERROR! Cannot reassign
```

### Data Types:

```javascript
// Primitive Types:
const name = "Kallesh";           // String
const age = 25;                   // Number
const isActive = true;            // Boolean
const nothing = null;             // Null
let notDefined;                   // Undefined
const id = Symbol('id');          // Symbol

// Reference Types:
const student = {                 // Object
    name: "John",
    age: 18
};

const grades = [85, 90, 78];     // Array

function greet() {                // Function
    return "Hello";
}
```

### Functions:

```javascript
// Function Declaration
function calculateFees(totalFees, paidFees) {
    return totalFees - paidFees;
}

// Function Expression
const calculateFees = function(totalFees, paidFees) {
    return totalFees - paidFees;
};

// Arrow Function (ES6) - Used extensively in this project
const calculateFees = (totalFees, paidFees) => {
    return totalFees - paidFees;
};

// Shorthand arrow function (single expression)
const calculateFees = (totalFees, paidFees) => totalFees - paidFees;

// Usage:
const balance = calculateFees(10000, 5000); // 5000
```

### Objects:

```javascript
// Object creation
const student = {
    name: "John Doe",
    age: 18,
    class: "10th",

    // Method (function inside object)
    getInfo: function() {
        return `${this.name} is ${this.age} years old`;
    }
};

// Accessing properties
console.log(student.name);        // Dot notation
console.log(student['age']);      // Bracket notation

// Adding new properties
student.rollNumber = "2024001";

// Object destructuring (ES6)
const { name, age } = student;
console.log(name); // "John Doe"
```

### Arrays:

```javascript
const students = ["John", "Jane", "Bob"];

// Common array methods used in this project:

// 1. push() - Add to end
students.push("Alice");
// ["John", "Jane", "Bob", "Alice"]

// 2. map() - Transform each element
const upperNames = students.map(name => name.toUpperCase());
// ["JOHN", "JANE", "BOB", "ALICE"]

// 3. filter() - Filter elements
const filteredStudents = students.filter(name => name.startsWith("J"));
// ["John", "Jane"]

// 4. find() - Find first matching element
const found = students.find(name => name === "Bob");
// "Bob"

// 5. forEach() - Loop through array
students.forEach(name => {
    console.log(name);
});

// 6. reduce() - Reduce to single value
const grades = [85, 90, 78, 92];
const total = grades.reduce((sum, grade) => sum + grade, 0);
// 345
```

### Conditionals:

```javascript
const age = 18;

// if-else
if (age >= 18) {
    console.log("Adult");
} else if (age >= 13) {
    console.log("Teenager");
} else {
    console.log("Child");
}

// Ternary operator
const status = age >= 18 ? "Adult" : "Minor";

// Switch statement
const role = "STUDENT";
switch(role) {
    case "SCHOOL":
        console.log("School Dashboard");
        break;
    case "TEACHER":
        console.log("Teacher Dashboard");
        break;
    case "STUDENT":
        console.log("Student Dashboard");
        break;
    default:
        console.log("Unknown role");
}
```

### Loops:

```javascript
const students = ["John", "Jane", "Bob"];

// for loop
for (let i = 0; i < students.length; i++) {
    console.log(students[i]);
}

// for...of loop (modern)
for (const student of students) {
    console.log(student);
}

// while loop
let i = 0;
while (i < students.length) {
    console.log(students[i]);
    i++;
}
```

## 2.2 ES6+ Features Used in Project

### Template Literals:

```javascript
const name = "John";
const age = 18;

// Old way:
const message = "My name is " + name + " and I am " + age + " years old";

// ES6 way:
const message = `My name is ${name} and I am ${age} years old`;

// Multi-line strings:
const html = `
    <div>
        <h1>${name}</h1>
        <p>Age: ${age}</p>
    </div>
`;
```

### Destructuring:

```javascript
// Object destructuring
const student = {
    name: "John",
    age: 18,
    class: "10th"
};

const { name, age } = student;
// Now: name = "John", age = 18

// Array destructuring
const [first, second, third] = ["Math", "Science", "English"];
// first = "Math", second = "Science", third = "English"

// Used in this project:
// In React components:
const { user, login, logout } = useContext(AuthContext);
```

### Spread Operator:

```javascript
// Arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];
// [1, 2, 3, 4, 5, 6]

// Objects
const student = { name: "John", age: 18 };
const updatedStudent = { ...student, class: "10th" };
// { name: "John", age: 18, class: "10th" }

// Used in this project:
// Updating state in React:
setStudents([...students, newStudent]);
```

### Default Parameters:

```javascript
function createStudent(name, age = 18, class = "10th") {
    return { name, age, class };
}

createStudent("John");
// { name: "John", age: 18, class: "10th" }

createStudent("Jane", 19);
// { name: "Jane", age: 19, class: "10th" }
```

### Object Shorthand:

```javascript
const name = "John";
const age = 18;

// Old way:
const student = {
    name: name,
    age: age
};

// ES6 shorthand:
const student = { name, age };
```

### Import/Export (ES6 Modules):

```javascript
// In auth.js (Export)
const authMiddleware = (roles) => {
    // ... code
};
module.exports = authMiddleware; // CommonJS (Backend)

// OR in React (Frontend)
export const AuthContext = createContext(); // Named export
export default App; // Default export

// Importing:
import React from 'react'; // Default import
import { useState, useEffect } from 'react'; // Named imports
```

## 2.3 Asynchronous JavaScript

JavaScript is single-threaded but can handle asynchronous operations.

### Callbacks (Old Way):

```javascript
// Example: Reading a file
fs.readFile('file.txt', (error, data) => {
    if (error) {
        console.log("Error:", error);
    } else {
        console.log("Data:", data);
    }
});
```

### Promises:

```javascript
// Creating a promise
const fetchStudents = () => {
    return new Promise((resolve, reject) => {
        // Simulating API call
        setTimeout(() => {
            const students = [{ name: "John" }, { name: "Jane" }];
            resolve(students); // Success
            // reject("Error occurred"); // Failure
        }, 1000);
    });
};

// Using promise
fetchStudents()
    .then(students => {
        console.log("Students:", students);
    })
    .catch(error => {
        console.log("Error:", error);
    });
```

### Async/Await (Modern - Used in this project):

```javascript
// Async function (used extensively in controllers)
const getAllStudents = async (req, res) => {
    try {
        // await pauses execution until promise resolves
        const students = await Student.find();
        res.status(200).json({ success: true, data: students });
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Example from project:
// In student.controller.js
registerStudent: async (req, res) => {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
        // Check if email exists
        const existingStudent = await Student.find({
            email: fields.email[0]
        });

        if (existingStudent.length > 0) {
            res.status(500).json({
                success: false,
                message: "Email Already Exist!"
            });
        } else {
            // Create new student
            const newStudent = new Student({ /* data */ });
            const savedStudent = await newStudent.save();
            res.status(200).json({
                success: true,
                data: savedStudent
            });
        }
    });
}
```

## 2.4 Module System (CommonJS vs ES6)

### CommonJS (Backend - Node.js):

```javascript
// Exporting (server.js)
const express = require("express");
const schoolRouter = require("./router/school.router");

// In school.router.js
const router = express.Router();
module.exports = router;
```

### ES6 Modules (Frontend - React):

```javascript
// Exporting (App.jsx)
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export default App;

// Importing
import App from './App.jsx';
```

## 2.5 Promises and Async/Await

### Example from the project:

```javascript
// In student.controller.js
const getStudentWithId = async (req, res) => {
    try {
        const id = req.params.id;
        const schoolId = req.user.schoolId;

        // This is a promise, await makes it synchronous-looking
        const student = await Student.findOne({
            _id: id,
            school: schoolId
        }).populate("student_class");

        if (student) {
            res.status(200).json({ success: true, data: student });
        } else {
            res.status(500).json({
                success: false,
                message: "Student data not Available"
            });
        }
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({
            success: false,
            message: "Error in getting Student Data"
        });
    }
};
```

### Multiple Async Operations:

```javascript
// Sequential (one after another)
const student = await Student.findById(id);
const class = await Class.findById(student.student_class);
const subjects = await Subject.find({ class: class._id });

// Parallel (all at once - faster)
const [student, classes, subjects] = await Promise.all([
    Student.findById(id),
    Class.find({ school: schoolId }),
    Subject.find({ school: schoolId })
]);
```

---

# PART 3: NODE.JS & EXPRESS BACKEND

## 3.1 What is Node.js?

**Node.js** is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows you to run JavaScript on the server (outside the browser).

### Key Features:
- **Asynchronous & Event-Driven:** Non-blocking I/O operations
- **Fast:** Built on V8 engine (compiles JS to machine code)
- **NPM:** Largest ecosystem of open-source libraries
- **Cross-Platform:** Runs on Windows, Linux, macOS

### Example:

```javascript
// Simple Node.js file (hello.js)
console.log("Hello from Node.js!");

// Run in terminal:
// node hello.js
```

## 3.2 Express.js Framework

**Express** is a minimal and flexible Node.js web application framework that provides robust features for web and mobile applications.

### Why Express?
- Simplifies routing
- Middleware support
- Easy integration with databases
- Templating engine support
- Community support

### Basic Express Server:

```javascript
const express = require('express');
const app = express();

// Route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

## 3.3 Server Setup and Configuration

### From server.js in this project:

```javascript
// 1. Load environment variables first
require("dotenv").config();

// 2. Import required packages
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

// 3. Import routers
const schoolRouter = require("./router/school.router");
const studentRouter = require("./router/student.router");
// ... more routers

// 4. Create Express application
const app = express();

// 5. Apply middleware (explained in next section)
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(cookieParser());
app.use(cors(corsOptions));

// 6. Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(db => {
        console.log("MongoDB Atlas is Connected Successfully.");
    })
    .catch(e => {
        console.log("MongoDB Connection Error:", e);
    });

// 7. Use routers
app.use("/api/school", schoolRouter);
app.use("/api/student", studentRouter);
app.use("/api/teacher", teacherRouter);
// ... more routes

// 8. Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server is running at port =>", PORT);
});
```

### Breakdown:

**1. Environment Variables (.env file):**
```
PORT=5000
JWT_SECRET=your-secret-key
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
NODE_ENV=production
```

**2. Package Imports:**
- `express`: Web framework
- `cors`: Cross-Origin Resource Sharing
- `cookieParser`: Parse cookies
- `mongoose`: MongoDB ODM

**3. Application Creation:**
```javascript
const app = express();
```
This creates an Express application instance.

**4. Middleware:**
Middleware are functions that have access to request and response objects.

**5. Database Connection:**
```javascript
mongoose.connect(process.env.MONGODB_URI)
```
Connects to MongoDB Atlas using connection string from .env

**6. Routes:**
```javascript
app.use("/api/school", schoolRouter);
```
- All requests to `/api/school/*` will be handled by `schoolRouter`
- `/api/student/*` → `studentRouter`
- etc.

**7. Server Listening:**
```javascript
app.listen(PORT, callback)
```
Starts the server on specified port.

## 3.4 Middleware Explained

Middleware functions are executed in sequence for each request.

### Request Flow:

```
Request → Middleware 1 → Middleware 2 → Route Handler → Response
```

### Types of Middleware Used:

#### 1. Built-in Middleware:

```javascript
// Parse JSON bodies
app.use(express.json({ limit: '100mb' }));
// Allows: req.body to contain parsed JSON

// Parse URL-encoded bodies (form data)
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
```

**What this does:**
```javascript
// Client sends:
POST /api/student/register
Content-Type: application/json
Body: {"name": "John", "age": 18}

// Express parses it, now in your route:
console.log(req.body);
// { name: "John", age: 18 }
```

#### 2. Third-party Middleware:

**Cookie Parser:**
```javascript
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Now you can access cookies:
// req.cookies.token
```

**CORS:**
```javascript
const cors = require("cors");

const corsOptions = {
    origin: [
        'http://localhost:5173',
        'https://www.schoolm.gentime.in',
        // ... more origins
    ],
    credentials: true,
    exposedHeaders: ["Authorization"]
};

app.use(cors(corsOptions));
```

**What CORS does:**
- Allows frontend (running on different domain) to access backend
- Without CORS, browser blocks cross-origin requests
- `credentials: true` allows cookies to be sent
- `exposedHeaders` allows frontend to read Authorization header

#### 3. Custom Middleware (Authentication):

```javascript
// auth.js
const jwt = require('jsonwebtoken');

const authMiddleware = (roles = []) => {
    return (req, res, next) => {
        // 1. Get token from request header
        const authHeader = req.header('Authorization');
        let token = authHeader;

        // Handle "Bearer token" format
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.replace('Bearer ', '');
        }

        // 2. Check if token exists
        if (!token) {
            return res.status(401).json({
                message: 'No token, authorization denied'
            });
        }

        try {
            // 3. Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4. Attach user data to request
            req.user = decoded;

            // 5. Check if user has required role
            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({
                    message: 'Access denied'
                });
            }

            // 6. Call next middleware/route handler
            next();
        } catch (error) {
            res.status(401).json({
                message: 'Token is not valid'
            });
        }
    };
};

module.exports = authMiddleware;
```

**Usage:**
```javascript
// In router
const authMiddleware = require('../auth/auth');

// Only SCHOOL role can access
router.get("/fetch-single",
    authMiddleware(['SCHOOL']),
    getSchoolOwnData
);

// Any authenticated user
router.get("/students",
    authMiddleware(),
    getAllStudents
);
```

## 3.5 Request-Response Cycle

### Complete Flow:

```javascript
// 1. CLIENT SENDS REQUEST:
fetch('https://api.gentime.in/api/student/all', {
    method: 'GET',
    headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    }
});

// 2. REQUEST REACHES EXPRESS SERVER
// app.js → middleware chain

// 3. CORS MIDDLEWARE
// Checks if origin is allowed

// 4. JSON PARSER MIDDLEWARE
// Parses request body

// 5. ROUTE MATCHING
// app.use("/api/student", studentRouter)
// Matches /api/student/all

// 6. ROUTER
// router.get("/all", authMiddleware(['SCHOOL']), getStudentWithQuery)

// 7. AUTH MIDDLEWARE
// Verifies JWT token
// Sets req.user = { id, schoolId, role }

// 8. CONTROLLER FUNCTION
const getStudentWithQuery = async (req, res) => {
    try {
        // Access user from middleware
        const schoolId = req.user.schoolId;

        // Query database
        const students = await Student.find({ school: schoolId });

        // Send response
        res.status(200).json({
            success: true,
            data: students
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// 9. RESPONSE SENT TO CLIENT
// Client receives:
// {
//     "success": true,
//     "data": [
//         { "name": "John", "age": 18, ... },
//         { "name": "Jane", "age": 19, ... }
//     ]
// }
```

### Request Object (req):

```javascript
app.get('/api/student/:id', (req, res) => {
    // URL parameters
    console.log(req.params.id);
    // /api/student/123 → "123"

    // Query parameters
    console.log(req.query);
    // /api/student?search=john&class=10
    // → { search: "john", class: "10" }

    // Request body (POST/PUT)
    console.log(req.body);
    // { name: "John", age: 18 }

    // Headers
    console.log(req.headers);
    console.log(req.header('Authorization'));

    // User data (from auth middleware)
    console.log(req.user);
    // { id: "...", schoolId: "...", role: "SCHOOL" }
});
```

### Response Object (res):

```javascript
app.get('/api/student/:id', async (req, res) => {
    // Send JSON
    res.json({ name: "John" });

    // Send with status code
    res.status(200).json({ success: true });

    // Send error
    res.status(404).json({ error: "Not found" });

    // Set headers
    res.header("Authorization", token);
    res.setHeader("Content-Type", "application/json");

    // Send file
    res.sendFile('/path/to/file');

    // Redirect
    res.redirect('/login');
});
```

## 3.6 Environment Variables

### .env file:

```
PORT=5000
JWT_SECRET=LSKDFJDLSJWIEOFFJDSLKJFLJ328929FDOSKJFlsdkfjdslskdfj
MONGODB_URI=mongodb+srv://schoolm2025:kallesh717@cluster0.ovqn73c.mongodb.net/school_management
NODE_ENV=production
```

### Loading environment variables:

```javascript
// At the top of server.js
require("dotenv").config();

// Now you can use:
process.env.PORT           // "5000"
process.env.JWT_SECRET     // "LSKDFJ..."
process.env.MONGODB_URI    // "mongodb+srv://..."
process.env.NODE_ENV       // "production"
```

### Why use .env?
- **Security:** Keeps sensitive data out of code
- **Flexibility:** Different values for dev/prod
- **Best Practice:** Never commit .env to git

## 3.7 File Upload Handling

### Using Formidable:

```javascript
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");

const registerStudent = async (req, res) => {
    // 1. Create formidable instance
    const form = new formidable.IncomingForm();

    // 2. Parse request
    form.parse(req, (err, fields, files) => {
        // 3. Access form fields
        console.log(fields.name[0]);      // "John Doe"
        console.log(fields.age[0]);       // "18"

        // 4. Access uploaded file
        const photo = files.image[0];
        console.log(photo.originalFilename); // "john.jpg"
        console.log(photo.filepath);         // Temp path

        // 5. Save file permanently
        let oldPath = photo.filepath;
        let filename = photo.originalFilename.replace(" ", "_");
        let newPath = path.join(
            __dirname,
            '../../frontend/public/images/uploaded/student',
            filename
        );

        // 6. Read from temp location
        let photoData = fs.readFileSync(oldPath);

        // 7. Write to permanent location
        fs.writeFile(newPath, photoData, function (err) {
            if (err) console.log(err);

            // 8. Save to database
            const newStudent = new Student({
                name: fields.name[0],
                age: fields.age[0],
                student_image: filename
            });

            newStudent.save();
        });
    });
};
```

### Frontend (sending file):

```javascript
const handleSubmit = async (values) => {
    // Create FormData
    const formData = new FormData();

    // Add text fields
    formData.append('name', values.name);
    formData.append('age', values.age);

    // Add file
    formData.append('image', values.image); // File object

    // Send to backend
    const response = await axios.post(
        '/api/student/register',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    );
};
```

---

*This documentation continues with all remaining parts. Due to length limits, I'll create this as the first file and continue with additional files.*

