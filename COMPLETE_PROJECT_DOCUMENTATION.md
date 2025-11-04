# 🎓 Complete School Management System Documentation
## From Beginner to Advanced - Everything You Need to Know

---

## 📚 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack Explained](#2-technology-stack-explained)
3. [Project Structure](#3-project-structure)
4. [Frontend Deep Dive](#4-frontend-deep-dive)
5. [Backend Deep Dive](#5-backend-deep-dive)
6. [Database Architecture](#6-database-architecture)
7. [Authentication & Security](#7-authentication--security)
8. [API Endpoints Guide](#8-api-endpoints-guide)
9. [Environment Configuration](#9-environment-configuration)
10. [Key Features Implementation](#10-key-features-implementation)
11. [Data Flow Examples](#11-data-flow-examples)
12. [Deployment Guide](#12-deployment-guide)

---

## 1. Project Overview

### What is This Project?

This is a **School Management System** - a web application that helps schools manage:
- Students (records, attendance, marks)
- Teachers (assignments, classes)
- Classes (creation, management)
- Examinations (scheduling, marksheets)
- Notices (announcements)
- SMS (notifications to parents)
- Front page (public website)

### Who Uses This System?

1. **School Admin** - Manages everything
2. **Teachers** - Manages their classes, marks, attendance
3. **Students** - Views their marks, attendance, schedule

---

## 2. Technology Stack Explained

### What is a "Stack"?

A "stack" is a collection of technologies used to build an application. Think of it like ingredients for cooking.

### Frontend (What Users See)

**React 18.2.0** - JavaScript Library
```
What it does: Creates interactive user interfaces
Why we use it: Fast, component-based, reusable code
Example: A button that changes color when clicked
```

**Material-UI (MUI)** - UI Component Library
```
What it does: Pre-built beautiful components
Why we use it: Professional look without designing from scratch
Example: Pre-styled buttons, cards, tables
```

**Vite 5.4.2** - Build Tool
```
What it does: Bundles and optimizes code
Why we use it: Super fast development and builds
Example: Combines all your files into one optimized file
```

**Axios** - HTTP Client
```
What it does: Makes API calls to backend
Why we use it: Easy to send/receive data
Example: axios.get('/api/students') fetches students
```

### Backend (Server Side)

**Node.js** - JavaScript Runtime
```
What it does: Runs JavaScript on the server
Why we use it: Same language (JavaScript) for frontend and backend
Example: Handles requests from browsers
```

**Express.js** - Web Framework
```
What it does: Creates web server and APIs
Why we use it: Simple, flexible, popular
Example: app.get('/api/students', ...) creates an endpoint
```

**MongoDB** - Database
```
What it does: Stores all data
Why we use it: NoSQL, flexible, JSON-like documents
Example: Stores student records, marks, etc.
```

**Mongoose** - MongoDB ODM
```
What it does: Makes working with MongoDB easier
Why we use it: Schema validation, easier queries
Example: Defines structure for student data
```

---

## 3. Project Structure

### Root Directory Layout

```
school management system/
├── frontend/           ← React application (what users see)
├── api/                ← Express backend (server logic)
├── .git/               ← Git version control
├── README.md           ← Project documentation
└── package.json        ← Project metadata
```

### Frontend Structure (Detailed)

```
frontend/
├── public/                     ← Static files
│   ├── index.html              ← Main HTML file
│   └── gentime-logo.svg        ← School logo
│
├── src/                        ← Source code
│   ├── school/                 ← School admin section
│   │   ├── components/         ← Reusable UI pieces
│   │   │   ├── dashboard/      ← Dashboard page
│   │   │   ├── students/       ← Student management
│   │   │   ├── teachers/       ← Teacher management
│   │   │   ├── marksheet/      ← Marksheet generator
│   │   │   ├── attendance/     ← Attendance tracking
│   │   │   ├── sms/            ← SMS management
│   │   │   ├── examinations/   ← Exam scheduling
│   │   │   └── notices/        ← Notice board
│   │   └── School.jsx          ← Main school layout
│   │
│   ├── teacher/                ← Teacher section
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   ├── attendance/
│   │   │   └── marks/
│   │   └── Teacher.jsx
│   │
│   ├── student/                ← Student section
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   ├── results/
│   │   │   └── attendance/
│   │   └── Student.jsx
│   │
│   ├── context/                ← Global state management
│   │   └── DashboardContext.jsx
│   │
│   ├── environment.js          ← API base URL
│   ├── App.jsx                 ← Main app component
│   └── main.jsx                ← Entry point
│
├── dist/                       ← Built files (for production)
├── package.json                ← Dependencies
└── vite.config.js              ← Build configuration
```

### Backend Structure (Detailed)

```
api/
├── model/                      ← Database schemas
│   ├── school.model.js         ← School data structure
│   ├── student.model.js        ← Student with login
│   ├── studentRecord.model.js  ← Student records (no login)
│   ├── teacher.model.js        ← Teacher data
│   ├── class.model.js          ← Class structure
│   ├── examination.model.js    ← Exam data
│   ├── marksheet.model.js      ← Marksheet data
│   ├── attendance.model.js     ← Attendance records
│   ├── notice.model.js         ← Notices
│   └── sms.model.js            ← SMS templates/logs
│
├── controller/                 ← Business logic
│   ├── school.controller.js    ← School operations
│   ├── student.controller.js   ← Student CRUD
│   ├── studentRecord.controller.js
│   ├── teacher.controller.js
│   ├── class.controller.js
│   ├── examination.controller.js
│   ├── marksheet.controller.js
│   ├── attendance.controller.js
│   ├── notice.controller.js
│   └── sms.controller.js
│
├── router/                     ← API routes
│   ├── school.router.js        ← /api/school/*
│   ├── student.router.js       ← /api/students/*
│   ├── studentRecord.router.js ← /api/student-records/*
│   ├── teacher.router.js       ← /api/teachers/*
│   ├── class.router.js         ← /api/class/*
│   ├── examination.router.js   ← /api/examination/*
│   ├── marksheet.router.js     ← /api/marksheets/*
│   └── sms.router.js           ← /api/sms/*
│
├── auth/                       ← Authentication
│   └── auth.js                 ← JWT verification middleware
│
├── images/                     ← Uploaded images
├── uploads/                    ← Uploaded files
├── server.js                   ← Main server file
├── .env                        ← Environment variables
└── package.json                ← Dependencies
```

---

## 4. Frontend Deep Dive

### What is React?

React is a JavaScript library for building user interfaces. Think of it like LEGO blocks:
- Each block is a **component**
- You combine blocks to build complex structures
- Blocks are reusable

### Basic React Concepts

#### 4.1 Components

**What is a Component?**
A component is a piece of UI that you can reuse.

```jsx
// Example: A simple button component
function MyButton() {
    return <button>Click Me</button>;
}

// Use it anywhere:
<MyButton />
<MyButton />
<MyButton />
```

**Types of Components in Our Project:**

1. **Page Components** - Full pages
```
Example: MarkSheetGenerator.jsx
Shows the entire marksheet page
```

2. **Layout Components** - Page structure
```
Example: School.jsx
Has sidebar, header, main content area
```

3. **Reusable Components** - Small pieces
```
Example: A card, button, input field
```

#### 4.2 State (useState)

**What is State?**
State is data that can change. When state changes, React re-renders the component.

```jsx
import { useState } from 'react';

function Counter() {
    // Declare state variable
    const [count, setCount] = useState(0);
    //      ↑         ↑            ↑
    //   current   function    initial
    //   value     to update    value

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>
                Increment
            </button>
        </div>
    );
}
```

**In Our Project:**
```jsx
// MarkSheetGenerator.jsx
const [students, setStudents] = useState([]);
//                                         ↑
//                                   starts empty

// Later, when data is fetched:
setStudents([{name: "John"}, {name: "Jane"}]);
// Now students = [{name: "John"}, {name: "Jane"}]
```

#### 4.3 Effects (useEffect)

**What is useEffect?**
Runs code when component loads or when something changes.

```jsx
import { useEffect } from 'react';

function StudentList() {
    const [students, setStudents] = useState([]);

    // This runs when component loads
    useEffect(() => {
        fetchStudents(); // Get students from API
    }, []); // ← Empty array = run once on load

    return <div>...</div>;
}
```

**Common Use Cases:**
1. Fetch data when page loads
2. Update when something changes
3. Clean up (remove listeners)

#### 4.4 Props

**What are Props?**
Props are arguments passed to components. Like function parameters.

```jsx
// Define component with props
function StudentCard({ name, rollNumber }) {
    return (
        <div>
            <h3>{name}</h3>
            <p>Roll: {rollNumber}</p>
        </div>
    );
}

// Use it with different data
<StudentCard name="John" rollNumber="101" />
<StudentCard name="Jane" rollNumber="102" />
```

### Project-Specific Frontend Code

#### Example 1: MarkSheetGenerator.jsx

**File Path:** `frontend/src/school/components/marksheet/MarkSheetGenerator.jsx`

**What it Does:**
Creates and manages student marksheets.

**Key Sections:**

```jsx
// 1. IMPORTS - Bring in what we need
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button } from '@mui/material';

// 2. COMPONENT DEFINITION
const MarkSheetGenerator = () => {
    // 3. STATE - Data that can change
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');

    // 4. EFFECTS - Run on load
    useEffect(() => {
        fetchClasses();    // Get classes from API
        fetchStudents();   // Get students from API
    }, []);

    // 5. FUNCTIONS - Logic
    const fetchClasses = async () => {
        const response = await axios.get('/api/class/fetch-all');
        setClasses(response.data.data);
    };

    const handleClassChange = async (classObj) => {
        // When class is selected, fetch its students
        const response = await axios.get(
            `/api/student-records?class_id=${classObj._id}`
        );
        setStudents(response.data.data);
    };

    // 6. JSX - What to display
    return (
        <div>
            <h1>Mark Sheet Generator</h1>

            {/* Class Dropdown */}
            <select onChange={(e) => handleClassChange(e.target.value)}>
                {classes.map(cls => (
                    <option key={cls._id} value={cls._id}>
                        Class {cls.class_num} - {cls.class_text}
                    </option>
                ))}
            </select>

            {/* Student List */}
            {students.map(student => (
                <div key={student._id}>
                    {student.student_name}
                </div>
            ))}
        </div>
    );
};
```

**Step-by-Step Flow:**

1. **Component Loads**
   ```
   useEffect runs → fetchClasses() → API call → setClasses()
   ```

2. **User Selects Class**
   ```
   onChange event → handleClassChange() → Fetch students → setStudents()
   ```

3. **Component Re-renders**
   ```
   State changed → React updates UI → Shows new students
   ```

#### Example 2: Context API (Global State)

**File Path:** `frontend/src/context/DashboardContext.jsx`

**What is Context?**
Context lets you share data across many components without passing props down manually.

```jsx
// Create context
import { createContext, useContext, useState } from 'react';

const DashboardContext = createContext();

// Provider component
export const DashboardProvider = ({ children }) => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const triggerDashboardRefresh = (message) => {
        console.log(message);
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <DashboardContext.Provider value={{
            refreshTrigger,
            triggerDashboardRefresh
        }}>
            {children}
        </DashboardContext.Provider>
    );
};

// Hook to use context
export const useDashboard = () => useContext(DashboardContext);
```

**How to Use:**

```jsx
// In any component:
import { useDashboard } from '../context/DashboardContext';

function MyComponent() {
    const { triggerDashboardRefresh } = useDashboard();

    const handleSave = () => {
        // Save data...
        triggerDashboardRefresh('Data saved!');
    };
}
```

---

## 5. Backend Deep Dive

### What is Node.js and Express?

**Node.js** = JavaScript runtime (runs JS outside browser)
**Express** = Web framework (makes creating APIs easy)

### Basic Express Concepts

#### 5.1 Creating a Server

```javascript
// Import Express
const express = require('express');
const app = express();

// Create a route
app.get('/api/hello', (req, res) => {
    //  ↑         ↑       ↑     ↑
    // HTTP    route   request response
    // method   path

    res.json({ message: 'Hello World!' });
});

// Start server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

#### 5.2 HTTP Methods

```javascript
// GET - Retrieve data
app.get('/api/students', (req, res) => {
    // Get all students from database
});

// POST - Create new data
app.post('/api/students', (req, res) => {
    // Create new student
});

// PUT - Update existing data
app.put('/api/students/:id', (req, res) => {
    // Update student with specific ID
});

// DELETE - Remove data
app.delete('/api/students/:id', (req, res) => {
    // Delete student with specific ID
});
```

#### 5.3 Request and Response

```javascript
app.post('/api/students', (req, res) => {
    // REQUEST (req) - Data sent TO server
    const studentData = req.body;      // Data in body
    const studentId = req.params.id;   // Data in URL
    const page = req.query.page;       // Data in query string

    // RESPONSE (res) - Data sent FROM server
    res.status(200).json({
        success: true,
        data: studentData
    });
});
```

### MVC Pattern in Our Project

**MVC = Model-View-Controller**

```
Request Flow:
Client → Router → Controller → Model → Database
                     ↓
                  Response
```

#### 5.4 Router (Routes)

**File:** `api/router/student.router.js`

```javascript
const express = require('express');
const router = express.Router();
const { getAllStudents, createStudent } = require('../controller/student.controller');
const authMiddleware = require('../auth/auth');

// Define routes
router.get('/all', authMiddleware(['SCHOOL']), getAllStudents);
//      ↑         ↑                              ↑
//    HTTP      middleware                   controller
//    method    (checks auth)                function

router.post('/create', authMiddleware(['SCHOOL']), createStudent);

module.exports = router;
```

**What This Does:**
- `/api/students/all` → Calls `getAllStudents()`
- `/api/students/create` → Calls `createStudent()`
- `authMiddleware` checks if user is authenticated

#### 5.5 Controller (Business Logic)

**File:** `api/controller/student.controller.js`

```javascript
const Student = require('../model/student.model');

module.exports = {
    // Get all students
    getAllStudents: async (req, res) => {
        try {
            // Get school ID from authenticated user
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
                message: 'Error fetching students'
            });
        }
    },

    // Create new student
    createStudent: async (req, res) => {
        try {
            const studentData = req.body;
            const newStudent = new Student(studentData);
            await newStudent.save();

            res.status(201).json({
                success: true,
                data: newStudent
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating student'
            });
        }
    }
};
```

**Step-by-Step:**
1. Receive request
2. Get data from request (body, params, query)
3. Validate data
4. Query/update database
5. Send response

#### 5.6 Model (Database Schema)

**File:** `api/model/student.model.js`

```javascript
const mongoose = require('mongoose');

// Define structure
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true  // Must be provided
    },
    email: {
        type: String,
        required: true,
        unique: true    // No duplicates
    },
    age: {
        type: Number,
        required: true
    },
    student_class: {
        type: mongoose.Schema.ObjectId,
        ref: 'Class'    // Reference to Class model
    },
    school: {
        type: mongoose.Schema.ObjectId,
        ref: 'School'   // Reference to School model
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create model
module.exports = mongoose.model('Student', studentSchema);
```

**What This Does:**
- Defines structure of student data
- Validates data before saving
- Creates relationships with other collections

### Example: Complete API Flow

**Scenario:** User creates a marksheet

```javascript
// 1. FRONTEND - User clicks "Save Marksheet"
const handleSave = async () => {
    const response = await axios.post('/api/marksheets', {
        student_id: 'abc123',
        class: 'Class 10 - A',
        marks: [85, 90, 78],
        percentage: 84.3
    });
};

// 2. BACKEND ROUTER - Receives request
// File: api/router/marksheet.router.js
router.post('/', authMiddleware(['SCHOOL']), createMarksheet);

// 3. AUTH MIDDLEWARE - Checks authentication
// File: api/auth/auth.js
module.exports = (roles) => {
    return (req, res, next) => {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        if (roles.includes(decoded.role)) {
            req.user = decoded;  // Attach user to request
            next();              // Continue to controller
        } else {
            res.status(403).json({ message: 'Unauthorized' });
        }
    };
};

// 4. CONTROLLER - Business logic
// File: api/controller/marksheet.controller.js
const createMarksheet = async (req, res) => {
    try {
        const marksheetData = req.body;

        // Validate
        if (!marksheetData.student_id) {
            return res.status(400).json({
                success: false,
                message: 'Student ID required'
            });
        }

        // Save to database
        const newMarksheet = new Marksheet(marksheetData);
        await newMarksheet.save();

        // Send success response
        res.status(201).json({
            success: true,
            data: newMarksheet
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 5. MODEL - Saves to MongoDB
// File: api/model/marksheet.model.js
const marksheetSchema = new mongoose.Schema({
    student_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'StudentRecord',
        required: true
    },
    class: String,
    marks: [Number],
    percentage: Number,
    grade: String,
    result: String
});
```

---

## 6. Database Architecture

### MongoDB Basics

**What is MongoDB?**
MongoDB is a NoSQL database that stores data in JSON-like documents.

```javascript
// SQL Table (Rows and Columns)
| id | name  | age |
|----|-------|-----|
| 1  | John  | 20  |
| 2  | Jane  | 22  |

// MongoDB Collection (Documents)
[
    { _id: "abc123", name: "John", age: 20 },
    { _id: "def456", name: "Jane", age: 22 }
]
```

### Collections in Our Database

```
school_management_db/
├── schools/           ← School accounts
├── students/          ← Students with login
├── studentrecords/    ← Student records (no login)
├── teachers/          ← Teachers
├── classes/           ← Class definitions
├── examinations/      ← Exam schedules
├── marksheets/        ← Student marksheets
├── attendances/       ← Attendance records
├── notices/           ← Notice board
└── sms/               ← SMS templates/logs
```

### Database Relationships

#### One-to-Many Relationship

**Example:** One School → Many Students

```javascript
// School Model
{
    _id: "school123",
    school_name: "ABC School"
}

// Student Model
{
    _id: "student456",
    name: "John Doe",
    school: "school123"  ← References school _id
}
```

**In Code:**

```javascript
// Define relationship in model
const studentSchema = new mongoose.Schema({
    school: {
        type: mongoose.Schema.ObjectId,
        ref: 'School'  // Reference to School collection
    }
});

// Query with populated data
const students = await Student.find()
    .populate('school');  // ← Joins and includes school data

// Result:
[
    {
        _id: "student456",
        name: "John Doe",
        school: {  // ← Full school object instead of just ID
            _id: "school123",
            school_name: "ABC School"
        }
    }
]
```

### Key Models Explained

#### 1. StudentRecord Model

**File:** `api/model/studentRecord.model.js`

```javascript
const studentRecordSchema = new mongoose.Schema({
    // Personal Information
    student_name: { type: String, required: true },
    father_name: { type: String },
    date_of_birth: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },

    // School Information
    school: { type: ObjectId, ref: 'School' },  // Link to school
    class: { type: String },                     // "Class 10 - A"
    class_id: { type: ObjectId, ref: 'Class' }, // Link to class
    section: { type: String },
    roll_number: { type: String },

    // Fees
    fees: {
        total_fees: { type: Number, default: 0 },
        paid_fees: { type: Number, default: 0 },
        balance_fees: { type: Number, default: 0 }
    },

    // Status
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Transferred'],
        default: 'Active'
    }
});
```

**Why Two Student Models?**

1. **Student** (student.model.js)
   - Has login credentials
   - Used for student portal access
   - Linked to Class via ObjectId

2. **StudentRecord** (studentRecord.model.js)
   - Detailed academic records
   - Used by school admin
   - Has fees, attendance, marks

#### 2. Class Model

**File:** `api/model/class.model.js`

```javascript
const classSchema = new mongoose.Schema({
    school: { type: ObjectId, ref: 'School' },
    class_num: { type: Number, required: true },  // 10
    class_text: { type: String, required: true }, // "A"
    asignSubTeach: [{
        subject: { type: ObjectId, ref: 'Subject' },
        teacher: { type: ObjectId, ref: 'Teacher' }
    }],
    attendee: { type: ObjectId, ref: 'Teacher' }
});

// Example document:
{
    _id: "class123",
    school: "school456",
    class_num: 10,
    class_text: "A",
    asignSubTeach: [
        {
            subject: "math_id",
            teacher: "teacher_id"
        }
    ]
}
```

#### 3. Marksheet Model

**File:** `api/model/marksheet.model.js`

```javascript
const marksheetSchema = new mongoose.Schema({
    student_id: { type: String, required: true },
    student_name: { type: String, required: true },
    class: { type: String, required: true },
    section: { type: String },
    roll_number: { type: String },
    examination: { type: String, required: true },
    academic_year: { type: String },

    subjects: [{
        name: { type: String, required: true },
        marks: { type: Number, required: true },
        max_marks: { type: Number, required: true },
        grade: { type: String },
        remarks: { type: String }
    }],

    total_marks: { type: Number },
    percentage: { type: Number },
    overall_grade: { type: String },
    result: { type: String, enum: ['Pass', 'Fail'] },

    teacher_name: { type: String },
    principal_name: { type: String },
    school_name: { type: String },
    issue_date: { type: Date, default: Date.now }
});
```

### Database Queries

#### Common Query Patterns

```javascript
// 1. FIND ALL
const students = await Student.find();

// 2. FIND WITH FILTER
const students = await Student.find({ class: 'Class 10 - A' });

// 3. FIND BY ID
const student = await Student.findById('student123');

// 4. FIND WITH POPULATE (Join)
const students = await Student.find()
    .populate('school', 'school_name')  // Include school name
    .populate('student_class');         // Include full class object

// 5. FIND WITH MULTIPLE CONDITIONS
const students = await Student.find({
    school: 'school123',
    status: 'Active',
    class: 'Class 10 - A'
});

// 6. CREATE
const newStudent = new Student({ name: 'John', age: 20 });
await newStudent.save();

// 7. UPDATE
await Student.findByIdAndUpdate('student123', { name: 'Jane' });

// 8. DELETE
await Student.findByIdAndDelete('student123');

// 9. COUNT
const count = await Student.countDocuments({ status: 'Active' });

// 10. PAGINATION
const page = 1;
const limit = 10;
const students = await Student.find()
    .limit(limit)
    .skip((page - 1) * limit);
```

---

## 7. Authentication & Security

### How Authentication Works

```
1. User Login
   ↓
2. Server Validates Credentials
   ↓
3. Server Creates JWT Token
   ↓
4. Token Sent to Client
   ↓
5. Client Stores Token (localStorage)
   ↓
6. Client Sends Token with Every Request
   ↓
7. Server Verifies Token
   ↓
8. Server Processes Request
```

### JWT (JSON Web Token)

**What is JWT?**
A secure way to transmit information between parties.

```javascript
// JWT Structure:
header.payload.signature

// Example:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJ1c2VySWQiOiIxMjMiLCJyb2xlIjoiU0NIT09MIn0.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Decoded JWT:**
```javascript
{
    // Header
    alg: "HS256",
    typ: "JWT",

    // Payload (data)
    userId: "123",
    role: "SCHOOL",
    schoolId: "school456",

    // Signature (verification)
    // Secret key used to verify token hasn't been tampered
}
```

### Authentication Middleware

**File:** `api/auth/auth.js`

```javascript
const jwt = require('jsonwebtoken');

module.exports = (allowedRoles) => {
    return (req, res, next) => {
        try {
            // 1. Get token from request header
            const token = req.headers.authorization;

            if (!token) {
                return res.status(401).json({
                    message: 'No token provided'
                });
            }

            // 2. Verify token
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            //                                  ↑
            //                          Secret key from .env

            // 3. Check if user role is allowed
            if (!allowedRoles.includes(decoded.role)) {
                return res.status(403).json({
                    message: 'Insufficient permissions'
                });
            }

            // 4. Attach user data to request
            req.user = decoded;

            // 5. Continue to next middleware/controller
            next();

        } catch (error) {
            return res.status(401).json({
                message: 'Invalid token'
            });
        }
    };
};
```

### Login Flow

**Frontend:**
```javascript
// Login.jsx
const handleLogin = async () => {
    const response = await axios.post('/api/school/login', {
        email: 'admin@school.com',
        password: 'password123'
    });

    // Store token
    localStorage.setItem('token', response.data.token);

    // Store user data
    localStorage.setItem('user', JSON.stringify(response.data.user));

    // Redirect to dashboard
    navigate('/school/dashboard');
};
```

**Backend:**
```javascript
// school.controller.js
const loginSchool = async (req, res) => {
    const { email, password } = req.body;

    // 1. Find school by email
    const school = await School.findOne({ email });

    if (!school) {
        return res.status(404).json({ message: 'School not found' });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, school.password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password' });
    }

    // 3. Create JWT token
    const token = jwt.sign(
        {
            id: school._id,
            schoolId: school._id,
            role: 'SCHOOL',
            email: school.email
        },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    );

    // 4. Send response
    res.status(200).json({
        success: true,
        token: token,
        user: {
            id: school._id,
            name: school.school_name,
            role: 'SCHOOL'
        }
    });
};
```

### Making Authenticated Requests

**Frontend:**
```javascript
// Every API call includes token
const fetchStudents = async () => {
    const token = localStorage.getItem('token');

    const response = await axios.get('/api/students/all', {
        headers: {
            'Authorization': token
        }
    });
};
```

---

## 8. API Endpoints Guide

### Complete API Reference

#### School APIs

```javascript
// Authentication
POST   /api/school/register        // Create new school account
POST   /api/school/login           // School login
GET    /api/school/profile/:id     // Get school profile
PATCH  /api/school/update/:id      // Update school details

// Example Request:
POST /api/school/login
Body: {
    "email": "admin@school.com",
    "password": "password123"
}

// Example Response:
{
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR...",
    "user": {
        "id": "school123",
        "name": "ABC School",
        "role": "SCHOOL"
    }
}
```

#### Student Record APIs

```javascript
GET    /api/student-records                    // Get all student records
GET    /api/student-records?class_id=xxx       // Get students of a class
POST   /api/student-records                    // Create new student record
GET    /api/student-records/:id                // Get single student record
PUT    /api/student-records/:id                // Update student record
DELETE /api/student-records/:id                // Delete student record

// Example: Get students of a class
GET /api/student-records?class_id=class123&limit=1000

// Response:
{
    "success": true,
    "data": [
        {
            "_id": "student456",
            "student_name": "John Doe",
            "class": "Class 10 - A",
            "class_id": {
                "class_num": 10,
                "class_text": "A"
            },
            "roll_number": "101",
            "section": "A"
        }
    ]
}
```

#### Class APIs

```javascript
GET    /api/class/fetch-all         // Get all classes
POST   /api/class/create            // Create new class
GET    /api/class/fetch-single/:id  // Get single class
PATCH  /api/class/update/:id        // Update class
DELETE /api/class/delete/:id        // Delete class

// Example: Get all classes
GET /api/class/fetch-all

// Response:
{
    "success": true,
    "data": [
        {
            "_id": "class123",
            "class_num": 10,
            "class_text": "A",
            "school": "school456"
        }
    ]
}
```

#### Examination APIs

```javascript
GET    /api/examination/all                  // Get all examinations
GET    /api/examination/fetch-class/:classId // Get exams for a class
POST   /api/examination/new                  // Create new examination
GET    /api/examination/single/:id           // Get single exam
PATCH  /api/examination/update/:id           // Update exam
DELETE /api/examination/delete/:id           // Delete exam

// Example: Create exam
POST /api/examination/new
Body: {
    "exam_date": "2024-12-01",
    "subject": "subject123",
    "exam_type": "Mid Term",
    "class_id": "class123"
}
```

#### Marksheet APIs

```javascript
GET    /api/marksheets           // Get all marksheets
POST   /api/marksheets           // Create new marksheet
GET    /api/marksheets/:id       // Get single marksheet
PUT    /api/marksheets/:id       // Update marksheet
DELETE /api/marksheets/:id       // Delete marksheet
GET    /api/marksheets/:id/pdf   // Generate PDF

// Example: Create marksheet
POST /api/marksheets
Body: {
    "student_id": "student456",
    "student_name": "John Doe",
    "class": "Class 10 - A",
    "section": "A",
    "roll_number": "101",
    "examination": "Mid Term",
    "subjects": [
        {
            "name": "Mathematics",
            "marks": 85,
            "max_marks": 100,
            "grade": "A"
        },
        {
            "name": "Science",
            "marks": 90,
            "max_marks": 100,
            "grade": "A+"
        }
    ],
    "total_marks": 175,
    "percentage": 87.5,
    "overall_grade": "A",
    "result": "Pass"
}
```

#### Attendance APIs

```javascript
GET    /api/attendance/all           // Get all attendance
POST   /api/attendance/mark          // Mark attendance
GET    /api/attendance/class/:classId // Get attendance for class
GET    /api/attendance/student/:id   // Get student attendance
```

#### SMS APIs

```javascript
GET    /api/sms/templates            // Get all SMS templates
POST   /api/sms/templates            // Create SMS template
GET    /api/sms/templates/:id        // Get single template
PUT    /api/sms/templates/:id        // Update template
DELETE /api/sms/templates/:id        // Delete template
POST   /api/sms/send                 // Send SMS
GET    /api/sms/logs                 // Get SMS logs
```

---

## 9. Environment Configuration

### .env File (Backend)

**File:** `api/.env`

```bash
# Database
MONGODB_URL=mongodb://localhost:27017/school_management_db
# OR for MongoDB Atlas:
# MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/school_db

# Server
PORT=5001
NODE_ENV=development

# JWT Secret
SECRET_KEY=your_super_secret_key_here_make_it_long_and_random_123456

# SMS API (if using SMS service)
SMS_API_KEY=your_sms_api_key
SMS_SENDER_ID=SCHOOL

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# File Upload
MAX_FILE_SIZE=5242880  # 5MB in bytes
```

### environment.js (Frontend)

**File:** `frontend/src/environment.js`

```javascript
// Development
export const baseUrl = 'http://localhost:5001/api';

// Production
// export const baseUrl = 'https://api.schoolm.gentime.in/api';

// You can also detect automatically:
export const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://api.schoolm.gentime.in/api'
    : 'http://localhost:5001/api';
```

### package.json (Frontend)

**File:** `frontend/package.json`

```json
{
    "name": "school-management-frontend",
    "version": "2.0.0",
    "scripts": {
        "dev": "vite",              // Start development server
        "build": "vite build",       // Build for production
        "preview": "vite preview"    // Preview production build
    },
    "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "react-router-dom": "^6.14.0",
        "@mui/material": "^5.14.0",
        "axios": "^1.4.0"
    },
    "devDependencies": {
        "@vitejs/plugin-react": "^4.0.3",
        "vite": "^5.4.2"
    }
}
```

### package.json (Backend)

**File:** `api/package.json`

```json
{
    "name": "school-management-api",
    "version": "2.0.0",
    "scripts": {
        "start": "node server.js",           // Production
        "dev": "nodemon server.js"           // Development (auto-restart)
    },
    "dependencies": {
        "express": "^4.18.2",
        "mongoose": "^7.3.1",
        "jsonwebtoken": "^9.0.1",
        "bcryptjs": "^2.4.3",
        "dotenv": "^16.3.1",
        "cors": "^2.8.5"
    },
    "devDependencies": {
        "nodemon": "^3.0.1"
    }
}
```

---

## 10. Key Features Implementation

### Feature 1: Marksheet Generation

**Complete Flow:**

```
1. User Opens Marksheet Page
   ↓
2. Frontend Fetches Classes
   GET /api/class/fetch-all
   ↓
3. User Selects Class
   ↓
4. Frontend Fetches Students for That Class
   GET /api/student-records?class_id=xxx
   ↓
5. User Selects Student
   ↓
6. User Fills Subject Marks
   ↓
7. Frontend Calculates Total, Percentage, Grade
   ↓
8. User Clicks Save
   ↓
9. Frontend Sends Data to Backend
   POST /api/marksheets
   ↓
10. Backend Validates and Saves to Database
   ↓
11. Frontend Shows Success Message
```

**Frontend Code:**

```jsx
// MarkSheetGenerator.jsx
const MarkSheetGenerator = () => {
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [formData, setFormData] = useState({
        student_id: '',
        student_name: '',
        class: '',
        subjects: [],
        total_marks: 0,
        percentage: 0,
        overall_grade: '',
        result: 'Pass'
    });

    // Fetch classes on component load
    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        const response = await axios.get(`${baseUrl}/class/fetch-all`, {
            headers: { Authorization: localStorage.getItem('token') }
        });
        setClasses(response.data.data);
    };

    // When class is selected
    const handleClassChange = async (classObj) => {
        // Fetch students for this class
        const response = await axios.get(
            `${baseUrl}/student-records?class_id=${classObj._id}&limit=1000`,
            { headers: { Authorization: localStorage.getItem('token') } }
        );
        setStudents(response.data.data);
    };

    // Calculate grade based on percentage
    const calculateGrade = (percentage) => {
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B+';
        if (percentage >= 60) return 'B';
        if (percentage >= 50) return 'C+';
        if (percentage >= 40) return 'C';
        return 'F';
    };

    // When marks are entered
    const handleSubjectChange = (index, field, value) => {
        const updatedSubjects = [...formData.subjects];
        updatedSubjects[index][field] = value;

        // Calculate totals
        let totalMarks = 0;
        let totalMaxMarks = 0;

        updatedSubjects.forEach(subject => {
            totalMarks += parseFloat(subject.marks) || 0;
            totalMaxMarks += parseFloat(subject.max_marks) || 100;
        });

        const percentage = (totalMarks / totalMaxMarks) * 100;
        const overallGrade = calculateGrade(percentage);
        const result = percentage >= 33 ? 'Pass' : 'Fail';

        setFormData({
            ...formData,
            subjects: updatedSubjects,
            total_marks: totalMarks,
            percentage: percentage.toFixed(2),
            overall_grade: overallGrade,
            result: result
        });
    };

    // Save marksheet
    const handleSubmit = async () => {
        const response = await axios.post(
            `${baseUrl}/marksheets`,
            formData,
            { headers: { Authorization: localStorage.getItem('token') } }
        );

        if (response.data.success) {
            alert('Marksheet saved successfully!');
        }
    };

    return (
        <div>
            {/* Class Dropdown */}
            <Autocomplete
                options={classes}
                getOptionLabel={(option) =>
                    `Class ${option.class_num} - ${option.class_text}`
                }
                onChange={(e, value) => handleClassChange(value)}
                renderInput={(params) => (
                    <TextField {...params} label="Select Class" />
                )}
            />

            {/* Student Dropdown */}
            <Autocomplete
                options={students}
                getOptionLabel={(option) =>
                    `${option.student_name} - Roll: ${option.roll_number}`
                }
                onChange={(e, value) => handleStudentSelect(value)}
                renderInput={(params) => (
                    <TextField {...params} label="Select Student" />
                )}
            />

            {/* Subjects Table */}
            {formData.subjects.map((subject, index) => (
                <div key={index}>
                    <TextField
                        label="Subject"
                        value={subject.name}
                        onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                    />
                    <TextField
                        label="Marks"
                        type="number"
                        value={subject.marks}
                        onChange={(e) => handleSubjectChange(index, 'marks', e.target.value)}
                    />
                </div>
            ))}

            {/* Results */}
            <div>
                <p>Total: {formData.total_marks}</p>
                <p>Percentage: {formData.percentage}%</p>
                <p>Grade: {formData.overall_grade}</p>
                <p>Result: {formData.result}</p>
            </div>

            {/* Save Button */}
            <Button onClick={handleSubmit}>Save Marksheet</Button>
        </div>
    );
};
```

**Backend Code:**

```javascript
// marksheet.controller.js
const createMarksheet = async (req, res) => {
    try {
        const marksheetData = req.body;

        // Validation
        if (!marksheetData.student_name || !marksheetData.examination) {
            return res.status(400).json({
                success: false,
                message: 'Student name and examination are required'
            });
        }

        // Check all subjects have marks
        const invalidSubjects = marksheetData.subjects.filter(
            subject => !subject.name || subject.marks === ''
        );

        if (invalidSubjects.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'All subjects must have marks'
            });
        }

        // Save to database
        const newMarksheet = new Marksheet(marksheetData);
        await newMarksheet.save();

        res.status(201).json({
            success: true,
            message: 'Marksheet created successfully',
            data: newMarksheet
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating marksheet',
            error: error.message
        });
    }
};
```

### Feature 2: SMS Management

**How It Works:**

```
1. Admin Creates SMS Template
   - Template: "Dear Parent, {{student_name}} is absent today."
   - Variables: {{student_name}}, {{date}}, etc.
   ↓
2. Admin Selects Template to Send
   ↓
3. System Fetches Student/Parent Data
   ↓
4. System Replaces Variables with Actual Data
   - "Dear Parent, John Doe is absent today."
   ↓
5. System Sends SMS via SMS Gateway
   ↓
6. System Logs SMS in Database
```

**Frontend Code:**

```jsx
// SmsManagement.jsx
const SmsManagement = () => {
    const [templates, setTemplates] = useState([]);
    const [templateForm, setTemplateForm] = useState({
        template_name: '',
        template_code: '',
        message_template: '',
        variables: []
    });

    // Fetch templates
    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        const response = await axios.get(`${baseUrl}/sms/templates`, {
            headers: { Authorization: localStorage.getItem('token') }
        });
        setTemplates(response.data.data);
    };

    // Create template
    const handleSaveTemplate = async () => {
        const response = await axios.post(
            `${baseUrl}/sms/templates`,
            templateForm,
            { headers: { Authorization: localStorage.getItem('token') } }
        );

        if (response.data.success) {
            alert('Template saved!');
            fetchTemplates();
        }
    };

    // Add variable to template
    const handleAddVariable = () => {
        setTemplateForm({
            ...templateForm,
            variables: [...templateForm.variables, { name: '', value: '' }]
        });
    };

    return (
        <div>
            {/* Create Template Form */}
            <TextField
                label="Template Name"
                value={templateForm.template_name}
                onChange={(e) => setTemplateForm({
                    ...templateForm,
                    template_name: e.target.value
                })}
            />

            <TextField
                label="Message Template"
                multiline
                rows={4}
                value={templateForm.message_template}
                onChange={(e) => setTemplateForm({
                    ...templateForm,
                    message_template: e.target.value
                })}
                helperText="Use {{variable_name}} for dynamic content"
            />

            {/* Variables */}
            {templateForm.variables.map((variable, index) => (
                <TextField
                    key={index}
                    label="Variable Name"
                    value={variable.name}
                    onChange={(e) => {
                        const updatedVars = [...templateForm.variables];
                        updatedVars[index].name = e.target.value;
                        setTemplateForm({
                            ...templateForm,
                            variables: updatedVars
                        });
                    }}
                />
            ))}

            <Button onClick={handleAddVariable}>Add Variable</Button>
            <Button onClick={handleSaveTemplate}>Save Template</Button>

            {/* Template List */}
            {templates.map(template => (
                <Card key={template._id}>
                    <h3>{template.template_name}</h3>
                    <p>{template.message_template}</p>
                    <Button onClick={() => handleEditTemplate(template)}>
                        Edit
                    </Button>
                    <Button onClick={() => handleDeleteTemplate(template._id)}>
                        Delete
                    </Button>
                </Card>
            ))}
        </div>
    );
};
```

---

## 11. Data Flow Examples

### Example 1: Login Flow

```
┌─────────────────────────────────────────────────────┐
│ 1. USER ENTERS CREDENTIALS                         │
│    Email: admin@school.com                          │
│    Password: password123                            │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 2. FRONTEND SENDS POST REQUEST                     │
│    POST /api/school/login                           │
│    Body: { email, password }                        │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 3. BACKEND ROUTER RECEIVES REQUEST                 │
│    router.post('/login', loginSchool)               │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 4. CONTROLLER VALIDATES CREDENTIALS                │
│    - Find school by email in database               │
│    - Compare password hash                          │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 5. IF VALID: GENERATE JWT TOKEN                    │
│    token = jwt.sign({ id, role, schoolId }, secret)│
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 6. SEND RESPONSE TO FRONTEND                       │
│    { success: true, token, user: {...} }           │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 7. FRONTEND STORES TOKEN                           │
│    localStorage.setItem('token', token)             │
│    localStorage.setItem('user', JSON.stringify(user))│
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 8. FRONTEND REDIRECTS TO DASHBOARD                 │
│    navigate('/school/dashboard')                    │
└─────────────────────────────────────────────────────┘
```

### Example 2: Fetching Students for a Class

```
┌─────────────────────────────────────────────────────┐
│ 1. USER SELECTS CLASS FROM DROPDOWN                │
│    Selected: Class 10 - A (ID: class123)           │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 2. FRONTEND TRIGGERS handleClassChange()           │
│    Extracts classObj._id = "class123"               │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 3. FRONTEND SENDS GET REQUEST                      │
│    GET /api/student-records?class_id=class123       │
│    Headers: { Authorization: token }                │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 4. BACKEND ROUTER RECEIVES REQUEST                 │
│    router.get('/', authMiddleware, getAllStudents) │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 5. AUTH MIDDLEWARE VERIFIES TOKEN                  │
│    - Extracts token from header                     │
│    - Verifies with SECRET_KEY                       │
│    - Attaches decoded user to req.user              │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 6. CONTROLLER QUERIES DATABASE                     │
│    StudentRecord.find({                             │
│        school: req.user.schoolId,                   │
│        class_id: req.query.class_id                 │
│    }).populate('class_id')                          │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 7. DATABASE RETURNS RESULTS                        │
│    [                                                 │
│        { _id: "s1", name: "John", class_id: {...} },│
│        { _id: "s2", name: "Jane", class_id: {...} } │
│    ]                                                 │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 8. BACKEND SENDS RESPONSE                          │
│    { success: true, data: [...students] }          │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 9. FRONTEND RECEIVES DATA                          │
│    setStudents(response.data.data)                  │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 10. REACT RE-RENDERS COMPONENT                     │
│     Student dropdown now shows:                     │
│     - John Doe - Roll: 101                          │
│     - Jane Smith - Roll: 102                        │
└─────────────────────────────────────────────────────┘
```

### Example 3: Saving a Marksheet

```
┌─────────────────────────────────────────────────────┐
│ 1. USER FILLS MARKSHEET FORM                       │
│    - Selected Class: Class 10 - A                   │
│    - Selected Student: John Doe                     │
│    - Subjects: Math (85), Science (90)              │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 2. FRONTEND CALCULATES RESULTS                     │
│    - Total: 175                                      │
│    - Percentage: 87.5%                               │
│    - Grade: A                                        │
│    - Result: Pass                                    │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 3. USER CLICKS "SAVE MARKSHEET"                    │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 4. FRONTEND SENDS POST REQUEST                     │
│    POST /api/marksheets                             │
│    Headers: { Authorization: token }                │
│    Body: {                                           │
│        student_id: "student456",                    │
│        student_name: "John Doe",                    │
│        class: "Class 10 - A",                       │
│        subjects: [...],                              │
│        total_marks: 175,                             │
│        percentage: 87.5,                             │
│        overall_grade: "A",                           │
│        result: "Pass"                                │
│    }                                                 │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 5. BACKEND ROUTER RECEIVES REQUEST                 │
│    router.post('/', authMiddleware, createMarksheet)│
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 6. AUTH MIDDLEWARE CHECKS PERMISSION               │
│    - Verifies token                                  │
│    - Checks role = 'SCHOOL'                         │
│    - Allows request to continue                     │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 7. CONTROLLER VALIDATES DATA                       │
│    - Check student_name exists                      │
│    - Check examination exists                        │
│    - Check all subjects have marks                  │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 8. CONTROLLER CREATES MARKSHEET DOCUMENT           │
│    const newMarksheet = new Marksheet(formData)     │
│    await newMarksheet.save()                         │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 9. MONGODB SAVES DOCUMENT                          │
│    Document inserted with _id: "marksheet789"       │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 10. BACKEND SENDS SUCCESS RESPONSE                 │
│     { success: true, data: { _id: "...", ... } }   │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 11. FRONTEND RECEIVES RESPONSE                     │
│     - Shows success message                          │
│     - Refreshes marksheet list                       │
│     - Closes dialog                                  │
└─────────────────────────────────────────────────────┘
```

---

## 12. Deployment Guide

### Local Development Setup

**Prerequisites:**
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

**Steps:**

1. **Clone Repository**
```bash
git clone https://github.com/yourusername/school-management-system.git
cd school-management-system
```

2. **Setup Backend**
```bash
cd api
npm install
```

Create `.env` file:
```bash
MONGODB_URL=mongodb://localhost:27017/school_management_db
PORT=5001
SECRET_KEY=your_super_secret_key_here
```

Start backend:
```bash
npm run dev
```

3. **Setup Frontend**
```bash
cd frontend
npm install
```

Update `src/environment.js`:
```javascript
export const baseUrl = 'http://localhost:5001/api';
```

Start frontend:
```bash
npm run dev
```

4. **Access Application**
```
Frontend: http://localhost:5173
Backend: http://localhost:5001
```

### Production Deployment (VPS)

**Prerequisites:**
- Ubuntu VPS
- Domain name (optional)
- SSH access

**Steps:**

1. **Connect to VPS**
```bash
ssh root@your-vps-ip
```

2. **Install Dependencies**
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install MongoDB
# Follow: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/

# Install Nginx
apt install -y nginx

# Install PM2 (Process Manager)
npm install -g pm2
```

3. **Clone and Setup Project**
```bash
cd /var/www
git clone https://github.com/yourusername/school-management-system.git schoolm
cd schoolm
```

4. **Setup Backend**
```bash
cd api
npm install

# Create .env
nano .env
```

```bash
MONGODB_URL=mongodb://localhost:27017/school_management_db
PORT=5001
SECRET_KEY=production_secret_key_change_this
NODE_ENV=production
```

Start with PM2:
```bash
pm2 start server.js --name schoolm-api
pm2 save
pm2 startup
```

5. **Setup Frontend**
```bash
cd ../frontend
npm install

# Update environment
nano src/environment.js
```

```javascript
export const baseUrl = 'https://api.yourdom ain.com/api';
// or
export const baseUrl = 'http://your-vps-ip:5001/api';
```

Build:
```bash
npm run build
```

6. **Configure Nginx**
```bash
nano /etc/nginx/sites-available/schoolm
```

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /var/www/schoolm/frontend/dist;
        try_files $uri $uri/ /index.html;

        # Cache busting
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
ln -s /etc/nginx/sites-available/schoolm /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

7. **SSL Certificate (Optional)**
```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com
```

### Deployment Workflow

**When You Make Changes:**

1. **Development**
```bash
# Make changes
# Test locally
git add .
git commit -m "Your changes"
git push
```

2. **Deploy to Production**
```bash
# SSH to VPS
ssh root@your-vps-ip

# Pull latest code
cd /var/www/schoolm
git pull

# Update backend
cd api
pm2 restart schoolm-api

# Update frontend
cd ../frontend
npm run build

# Clear nginx cache if needed
nginx -s reload
```

---

## Summary

This documentation covers:

✅ **Project Overview** - What the system does
✅ **Technology Stack** - React, Express, MongoDB explained
✅ **Project Structure** - Every folder and file
✅ **Frontend** - React components, state, effects, props
✅ **Backend** - Express, routes, controllers, models
✅ **Database** - MongoDB, schemas, relationships, queries
✅ **Authentication** - JWT, login flow, middleware
✅ **APIs** - Complete endpoint reference
✅ **Environment** - Configuration files
✅ **Features** - Marksheet, SMS implementation
✅ **Data Flow** - Step-by-step examples
✅ **Deployment** - Local and production setup

You now have complete knowledge of:
- How React builds UIs
- How Express creates APIs
- How MongoDB stores data
- How authentication works
- How frontend and backend communicate
- How to deploy the application

This is a **professional, production-ready** school management system!

---

**Generated by Claude Code**
**Date:** October 31, 2024
