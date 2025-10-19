# COMPLETE API DOCUMENTATION
## School Management System - All REST API Endpoints

**Base URL:** `https://api.gentime.in/api` (Production)
**Base URL:** `http://localhost:5000/api` (Development)

---

## TABLE OF CONTENTS

1. [Authentication Overview](#1-authentication-overview)
2. [School Management APIs](#2-school-management-apis)
3. [Student Management APIs](#3-student-management-apis)
4. [Teacher Management APIs](#4-teacher-management-apis)
5. [Class Management APIs](#5-class-management-apis)
6. [Subject Management APIs](#6-subject-management-apis)
7. [Course Management APIs](#7-course-management-apis)
8. [Attendance APIs](#8-attendance-apis)
9. [Examination APIs](#9-examination-apis)
10. [Fees Management APIs](#10-fees-management-apis)
11. [Student Records APIs](#11-student-records-apis)
12. [Notice Board APIs](#12-notice-board-apis)
13. [Period/Schedule APIs](#13-periodschedule-apis)
14. [Marksheet APIs](#14-marksheet-apis)
15. [SMS Management APIs](#15-sms-management-apis)
16. [Front Page Management APIs](#16-front-page-management-apis)
17. [Public Homepage APIs](#17-public-homepage-apis)
18. [Error Handling](#18-error-handling)
19. [Testing with cURL/Postman](#19-testing-with-curlpostman)

---

# 1. AUTHENTICATION OVERVIEW

## How Authentication Works

This system uses **JWT (JSON Web Tokens)** for authentication.

### Authentication Flow:

```
1. User logs in → Receives JWT token
2. Store token in localStorage
3. Include token in all API requests
4. Token verified by authMiddleware
5. Access granted/denied based on role
```

### Token Structure:

```javascript
// JWT Payload
{
  id: "user_id",
  schoolId: "school_id",
  name: "User Name",
  role: "SCHOOL" | "TEACHER" | "STUDENT",
  iat: 1234567890,  // Issued at
  exp: 1234567890   // Expires at
}
```

### Including Token in Requests:

**Method 1: Authorization Header (Recommended)**
```http
GET /api/student/fetch-all
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Method 2: Direct Token**
```http
GET /api/student/fetch-all
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Role-Based Access Control (RBAC):

| Role | Access Level |
|------|--------------|
| **SCHOOL** | Full access (admin) - Create/Read/Update/Delete all |
| **TEACHER** | Read students, Mark attendance, View schedule, Post notices |
| **STUDENT** | View own data, attendance, schedule, notices |

### Frontend Token Setup:

```javascript
// In main.jsx
import axios from 'axios';

// Axios interceptor - automatically adds token to all requests
axios.interceptors.request.use((request) => {
    if (localStorage.getItem("token")) {
        request.headers.Authorization = localStorage.getItem("token");
    }
    return request;
});
```

---

# 2. SCHOOL MANAGEMENT APIS

Base Path: `/api/school`

## 2.1 Register School

**POST** `/api/school/register`

**Auth Required:** No
**Role:** Public

**Description:** Register a new school (admin account creation)

**Request Type:** `multipart/form-data` (File upload)

**Request Body:**
```javascript
{
  school_name: "Test School",
  email: "admin@testschool.com",
  owner_name: "John Doe",
  password: "securePassword123",
  image: File  // Image file (logo)
}
```

**cURL Example:**
```bash
curl -X POST https://api.gentime.in/api/school/register \
  -F "school_name=Test School" \
  -F "email=admin@testschool.com" \
  -F "owner_name=John Doe" \
  -F "password=securePass123" \
  -F "image=@/path/to/school_logo.jpg"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "School is Registered Successfully.",
  "data": {
    "_id": "68cc82457107f80c1bbcb940",
    "school_name": "Test School",
    "email": "admin@testschool.com",
    "owner_name": "John Doe",
    "school_image": "school_logo.jpg",
    "createdAt": "2025-10-18T00:00:00.000Z"
  }
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Email Already Exist!"
}
```

---

## 2.2 Login School

**POST** `/api/school/login`

**Auth Required:** No
**Role:** Public

**Description:** School admin login

**Request Type:** `application/json`

**Request Body:**
```json
{
  "email": "test@school.com",
  "password": "test123"
}
```

**JavaScript Example:**
```javascript
const response = await axios.post('/api/school/login', {
  email: 'test@school.com',
  password: 'test123'
});

// Store token
localStorage.setItem('token', response.headers.authorization);
localStorage.setItem('user', JSON.stringify(response.data.user));
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Success Login",
  "user": {
    "id": "68cc82457107f80c1bbcb940",
    "owner_name": "Test Owner",
    "school_name": "Test School",
    "image_url": "school_logo.jpg",
    "role": "SCHOOL"
  }
}
```

**Response Headers:**
```
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4Y2M4...
```

**Error Responses:**

```json
// Wrong password (401)
{
  "success": false,
  "message": "Password doesn't match."
}

// Email not found (401)
{
  "success": false,
  "message": "Email not registerd."
}
```

---

## 2.3 Get School Own Data

**GET** `/api/school/fetch-single`

**Auth Required:** Yes
**Role:** SCHOOL

**Description:** Get logged-in school's profile data

**Request Headers:**
```
Authorization: Bearer <token>
```

**JavaScript Example:**
```javascript
const response = await axios.get('/api/school/fetch-single');
console.log(response.data.data);
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "68cc82457107f80c1bbcb940",
    "school_name": "Test School",
    "email": "test@school.com",
    "owner_name": "Test Owner",
    "school_image": "school_logo.jpg",
    "createdAt": "2025-10-01T00:00:00.000Z"
  }
}
```

---

## 2.4 Update School Profile

**PATCH** `/api/school/update`

**Auth Required:** Yes
**Role:** SCHOOL

**Description:** Update school profile information

**Request Type:** `multipart/form-data`

**Request Body:**
```javascript
{
  school_name: "Updated School Name",
  owner_name: "Updated Owner",
  image: File  // Optional: new logo
}
```

**JavaScript Example:**
```javascript
const formData = new FormData();
formData.append('school_name', 'Updated School Name');
formData.append('owner_name', 'Updated Owner');
if (newImage) {
  formData.append('image', newImage);
}

const response = await axios.patch('/api/school/update', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
```

**Success Response (200):**
```json
{
  "message": "School updated successfully",
  "data": {
    "_id": "68cc82457107f80c1bbcb940",
    "school_name": "Updated School Name",
    "owner_name": "Updated Owner",
    "school_image": "new_logo.jpg"
  }
}
```

---

## 2.5 Get All Schools (Public)

**GET** `/api/school/all`

**Auth Required:** No
**Role:** Public

**Description:** Get list of all registered schools (limited info)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Success in fetching all Schools",
  "data": [
    {
      "school_name": "Test School",
      "school_image": "logo1.jpg"
    },
    {
      "school_name": "Another School",
      "school_image": "logo2.jpg"
    }
  ]
}
```

**Note:** Sensitive fields (email, password, owner_name) are excluded using `.select(['-_id','-password','-email','-owner_name','-createdAt'])`

---

## 2.6 Sign Out

**GET** `/api/school/sign-out`

**Auth Required:** No

**Description:** Clear authorization header (client-side should also clear localStorage)

**JavaScript Example:**
```javascript
// Call API
await axios.get('/api/school/sign-out');

// Clear client-side storage
localStorage.removeItem('token');
localStorage.removeItem('user');

// Redirect to login
window.location.href = '/login';
```

**Success Response (200):**
```json
{
  "success": true,
  "messsage": "School Signed Out Successfully."
}
```

---

## 2.7 Check If Logged In

**GET** `/api/school/is-login`

**Auth Required:** No (token in header)

**Description:** Verify if token is valid

**Request Headers:**
```
Authorization: <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "68cc82457107f80c1bbcb940",
    "schoolId": "68cc82457107f80c1bbcb940",
    "school_name": "Test School",
    "owner_name": "Test Owner",
    "role": "SCHOOL"
  },
  "message": "School is a logged in One"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "You are not Authorized."
}
```

---

# 3. STUDENT MANAGEMENT APIS

Base Path: `/api/student`

## 3.1 Register Student

**POST** `/api/student/register`

**Auth Required:** Yes
**Role:** SCHOOL

**Description:** Add a new student to the school

**Request Type:** `multipart/form-data`

**Request Body:**
```javascript
{
  name: "John Doe",
  email: "john@student.com",
  password: "student123",
  age: "18",
  gender: "Male",
  guardian: "Parent Name",
  guardian_phone: "9876543210",
  student_class: "68cc82457107f80c1bbcb941",  // Class ObjectId
  course: "68cc82457107f80c1bbcb942",        // Course ObjectId (optional)
  aadhaar_number: "123456789012",            // Optional (12 digits)
  "fees[total_fees]": "10000",               // Optional
  "fees[paid_fees]": "5000",                 // Optional
  image: File                                 // Student photo
}
```

**JavaScript Example:**
```javascript
const formData = new FormData();
formData.append('name', values.name);
formData.append('email', values.email);
formData.append('password', values.password);
formData.append('age', values.age);
formData.append('gender', values.gender);
formData.append('guardian', values.guardian);
formData.append('guardian_phone', values.guardian_phone);
formData.append('student_class', selectedClass);
formData.append('image', photoFile);

// Optional fees
formData.append('fees[total_fees]', '10000');
formData.append('fees[paid_fees]', '5000');

const response = await axios.post('/api/student/register', formData);
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Student is Registered Successfully.",
  "data": {
    "_id": "68cc82457107f80c1bbcb943",
    "name": "John Doe",
    "email": "john@student.com",
    "age": "18",
    "gender": "Male",
    "student_class": "68cc82457107f80c1bbcb941",
    "student_image": "john_doe.jpg",
    "fees": {
      "total_fees": 10000,
      "paid_fees": 5000,
      "balance_fees": 5000
    }
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Email Already Exist!"
}
```

---

## 3.2 Login Student

**POST** `/api/student/login`

**Auth Required:** No
**Role:** Public

**Description:** Student login

**Request Body:**
```json
{
  "email": "john@student.com",
  "password": "student123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Success Login",
  "user": {
    "id": "68cc82457107f80c1bbcb943",
    "email": "john@student.com",
    "image_url": "john_doe.jpg",
    "name": "John Doe",
    "role": "STUDENT"
  }
}
```

**Response Headers:**
```
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 3.3 Get Students with Query

**GET** `/api/student/fetch-with-query?search=<name>&student_class=<classId>`

**Auth Required:** Yes
**Role:** SCHOOL, TEACHER

**Description:** Search/filter students

**Query Parameters:**
- `search` (optional): Search by name (case-insensitive, partial match)
- `student_class` (optional): Filter by class ID

**Example Requests:**
```javascript
// Get all students
const all = await axios.get('/api/student/fetch-with-query');

// Search by name
const search = await axios.get('/api/student/fetch-with-query?search=john');

// Filter by class
const classStudents = await axios.get(
  `/api/student/fetch-with-query?student_class=${classId}`
);

// Both filters
const filtered = await axios.get(
  `/api/student/fetch-with-query?search=john&student_class=${classId}`
);
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "68cc82457107f80c1bbcb943",
      "name": "John Doe",
      "email": "john@student.com",
      "age": "18",
      "gender": "Male",
      "student_image": "john_doe.jpg",
      "student_class": {
        "_id": "68cc82457107f80c1bbcb941",
        "class_text": "10th Standard",
        "class_num": 10
      },
      "fees": {
        "total_fees": 10000,
        "paid_fees": 5000,
        "balance_fees": 5000
      }
    }
  ]
}
```

**Backend Logic:**
```javascript
const filterQuery = {};
const schoolId = req.user.schoolId;
filterQuery['school'] = schoolId;

// Add search filter if provided
if (req.query.hasOwnProperty('search')) {
    filterQuery['name'] = { $regex: req.query.search, $options: 'i' };
}

// Add class filter if provided
if (req.query.hasOwnProperty('student_class')) {
    filterQuery['student_class'] = req.query.student_class;
}

const students = await Student.find(filterQuery).populate("student_class");
```

---

## 3.4 Get Single Student

**GET** `/api/student/fetch-single/:id`

**Auth Required:** Yes
**Role:** SCHOOL, STUDENT

**Description:** Get details of a specific student

**URL Parameters:**
- `id`: Student ObjectId

**JavaScript Example:**
```javascript
const studentId = "68cc82457107f80c1bbcb943";
const response = await axios.get(`/api/student/fetch-single/${studentId}`);
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "68cc82457107f80c1bbcb943",
    "name": "John Doe",
    "email": "john@student.com",
    "age": "18",
    "gender": "Male",
    "guardian": "Parent Name",
    "guardian_phone": "9876543210",
    "student_class": {
      "_id": "68cc82457107f80c1bbcb941",
      "class_text": "10th Standard",
      "class_num": 10,
      "asignSubTeach": [...]
    },
    "fees": {
      "total_fees": 10000,
      "paid_fees": 5000,
      "balance_fees": 5000
    }
  }
}
```

---

## 3.5 Get Own Details (Student)

**GET** `/api/student/fetch-own`

**Auth Required:** Yes
**Role:** STUDENT

**Description:** Student gets their own profile data

**JavaScript Example:**
```javascript
// Token contains student ID
const response = await axios.get('/api/student/fetch-own');
```

**Success Response:** Same as 3.4

---

## 3.6 Update Student

**PATCH** `/api/student/update/:id`

**Auth Required:** Yes
**Role:** SCHOOL

**Description:** Update student information

**Request Type:** `multipart/form-data`

**URL Parameters:**
- `id`: Student ObjectId

**Request Body:** (All fields optional)
```javascript
{
  name: "Updated Name",
  age: "19",
  guardian_phone: "9999999999",
  "fees[total_fees]": "15000",
  "fees[paid_fees]": "7000",
  image: File  // Optional: new photo
}
```

**JavaScript Example:**
```javascript
const formData = new FormData();
formData.append('name', 'Updated Name');
formData.append('fees[total_fees]', '15000');
formData.append('fees[paid_fees]', '7000');

if (newPhoto) {
  formData.append('image', newPhoto);
}

await axios.patch(`/api/student/update/${studentId}`, formData);
```

**Success Response (200):**
```json
{
  "message": "Student updated successfully",
  "data": {
    "_id": "68cc82457107f80c1bbcb943",
    "name": "Updated Name",
    "fees": {
      "total_fees": 15000,
      "paid_fees": 7000,
      "balance_fees": 8000
    }
  }
}
```

**Note:** `balance_fees` is auto-calculated by pre-save middleware

---

## 3.7 Delete Student

**DELETE** `/api/student/delete/:id`

**Auth Required:** Yes
**Role:** SCHOOL

**Description:** Delete a student (also deletes their attendance records)

**URL Parameters:**
- `id`: Student ObjectId

**JavaScript Example:**
```javascript
await axios.delete(`/api/student/delete/${studentId}`);
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Student deleted",
  "data": null
}
```

**Backend Logic:**
```javascript
// Delete all attendance records for this student
await Attendance.deleteMany({ school: schoolId, student: id });

// Delete student
await Student.findOneAndDelete({ _id: id, school: schoolId });
```

---

## 3.8 Get Student Marksheets

**GET** `/api/student/marksheets`

**Auth Required:** Yes
**Role:** STUDENT

**Description:** Get all marksheets for logged-in student

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "marksheet123",
      "student": "68cc82457107f80c1bbcb943",
      "exam_name": "Midterm 2025",
      "subjects": [
        { "name": "Math", "marks": 85, "total": 100 },
        { "name": "Science", "marks": 90, "total": 100 }
      ],
      "total_marks": 175,
      "percentage": 87.5
    }
  ]
}
```

---

# 4. TEACHER MANAGEMENT APIS

Base Path: `/api/teacher`

## 4.1 Register Teacher

**POST** `/api/teacher/register`

**Auth Required:** Yes
**Role:** SCHOOL

**Request Type:** `multipart/form-data`

**Request Body:**
```javascript
{
  name: "Jane Smith",
  email: "jane@teacher.com",
  password: "teacher123",
  gender: "Female",
  age: "35",                    // Optional
  qualification: "M.Sc, B.Ed",  // Optional
  image: File
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Teacher is Registered Successfully.",
  "data": {
    "_id": "68cc82457107f80c1bbcb944",
    "name": "Jane Smith",
    "email": "jane@teacher.com",
    "gender": "Female",
    "teacher_image": "jane_smith.jpg"
  }
}
```

---

## 4.2 Login Teacher

**POST** `/api/teacher/login`

**Auth Required:** No

**Request Body:**
```json
{
  "email": "jane@teacher.com",
  "password": "teacher123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Success Login",
  "user": {
    "id": "68cc82457107f80c1bbcb944",
    "email": "jane@teacher.com",
    "image_url": "jane_smith.jpg",
    "name": "Jane Smith",
    "role": "TEACHER"
  }
}
```

---

## 4.3 Get Teachers with Query

**GET** `/api/teacher/fetch-with-query?search=<name>`

**Auth Required:** Yes
**Role:** SCHOOL

**Query Parameters:**
- `search` (optional): Search by name

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "68cc82457107f80c1bbcb944",
      "name": "Jane Smith",
      "email": "jane@teacher.com",
      "gender": "Female",
      "qualification": "M.Sc, B.Ed",
      "teacher_image": "jane_smith.jpg"
    }
  ]
}
```

---

## 4.4 Get Teacher Own Details

**GET** `/api/teacher/fetch-own`

**Auth Required:** Yes
**Role:** TEACHER

**Description:** Teacher gets their own profile

---

## 4.5 Update Teacher

**PATCH** `/api/teacher/update/:id`

**Auth Required:** Yes
**Role:** SCHOOL

**Request Type:** `multipart/form-data`

---

## 4.6 Delete Teacher

**DELETE** `/api/teacher/delete/:id`

**Auth Required:** Yes
**Role:** SCHOOL

---

# 5. CLASS MANAGEMENT APIS

Base Path: `/api/class`

## 5.1 Create Class

**POST** `/api/class/create`

**Auth Required:** Yes
**Role:** SCHOOL

**Request Body:**
```json
{
  "class_text": "10th Standard",
  "class_num": 10
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Class Created",
  "data": {
    "_id": "68cc82457107f80c1bbcb941",
    "class_text": "10th Standard",
    "class_num": 10,
    "asignSubTeach": [],
    "school": "68cc82457107f80c1bbcb940"
  }
}
```

---

## 5.2 Get All Classes

**GET** `/api/class/fetch-all`

**Auth Required:** Yes
**Role:** SCHOOL, TEACHER

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "68cc82457107f80c1bbcb941",
      "class_text": "10th Standard",
      "class_num": 10,
      "asignSubTeach": [
        {
          "subject": {
            "_id": "subject123",
            "subject_name": "Mathematics"
          },
          "teacher": {
            "_id": "teacher123",
            "name": "Jane Smith"
          }
        }
      ],
      "attendee": {
        "_id": "teacher123",
        "name": "Jane Smith"
      }
    }
  ]
}
```

---

## 5.3 Get Single Class

**GET** `/api/class/fetch-single/:id`

**Auth Required:** No (in current implementation, should be Yes)

**URL Parameters:**
- `id`: Class ObjectId

---

## 5.4 Update Class

**PATCH** `/api/class/update/:id`

**Auth Required:** Yes
**Role:** SCHOOL

**Request Body:**
```json
{
  "class_text": "10th Standard - Section A",
  "asignSubTeach": [
    {
      "subject": "subject_id_1",
      "teacher": "teacher_id_1"
    },
    {
      "subject": "subject_id_2",
      "teacher": "teacher_id_2"
    }
  ],
  "attendee": "teacher_id_1"
}
```

**Description:** Assigns subjects and teachers to a class

---

## 5.5 Delete Class

**DELETE** `/api/class/delete/:id`

**Auth Required:** Yes
**Role:** SCHOOL

---

## 5.6 Get Attendee Teacher

**GET** `/api/class/attendee`

**Auth Required:** Yes
**Role:** TEACHER

**Description:** Get classes where logged-in teacher is the attendee (class teacher)

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "class123",
      "class_text": "10th Standard",
      "class_num": 10
    }
  ]
}
```

---

# 6. SUBJECT MANAGEMENT APIS

Base Path: `/api/subject`

## 6.1 Create Subject

**POST** `/api/subject/create`

**Auth Required:** Yes
**Role:** SCHOOL

**Request Body:**
```json
{
  "subject_name": "Mathematics",
  "subject_codename": "MATH101"
}
```

---

## 6.2 Get All Subjects

**GET** `/api/subject/fetch-all`

**Auth Required:** Yes
**Role:** SCHOOL, TEACHER

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "subject123",
      "subject_name": "Mathematics",
      "subject_codename": "MATH101"
    },
    {
      "_id": "subject124",
      "subject_name": "Science",
      "subject_codename": "SCI101"
    }
  ]
}
```

---

# 7. COURSE MANAGEMENT APIS

Base Path: `/api/course`

## 7.1 Create Course

**POST** `/api/course/create`

**Auth Required:** Yes
**Role:** SCHOOL

**Request Body:**
```json
{
  "courseName": "Computer Science",
  "courseCode": "CS101",
  "description": "Undergraduate CS program",
  "duration": "3 Years",
  "category": "Undergraduate",
  "totalFees": 150000,
  "subjects": ["subject_id_1", "subject_id_2"],
  "eligibilityCriteria": "10th Pass with 60%",
  "maxStudents": 100
}
```

---

## 7.2 Get All Courses

**GET** `/api/course/fetch-all`

**Auth Required:** Yes
**Role:** SCHOOL, TEACHER, STUDENT

---

# 8. ATTENDANCE APIS

Base Path: `/api/attendance`

## 8.1 Mark Attendance

**POST** `/api/attendance/mark`

**Auth Required:** Yes
**Role:** TEACHER

**Request Body:**
```json
{
  "classId": "class123",
  "date": "2025-10-18",
  "attendance": [
    {
      "studentId": "student1",
      "status": "Present"
    },
    {
      "studentId": "student2",
      "status": "Absent"
    }
  ]
}
```

**JavaScript Example:**
```javascript
const attendanceData = {
  classId: selectedClass,
  date: new Date().toISOString().split('T')[0],
  attendance: students.map(student => ({
    studentId: student._id,
    status: student.isPresent ? 'Present' : 'Absent'
  }))
};

await axios.post('/api/attendance/mark', attendanceData);
```

---

## 8.2 Get Student Attendance

**GET** `/api/attendance/:studentId`

**Auth Required:** Yes
**Role:** TEACHER, STUDENT, SCHOOL

**URL Parameters:**
- `studentId`: Student ObjectId

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "attendance123",
      "student": "student123",
      "class": "class123",
      "date": "2025-10-18T00:00:00.000Z",
      "status": "Present"
    },
    {
      "_id": "attendance124",
      "student": "student123",
      "class": "class123",
      "date": "2025-10-17T00:00:00.000Z",
      "status": "Absent"
    }
  ]
}
```

---

## 8.3 Check Attendance

**GET** `/api/attendance/check/:classId?date=<date>`

**Auth Required:** Yes
**Role:** TEACHER

**Description:** Check if attendance is already marked for a class on a specific date

**Query Parameters:**
- `date`: Date in format YYYY-MM-DD

**Success Response (200):**
```json
{
  "success": true,
  "marked": true,
  "data": [...]
}
```

---

## 8.4 Get Attendance Report

**GET** `/api/attendance/report/all`

**Auth Required:** Yes
**Role:** SCHOOL, TEACHER

**Description:** Get comprehensive attendance report

---

## 8.5 Get Attendance Summary

**GET** `/api/attendance/report/summary`

**Auth Required:** Yes
**Role:** SCHOOL, TEACHER

**Description:** Get attendance statistics

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalStudents": 100,
    "presentToday": 85,
    "absentToday": 15,
    "averageAttendance": 87.5
  }
}
```

---

# 9. EXAMINATION APIS

Base Path: `/api/examination`

## 9.1 Create Examination

**POST** `/api/examination/create`

**Auth Required:** Yes
**Role:** SCHOOL

**Request Body:**
```json
{
  "examDate": "2025-10-25",
  "subject": "subject123",
  "examType": "Midterm",
  "class": "class123"
}
```

---

## 9.2 Get All Examinations

**GET** `/api/examination/fetch-all`

**Auth Required:** Yes
**Role:** SCHOOL, TEACHER, STUDENT

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "exam123",
      "examDate": "2025-10-25",
      "subject": {
        "_id": "subject123",
        "subject_name": "Mathematics"
      },
      "examType": "Midterm",
      "status": "pending",
      "class": {
        "_id": "class123",
        "class_text": "10th Standard"
      }
    }
  ]
}
```

---

# 10. FEES MANAGEMENT APIS

Base Path: `/api/fees`

## 10.1 Get Student Fees

**GET** `/api/fees/:studentId`

**Auth Required:** Yes
**Role:** SCHOOL, STUDENT

---

## 10.2 Record Payment

**POST** `/api/fees/pay`

**Auth Required:** Yes
**Role:** SCHOOL

**Request Body:**
```json
{
  "studentId": "student123",
  "paidAmount": 5000,
  "paymentMethod": "Online",
  "remarks": "Partial payment"
}
```

---

# 11. STUDENT RECORDS APIS

Base Path: `/api/student-records`

## 11.1 Create Student Record

**POST** `/api/student-records/create`

**Auth Required:** Yes
**Role:** SCHOOL

**Request Body:** (Comprehensive student profile)
```json
{
  "student_name": "John Doe",
  "father_name": "Father Name",
  "mother_name": "Mother Name",
  "date_of_birth": "2007-05-15",
  "gender": "Male",
  "blood_group": "O+",
  "class": "10th",
  "section": "A",
  "admission_number": "2024001",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "phone_number": "9876543210",
  "fees": {
    "total_fees": 50000,
    "paid_fees": 20000
  }
}
```

---

## 11.2 Get All Student Records

**GET** `/api/student-records/fetch-all`

**Auth Required:** Yes
**Role:** SCHOOL

---

## 11.3 Get Student Record Stats

**GET** `/api/student-records/stats`

**Auth Required:** Yes
**Role:** SCHOOL

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalStudents": 500,
    "activeStudents": 485,
    "inactiveStudents": 15,
    "totalFees": 25000000,
    "totalFeesCollected": 18000000,
    "totalFeesBalance": 7000000,
    "todayFeesCollected": 150000
  }
}
```

---

# 12. NOTICE BOARD APIS

Base Path: `/api/notices`

## 12.1 Create Notice

**POST** `/api/notices/create`

**Auth Required:** Yes
**Role:** SCHOOL, TEACHER

**Request Body:**
```json
{
  "title": "Holiday Notice",
  "message": "School will remain closed on Monday due to public holiday",
  "audience": "student"
}
```

---

## 12.2 Get Notices

**GET** `/api/notices/fetch?audience=<student|teacher>`

**Auth Required:** Yes
**Role:** SCHOOL, TEACHER, STUDENT

**Query Parameters:**
- `audience`: "student" or "teacher"

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "notice123",
      "title": "Holiday Notice",
      "message": "School will remain closed...",
      "audience": "student",
      "date": "2025-10-18T00:00:00.000Z"
    }
  ]
}
```

---

# 13. PERIOD/SCHEDULE APIS

Base Path: `/api/period`

## 13.1 Create Period

**POST** `/api/period/create`

**Auth Required:** Yes
**Role:** SCHOOL

**Request Body:**
```json
{
  "teacher": "teacher123",
  "subject": "subject123",
  "class": "class123",
  "startTime": "2025-10-20T09:00:00",
  "endTime": "2025-10-20T10:00:00"
}
```

---

## 13.2 Get Schedule

**GET** `/api/period/fetch?teacher=<id>&class=<id>&date=<date>`

**Auth Required:** Yes
**Role:** SCHOOL, TEACHER, STUDENT

**Query Parameters:**
- `teacher` (optional): Teacher ID
- `class` (optional): Class ID
- `date` (optional): Specific date

---

# 14. MARKSHEET APIS

Base Path: `/api/marksheets`

## 14.1 Generate Marksheet

**POST** `/api/marksheets/generate`

**Auth Required:** Yes
**Role:** SCHOOL

---

## 14.2 Get Student Marksheets

**GET** `/api/marksheets/student/:studentId`

**Auth Required:** Yes
**Role:** SCHOOL, STUDENT

---

# 15. SMS MANAGEMENT APIS

Base Path: `/api/sms`

## 15.1 Send SMS

**POST** `/api/sms/send`

**Auth Required:** Yes
**Role:** SCHOOL

---

## 15.2 Get SMS Templates

**GET** `/api/sms/templates`

**Auth Required:** Yes
**Role:** SCHOOL

---

## 15.3 Get SMS Logs

**GET** `/api/sms/logs`

**Auth Required:** Yes
**Role:** SCHOOL

---

# 16. FRONT PAGE MANAGEMENT APIS

Base Path: `/api/front-page`

## 16.1 Update Front Page

**POST** `/api/front-page/update`

**Auth Required:** Yes
**Role:** SCHOOL

---

## 16.2 Get Front Page Data

**GET** `/api/front-page/fetch`

**Auth Required:** No (Public)

---

# 17. PUBLIC HOMEPAGE APIS

Base Path: `/api/public-home`

## 17.1 Update Homepage

**POST** `/api/public-home/update`

**Auth Required:** Yes
**Role:** SCHOOL

---

## 17.2 Get Homepage Data

**GET** `/api/public-home/fetch`

**Auth Required:** No (Public)

---

# 18. ERROR HANDLING

## Common HTTP Status Codes:

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Success |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid data |
| 401 | Unauthorized | No/Invalid token |
| 403 | Forbidden | Wrong role |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Database/server issue |

## Error Response Format:

```json
{
  "success": false,
  "message": "Error description"
}
```

## Frontend Error Handling:

```javascript
try {
  const response = await axios.post('/api/student/register', data);
  console.log('Success:', response.data);
} catch (error) {
  if (error.response) {
    // Server responded with error
    console.log('Error:', error.response.data.message);
    console.log('Status:', error.response.status);

    if (error.response.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
  } else if (error.request) {
    // Request made but no response
    console.log('Network error');
  } else {
    // Other errors
    console.log('Error:', error.message);
  }
}
```

---

# 19. TESTING WITH cURL/POSTMAN

## Example: Complete Student Registration Flow

### 1. School Login:

```bash
curl -X POST https://api.gentime.in/api/school/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@school.com",
    "password": "test123"
  }'
```

**Save the token from Authorization header**

### 2. Create Student:

```bash
curl -X POST https://api.gentime.in/api/student/register \
  -H "Authorization: Bearer <token>" \
  -F "name=John Doe" \
  -F "email=john@student.com" \
  -F "password=student123" \
  -F "age=18" \
  -F "gender=Male" \
  -F "guardian=Parent Name" \
  -F "guardian_phone=9876543210" \
  -F "student_class=68cc82457107f80c1bbcb941" \
  -F "image=@/path/to/photo.jpg"
```

### 3. Get All Students:

```bash
curl -X GET https://api.gentime.in/api/student/fetch-with-query \
  -H "Authorization: Bearer <token>"
```

## Postman Collection:

Create a Postman collection with these environment variables:

```
BASE_URL = https://api.gentime.in/api
TOKEN = <your_token>
SCHOOL_ID = <school_id>
```

Then use `{{BASE_URL}}/student/fetch-all` in requests.

---

## API Summary Table:

| Module | Endpoints | Base Path |
|--------|-----------|-----------|
| School | 7 | /api/school |
| Student | 8 | /api/student |
| Teacher | 6 | /api/teacher |
| Class | 6 | /api/class |
| Subject | 5 | /api/subject |
| Course | 6 | /api/course |
| Attendance | 5 | /api/attendance |
| Examination | 5 | /api/examination |
| Fees | 4 | /api/fees |
| Student Records | 5 | /api/student-records |
| Notice | 4 | /api/notices |
| Period | 5 | /api/period |
| Marksheet | 5 | /api/marksheets |
| SMS | 6 | /api/sms |
| Front Page | 3 | /api/front-page |
| Public Home | 3 | /api/public-home |

**Total: ~80+ API Endpoints**

---

**End of API Documentation**
