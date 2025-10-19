# React Frontend Complete Guide - School Management System

## Table of Contents
1. [React Fundamentals](#1-react-fundamentals)
2. [React Hooks in Detail](#2-react-hooks-in-detail)
3. [Component Architecture](#3-component-architecture)
4. [Routing with React Router](#4-routing-with-react-router)
5. [Context API](#5-context-api)
6. [Material-UI Components](#6-material-ui-components)
7. [Form Handling](#7-form-handling)
8. [State Management](#8-state-management)
9. [API Integration](#9-api-integration)
10. [Protected Routes](#10-protected-routes)
11. [Component Examples](#11-component-examples)
12. [Data Flow](#12-data-flow)

---

## 1. React Fundamentals

### What is React?
React is a JavaScript library for building user interfaces, developed by Facebook. It allows developers to create reusable UI components and manage the state of complex applications efficiently.

**Key Concepts:**

#### Components
Components are the building blocks of React applications. They are reusable pieces of code that return JSX to be rendered to the screen.

**Types of Components:**
1. **Functional Components** - Modern approach using functions (used throughout this project)
2. **Class Components** - Legacy approach using ES6 classes (not used in this project)

```jsx
// Example from our project - Students.jsx
export default function Students() {
  // Component logic here
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* JSX content */}
    </Container>
  );
}
```

#### JSX (JavaScript XML)
JSX is a syntax extension for JavaScript that looks similar to HTML. It allows you to write HTML-like code in your JavaScript files.

**Key JSX Rules:**
- Use `className` instead of `class` for CSS classes
- Use camelCase for attribute names (e.g., `onClick` instead of `onclick`)
- All tags must be closed (self-closing tags like `<img />`)
- Can embed JavaScript expressions using curly braces `{}`

```jsx
// Example from Students.jsx
<Typography variant="h3" component="h1" gutterBottom>
  Student Management
</Typography>
```

#### Virtual DOM
The Virtual DOM is a lightweight copy of the actual DOM. React uses it to:
1. Keep track of changes in the application state
2. Calculate the minimal set of changes needed
3. Update only the changed parts in the real DOM

**How it works:**
1. When state changes, React creates a new Virtual DOM tree
2. Compares it with the previous Virtual DOM (diffing)
3. Calculates the differences (reconciliation)
4. Updates only the changed nodes in the real DOM (efficient!)

**Example from our project:**
```jsx
// When students array changes, React efficiently updates only the table rows
{students && students.length > 0 ? (
  students.map((student, index) => (
    <StyledTableRow key={index}>
      {/* Row content */}
    </StyledTableRow>
  ))
) : (
  <TableRow>
    <TableCell colSpan={6}>No students found</TableCell>
  </TableRow>
)}
```

---

## 2. React Hooks in Detail

Hooks are functions that let you "hook into" React state and lifecycle features from functional components.

### useState Hook

**Purpose:** Manage local state in functional components

**Syntax:** `const [state, setState] = useState(initialValue)`

**Examples from Students.jsx:**

```jsx
// Line 121-126: Managing multiple state variables
const [studentClass, setStudentClass] = useState([]);     // Array of classes
const [courses, setCourses] = useState([]);               // Array of courses
const [students, setStudents] = useState([]);             // Array of students
const [isEdit, setEdit] = useState(false);                // Boolean for edit mode
const [editId, setEditId] = useState(null);               // ID being edited
const [viewMode, setViewMode] = useState('table');        // View mode: 'table' or 'cards'

// Line 128-129: File upload state
const [file, setFile] = useState(null);                   // File object
const [imageUrl, setImageUrl] = useState(null);           // Image preview URL

// Line 139: Dynamic query parameters
const [params, setParams] = useState({});                 // Search/filter params

// Line 200-202: Notification state
const [message, setMessage] = useState("");               // Message text
const [type, setType] = useState("success");              // Message type: success/error
```

**How useState works:**
1. Returns an array with two elements: current state and updater function
2. When updater is called, component re-renders with new state
3. State persists between re-renders

**Example - Updating state:**
```jsx
// Line 140-145: Updating params state
const handleClass = (e) => {
  setParams((prevParams) => ({
    ...prevParams,                          // Spread previous params
    student_class: e.target.value || undefined,  // Add/update class filter
  }));
};
```

### useEffect Hook

**Purpose:** Perform side effects (data fetching, subscriptions, manual DOM changes)

**Syntax:** `useEffect(() => { /* effect */ }, [dependencies])`

**Examples from Students.jsx:**

```jsx
// Line 310-314: Fetch data when component mounts or dependencies change
useEffect(() => {
  fetchStudents();      // Fetch students list
  fetchStudentClass();  // Fetch classes
  fetchCourses();       // Fetch courses
}, [message, params]);  // Re-run when message or params change
```

**Dependency Array Explained:**
- `[]` - Runs once on mount (componentDidMount)
- `[dep1, dep2]` - Runs when dep1 or dep2 changes
- No array - Runs on every render (avoid!)

**Example from SchoolDashboard.jsx:**

```jsx
// Line 240-242: Runs on mount and when message changes
useEffect(() => {
  fetchData();
}, [message]);

// Line 245-250: Refresh when external trigger changes
useEffect(() => {
  if (refreshTrigger > 0) {
    console.log('Dashboard refreshing due to external trigger...');
    fetchData();
  }
}, [refreshTrigger]);

// Line 253-260: Auto-refresh every 30 seconds
useEffect(() => {
  const interval = setInterval(() => {
    console.log('Auto-refreshing dashboard fees data...');
    fetchData();
  }, 30000);

  return () => clearInterval(interval);  // Cleanup function
}, []);

// Line 263-273: Listen to visibility change events
useEffect(() => {
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      console.log('Window became visible, refreshing dashboard data...');
      fetchData();
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
}, []);
```

### useContext Hook

**Purpose:** Access context values without prop drilling

**Syntax:** `const value = useContext(MyContext)`

**Example from App.jsx:**

```jsx
// Line 57: Accessing AuthContext
const { authenticated, login } = useContext(AuthContext);
```

**Example from ProtectedRoute.jsx:**

```jsx
// Line 7: Accessing authentication state from context
const { user, loading, authenticated } = useContext(AuthContext);
```

### useCallback Hook

**Purpose:** Memoize callback functions to prevent unnecessary re-renders

**Syntax:** `const memoizedCallback = useCallback(() => { /* callback */ }, [dependencies])`

**Use case:** Pass optimized callbacks to child components

```jsx
// Example (not in current code but commonly used):
const handleStudentClick = useCallback((studentId) => {
  console.log('Student clicked:', studentId);
}, []); // Function reference stays same across re-renders
```

### useMemo Hook

**Purpose:** Memoize expensive calculations

**Syntax:** `const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])`

**Example from SchoolDashboard.jsx:**

```jsx
// Line 96-140: Complex calculation that could be memoized
const calculateFeesFromRecords = (studentRecords) => {
  // Expensive calculation
  // Could be wrapped in useMemo if studentRecords doesn't change often
};
```

### useRef Hook

**Purpose:** Create mutable references that persist across renders, access DOM elements

**Syntax:** `const refContainer = useRef(initialValue)`

**Examples from Students.jsx:**

```jsx
// Line 316: Create reference to file input element
const fileInputRef = useRef(null);

// Line 317-323: Access and manipulate DOM element
const handleClearFile = () => {
  if (fileInputRef.current) {
    fileInputRef.current.value = "";  // Direct DOM manipulation
  }
  setFile(null);
  setImageUrl(null);
};

// Line 374: Attach ref to input element
<TextField
  inputRef={fileInputRef}  // Connect ref to DOM element
  type="file"
  onChange={addImage}
/>
```

**useRef vs useState:**
- useRef: Doesn't trigger re-render when value changes
- useState: Triggers re-render when value changes

---

## 3. Component Architecture

### Component Structure Overview

```
frontend/src/
├── App.jsx                          # Root component with routing
├── main.jsx                         # Entry point, renders App
├── context/
│   ├── AuthContext.jsx             # Authentication state management
│   └── DashboardContext.jsx        # Dashboard state management
├── guards/
│   └── ProtectedRoute.jsx          # Route protection logic
├── client/                          # Public-facing components
│   ├── Client.jsx                  # Client layout wrapper
│   └── components/
│       ├── home/Home.jsx           # Landing page
│       ├── login/Login.jsx         # Login form
│       ├── register/Register.jsx   # Registration form
│       ├── contact/Contact.jsx     # Contact page
│       └── logout/Logout.jsx       # Logout handler
├── school/                          # School admin components
│   ├── School.jsx                  # School layout wrapper
│   └── components/
│       ├── dashboard/SchoolDashboard.jsx  # Admin dashboard
│       ├── students/Students.jsx          # Student management
│       ├── teachers/Teachers.jsx          # Teacher management
│       ├── class/Class.jsx                # Class management
│       ├── subjects/Subjects.jsx          # Subject management
│       ├── courses/Courses.jsx            # Course management
│       ├── examinations/Examinations.jsx  # Exam management
│       ├── attendance/                    # Attendance components
│       ├── periods/Schedule.jsx           # Schedule management
│       ├── fees/FeesManagement.jsx        # Fees management
│       └── notice/NoticeSchool.jsx        # Notice board
├── student/                         # Student portal components
│   ├── Student.jsx                 # Student layout wrapper
│   └── components/
│       ├── student details/StudentDetails.jsx
│       ├── examination/StudentExaminations.jsx
│       ├── attendance/AttendanceStudent.jsx
│       ├── schedule/ScheduleStudent.jsx
│       └── notice/NoticeStudent.jsx
├── teacher/                         # Teacher portal components
│   ├── Teacher.jsx                 # Teacher layout wrapper
│   └── components/
│       ├── teacher details/TeacherDetails.jsx
│       ├── teacher examinations/TeacherExaminations.jsx
│       ├── attendance/AttendanceTeacher.jsx
│       ├── periods/TeacherSchedule.jsx
│       └── notice/Notice.jsx
└── basic utility components/
    ├── CustomizedSnackbars.jsx     # Notification component
    └── lightTheme.jsx              # MUI theme configuration
```

### Component Types

#### 1. Layout Components (Wrappers)
These provide consistent structure across sections:

**Client.jsx** - Public website layout
**School.jsx** - School admin layout
**Student.jsx** - Student portal layout
**Teacher.jsx** - Teacher portal layout

#### 2. Page Components
Full pages that match routes:

**Students.jsx** - Complete student management page
**SchoolDashboard.jsx** - Admin dashboard with statistics
**Login.jsx** - Authentication page

#### 3. Utility Components
Reusable small components:

**CustomizedSnackbars.jsx** - Toast notifications
**StudentCard.jsx** - Student display card
**TeacherCard.jsx** - Teacher display card

---

## 4. Routing with React Router

### Router Setup (App.jsx)

```jsx
// Line 7: Import routing components
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

// Line 62-117: Router structure
<BrowserRouter>
  <Routes>
    {/* Routes defined here */}
  </Routes>
</BrowserRouter>
```

### Complete Route Breakdown

#### School Admin Routes (Protected by SCHOOL role)
```jsx
// Line 65-86: School routes - All wrapped in ProtectedRoute
<Route path="school" element={<ProtectedRoute allowedRoles={['SCHOOL']}><School/></ProtectedRoute>}>
  {/* Index route - default child route */}
  <Route index element={<SchoolDashboard />} />

  {/* Content Management */}
  <Route path="front-page" element={<FrontPageManagement />} />
  <Route path="public-home" element={<PublicHomePageManagement />} />

  {/* Academic Management */}
  <Route path="courses" element={<Courses />} />
  <Route path="class" element={<Class />} />
  <Route path="class-details" element={<ClassDetails />} />
  <Route path="subject" element={<Subject />} />

  {/* People Management */}
  <Route path="students" element={<Students />} />
  <Route path="teachers" element={<Teachers />} />
  <Route path="student-records" element={<StudentRecords />} />

  {/* Schedule & Attendance */}
  <Route path="assign-period" element={<AssignPeriod2 />} />
  <Route path="periods" element={<Schedule />} />
  <Route path="attendance" element={<StudentAttendanceList />} />
  <Route path="attendance-report" element={<AttendanceReport />} />
  <Route path="attendance-student/:studentId" element={<AttendanceDetails />} />

  {/* Academics & Finance */}
  <Route path="examinations" element={<Examinations />} />
  <Route path="fees" element={<FeesManagement />} />
  <Route path="marksheets" element={<MarkSheetGenerator />} />

  {/* Communication */}
  <Route path="sms" element={<SmsManagement />} />
  <Route path="notice" element={<NoticeSchool/>} />
</Route>
```

**Explanation:**
- `path="school"` - Parent route, matches `/school`
- `element={<ProtectedRoute allowedRoles={['SCHOOL']}><School/></ProtectedRoute>}` - Wrapper component with role checking
- `<Route index>` - Renders when user visits `/school` exactly
- Nested routes like `path="students"` match `/school/students`
- URL parameters like `:studentId` capture dynamic values

#### Student Routes (Protected by STUDENT role)
```jsx
// Line 88-96: Student routes
<Route path="student" element={<ProtectedRoute allowedRoles={['STUDENT']}><Student/></ProtectedRoute>}>
  <Route index element={<StudentDetails />}/>
  <Route path="student-details" element={<StudentDetails />} />
  <Route path="app" element={<StudentApp />} />
  <Route path="examinations" element={<StudentExaminations />} />
  <Route path='periods' element={<ScheduleStudent/>} />
  <Route path="attendance" element={<AttendanceStudent />} />
  <Route path="notice" element={<NoticeStudent/>} />
</Route>
```

**Matches:**
- `/student` → StudentDetails (index route)
- `/student/examinations` → StudentExaminations
- `/student/attendance` → AttendanceStudent

#### Teacher Routes (Protected by TEACHER role)
```jsx
// Line 98-106: Teacher routes
<Route path="teacher" element={<ProtectedRoute allowedRoles={['TEACHER']}><Teacher/></ProtectedRoute>}>
  <Route index element={<TeacherDetails />}/>
  <Route path="details" element={<TeacherDetails />} />
  <Route path="examinations" element={<TeacherExaminations />} />
  <Route path="periods" element={<TeacherSchedule />} />
  <Route path="attendance" element={<AttendanceTeacher />} />
  <Route path="notice" element={<NoticeTeacher/>} />
</Route>
```

#### Public Routes (No authentication required)
```jsx
// Line 108-115: Public client routes
<Route path="/" element={<Client />}>
  <Route index element={<Navigate to="/home" replace />} />
  <Route path="home" element={<Home />} />
  <Route path="contact" element={<Contact />} />
  <Route path="login" element={<Login />} />
  <Route path="register" element={<Register />} />
  <Route path="logout" element={<Logout />} />
</Route>
```

**Special Features:**
- `<Navigate to="/home" replace />` - Redirects `/` to `/home`
- `replace` prop - Replaces current history entry instead of adding new one

### Route Concepts

**Nested Routes:**
Parent route renders layout, child routes render inside it via `<Outlet />` component

**Protected Routes:**
Wrapped in `ProtectedRoute` component which checks authentication and authorization

**Dynamic Routes:**
Use `:paramName` syntax for URL parameters:
```jsx
<Route path="attendance-student/:studentId" element={<AttendanceDetails />} />
// Matches: /school/attendance-student/12345
// Access in component: useParams() → { studentId: "12345" }
```

---

## 5. Context API

### AuthContext.jsx - Complete Breakdown

**Purpose:** Manage authentication state globally without prop drilling

#### Line-by-Line Explanation:

```jsx
// Line 1: Disable prop-types validation warnings
/* eslint-disable react/prop-types */

// Line 2: Import React and hooks
import React, { createContext, useState, useEffect } from 'react';

// Line 4: Create Context object
// This creates two things: AuthContext.Provider and AuthContext.Consumer
export const AuthContext = createContext();

// Line 6: AuthProvider component - wraps app to provide context
export const AuthProvider = ({ children }) => {
  // children = All components wrapped by AuthProvider

  // Line 7-9: State variables
  const [authenticated, setAuthenticated] = useState(false)  // Is user logged in?
  const [user, setUser] = useState(null);                   // User data object
  const [loading, setLoading] = useState(false);            // Loading indicator

  // Line 14-25: Check for existing login on mount
  useEffect(() => {
    // Runs once when component mounts

    // Line 15-16: Get stored data from localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem("user");

    // Line 18: If token exists, user is logged in
    if (token) {
      console.log("token", token)

      // Line 20-21: Set authentication state
      setAuthenticated(true)
      setUser(JSON.parse(userData));  // Parse JSON string to object
    } else {
      // Line 23: No token, not loading
      setLoading(false);
    }
  }, []);  // Empty dependency array = run once on mount

  // Line 28-33: Login function
  const login = (credentials) => {
    // Called from Login component after successful API response

    setAuthenticated(true);         // Set logged in flag
    setUser(credentials)            // Store user data
    console.log("login called", credentials)
  };

  // Line 36-41: Logout function
  const logout = () => {
    // Called from Logout component

    localStorage.removeItem('token');      // Clear token
    localStorage.removeItem('user')        // Clear user data
    setUser(null);                         // Reset user state
    setAuthenticated(false)                // Set logged out flag
  };

  // Line 44-48: Provide context to children
  return (
    <AuthContext.Provider value={{authenticated, user, login, logout, loading }}>
      {children}  {/* Render all wrapped components */}
    </AuthContext.Provider>
  );
};
```

### How Context Works

**1. Create Context:**
```jsx
const AuthContext = createContext();
```
Creates a context object with Provider and Consumer

**2. Provide Context:**
```jsx
// In main.jsx (Line 14-16)
<AuthProvider>
  <App />
</AuthProvider>
```
Wraps the app, making context available to all children

**3. Consume Context:**
```jsx
// In any component (App.jsx Line 57)
const { authenticated, login } = useContext(AuthContext);
```
Access context values without passing props

### Context Flow Diagram

```
main.jsx
  └─> <AuthProvider>  (creates context)
        ├─> value={{ authenticated, user, login, logout, loading }}
        └─> <App>
              ├─> useContext(AuthContext) → { authenticated, user, ... }
              └─> <ProtectedRoute>
                    ├─> useContext(AuthContext) → { user, loading, authenticated }
                    └─> Checks authentication
```

---

## 6. Material-UI Components

Material-UI (MUI) is a React component library implementing Google's Material Design.

### Theme Configuration

**lightTheme.jsx - Complete Breakdown:**

```jsx
// Line 2: Import MUI theme creator
import { createTheme } from "@mui/material/styles";

// Line 4-61: Create custom theme
const lightTheme = createTheme({
  palette: {
    mode: 'light',              // Light mode theme
    primary: {
      main: '#1976D2',          // Blue - buttons, links
    },
    secondary: {
      main: '#FF4081',          // Pink - accents
    },
    background: {
      default: '#F5F5F5',       // Page background
      paper: '#FFFFFF',         // Cards, dialogs
    },
    text: {
      primary: '#333333',       // Main text color
      secondary: '#666666',     // Muted text
    },
  },
  components: {
    // Typography customization
    MuiTypography:{
        fontFamily: 'Roboto, Arial, sans-serif',
        h1: {
          fontSize: '2rem',
          fontWeight: 700,
        },
        body1: {
          fontSize: '1rem',
          color: '#333',
        },
    },
    // Input field customization
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: '#333333',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#CCCCCC',    // Default border
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1976D2',    // Hover border
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1976D2',    // Focused border
          },
        },
      },
    },
    // Label customization
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#666666',            // Default label
          '&.Mui-focused': {
            color: '#1976D2',          // Focused label
          },
        },
      },
    },
  },
});

export default lightTheme;
```

### MUI Components Used in Project

#### 1. Layout Components

**Container:**
```jsx
// Students.jsx Line 326
<Container maxWidth="xl" sx={{ py: 4 }}>
  {/* Content */}
</Container>
```
- `maxWidth="xl"` - Max width 1536px
- `sx={{ py: 4 }}` - Padding top/bottom: 4 * 8px = 32px

**Box:**
```jsx
// General purpose container with flexbox support
<Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
  {/* Items */}
</Box>
```

**Grid:**
```jsx
// Students.jsx Line 388-631
<Grid container spacing={2}>
  <Grid item xs={12} md={6}>
    <TextField fullWidth label="Email" />
  </Grid>
  <Grid item xs={12} md={6}>
    <TextField fullWidth label="Name" />
  </Grid>
</Grid>
```
- `spacing={2}` - Gap between items: 2 * 8px = 16px
- `xs={12}` - Full width on mobile (12/12 columns)
- `md={6}` - Half width on medium screens (6/12 columns)

#### 2. Data Display Components

**Card:**
```jsx
// Students.jsx Line 336-346
<StyledHeaderCard>
  <CardContent sx={{ textAlign: 'center', py: 4 }}>
    <SchoolIcon sx={{ fontSize: 60, mb: 2 }} />
    <Typography variant="h3">Student Management</Typography>
  </CardContent>
</StyledHeaderCard>
```

**Table:**
```jsx
// Students.jsx Line 711-880
<TableContainer component={Paper}>
  <Table sx={{ minWidth: 650 }}>
    <TableHead>
      <TableRow>
        <TableCell>Student Details</TableCell>
        <TableCell>Course</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {students.map((student, index) => (
        <TableRow key={index}>
          <TableCell>{student.name}</TableCell>
          <TableCell>{student.course?.courseName}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
```

**Typography:**
```jsx
// Different variants
<Typography variant="h3">Heading 3</Typography>
<Typography variant="h6">Heading 6</Typography>
<Typography variant="body1">Body text</Typography>
<Typography variant="caption">Small text</Typography>
```

**Chip:**
```jsx
// Students.jsx Line 654-659
<Chip
  label={value.class_text}
  variant="outlined"
  color="primary"
  size="small"
/>
```

**Avatar:**
```jsx
// Students.jsx Line 745-754
<Avatar
  src={`/images/uploaded/student/${student.student_image}`}
  alt={student.name}
  sx={{
    width: 60,
    height: 60,
    border: '3px solid #1976d2',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  }}
/>
```

#### 3. Input Components

**TextField:**
```jsx
// Students.jsx Line 390-403
<TextField
  fullWidth                           // Take full width
  label="Email"                       // Floating label
  variant="outlined"                  // Border style
  name="email"                        // Form field name
  value={Formik.values.email}        // Controlled value
  onChange={Formik.handleChange}     // Update handler
  onBlur={Formik.handleBlur}         // Touch handler
/>
```

**Select:**
```jsx
// Students.jsx Line 424-440
<FormControl fullWidth>
  <InputLabel>Course</InputLabel>
  <Select
    label="Course"
    name="course"
    onChange={Formik.handleChange}
    value={Formik.values.course}
  >
    {courses.map((course, i) => (
      <MenuItem key={i} value={course._id}>
        {course.courseName} ({course.courseCode})
      </MenuItem>
    ))}
  </Select>
</FormControl>
```

#### 4. Navigation Components

**Tabs:**
```jsx
// Students.jsx Line 684-702
<Tabs
  value={viewMode}
  onChange={(e, newValue) => setViewMode(newValue)}
  indicatorColor="primary"
  textColor="primary"
>
  <Tab
    icon={<TableViewIcon />}
    label="Table"
    value="table"
  />
  <Tab
    icon={<ViewModuleIcon />}
    label="Cards"
    value="cards"
  />
</Tabs>
```

#### 5. Feedback Components

**IconButton:**
```jsx
// Students.jsx Line 849-856
<Tooltip title="Edit Student">
  <ActionButton
    color="primary"
    onClick={() => handleEdit(student._id)}
  >
    <EditIcon />
  </ActionButton>
</Tooltip>
```

**Button:**
```jsx
// Students.jsx Line 613-629
<Button
  type="submit"
  variant="contained"      // Filled style
  color="primary"
  sx={{ marginRight: 2, borderRadius: '10px' }}
>
  {isEdit ? "Update Student" : "Register Student"}
</Button>
```

### Styled Components (MUI + Emotion)

```jsx
// Students.jsx Line 52-58
const StyledHeaderCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  marginBottom: theme.spacing(3),
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
}));
```

**Benefits:**
- Type-safe styling
- Theme access
- Automatic CSS optimization
- No className collisions

---

## 7. Form Handling

### Formik Integration

Formik is a form library that handles form state, validation, and submission.

#### Setup (Students.jsx)

```jsx
// Line 30: Import Formik
import { useFormik } from "formik";

// Line 34: Import validation schema
import { studentSchema } from "../../../yupSchema/studentSchema";

// Line 204-217: Define initial values
const initialValues = {
  name: "",
  email: "",
  student_class: "",
  course: "",
  gender: "",
  age: "",
  guardian: "",
  guardian_phone: "",
  aadhaar_number: "",
  password: "",
  total_fees: "",
  paid_fees: "",
};

// Line 219-280: Initialize Formik
const Formik = useFormik({
  initialValues,                    // Initial form state
  validationSchema: studentSchema,  // Yup validation schema
  onSubmit: (values) => {          // Submit handler
    // Form submission logic
  },
});
```

#### Formik Properties and Methods

**values** - Current form values
```jsx
// Line 395
value={Formik.values.email}
```

**handleChange** - Update field value
```jsx
// Line 396
onChange={Formik.handleChange}
```

**handleBlur** - Mark field as touched
```jsx
// Line 397
onBlur={Formik.handleBlur}
```

**touched** - Which fields have been visited
```jsx
// Line 399
{Formik.touched.email && Formik.errors.email && (
  <Typography variant="caption" color="error">
    {Formik.errors.email}
  </Typography>
)}
```

**errors** - Validation errors
```jsx
// Formik automatically validates using yup schema
// Errors object: { email: "It must be an Email.", name: "Name is required" }
```

**setValues** - Set multiple values at once
```jsx
// Line 175-188: When editing student
Formik.setValues({
  email: data.email,
  name: data.name,
  student_class: data.student_class._id,
  // ... all fields
});
```

**setFieldValue** - Set single field
```jsx
// Teachers.jsx Line 163-168
Formik.setFieldValue("email", resp.data.data.email);
Formik.setFieldValue("name", resp.data.data.name);
```

**resetForm** - Reset to initial values
```jsx
// Line 197, 267
Formik.resetForm();
```

**handleSubmit** - Form submit handler
```jsx
// Line 362
<Box component="form" onSubmit={Formik.handleSubmit}>
```

### Yup Validation Schema

**studentSchema.js - Complete:**

```jsx
import * as yup from 'yup';

export const studentSchema = yup.object({
  // Line 4: Name validation
  name: yup.string()
    .min(4, "Name must contain 4 characters")
    .required("Name is required"),

  // Line 5: Email validation
  email: yup.string()
    .email("It must be an Email.")
    .min(4, "email must contain 4 characters")
    .required("email is required"),

  // Line 6: Class validation
  student_class: yup.string("Student Class must be string value.")
    .required("Select A Class || Add New Class & Select."),

  // Line 7: Gender validation
  gender: yup.string("Gender must be string value.")
    .required("You must select a Gender."),

  // Line 8: Age validation
  age: yup.number("Age must be a number.")
    .required("You must give Age."),

  // Line 9: Guardian validation
  guardian: yup.string()
    .min(4, "Guardian must contain 4 characters")
    .required("Guardian is required"),

  // Line 10: Phone validation
  guardian_phone: yup.string()
    .min(10, "Phone must contain 10 characters")
    .required("Phone is required"),

  // Line 11-13: Aadhaar validation with regex
  aadhaar_number: yup.string()
    .matches(/^\d{12}$/, "Aadhaar number must be exactly 12 digits")
    .required("Aadhaar number is required"),

  // Line 14: Password validation
  password: yup.string()
    .required("Password is a required field."),
})
```

**Validation Types:**
- `.string()` - Must be string
- `.number()` - Must be number
- `.email()` - Must be valid email format
- `.min(n)` - Minimum length/value
- `.max(n)` - Maximum length/value
- `.matches(regex)` - Match regex pattern
- `.required()` - Cannot be empty
- `.oneOf([values])` - Must be one of values

### Form Submission Flow

```jsx
// Line 222-279: onSubmit handler
onSubmit: (values) => {
  if (isEdit) {
    // UPDATE MODE

    // Line 224: Create FormData for file upload
    const fd = new FormData();

    // Line 225: Add all form values
    Object.keys(values).forEach((key) => fd.append(key, values[key]));

    // Line 226-228: Add image if selected
    if (file) {
      fd.append("image", file, file.name);
    }

    // Line 230-233: Handle nested fees object
    if (values.total_fees || values.paid_fees) {
      fd.append("fees[total_fees]", values.total_fees || 0);
      fd.append("fees[paid_fees]", values.paid_fees || 0);
    }

    // Line 235-246: Send PATCH request
    axios
      .patch(`${baseUrl}/student/update/${editId}`, fd)
      .then((resp) => {
        setMessage(resp.data.message);
        setType("success");
        handleClearFile();
        cancelEdit();
      })
      .catch((e) => {
        setMessage(e.response.data.message);
        setType("error");
      });
  } else {
    // CREATE MODE

    // Line 248: Check if image provided
    if (file) {
      // Line 249-250: Create FormData
      const fd = new FormData();
      fd.append("image", file, file.name);

      // Line 251-255: Add all values except fees
      Object.keys(values).forEach((key) => {
        if (key !== 'total_fees' && key !== 'paid_fees') {
          fd.append(key, values[key]);
        }
      });

      // Line 257-260: Add fees separately
      if (values.total_fees || values.paid_fees) {
        fd.append("fees[total_fees]", values.total_fees || 0);
        fd.append("fees[paid_fees]", values.paid_fees || 0);
      }

      // Line 262-273: Send POST request
      axios
        .post(`${baseUrl}/student/register`, fd)
        .then(async (resp) => {
          setMessage(resp.data.message);
          setType("success");
          Formik.resetForm();
          handleClearFile();
        })
        .catch((e) => {
          setMessage(e.response.data.message);
          setType("error");
        });
    } else {
      // Line 274-276: No image error
      setMessage("Please provide an image.");
      setType("error");
    }
  }
},
```

### File Upload Handling

```jsx
// Line 131-137: Handle image selection
const addImage = (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    setFile(selectedFile);                              // Store file
    setImageUrl(URL.createObjectURL(selectedFile));     // Create preview URL
  }
};

// Line 368-375: File input field
<TextField
  sx={{ marginTop: "10px" }}
  variant="outlined"
  name="file"
  type="file"
  onChange={addImage}
  inputRef={fileInputRef}
/>

// Line 376-385: Image preview
{imageUrl && (
  <Box sx={{ position: "relative", ml: 2 }}>
    <CardMedia
      component="img"
      image={imageUrl}
      height="120px"
      sx={{ borderRadius: '10px' }}
    />
  </Box>
)}
```

---

## 8. State Management

### Local State vs Global State

#### Local State (useState)
**Used for:** Component-specific data that doesn't need to be shared

**Examples:**
```jsx
// Students.jsx
const [students, setStudents] = useState([]);      // Student list
const [viewMode, setViewMode] = useState('table'); // UI state
const [file, setFile] = useState(null);            // File upload
```

**Characteristics:**
- Scoped to single component
- Lost when component unmounts
- Fast and simple
- No prop drilling needed

#### Global State (Context API)
**Used for:** Data needed across multiple components

**Examples:**
```jsx
// AuthContext.jsx
const [authenticated, setAuthenticated] = useState(false)
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(false);
```

**Characteristics:**
- Available to all components
- Persists across component changes
- Prevents prop drilling
- Single source of truth

### State Update Patterns

#### 1. Direct Update
```jsx
// Simple value
setViewMode('table');

// Object/Array (requires new reference)
setStudents([...students, newStudent]);
```

#### 2. Functional Update
```jsx
// Line 141-145: When new state depends on old state
const handleClass = (e) => {
  setParams((prevParams) => ({
    ...prevParams,
    student_class: e.target.value || undefined,
  }));
};
```

**Why functional update?**
- Ensures you have latest state
- Important for async operations
- Prevents race conditions

#### 3. Computed State
```jsx
// SchoolDashboard.jsx Line 96-140: Expensive calculation
const calculateFeesFromRecords = (studentRecords) => {
  // Calculate fees statistics
  return { totalFees, collectedFees, todayCollected, balanceFees };
};

// Could be memoized:
const feesStats = useMemo(
  () => calculateFeesFromRecords(studentRecords),
  [studentRecords]
);
```

### State Persistence

#### localStorage
```jsx
// AuthContext.jsx Line 15-16: Read from storage
const token = localStorage.getItem('token');
const userData = localStorage.getItem("user");

// Login component: Write to storage
localStorage.setItem('token', response.data.token);
localStorage.setItem('user', JSON.stringify(response.data.user));

// Line 37-38: Clear on logout
localStorage.removeItem('token');
localStorage.removeItem('user')
```

**localStorage API:**
- `setItem(key, value)` - Store data (strings only)
- `getItem(key)` - Retrieve data
- `removeItem(key)` - Delete data
- `clear()` - Delete all data

**Best Practices:**
- Store only non-sensitive data
- Use JSON.stringify/parse for objects
- Check for existence before parsing
- Clear on logout

---

## 9. API Integration

### Axios Setup (main.jsx)

```jsx
// Line 5: Import axios
import axios from 'axios'

// Line 7-12: Global request interceptor
axios.interceptors.request.use((request)=>{
  // Runs before EVERY axios request

  if(localStorage.getItem("token")){
    // Add token to Authorization header if exists
    request.headers.Authorization = localStorage.getItem("token")
  }
  return request;  // Continue with modified request
})
```

**Interceptor Explanation:**
1. Intercepts all outgoing requests
2. Checks localStorage for authentication token
3. Adds token to Authorization header
4. Returns modified request
5. API receives authenticated request

**Benefits:**
- Don't need to manually add token to every request
- Centralized authentication logic
- Easy to modify for all requests

### Environment Configuration (environment.js)

```jsx
// Line 2: Use Vite environment variable with fallback
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:9000/api';

export {baseUrl}
```

**How it works:**
- Checks for `VITE_API_URL` environment variable
- Falls back to localhost if not found
- Allows different URLs for dev/staging/production

**Usage in .env file:**
```
VITE_API_URL=https://api.schoolmanagement.com/api
```

### API Request Patterns

#### 1. GET Request - Fetch Data

```jsx
// Students.jsx Line 282-289: Fetch classes
const fetchStudentClass = () => {
  axios
    .get(`${baseUrl}/class/fetch-all`)
    .then((resp) => {
      setStudentClass(resp.data.data);  // Update state with response
    })
    .catch(() => console.log("Error in fetching student Class"));
};

// Line 301-308: Fetch with query parameters
const fetchStudents = () => {
  axios
    .get(`${baseUrl}/student/fetch-with-query`, { params })
    .then((resp) => {
      setStudents(resp.data.data);
    })
    .catch(() => console.log("Error in fetching students data"));
};
```

**GET Request Structure:**
```
GET /api/student/fetch-with-query?student_class=abc123&search=john
```

#### 2. POST Request - Create Data

```jsx
// Line 262-273: Create student
axios
  .post(`${baseUrl}/student/register`, fd)
  .then(async (resp) => {
    setMessage(resp.data.message);
    setType("success");
    Formik.resetForm();
    handleClearFile();
  })
  .catch((e) => {
    setMessage(e.response.data.message);
    setType("error");
  });
```

**POST Request Structure:**
```
POST /api/student/register
Headers: { Authorization: "token", Content-Type: "multipart/form-data" }
Body: FormData with student info and image
```

#### 3. PATCH Request - Update Data

```jsx
// Line 235-246: Update student
axios
  .patch(`${baseUrl}/student/update/${editId}`, fd)
  .then((resp) => {
    setMessage(resp.data.message);
    setType("success");
    handleClearFile();
    cancelEdit();
  })
  .catch((e) => {
    setMessage(e.response.data.message);
    setType("error");
  });
```

**PATCH Request Structure:**
```
PATCH /api/student/update/abc123
Headers: { Authorization: "token", Content-Type: "multipart/form-data" }
Body: FormData with updated fields
```

#### 4. DELETE Request - Remove Data

```jsx
// Line 154-167: Delete student
const handleDelete = (id) => {
  if (confirm("Are you sure you want to delete?")) {
    axios
      .delete(`${baseUrl}/student/delete/${id}`)
      .then((resp) => {
        setMessage(resp.data.message);
        setType("success");
      })
      .catch((e) => {
        setMessage(e.response.data.message);
        setType("error");
      });
  }
};
```

**DELETE Request Structure:**
```
DELETE /api/student/delete/abc123
Headers: { Authorization: "token" }
```

### FormData for File Uploads

```jsx
// Line 224-225: Create FormData
const fd = new FormData();
Object.keys(values).forEach((key) => fd.append(key, values[key]));

// Line 226-228: Add file
if (file) {
  fd.append("image", file, file.name);
}

// Line 230-233: Add nested object
if (values.total_fees || values.paid_fees) {
  fd.append("fees[total_fees]", values.total_fees || 0);
  fd.append("fees[paid_fees]", values.paid_fees || 0);
}
```

**FormData Methods:**
- `append(key, value)` - Add field
- `append(key, file, filename)` - Add file
- `get(key)` - Get value
- `delete(key)` - Remove field

**Server receives:**
```
{
  name: "John Doe",
  email: "john@example.com",
  image: File,
  "fees[total_fees]": "10000",
  "fees[paid_fees]": "5000"
}
```

### Error Handling

```jsx
// Common pattern throughout project
axios
  .get(url)
  .then((resp) => {
    // Success: resp.data contains response
    setData(resp.data.data);
    setMessage(resp.data.message);
    setType("success");
  })
  .catch((e) => {
    // Error: e.response.data contains error info
    setMessage(e.response.data.message);
    setType("error");
    console.log("Error", e);
  });
```

**Response Structure:**
```json
// Success
{
  "success": true,
  "message": "Student created successfully",
  "data": { ... }
}

// Error
{
  "success": false,
  "message": "Email already exists",
  "error": { ... }
}
```

### Parallel Requests (SchoolDashboard.jsx)

```jsx
// Line 169-177: Fetch multiple endpoints at once
const [studentRes, teacherRes, classesRes, subjectsRes, schoolData, ...] =
  await Promise.all([
    axios.get(`${baseUrl}/student/fetch-with-query`, {params:{}, headers}),
    axios.get(`${baseUrl}/teacher/fetch-with-query`, {params:{}, headers}),
    axios.get(`${baseUrl}/class/fetch-all`, {headers}),
    axios.get(`${baseUrl}/subject/fetch-all`, {headers}),
    axios.get(`${baseUrl}/school/fetch-single`, {headers}),
    // ... more requests
  ]);
```

**Benefits:**
- All requests run simultaneously
- Faster than sequential requests
- Single error handling point

---

## 10. Protected Routes

### ProtectedRoute.jsx - Complete Breakdown

```jsx
// Line 1: Disable prop validation
/* eslint-disable react/prop-types */

// Line 3-5: Import dependencies
import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Line 6: Component with props
const ProtectedRoute = ({ children, allowedRoles }) => {
  // children = Component to protect (e.g., <School/>)
  // allowedRoles = Array of roles allowed (e.g., ['SCHOOL', 'ADMIN'])

  // Line 7-8: Get auth state from context
  const { user, loading, authenticated } = useContext(AuthContext);
  const [checked, setChecked] = useState(false)

  // Line 11-14: Mark as checked when auth state loads
  useEffect(()=>{
    setChecked(true)
  },[user, authenticated])

  // Line 16: Show loading while checking auth
  if (loading) return <div>Loading...</div>;

  // Line 18: Not authenticated → redirect to login
  if (checked && !authenticated) return <Navigate to="/login" />;

  // Line 20: Authenticated but wrong role → redirect to login
  if (checked && allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/login" />;

  // Line 22: All checks passed → render protected component
  return children;
};

export default ProtectedRoute;
```

### How Protection Works

**1. Check Authentication:**
```jsx
if (checked && !authenticated) return <Navigate to="/login" />;
```
- User not logged in
- Redirect to login page

**2. Check Authorization:**
```jsx
if (checked && allowedRoles && !allowedRoles.includes(user.role))
  return <Navigate to="/login" />;
```
- User logged in but wrong role
- Student trying to access teacher routes
- Redirect to login

**3. Allow Access:**
```jsx
return children;
```
- User authenticated
- User has correct role
- Render the protected component

### Usage in Routes

```jsx
// App.jsx Line 65: Protect school routes
<Route
  path="school"
  element={
    <ProtectedRoute allowedRoles={['SCHOOL']}>
      <School/>
    </ProtectedRoute>
  }
>
  {/* Nested routes */}
</Route>
```

**Flow:**
1. User navigates to `/school`
2. ProtectedRoute checks authentication
3. Checks if user.role is 'SCHOOL'
4. If valid, renders `<School/>` component
5. School component renders its nested routes
6. If invalid, redirects to `/login`

### Multi-Role Protection

```jsx
// Can allow multiple roles:
<ProtectedRoute allowedRoles={['SCHOOL', 'ADMIN']}>
  <AdminPanel/>
</ProtectedRoute>
```

---

## 11. Component Examples

### Example 1: Students.jsx - Complete Analysis

#### Component Structure

```jsx
// Line 120: Export default function
export default function Students() {
  // State variables
  // Event handlers
  // API calls
  // Effects
  // Return JSX
}
```

#### State Management

```jsx
// Line 121-126: Data state
const [studentClass, setStudentClass] = useState([]);
const [courses, setCourses] = useState([]);
const [students, setStudents] = useState([]);
const [isEdit, setEdit] = useState(false);
const [editId, setEditId] = useState(null);
const [viewMode, setViewMode] = useState('table');

// Line 128-129: File handling
const [file, setFile] = useState(null);
const [imageUrl, setImageUrl] = useState(null);

// Line 139: Search/filter params
const [params, setParams] = useState({});

// Line 200-202: Notifications
const [message, setMessage] = useState("");
const [type, setType] = useState("success");
```

#### Event Handlers

**Search Handler:**
```jsx
// Line 147-152: Update search param
const handleSearch = (e) => {
  setParams((prevParams) => ({
    ...prevParams,
    search: e.target.value || undefined,
  }));
};
```

**Delete Handler:**
```jsx
// Line 154-167: Delete with confirmation
const handleDelete = (id) => {
  if (confirm("Are you sure you want to delete?")) {
    axios
      .delete(`${baseUrl}/student/delete/${id}`)
      .then((resp) => {
        setMessage(resp.data.message);
        setType("success");
      })
      .catch((e) => {
        setMessage(e.response.data.message);
        setType("error");
      });
  }
};
```

**Edit Handler:**
```jsx
// Line 169-193: Load student data for editing
const handleEdit = (id) => {
  setEdit(true);  // Enter edit mode

  axios
    .get(`${baseUrl}/student/fetch-single/${id}`)
    .then((resp) => {
      const data = resp.data.data;

      // Populate form with existing data
      Formik.setValues({
        email: data.email,
        name: data.name,
        student_class: data.student_class._id,
        course: data.course?._id || "",
        gender: data.gender,
        age: data.age,
        guardian: data.guardian,
        guardian_phone: data.guardian_phone,
        aadhaar_number: data.aadhaar_number || "",
        password: data.password,
        total_fees: data.fees?.total_fees || "",
        paid_fees: data.fees?.paid_fees || "",
      });
      setImageUrl(data.image);
      setEditId(data._id);
    })
    .catch(() => console.log("Error in fetching edit data."));
};
```

#### API Integration

```jsx
// Line 282-289: Fetch classes
const fetchStudentClass = () => {
  axios
    .get(`${baseUrl}/class/fetch-all`)
    .then((resp) => setStudentClass(resp.data.data))
    .catch(() => console.log("Error in fetching student Class"));
};

// Line 291-299: Fetch courses
const fetchCourses = () => {
  const schoolId = localStorage.getItem('schoolId') || '66e0e5fcb543e2e1cb54df19';
  axios
    .get(`${baseUrl}/course/school/${schoolId}`)
    .then((resp) => setCourses(resp.data.courses))
    .catch(() => console.log("Error in fetching courses"));
};

// Line 301-308: Fetch students with params
const fetchStudents = () => {
  axios
    .get(`${baseUrl}/student/fetch-with-query`, { params })
    .then((resp) => setStudents(resp.data.data))
    .catch(() => console.log("Error in fetching students data"));
};
```

#### Effects

```jsx
// Line 310-314: Fetch data when component mounts or dependencies change
useEffect(() => {
  fetchStudents();      // Re-fetch when params change
  fetchStudentClass();  // Re-fetch when message changes (after create/update/delete)
  fetchCourses();
}, [message, params]);
```

**Why these dependencies?**
- `message` - Changes after successful operation, triggers re-fetch
- `params` - Search/filter changes, need to fetch filtered data

#### Formik Form

```jsx
// Line 219-280: Formik configuration
const Formik = useFormik({
  initialValues,
  validationSchema: studentSchema,
  onSubmit: (values) => {
    if (isEdit) {
      // Update existing student
      const fd = new FormData();
      Object.keys(values).forEach((key) => fd.append(key, values[key]));
      if (file) fd.append("image", file, file.name);
      if (values.total_fees || values.paid_fees) {
        fd.append("fees[total_fees]", values.total_fees || 0);
        fd.append("fees[paid_fees]", values.paid_fees || 0);
      }

      axios.patch(`${baseUrl}/student/update/${editId}`, fd)
        .then((resp) => {
          setMessage(resp.data.message);
          setType("success");
          handleClearFile();
          cancelEdit();
        })
        .catch((e) => {
          setMessage(e.response.data.message);
          setType("error");
        });
    } else {
      // Create new student
      if (file) {
        const fd = new FormData();
        fd.append("image", file, file.name);
        Object.keys(values).forEach((key) => {
          if (key !== 'total_fees' && key !== 'paid_fees') {
            fd.append(key, values[key]);
          }
        });
        if (values.total_fees || values.paid_fees) {
          fd.append("fees[total_fees]", values.total_fees || 0);
          fd.append("fees[paid_fees]", values.paid_fees || 0);
        }

        axios.post(`${baseUrl}/student/register`, fd)
          .then((resp) => {
            setMessage(resp.data.message);
            setType("success");
            Formik.resetForm();
            handleClearFile();
          })
          .catch((e) => {
            setMessage(e.response.data.message);
            setType("error");
          });
      } else {
        setMessage("Please provide an image.");
        setType("error");
      }
    }
  },
});
```

#### JSX Structure

```jsx
return (
  <Container maxWidth="xl" sx={{ py: 4 }}>
    {/* 1. Notification Snackbar */}
    {message && <CustomizedSnackbars ... />}

    {/* 2. Header Card */}
    <StyledHeaderCard>
      <CardContent>
        <SchoolIcon />
        <Typography variant="h3">Student Management</Typography>
      </CardContent>
    </StyledHeaderCard>

    {/* 3. Add/Edit Form */}
    <StyledFilterCard>
      <CardContent>
        <Box component="form" onSubmit={Formik.handleSubmit}>
          {/* File upload */}
          {/* Grid of form fields */}
          {/* Submit button */}
        </Box>
      </CardContent>
    </StyledFilterCard>

    {/* 4. Filter Controls */}
    <StyledFilterCard>
      <CardContent>
        <Grid container spacing={3}>
          {/* Class filter */}
          {/* Search box */}
          {/* View mode tabs */}
        </Grid>
      </CardContent>
    </StyledFilterCard>

    {/* 5. Data Display */}
    {viewMode === 'table' ? (
      <StyledTableContainer>
        <Table>
          {/* Table headers */}
          {/* Table rows mapped from students array */}
        </Table>
      </StyledTableContainer>
    ) : (
      <Grid container>
        {/* Cards mapped from students array */}
      </Grid>
    )}
  </Container>
);
```

### Example 2: SchoolDashboard.jsx - Complete Analysis

#### Purpose
Display statistics and quick access navigation for school administrators.

#### Key Features

**1. Statistics Cards:**
```jsx
// Line 506-565: Student and attendance stats
<Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
  <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h4" fontWeight="bold">{totalStudents}</Typography>
          <Typography variant="body2">Total Students</Typography>
        </Box>
        <PeopleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
      </Box>
    </CardContent>
  </Card>
</Grid2>
```

**2. Fees Management Cards:**
```jsx
// Line 568-638: Fees statistics with real-time data
<Card>
  <Typography variant="h4">
    {feesStats.totalFees > 0 ? `₹${feesStats.totalFees.toLocaleString()}` : '₹0'}
  </Typography>
  <Typography variant="body2">
    Total Fees {feesStats.totalFees === 0 && '(No Data)'}
  </Typography>
</Card>
```

**3. Charts with Chart.js:**
```jsx
// Line 641-697: Attendance and fees doughnut charts
<Doughnut
  data={{
    labels: ['Present', 'Absent'],
    datasets: [{
      data: [attendanceStats.presentToday, attendanceStats.absentToday],
      backgroundColor: ['#4CAF50', '#f44336'],
    }]
  }}
  options={{
    responsive: true,
    maintainAspectRatio: false,
  }}
/>
```

**4. Quick Access Navigation:**
```jsx
// Line 330-349: Navigation array
const navArr = [
  { link: "/school", component: "Dashboard", icon: DashboardIcon },
  { link: "/school/students", component: "Students", icon: GroupIcon },
  // ... more nav items
];

// Line 351-381: Quick access cards
const QuickAccessCard = ({ title, icon, link }) => (
  <Card onClick={() => navigate(link)}>
    <IconButton>
      {React.createElement(icon, { sx: { fontSize: 40 } })}
    </IconButton>
    <Typography variant="h6">{title}</Typography>
  </Card>
);

// Line 492-497: Render navigation grid
{navArr.map((item, index) => (
  <QuickAccessCard
    key={index}
    title={item.component}
    icon={item.icon}
    link={item.link}
  />
))}
```

#### Advanced State Calculation

```jsx
// Line 96-140: Complex fee calculation
const calculateFeesFromRecords = (studentRecords) => {
  if (!studentRecords || studentRecords.length === 0) {
    return { totalFees: 0, collectedFees: 0, todayCollected: 0, balanceFees: 0 };
  }

  let totalFees = 0;
  let collectedFees = 0;
  let todayCollected = 0;

  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  studentRecords.forEach(record => {
    if (record.fees) {
      totalFees += (record.fees.total_fees || 0);
      collectedFees += (record.fees.paid_fees || 0);

      if (record.fees.fee_payment_history && record.fees.fee_payment_history.length > 0) {
        record.fees.fee_payment_history.forEach(payment => {
          const paymentDate = new Date(payment.payment_date);
          if (paymentDate >= todayStart && paymentDate < new Date(todayStart.getTime() + 24*60*60*1000)) {
            todayCollected += payment.amount || 0;
          }
        });
      }
    }
  });

  return {
    totalFees,
    collectedFees,
    todayCollected,
    balanceFees: Math.max(0, totalFees - collectedFees)
  };
};
```

#### Parallel Data Fetching

```jsx
// Line 161-237: Fetch all dashboard data
const fetchData = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    // Fetch all data in parallel using Promise.all
    const [studentRes, teacherRes, classesRes, subjectsRes, schoolData, studentRecordsRes, studentRecordsStatsRes] =
      await Promise.all([
        axios.get(`${baseUrl}/student/fetch-with-query`, {params:{}, headers}),
        axios.get(`${baseUrl}/teacher/fetch-with-query`, {params:{}, headers}),
        axios.get(`${baseUrl}/class/fetch-all`, {headers}),
        axios.get(`${baseUrl}/subject/fetch-all`, {headers}),
        axios.get(`${baseUrl}/school/fetch-single`, {headers}),
        axios.get(`${baseUrl}/student-records`, {headers}).catch(() => ({data: {data: []}})),
        axios.get(`${baseUrl}/student-records/stats`, {headers}).catch(() => ({data: {data: {}}}))
      ]);

    // Process all responses
    setSchoolDetails(schoolData.data.data);
    setTotalStudents(studentRecordsStatsRes.data.data.totalStudents || studentRes.data.data.length);
    setTotalTeachers(teacherRes.data.data.length);

    // Calculate fees from records
    const calculatedStats = calculateFeesFromRecords(studentRecordsRes.data.data);
    setFeesStats(calculatedStats);
  } catch (error) {
    console.log('Dashboard fetch error:', error);
    // Fallback to dummy data
  } finally {
    setLoading(false);
  }
};
```

#### Multiple useEffect Hooks

```jsx
// Line 240-242: Initial load
useEffect(() => {
  fetchData();
}, [message]);

// Line 245-250: External refresh trigger
useEffect(() => {
  if (refreshTrigger > 0) {
    fetchData();
  }
}, [refreshTrigger]);

// Line 253-260: Auto-refresh timer
useEffect(() => {
  const interval = setInterval(() => {
    fetchData();
  }, 30000); // Every 30 seconds

  return () => clearInterval(interval);
}, []);

// Line 263-273: Visibility change listener
useEffect(() => {
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      fetchData();
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
}, []);
```

### Example 3: Teachers.jsx - Analysis

#### Unique Features

**1. Excel Export:**
```jsx
// Line 192-231: Export to Excel using xlsx library
const exportTeachersToExcel = () => {
  try {
    // Map teacher data to export format
    const exportData = teachers.map((teacher, index) => ({
      'S.No': index + 1,
      'Name': teacher.name || 'N/A',
      'Email': teacher.email || 'N/A',
      'Qualification': teacher.qualification || 'N/A',
      'Age': teacher.age || 'N/A',
      'Gender': teacher.gender || 'N/A',
      'Created Date': teacher.createdAt ? new Date(teacher.createdAt).toLocaleDateString() : 'N/A'
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();

    // Set column widths
    const columnWidths = [
      { wch: 8 }, { wch: 25 }, { wch: 30 }, { wch: 25 },
      { wch: 10 }, { wch: 12 }, { wch: 15 }
    ];
    worksheet['!cols'] = columnWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Teachers');

    const fileName = `Teachers_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    setMessage(`Excel file exported successfully: ${fileName}`);
    setType("success");
  } catch (error) {
    setMessage('Error exporting to Excel');
    setType("error");
  }
};
```

**2. RDLC Report Generation:**
```jsx
// Line 289-413: Generate printable HTML report
const generateTeachersRDLCReport = () => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Teachers Report</title>
      <style>
        /* Report styles */
        .report-table { width: 100%; border-collapse: collapse; }
        .report-table th { background-color: #2196F3; color: white; }
        /* ... more styles */
      </style>
    </head>
    <body>
      <div class="header">
        <h1>TEACHERS REPORT</h1>
        <h2>Academic Year ${new Date().getFullYear()}</h2>
      </div>

      <table class="report-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <!-- ... more columns -->
          </tr>
        </thead>
        <tbody>
          ${teachers.map((teacher, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${teacher.name || 'N/A'}</td>
              <!-- ... more fields -->
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- Summary statistics -->
    </body>
    </html>
  `;

  // Open in new window for printing
  const printWindow = window.open('', '_blank', 'width=1200,height=800');
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 1000);
  };
};
```

---

## 12. Data Flow

### Complete Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Application Start                         │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │      main.jsx         │
                    │ - Setup axios         │
                    │   interceptors        │
                    │ - Wrap App in         │
                    │   AuthProvider        │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   AuthProvider        │
                    │ - Check localStorage  │
                    │   for token           │
                    │ - Set authenticated   │
                    │   state               │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │      App.jsx          │
                    │ - Setup routes        │
                    │ - Apply ThemeProvider │
                    │ - Wrap protected      │
                    │   routes              │
                    └───────────┬───────────┘
                                │
                ┌───────────────┴──────────────┐
                │                              │
                ▼                              ▼
    ┌──────────────────┐          ┌──────────────────────┐
    │  Public Routes   │          │  Protected Routes    │
    │  (Client)        │          │  (School/Student/    │
    │                  │          │   Teacher)           │
    └─────────┬────────┘          └──────────┬───────────┘
              │                               │
              ▼                               ▼
    ┌──────────────────┐          ┌──────────────────────┐
    │  Login.jsx       │          │  ProtectedRoute.jsx  │
    │  - User enters   │          │  - Check auth        │
    │    credentials   │          │  - Check role        │
    │  - Call API      │──────────▶  - Allow/Deny        │
    │  - Store token   │          └──────────┬───────────┘
    │  - Call login()  │                     │
    └──────────────────┘                     ▼
                              ┌──────────────────────────┐
                              │   Component (Students)   │
                              │   1. Mount               │
                              │   2. useEffect runs      │
                              │   3. Fetch data from API │
                              └────────┬─────────────────┘
                                       │
                                       ▼
                              ┌──────────────────────────┐
                              │   Axios Request          │
                              │   - Add token from       │
                              │     interceptor          │
                              │   - Send to API          │
                              └────────┬─────────────────┘
                                       │
                                       ▼
                              ┌──────────────────────────┐
                              │   Backend API            │
                              │   - Verify token         │
                              │   - Process request      │
                              │   - Return data          │
                              └────────┬─────────────────┘
                                       │
                                       ▼
                              ┌──────────────────────────┐
                              │   Component receives     │
                              │   - Update state         │
                              │   - Re-render UI         │
                              │   - Display data         │
                              └──────────────────────────┘
```

### Detailed Flow: Creating a Student

```
1. USER ACTION
   └─> Click "Register Student" button

2. FORM VALIDATION
   └─> Formik validates using Yup schema
       ├─> Valid: Continue
       └─> Invalid: Show errors

3. FORM SUBMISSION
   └─> onSubmit handler called
       └─> Create FormData object
           ├─> Add all form values
           ├─> Add image file
           └─> Add nested fees object

4. API REQUEST
   └─> axios.post(${baseUrl}/student/register, formData)
       └─> Interceptor adds Authorization header
           └─> Request sent to backend

5. BACKEND PROCESSING
   └─> Verify authentication token
       └─> Validate data
           └─> Check for duplicates
               └─> Upload image to server
                   └─> Save to database
                       └─> Return response

6. RESPONSE HANDLING
   └─> .then() receives success response
       ├─> setMessage("Student created successfully")
       ├─> setType("success")
       ├─> Formik.resetForm()
       └─> handleClearFile()

7. UI UPDATE
   └─> useEffect detects message change
       └─> fetchStudents() called
           └─> New student list fetched
               └─> setStudents(newList)
                   └─> Component re-renders
                       └─> Table shows new student
```

### State Update Flow

```
Component State Changes:
┌──────────────────────────┐
│ User types in search box │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────────┐
│ onChange event fires         │
│ handleSearch(e) called       │
└────────────┬─────────────────┘
             │
             ▼
┌──────────────────────────────┐
│ setParams(prevParams => {    │
│   ...prevParams,             │
│   search: e.target.value     │
│ })                           │
└────────────┬─────────────────┘
             │
             ▼
┌──────────────────────────────┐
│ params state updated         │
│ Component re-renders         │
└────────────┬─────────────────┘
             │
             ▼
┌──────────────────────────────┐
│ useEffect([params])          │
│ dependency changed           │
└────────────┬─────────────────┘
             │
             ▼
┌──────────────────────────────┐
│ fetchStudents() called       │
│ with new params              │
└────────────┬─────────────────┘
             │
             ▼
┌──────────────────────────────┐
│ API returns filtered results │
└────────────┬─────────────────┘
             │
             ▼
┌──────────────────────────────┐
│ setStudents(filteredData)    │
└────────────┬─────────────────┘
             │
             ▼
┌──────────────────────────────┐
│ Component re-renders         │
│ Table shows filtered list    │
└──────────────────────────────┘
```

### Authentication Flow

```
1. USER VISITS SITE
   └─> main.jsx renders
       └─> AuthProvider mounts
           └─> useEffect runs
               └─> Check localStorage for token
                   ├─> Token found
                   │   ├─> setAuthenticated(true)
                   │   └─> setUser(userData)
                   └─> No token
                       └─> Stay logged out

2. USER LOGS IN
   └─> Navigate to /login
       └─> Login component renders
           └─> User enters credentials
               └─> Submit form
                   └─> axios.post('/login', credentials)
                       └─> Backend verifies credentials
                           └─> Returns { token, user }
                               └─> localStorage.setItem('token', token)
                                   └─> localStorage.setItem('user', JSON.stringify(user))
                                       └─> login(user) from context
                                           └─> setAuthenticated(true)
                                               └─> setUser(user)
                                                   └─> Navigate to dashboard

3. USER NAVIGATES TO PROTECTED ROUTE
   └─> URL: /school/students
       └─> Router matches route
           └─> ProtectedRoute component renders
               └─> useContext(AuthContext)
                   └─> Get { authenticated, user }
                       ├─> authenticated = true
                       │   └─> user.role = 'SCHOOL'
                       │       └─> allowedRoles.includes('SCHOOL')
                       │           └─> Render <Students /> component
                       └─> authenticated = false
                           └─> <Navigate to="/login" />

4. EVERY API REQUEST
   └─> axios.get/post/patch/delete
       └─> Interceptor runs
           └─> Get token from localStorage
               └─> Add to headers: Authorization: token
                   └─> Request sent with auth
                       └─> Backend verifies token
                           ├─> Valid: Process request
                           └─> Invalid: Return 401 error

5. USER LOGS OUT
   └─> Click logout
       └─> Navigate to /logout
           └─> Logout component renders
               └─> logout() from context
                   └─> localStorage.removeItem('token')
                       └─> localStorage.removeItem('user')
                           └─> setAuthenticated(false)
                               └─> setUser(null)
                                   └─> Navigate to /login
```

### Component Lifecycle with Hooks

```
Component Mount (First Render):
┌────────────────────────────┐
│ Component function called  │
└──────────┬─────────────────┘
           │
           ▼
┌────────────────────────────┐
│ useState initializes       │
│ - All state variables      │
│   created with initial     │
│   values                   │
└──────────┬─────────────────┘
           │
           ▼
┌────────────────────────────┐
│ Return JSX                 │
│ - First render happens     │
│ - DOM created              │
└──────────┬─────────────────┘
           │
           ▼
┌────────────────────────────┐
│ useEffect runs             │
│ - All effects with []      │
│   dependency execute       │
│ - fetchData() called       │
└──────────┬─────────────────┘
           │
           ▼
┌────────────────────────────┐
│ API calls complete         │
│ - setState called          │
│ - Triggers re-render       │
└──────────┬─────────────────┘
           │
           ▼
┌────────────────────────────┐
│ Component Re-renders       │
│ - New JSX returned         │
│ - Virtual DOM diffed       │
│ - Real DOM updated         │
└────────────────────────────┘

State Update Cycle:
┌────────────────────────────┐
│ User interaction           │
│ (click, type, etc)         │
└──────────┬─────────────────┘
           │
           ▼
┌────────────────────────────┐
│ Event handler called       │
│ setState(newValue)         │
└──────────┬─────────────────┘
           │
           ▼
┌────────────────────────────┐
│ React schedules re-render  │
│ (batches updates)          │
└──────────┬─────────────────┘
           │
           ▼
┌────────────────────────────┐
│ Component function runs    │
│ with new state             │
└──────────┬─────────────────┘
           │
           ▼
┌────────────────────────────┐
│ Return new JSX             │
└──────────┬─────────────────┘
           │
           ▼
┌────────────────────────────┐
│ Virtual DOM comparison     │
│ Calculate differences      │
└──────────┬─────────────────┘
           │
           ▼
┌────────────────────────────┐
│ Update only changed parts  │
│ in real DOM                │
└──────────┬─────────────────┘
           │
           ▼
┌────────────────────────────┐
│ useEffect runs if          │
│ dependencies changed       │
└────────────────────────────┘

Component Unmount:
┌────────────────────────────┐
│ User navigates away        │
│ or parent removes component│
└──────────┬─────────────────┘
           │
           ▼
┌────────────────────────────┐
│ Cleanup functions run      │
│ - useEffect return values  │
│ - clearInterval()          │
│ - removeEventListener()    │
└──────────┬─────────────────┘
           │
           ▼
┌────────────────────────────┐
│ Component removed from DOM │
│ State discarded            │
└────────────────────────────┘
```

---

## Summary

This guide covers every aspect of the React frontend:

1. **React Fundamentals** - Components, JSX, Virtual DOM
2. **Hooks** - useState, useEffect, useContext, useRef with real examples
3. **Architecture** - Complete component structure and organization
4. **Routing** - All routes explained with nested routing and protection
5. **Context API** - Line-by-line AuthContext explanation
6. **Material-UI** - All MUI components used with examples
7. **Forms** - Formik + Yup validation in detail
8. **State Management** - Local vs global state patterns
9. **API Integration** - Axios setup, interceptors, all request types
10. **Protected Routes** - Complete authentication and authorization
11. **Component Examples** - Students, Teachers, Dashboard analyzed
12. **Data Flow** - Complete flow diagrams from user action to UI update

Every file has been analyzed line-by-line with clear explanations of how components work together to create a complete school management system.
