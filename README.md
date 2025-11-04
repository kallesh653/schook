# GenTime - School Management System

A comprehensive web-based school management system built with the MERN stack (MongoDB, Express.js, React.js, Node.js). This system provides a complete solution for managing students, teachers, classes, examinations, fees, attendance, marksheets, and more - perfect for schools of any size.

## 🚀 Live Deployment

- **Frontend**: https://www.schoolm.gentime.in
- **Backend API**: https://api.gentime.in/api
- **Server**: Ubuntu 24.04.3 LTS (VPS: 72.60.202.218)

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started for Beginners](#getting-started-for-beginners)
- [Installation Guide](#installation-guide)
- [Local Development](#local-development)
- [Understanding the Application](#understanding-the-application)
- [User Roles & Capabilities](#user-roles--capabilities)
- [Core Modules Explained](#core-modules-explained)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Deployment Information](#deployment-information)
- [Troubleshooting](#troubleshooting)
- [Project Structure](#project-structure)

## 🎯 Project Overview

GenTime is a comprehensive school management system that provides:
- School administration dashboard
- Teacher management and tracking
- Student enrollment and records
- Attendance management
- Examination and marksheet generation
- Fee management
- Notice board system
- SMS integration for notifications

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18.2.0 + Vite 5.4.2
- **UI Library**: Material-UI (MUI) v5
- **State Management**: React Context API
- **Form Handling**: Formik + Yup
- **HTTP Client**: Axios
- **Routing**: React Router DOM v6

### Backend
- **Runtime**: Node.js 18.x
- **Framework**: Express.js 4.18.2
- **Database**: MongoDB Atlas
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **File Upload**: Formidable
- **Process Manager**: PM2

### DevOps
- **Web Server**: Nginx 1.24.0
- **SSL**: Let's Encrypt (Certbot)
- **Version Control**: Git + GitHub

## ✨ Features

### Student Management
- **Student Registration**: Complete student profile with personal and academic information
- **Bulk Upload**: Import multiple students via Excel/CSV files
- **Student Records**: Comprehensive records including personal, academic, contact, and fee details
- **ID Card Generation**: Automatically generate student ID cards
- **Image Management**: Upload and manage student photos
- **Age Validation**: Ensures students meet minimum age requirement (4 years)
- **Aadhaar Integration**: Optional 12-digit Aadhaar number validation
- **Status Tracking**: Active, Inactive, Transferred, or Graduated status

### Teacher Management
- **Teacher Profiles**: Complete teacher information with qualifications and experience
- **Subject Assignment**: Assign subjects to teachers
- **Salary Management**: Track teacher compensation
- **Class Teacher Assignment**: Designate class teachers for each section
- **Attendance Tracking**: Monitor teacher attendance
- **Performance Reports**: Generate teacher performance analytics

### Class & Academic Management
- **Class Creation**: Support for grades 1-12 with multiple sections (A, B, C, etc.)
- **Subject Management**: Create and assign subjects to classes
- **Course Management**: Define course structures
- **Subject-Teacher Mapping**: Assign teachers to subjects per class
- **Timetable Management**: Create and manage class schedules
- **Period Management**: Track daily periods and schedules

### Examination System
- **Multiple Exam Types**: First Term, Second Term, Final, Unit Tests, Pre-Board
- **Exam Scheduling**: Schedule examinations with dates and times
- **Mark Entry**: Enter marks subject-wise for each student
- **Grade Calculation**: Automatic grade assignment based on marks
- **Bulk Mark Upload**: Import marks via Excel for faster entry
- **Result Publishing**: Publish results for students to view

### Marksheet Generation
- **Professional Design**: Well-formatted marksheets with school branding
- **Student Photos**: Include student photos on marksheets
- **Subject-wise Display**: Show marks, grades, and percentages for all subjects
- **Grade System**: A+ (90-100), A (80-89), B+ (70-79), B (60-69), C (50-59), D (40-49), F (<40)
- **PDF Export**: Download marksheets as PDF files
- **Print Support**: Printer-friendly format for physical copies
- **Academic Year Tracking**: Organize marksheets by academic year

### Fee Management
- **Fee Structure**: Define fee structure per class
- **Transport Fees**: Separate transport fee management by routes
- **Payment Tracking**: Record fee payments with dates and methods
- **Balance Calculation**: Automatic calculation of pending fees
- **Payment History**: Complete payment history for each student
- **Fee Reports**: Generate fee collection reports
- **Due Date Management**: Track fee due dates and overdue payments
- **Fee Receipts**: Generate printable fee receipts

### Attendance System
- **Daily Attendance**: Mark daily attendance for students
- **Multiple Status**: Present, Absent, Late, Half Day, On Leave
- **Bulk Entry**: Mark attendance for entire class at once
- **Teacher Attendance**: Track teacher attendance separately
- **Attendance Reports**: Generate monthly and custom period reports
- **Percentage Calculation**: Automatic attendance percentage calculation
- **Attendance Analytics**: Visual graphs and charts for attendance trends

### Dashboard & Analytics
- **Overview Statistics**: Total students, teachers, classes at a glance
- **Today's Attendance**: Quick view of today's student and teacher attendance
- **Fee Collection**: Real-time fee collection statistics
- **Recent Activities**: Timeline of recent system activities
- **Visual Charts**: Interactive charts using Recharts library
- **Quick Actions**: One-click access to common tasks
- **Role-based Dashboard**: Different dashboards for Admin, Teacher, and Student roles

### Notice Board
- **Announcement System**: Post important notices and announcements
- **Category-based**: Organize notices by categories (Academic, Events, Holidays, etc.)
- **Targeted Publishing**: Send notices to specific classes or all students
- **Attachment Support**: Attach files to notices
- **Notice Archive**: Access old notices and announcements

### Additional Features
- **Multi-school Support**: Manage multiple schools from one installation
- **Role-based Access Control**: Different permissions for Admin, Teacher, and Student
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Search & Filter**: Advanced search and filtering across all modules
- **Export Functionality**: Export data to Excel and PDF formats
- **Image Upload**: Secure file upload for student/teacher photos
- **Data Validation**: Comprehensive input validation to ensure data integrity
- **Security**: JWT authentication, password hashing, and protected routes

## 🎓 Getting Started for Beginners

### What is the MERN Stack?

This application is built using the **MERN stack**, which consists of four technologies:

1. **MongoDB** - Database (stores all data like students, teachers, marks)
   - A NoSQL database that stores data in flexible, JSON-like documents
   - Perfect for storing complex data structures like student records

2. **Express.js** - Backend Framework (handles business logic)
   - A web application framework for Node.js
   - Creates APIs that the frontend can call to get/send data

3. **React** - Frontend Library (what users see and interact with)
   - A JavaScript library for building user interfaces
   - Creates dynamic, interactive web pages without full page reloads

4. **Node.js** - Runtime Environment (runs JavaScript on the server)
   - Allows JavaScript to run on the server side, not just in browsers
   - Handles requests from the frontend and communicates with the database

### How the Application Works

```
User's Browser (React Frontend)
         ↓
    Makes HTTP Request (e.g., "get all students")
         ↓
Backend Server (Express + Node.js)
         ↓
    Queries Database (MongoDB)
         ↓
    Sends Response with Data
         ↓
Frontend Displays Data to User
```

### Project Architecture

**Frontend (React)**: Located in `frontend/` folder
- User interface components
- Forms for data entry
- Tables to display data
- Charts and analytics
- Runs on: `http://localhost:5173` (development)

**Backend (Node.js + Express)**: Located in `api/` folder
- API endpoints (routes)
- Business logic and validation
- Database operations
- Authentication and security
- Runs on: `http://localhost:5002` (development)

**Database (MongoDB)**:
- Stores all application data
- Can be local (on your computer) or cloud-based (MongoDB Atlas)

## 📦 Installation Guide

### Step 1: Install Prerequisites

#### 1.1 Install Node.js

Node.js is required to run both frontend and backend.

**Windows:**
1. Visit https://nodejs.org/
2. Download the LTS (Long Term Support) version
3. Run the installer
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

**macOS:**
```bash
# Using Homebrew
brew install node

# Verify
node --version
npm --version
```

**Linux (Ubuntu/Debian):**
```bash
# Update package manager
sudo apt update

# Install Node.js
sudo apt install nodejs npm

# Verify
node --version
npm --version
```

#### 1.2 Install MongoDB

You have two options:

**Option A: MongoDB Atlas (Cloud - Recommended for beginners)**
1. Visit https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (free tier available)
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

**Option B: Local MongoDB Installation**

**Windows:**
1. Visit https://www.mongodb.com/try/download/community
2. Download MongoDB Community Server
3. Run installer and follow the setup wizard
4. MongoDB will run as a Windows service

**macOS:**
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Step 2: Clone or Download the Project

**Option A: Using Git**
```bash
git clone <repository-url>
cd "school management system"
```

**Option B: Download ZIP**
1. Download the project ZIP file
2. Extract it to your desired location
3. Open terminal/command prompt in that folder

### Step 3: Install Backend Dependencies

```bash
# Navigate to backend folder
cd api

# Install all required packages
npm install
```

This will install packages like:
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - For authentication
- `bcryptjs` - Password hashing
- `axios` - HTTP client
- And many more...

### Step 4: Configure Backend Environment

Create a file named `.env` in the `api` folder:

```bash
# In api folder
touch .env  # On Mac/Linux
# Or manually create .env file on Windows
```

Add the following content to `.env`:

```env
# Server Configuration
PORT=5002

# Database Configuration
# For MongoDB Atlas (cloud):
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/school_management

# For local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/school_management

# JWT Secret (change this to a random string)
JWT_SECRET=your_super_secret_key_change_this_in_production

# Environment
NODE_ENV=development
```

**Important**: Replace `username`, `password`, and `cluster` with your actual MongoDB Atlas credentials.

### Step 5: Install Frontend Dependencies

```bash
# Navigate to frontend folder (from project root)
cd frontend

# Install all required packages
npm install
```

This will install packages like:
- `react` & `react-dom` - React library
- `@mui/material` - Material-UI components
- `axios` - For API calls
- `react-router-dom` - For routing
- `recharts` - For charts
- And many more...

### Step 6: Configure Frontend Environment

Create a file named `.env` in the `frontend` folder:

```bash
# In frontend folder
touch .env  # On Mac/Linux
# Or manually create .env file on Windows
```

Add the following content:

```env
# API URL for development
VITE_API_URL=http://localhost:5002/api
```

### Step 7: Start the Application

You need **TWO terminal windows** - one for backend, one for frontend.

#### Terminal 1 - Start Backend

```bash
# From project root
cd api

# Start backend server
npm start
```

You should see:
```
Server is running on port 5002
Connected to MongoDB successfully
```

#### Terminal 2 - Start Frontend

```bash
# From project root (in a NEW terminal)
cd frontend

# Start frontend development server
npm run dev
```

You should see:
```
VITE v5.4.2  ready in X ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 8: Access the Application

Open your web browser and go to:
```
http://localhost:5173
```

You should see the login page!

### First-Time Setup

1. **Register a School**: Click on "Register School" or visit the registration page
2. **Login**: Use the school credentials you just created
3. **Set up**:
   - Add classes (Class 1-12, sections A, B, C, etc.)
   - Add subjects (Math, Science, English, etc.)
   - Add teachers
   - Add students

## 💻 Local Development

### Prerequisites
- Node.js 18.x or higher
- MongoDB Atlas account (or local MongoDB)
- Git

### Backend Setup

1. Navigate to the API directory:
```bash
cd "school management system/api"
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# .env file should contain:
PORT=5002
JWT_SECRET=your_jwt_secret_here
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
```

4. Start the development server:
```bash
npm start
# Server runs on http://localhost:5002
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd "school management system/frontend"
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# .env file should contain:
VITE_API_URL=http://localhost:5002/api
```

4. Start the development server:
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

## 🎯 Understanding the Application

### Application Flow

#### 1. Authentication Flow
```
User enters credentials → Frontend sends to /api/school/login
                       ↓
Backend validates credentials using bcrypt
                       ↓
If valid: Generate JWT token
                       ↓
Send token to frontend
                       ↓
Frontend stores token in localStorage
                       ↓
All future requests include token in Authorization header
```

#### 2. Data Flow Example (Fetching Students)
```
User clicks "Students" → Frontend calls axios.get('/api/student/fetch-all')
                       ↓
Request includes JWT token in header
                       ↓
Backend auth middleware verifies token
                       ↓
If valid: Controller fetches students from MongoDB
                       ↓
Database returns student documents
                       ↓
Backend sends JSON response to frontend
                       ↓
Frontend displays students in table/cards
```

### Key Concepts

#### What is JWT (JSON Web Token)?
- A secure way to transmit information between frontend and backend
- Contains user information (id, role, school)
- Signed with a secret key to prevent tampering
- Expires after a set time (default: 7 days in this project)

#### What is Mongoose?
- An Object Data Modeling (ODM) library for MongoDB
- Provides a schema-based solution to model data
- Example: Student model defines what fields a student should have
- Automatically validates data before saving to database

#### What is REST API?
- **RE**presentational **S**tate **T**ransfer
- A way for frontend and backend to communicate
- Uses HTTP methods:
  - `GET` - Retrieve data
  - `POST` - Create new data
  - `PUT` - Update existing data
  - `DELETE` - Remove data

#### Frontend Components Explained

**React Components**: Reusable pieces of UI
- `StudentList.jsx` - Displays all students in a table
- `AddStudent.jsx` - Form to add new student
- `Dashboard.jsx` - Main dashboard with statistics

**React Hooks**: Special functions that add features to components
- `useState` - Manage component state (data)
- `useEffect` - Run code when component loads
- `useContext` - Access global state (like logged-in user)

**Material-UI (MUI)**: Pre-built, beautiful React components
- `Button`, `TextField`, `Table`, `Dialog`, etc.
- Consistent, professional design out of the box

## 👥 User Roles & Capabilities

### 1. Admin/School Owner

**Access Level**: Full system access

**Login**: School credentials created during registration

**Main Dashboard Shows**:
- Total students, teachers, classes
- Today's attendance overview
- Fee collection statistics
- Recent system activities
- Quick action buttons

**Can Do**:
- ✅ Manage school profile and settings
- ✅ Add/edit/delete students
- ✅ Bulk upload students via Excel
- ✅ Add/edit/delete teachers
- ✅ Create and manage classes (1-12, sections)
- ✅ Create and assign subjects
- ✅ Set up fee structures
- ✅ Configure transport fees
- ✅ Schedule examinations
- ✅ View all marks and results
- ✅ Generate marksheets for any student
- ✅ View attendance for all students/teachers
- ✅ Manage fee payments
- ✅ Post notices and announcements
- ✅ Generate reports (students, fees, attendance)
- ✅ Export data to Excel/PDF
- ✅ User management (teachers, students)

**Key Pages**:
- Dashboard
- Students Management
- Teachers Management
- Classes Management
- Subjects Management
- Examination Management
- Marks Entry
- Marksheet Generation
- Fee Management
- Attendance Tracking
- Reports & Analytics
- Settings

### 2. Teacher

**Access Level**: Limited to assigned classes and subjects

**Login**: Teacher email and password

**Main Dashboard Shows**:
- Assigned classes
- Today's schedule
- Recent activities
- Quick links to attendance and marks

**Can Do**:
- ✅ View own profile
- ✅ Update own password
- ✅ View assigned classes and students
- ✅ Mark attendance for assigned classes
- ✅ Enter marks for assigned subjects
- ✅ Generate marksheets for students in assigned classes
- ✅ View student profiles
- ✅ View class timetable
- ✅ Post notices (if permitted)

**Cannot Do**:
- ❌ Add/delete students
- ❌ Add/delete other teachers
- ❌ Modify fee structures
- ❌ Access school settings
- ❌ View financial reports
- ❌ Modify class structures

**Key Pages**:
- Teacher Dashboard
- My Classes
- Mark Attendance
- Enter Marks
- View Students
- Generate Marksheets

### 3. Student

**Access Level**: View own information only

**Login**: Student email and password

**Main Dashboard Shows**:
- Personal information
- Current class and section
- Attendance percentage
- Fee status
- Recent notices

**Can Do**:
- ✅ View own profile
- ✅ Update own password
- ✅ View own attendance records
- ✅ View own marks and grades
- ✅ Download own marksheets
- ✅ View fee status and payment history
- ✅ View class timetable
- ✅ Read notices and announcements

**Cannot Do**:
- ❌ View other students' information
- ❌ Modify any data
- ❌ Access administrative features
- ❌ View teacher information
- ❌ Generate reports

**Key Pages**:
- Student Dashboard
- My Profile
- My Attendance
- My Marksheets
- Fee Status
- Notices

## 🔧 Core Modules Explained

### 1. Student Management Module

**Files**:
- **Models**:
  - [api/model/student.model.js](api/model/student.model.js) - Basic student info with authentication
  - [api/model/studentRecord.model.js](api/model/studentRecord.model.js) - Detailed student records
- **Controllers**: [api/controller/student.controller.js](api/controller/student.controller.js)
- **Frontend**: [frontend/src/school/components/student/](frontend/src/school/components/student/)

**How It Works**:

1. **Student Registration**:
   ```javascript
   // Frontend sends POST request to /api/student/register
   POST /api/student/register
   Body: {
     name: "John Doe",
     email: "john@example.com",
     date_of_birth: "2015-05-15",
     class: "5",
     guardian: "Jane Doe",
     guardian_phone: "1234567890",
     password: "password123"
   }

   // Backend:
   // 1. Validates age (minimum 4 years)
   // 2. Hashes password using bcrypt
   // 3. Calculates age automatically
   // 4. Saves to MongoDB
   // 5. Returns success response
   ```

2. **Age Validation**:
   - Pre-save middleware automatically calculates age from date_of_birth
   - Ensures student is at least 4 years old
   - Located in: [api/model/student.model.js:57-78](api/model/student.model.js#L57-L78)

3. **Bulk Upload**:
   - Teachers can upload Excel file with multiple students
   - System validates each row
   - Creates students in batch
   - Component: [frontend/src/school/components/student/StudentBulkUpload.jsx](frontend/src/school/components/student/StudentBulkUpload.jsx)

**Two Student Models Explained**:

- **Student Model**: Basic info + authentication (for login)
- **StudentRecord Model**: Comprehensive records (for detailed information)
- Why two? Separation of concerns - authentication vs. record-keeping

### 2. Class Management Module

**Files**:
- **Model**: [api/model/class.model.js](api/model/class.model.js)
- **Controllers**: [api/controller/class.controller.js](api/controller/class.controller.js)
- **Frontend**: [frontend/src/school/components/class/](frontend/src/school/components/class/)

**Class Structure**:
```javascript
{
  class_num: 10,              // Grade level (1-12)
  class_text: "A",            // Section (A, B, C, etc.)
  asignSubTeach: [            // Subject-teacher assignments
    {
      subject: ObjectId,      // Reference to Subject
      teacher: ObjectId       // Reference to Teacher
    }
  ],
  attendee: ObjectId          // Class teacher (homeroom teacher)
}
```

**How It Works**:
1. Admin creates a class (e.g., Class 10 - A)
2. Admin assigns subjects to the class
3. Admin assigns teachers to each subject
4. Admin designates one teacher as class teacher (attendee)
5. Students are enrolled in the class
6. Class teacher can mark attendance and manage class activities

### 3. Examination & Marks Module

**Files**:
- **Models**:
  - [api/model/examination.model.js](api/model/examination.model.js)
  - [api/model/marks.model.js](api/model/marks.model.js)
- **Frontend**: [frontend/src/school/components/marks/](frontend/src/school/components/marks/)

**Workflow**:

1. **Create Examination**:
   ```javascript
   POST /api/examination/create
   Body: {
     examType: "First Term",
     class: "class_id",
     startDate: "2025-03-01",
     endDate: "2025-03-15"
   }
   ```

2. **Enter Marks**:
   ```javascript
   POST /api/marks/create
   Body: {
     student: "student_id",
     examination: "First Term",
     subject: "subject_id",
     marks_obtained: 85,
     max_marks: 100
   }

   // Backend automatically calculates grade:
   // 90-100: A+, 80-89: A, 70-79: B+, etc.
   ```

3. **Grade Calculation Logic**:
   ```javascript
   if (percentage >= 90) return 'A+';
   else if (percentage >= 80) return 'A';
   else if (percentage >= 70) return 'B+';
   else if (percentage >= 60) return 'B';
   else if (percentage >= 50) return 'C';
   else if (percentage >= 40) return 'D';
   else return 'F';
   ```

### 4. Marksheet Generation Module

**File**: [frontend/src/school/components/marksheet/MarkSheetGenerator.jsx](frontend/src/school/components/marksheet/MarkSheetGenerator.jsx)

**How It Works**:

1. **User selects**:
   - Class (e.g., Class 10 - A)
   - Student (from that class)
   - Examination (e.g., First Term)
   - Academic Year

2. **System fetches**:
   - Student details from student records
   - All marks for that student in that examination
   - School information

3. **System generates**:
   - Professional marksheet layout
   - Student photo
   - Subject-wise marks and grades
   - Total marks and percentage
   - Overall grade

4. **User can**:
   - View on screen
   - Download as PDF (using jsPDF + html2canvas)
   - Print directly

**Key Features**:
- Uses `html2canvas` to convert HTML to image
- Uses `jsPDF` to create PDF from image
- Responsive design for different paper sizes
- Includes school logo and branding

### 5. Fee Management Module

**Files**:
- **Models**:
  - [api/model/fees.model.js](api/model/fees.model.js)
  - [api/model/transportFees.model.js](api/model/transportFees.model.js)
- **Frontend**: [frontend/src/school/components/fees/](frontend/src/school/components/fees/)

**Fee Structure**:
```javascript
// In Student/StudentRecord model:
fees: {
  total_fees: 50000,        // Annual fees
  paid_fees: 30000,         // Amount paid so far
  balance_fees: 20000,      // Auto-calculated (total - paid)
  transport_fees: 5000      // Additional transport fees
}

// Pre-save middleware automatically calculates balance:
balance_fees = total_fees - paid_fees
```

**Transport Fees**:
- Separate model for transport fee structure
- Organized by routes (Route A, Route B, etc.)
- Different fees for different distances
- Students can opt-in for transport

### 6. Attendance Module

**Files**:
- **Models**:
  - [api/model/attendance.model.js](api/model/attendance.model.js)
  - [api/model/teacherAttendance.model.js](api/model/teacherAttendance.model.js)
- **Frontend**: [frontend/src/school/components/attendance/](frontend/src/school/components/attendance/)

**Attendance Status Options**:
- **Present**: Student attended class
- **Absent**: Student did not attend
- **Late**: Student arrived late
- **Half Day**: Student attended partial day
- **On Leave**: Student has approved leave

**How Attendance Works**:

1. **Teacher marks attendance daily**:
   ```javascript
   POST /api/attendance/mark
   Body: {
     student: "student_id",
     class: "class_id",
     date: "2025-11-01",
     status: "Present",
     remarks: "Optional notes"
   }
   ```

2. **System calculates percentage**:
   ```javascript
   Attendance % = (Present Days / Total Days) × 100
   ```

3. **Reports available**:
   - Daily attendance
   - Monthly summary
   - Student-wise attendance
   - Class-wise attendance
   - Date range reports

## 📊 Database Schema

### Collections (Tables) in MongoDB

#### 1. School Collection
```javascript
{
  _id: ObjectId,
  school_name: "ABC International School",
  email: "admin@abcschool.com",
  password: "$2a$10$hashed_password",  // Bcrypt hashed
  school_id: "SCH001",
  established_year: 1990,
  address: "123 Main St, City",
  phone: "1234567890",
  website: "www.abcschool.com",
  createdAt: Date
}
```

#### 2. Student Collection (for authentication)
```javascript
{
  _id: ObjectId,
  school: ObjectId,              // Reference to School
  name: "John Doe",
  email: "john@example.com",
  password: "$2a$10$hashed",
  student_class: ObjectId,       // Reference to Class
  date_of_birth: Date,
  age: 15,                       // Auto-calculated
  gender: "Male",
  guardian: "Jane Doe",
  guardian_phone: "1234567890",
  aadhaar_number: "123456789012", // 12 digits, optional
  roll_number: "001",
  student_image: "john-doe.jpg",
  fees: {
    total_fees: 50000,
    advance_fees: 10000,
    balance_fees: 40000
  },
  transport_fees: ObjectId,      // Reference to TransportFees
  createdAt: Date
}
```

#### 3. StudentRecord Collection (detailed records)
```javascript
{
  _id: ObjectId,
  // Personal Information
  student_name: "John Doe",
  father_name: "Robert Doe",
  mother_name: "Jane Doe",
  date_of_birth: Date,
  gender: "Male",
  blood_group: "O+",
  religion: "Christian",
  caste: "General",
  nationality: "Indian",

  // Academic Information
  school: ObjectId,
  school_name: "ABC School",
  school_id: "SCH001",
  class: "Class 10 - A",         // Display string
  class_id: ObjectId,            // Reference to Class
  section: "A",
  roll_number: "001",
  admission_number: "ADM2025001",
  admission_date: Date,
  academic_year: "2024-2025",

  // Contact Information
  address: {
    street: "123 Main St",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    country: "India"
  },
  phone_number: "1234567890",
  email: "john@example.com",
  emergency_contact: {
    name: "Jane Doe",
    relationship: "Mother",
    phone: "0987654321"
  },

  // Fees
  fees: {
    total_fees: 50000,
    paid_fees: 30000,
    balance_fees: 20000,         // Auto-calculated
    transport_fees: 5000
  },

  // Additional
  previous_school: "XYZ School",
  medical_conditions: "None",
  transport_required: true,
  hostel_required: false,
  status: "Active",              // Active/Inactive/Transferred/Graduated

  created_at: Date,
  updated_at: Date
}
```

#### 4. Teacher Collection
```javascript
{
  _id: ObjectId,
  school: ObjectId,
  name: "Dr. Smith",
  email: "smith@example.com",
  password: "$2a$10$hashed",
  subject: "Mathematics",
  date_of_birth: Date,
  age: 35,
  date_of_joining: Date,
  gender: "Male",
  phone: "1234567890",
  address: "456 Teacher Lane",
  qualification: "PhD in Mathematics",
  experience: 10,                // years
  salary: 50000,                 // monthly
  teacher_image: "smith.jpg",
  createdAt: Date
}
```

#### 5. Class Collection
```javascript
{
  _id: ObjectId,
  school: ObjectId,
  class_num: 10,                 // Grade (1-12)
  class_text: "A",               // Section
  asignSubTeach: [               // Subject-teacher assignments
    {
      subject: ObjectId,         // e.g., Math
      teacher: ObjectId          // e.g., Dr. Smith
    },
    {
      subject: ObjectId,         // e.g., Science
      teacher: ObjectId          // e.g., Dr. Johnson
    }
  ],
  attendee: ObjectId,            // Class teacher
  createdAt: Date
}
```

#### 6. Marks Collection
```javascript
{
  _id: ObjectId,
  school: ObjectId,
  student: ObjectId,
  student_name: "John Doe",
  class: ObjectId,
  examination: "First Term",
  subject: ObjectId,
  subject_name: "Mathematics",
  marks_obtained: 85,
  max_marks: 100,
  grade: "A",                    // Auto-calculated
  academic_year: "2024-2025",
  createdAt: Date
}
```

#### 7. Attendance Collection
```javascript
{
  _id: ObjectId,
  school: ObjectId,
  student: ObjectId,
  student_name: "John Doe",
  class: ObjectId,
  date: Date,
  status: "Present",            // Present/Absent/Late/Half Day/On Leave
  marked_by: ObjectId,          // Teacher who marked
  remarks: "Optional notes",
  createdAt: Date
}
```

#### 8. Fees Collection
```javascript
{
  _id: ObjectId,
  school: ObjectId,
  student: ObjectId,
  student_name: "John Doe",
  class: ObjectId,
  fee_type: "Tuition Fee",
  amount: 50000,
  paid_amount: 30000,
  balance: 20000,
  due_date: Date,
  payment_date: Date,
  payment_method: "Cash/Online/Cheque",
  status: "Paid/Pending/Overdue",
  academic_year: "2024-2025",
  createdAt: Date
}
```

### Relationships Between Collections

```
School
  ├── has many Students
  ├── has many Teachers
  ├── has many Classes
  └── has many Fees

Class
  ├── belongs to School
  ├── has many Students
  ├── has many Subjects
  ├── has many Teachers (through asignSubTeach)
  └── has one Class Teacher (attendee)

Student
  ├── belongs to School
  ├── belongs to Class
  ├── has many Marks
  ├── has many Attendance records
  └── has many Fee records

Teacher
  ├── belongs to School
  ├── teaches many Subjects (through Class.asignSubTeach)
  └── may be attendee of one Class

Marks
  ├── belongs to Student
  ├── belongs to Subject
  └── belongs to Examination

Attendance
  ├── belongs to Student
  ├── belongs to Class
  └── marked by Teacher
```

## 🌐 Deployment Information

### Current Production Setup

**VPS Details:**
- IP: 72.60.202.218
- OS: Ubuntu 24.04.3 LTS
- SSH: root@72.60.202.218

**Domains:**
- Frontend: www.schoolm.gentime.in → /var/www/schoolm/frontend/dist
- Backend: api.gentime.in → http://localhost:5000

**SSL Certificates:**
- Provider: Let's Encrypt
- Auto-renewal: Enabled via Certbot
- Expiry: January 10, 2026

### Deployment Architecture

```
Client Browser
     ↓ HTTPS (443)
Nginx Web Server
     ↓ Frontend: Serves static React build
     ↓ Backend: Reverse proxy to localhost:5000
PM2 Process Manager
     ↓ Manages Node.js backend
Express.js Backend
     ↓
MongoDB Atlas
```

### Backend Configuration (PM2)

File: `/var/www/schoolm/ecosystem.config.js`
```javascript
module.exports = {
  apps: [{
    name: 'schoolm-api',
    script: 'server.js',
    cwd: '/var/www/schoolm/api',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000,
      MONGODB_URI: 'mongodb+srv://...',
      JWT_SECRET: 'your_secret_here'
    }
  }]
};
```

### Nginx Configuration

**Frontend** (`/etc/nginx/sites-available/gentime-frontend`):
- Serves static files from `/var/www/schoolm/frontend/dist`
- SSL enabled on port 443
- HTTP to HTTPS redirect

**Backend** (`/etc/nginx/sites-available/gentime-backend`):
- Reverse proxy to `http://localhost:5000`
- SSL enabled on port 443
- HTTP to HTTPS redirect

## 🤖 AI-Powered Exam Grading (MCP Server)

This project supports integration with **Model Context Protocol (MCP)** servers to enable AI-powered automated exam grading and assessment capabilities.

### What is MCP?

MCP (Model Context Protocol) is an open protocol developed by Anthropic that allows AI assistants like Claude to seamlessly integrate with external data sources and tools. In the context of this school management system, MCP enables:

- **Automated Exam Grading**: Teachers upload question papers with answer keys, students take exams, and the system automatically grades responses using AI
- **Intelligent Assessment**: Support for both objective (MCQ, True/False) and subjective (descriptive) questions with AI-powered evaluation
- **Instant Feedback**: Students receive immediate results with detailed feedback on their answers
- **Teacher Time Savings**: Reduce grading workload by 70-90%, allowing teachers to focus on instruction

### Quick Start: Enable Exam Grading Feature

#### Prerequisites
- Node.js 18+ installed
- MongoDB database connection
- Claude Desktop app (for AI-powered grading)

#### Installation Steps

1. **Install MCP Server Dependencies**:
```bash
cd "school management system/api"
npm install @modelcontextprotocol/sdk crypto
```

2. **Create Exam Server Directory**:
```bash
mkdir -p mcp-servers/exam-server
```

3. **Copy MCP Server Code**: See the complete implementation in [MCP_SERVER_IMPLEMENTATION_GUIDE.md](MCP_SERVER_IMPLEMENTATION_GUIDE.md)

4. **Configure Claude Desktop**:
Add to your Claude Desktop config (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "exam-grading": {
      "command": "node",
      "args": ["path/to/api/mcp-servers/exam-server/exam-mcp-server.js"],
      "env": {
        "MONGODB_URI": "your_mongodb_connection_string"
      }
    }
  }
}
```

5. **Restart Claude Desktop** and start using AI-powered exam grading!

### Key Features

#### For Teachers
- **Create Exams**: Upload questions with answers and set grading criteria
- **Multiple Question Types**: MCQ, True/False, Short Answer, Long Answer, Essay
- **Automated Grading**: AI evaluates student responses based on your answer key
- **Detailed Analytics**: View class performance, question-wise analysis, and individual student insights

#### For Students
- **Take Exams**: Access questions without seeing answers (secure exam mode)
- **Submit Answers**: Simple interface to submit responses
- **Instant Results**: Get scores and feedback immediately after grading
- **View Corrections**: See where you went wrong with detailed explanations

#### AI Grading Capabilities
- **Objective Questions**: 100% accurate automated grading for MCQs and True/False
- **Subjective Questions**: AI evaluates based on:
  - Keyword matching with answer key
  - Concept understanding
  - Completeness of answer
  - Factual accuracy

### Cost Analysis

#### Free Option (Self-Hosted)
- **Cost**: ~$10/month
- **What you need**: VPS server + MongoDB
- **Best for**: Schools with technical staff or budget constraints
- **Grading method**: Keyword-based algorithm (good for most use cases)

#### Paid Option (Cloud + AI)
- **Cost**: ~$127-357/month
- **What you get**: Cloud hosting + Advanced AI grading
- **Best for**: Schools wanting premium AI evaluation
- **Grading method**: Claude AI-powered assessment (superior accuracy)

### Security Features
- Answer keys are encrypted in the database
- Students cannot access answer keys via API
- Role-based access control (Teachers create, Students take)
- Exam submissions are timestamped and immutable
- Audit logs for all grading activities

### Complete Documentation

For detailed implementation instructions, including:
- Full MCP server code
- MongoDB schemas for exams and submissions
- Frontend components for teachers and students
- AI grading algorithms
- Integration with existing system
- Troubleshooting guide

**👉 See the complete guide**: [MCP_SERVER_IMPLEMENTATION_GUIDE.md](MCP_SERVER_IMPLEMENTATION_GUIDE.md)

### Example Workflow

1. **Teacher creates exam**:
   - Question: "What is photosynthesis?"
   - Answer key: "Process by which plants convert light energy into chemical energy using chlorophyll"
   - Keywords: ["plants", "light energy", "chemical energy", "chlorophyll"]

2. **Student takes exam**:
   - Sees question only (answer is hidden)
   - Submits: "Photosynthesis is when plants use sunlight and chlorophyll to make food by converting light into energy"

3. **AI grades automatically**:
   - Matches keywords: ✓ plants, ✓ light, ✓ energy, ✓ chlorophyll
   - Score: 9/10
   - Feedback: "Good answer! You covered the main concepts. To improve, mention that it's specifically chemical energy that's produced."

4. **Results available instantly**:
   - Student sees score and feedback
   - Teacher sees class analytics
   - Marksheet system automatically updated

### Benefits
- **Save Time**: 70-90% reduction in grading time
- **Consistency**: Same standards applied to all students
- **Instant Feedback**: Students learn immediately from mistakes
- **Scalability**: Grade hundreds of exams in seconds
- **Analytics**: Automatic performance tracking and insights

---

## 📡 API Documentation

### Base URL
```
Production: https://api.gentime.in/api
Development: http://localhost:5002/api
```

### Authentication Endpoints

#### School Login
```http
POST /school/login
Content-Type: application/json

{
  "email": "school@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Success Login",
  "user": {
    "id": "...",
    "owner_name": "...",
    "school_name": "...",
    "image_url": "...",
    "role": "SCHOOL"
  }
}
Headers:
Authorization: <JWT_TOKEN>
```

#### Teacher Login
```http
POST /teacher/login
```

#### Student Login
```http
POST /student/login
```

### Protected Routes

All protected routes require JWT token in Authorization header:
```http
Authorization: <JWT_TOKEN>
```

### Available API Routes

- `/api/school/*` - School management
- `/api/teacher/*` - Teacher operations
- `/api/student/*` - Student operations
- `/api/class/*` - Class management
- `/api/subject/*` - Subject management
- `/api/course/*` - Course management
- `/api/examination/*` - Exam operations
- `/api/attendance/*` - Attendance tracking
- `/api/period/*` - Period management
- `/api/notices/*` - Notice board
- `/api/fees/*` - Fee management
- `/api/student-records/*` - Student records
- `/api/marksheets/*` - Marksheet generation
- `/api/sms/*` - SMS notifications
- `/api/auth/check` - Auth verification

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=5002                          # Server port
JWT_SECRET=your_secret_key         # JWT signing key
MONGODB_URI=mongodb+srv://...      # MongoDB connection
NODE_ENV=development               # Environment
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5002/api    # Development API URL
```

### Frontend (.env.production)
```env
VITE_API_URL=https://api.gentime.in/api   # Production API URL
```

## 🔑 Test Credentials

### School Owner Account
```
Email: test@school.com
Password: test123
URL: https://www.schoolm.gentime.in
```

## 📁 Project Structure

```
school management system/
├── api/                          # Backend (Express.js)
│   ├── auth/                     # Authentication middleware
│   ├── controller/               # Route controllers
│   │   ├── auth.controller.js
│   │   ├── school.controller.js
│   │   ├── teacher.controller.js
│   │   ├── student.controller.js
│   │   └── ...
│   ├── model/                    # Mongoose models
│   │   ├── school.model.js
│   │   ├── teacher.model.js
│   │   ├── student.model.js
│   │   └── ...
│   ├── router/                   # Express routes
│   │   ├── school.router.js
│   │   ├── teacher.router.js
│   │   ├── student.router.js
│   │   └── ...
│   ├── .env                      # Environment variables
│   ├── server.js                 # Entry point
│   └── package.json
│
├── frontend/                     # Frontend (React + Vite)
│   ├── public/                   # Static assets
│   │   └── images/              # Image uploads
│   ├── src/
│   │   ├── client/              # Client components
│   │   │   ├── components/      # React components
│   │   │   │   ├── login/
│   │   │   │   ├── dashboard/
│   │   │   │   └── ...
│   │   │   └── pages/          # Page components
│   │   ├── context/            # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── yupSchema/          # Form validation
│   │   ├── environment.js      # API config
│   │   └── main.jsx           # Entry point
│   ├── .env                    # Dev environment
│   ├── .env.production        # Prod environment
│   ├── vite.config.js
│   └── package.json
│
└── README.md                   # This file
```

## 🔧 Troubleshooting

### Common Issues & Solutions

#### 1. Database Connection Error

**Error**: `MongoDB connection error: connect ECONNREFUSED`

**Cause**: MongoDB is not running or connection string is incorrect

**Solution**:
```bash
# Check if MongoDB is running
# Windows:
net start MongoDB

# macOS/Linux:
sudo systemctl status mongod
sudo systemctl start mongod

# Verify your .env file has correct MONGODB_URI
# For local: mongodb://localhost:27017/school_management
# For Atlas: mongodb+srv://username:password@cluster.mongodb.net/school_management
```

#### 2. Port Already in Use

**Error**: `Error: listen EADDRINUSE: address already in use :::5002`

**Cause**: Another process is using port 5002

**Solution**:
```bash
# Find the process using the port
# Windows:
netstat -ano | findstr :5002
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :5002
kill -9 <PID>

# Or change the PORT in your .env file to another number like 5003
```

#### 3. Module Not Found Errors

**Error**: `Error: Cannot find module 'express'` or similar

**Cause**: Dependencies not installed

**Solution**:
```bash
# In api folder:
cd api
rm -rf node_modules package-lock.json
npm install

# In frontend folder:
cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

#### 4. Frontend Cannot Connect to Backend

**Error**: `Network Error` or `ERR_CONNECTION_REFUSED` in browser console

**Cause**: Backend not running or wrong API URL

**Solution**:
- Ensure backend is running on `http://localhost:5002`
- Check frontend `.env` file has: `VITE_API_URL=http://localhost:5002/api`
- Check browser console for the actual error
- Try accessing `http://localhost:5002/api/health` (if health endpoint exists)

#### 5. Authentication Token Errors

**Error**: `Invalid token` or `No token provided` or `Token expired`

**Cause**: Token expired, corrupted, or not being sent

**Solution**:
```javascript
// Clear browser storage and re-login
localStorage.clear();
sessionStorage.clear();
// Then login again

// Check JWT_SECRET in backend .env matches
// Check token expiration (default: 7 days)
// Verify Authorization header is being sent with requests
```

#### 6. Image Upload Not Working

**Error**: Images not displaying or `404 Not Found` for images

**Cause**: Upload directory doesn't exist or incorrect path

**Solution**:
```bash
# Create images directory if it doesn't exist
cd "school management system/frontend/public"
mkdir images

# Check permissions (Mac/Linux)
chmod 755 images

# Verify backend UPLOAD_PATH in .env points to correct location
# UPLOAD_PATH=../frontend/public/images
```

#### 7. Build Warnings (Chunk Size)

**Warning**: `(!) Some chunks are larger than 500 kB after minification`

**Cause**: Large bundle size (this is just a warning, not an error)

**Solution**:
- The build still works - this is just a performance warning
- To optimize, you can implement code splitting
- Or increase the limit in `vite.config.js`:
  ```javascript
  export default {
    build: {
      chunkSizeWarningLimit: 1000
    }
  }
  ```

#### 8. Student Age Validation Error

**Error**: `Student must be at least 4 years old`

**Cause**: Date of birth makes student younger than 4 years

**Solution**:
- Check the date of birth entered
- Ensure date format is correct (YYYY-MM-DD)
- Student must have been born before: (Current Year - 4)

#### 9. CORS Errors

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Cause**: CORS not configured or wrong origin

**Solution**:
```javascript
// In api/server.js, ensure CORS is properly configured:
const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:5173', 'https://www.schoolm.gentime.in'],
  credentials: true
}));
```

#### 10. Mongoose Validation Errors

**Error**: `Validation failed: name: Path 'name' is required`

**Cause**: Required fields missing in request

**Solution**:
- Check which fields are required in the model
- Ensure frontend form sends all required fields
- Check browser console and network tab for request payload
- Verify field names match between frontend and backend

### Debugging Tips

#### Frontend Debugging

1. **Browser DevTools** (F12):
   - **Console Tab**: View JavaScript errors and console.log() output
   - **Network Tab**: Inspect API calls, see request/response
   - **Application Tab**: Check localStorage/sessionStorage tokens

2. **React DevTools** (Chrome Extension):
   - Inspect component props and state
   - View component hierarchy
   - Track re-renders

3. **Common Console Commands**:
   ```javascript
   // Check stored token
   console.log(localStorage.getItem('token'));

   // Check API URL
   console.log(import.meta.env.VITE_API_URL);

   // Test API call
   fetch('http://localhost:5002/api/student/fetch-all', {
     headers: { 'Authorization': localStorage.getItem('token') }
   }).then(r => r.json()).then(console.log);
   ```

#### Backend Debugging

1. **Server Logs**: Check terminal running backend for errors

2. **Add Console Logs**:
   ```javascript
   // In controller functions
   console.log('Request body:', req.body);
   console.log('User from token:', req.user);
   console.log('Query result:', result);
   ```

3. **Test API with cURL**:
   ```bash
   # Test login
   curl -X POST http://localhost:5002/api/school/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@school.com","password":"password123"}'

   # Test protected route
   curl http://localhost:5002/api/student/fetch-all \
     -H "Authorization: <your_token_here>"
   ```

4. **Use Postman or Insomnia**: GUI tools for testing APIs

#### Database Debugging

1. **MongoDB Compass** (GUI tool):
   - Connect to your database
   - View collections and documents
   - Run queries manually
   - Check indexes

2. **Mongoose Debug Mode**:
   ```javascript
   // In api/server.js
   mongoose.set('debug', true);  // Logs all MongoDB queries
   ```

3. **Check Database Connection**:
   ```javascript
   // In api/db.js or server.js
   mongoose.connection.on('connected', () => {
     console.log('✅ MongoDB connected successfully');
   });
   mongoose.connection.on('error', (err) => {
     console.error('❌ MongoDB connection error:', err);
   });
   ```

### Getting Help

1. **Check the Logs**: Always check terminal output for both frontend and backend
2. **Read Error Messages**: Error messages usually tell you what's wrong
3. **Google the Error**: Copy exact error message and search
4. **Check Documentation**: Review this README and code comments
5. **Verify Environment**: Ensure `.env` files are correctly configured
6. **Test in Isolation**: Test individual components/endpoints separately

### Development Best Practices

1. **Always use version control (Git)**:
   ```bash
   git add .
   git commit -m "Descriptive message"
   git push
   ```

2. **Keep dependencies updated**:
   ```bash
   npm outdated       # Check for updates
   npm update         # Update packages
   ```

3. **Use meaningful variable names**:
   ```javascript
   // Good
   const studentList = await Student.find();

   // Bad
   const data = await Student.find();
   ```

4. **Handle errors properly**:
   ```javascript
   try {
     // Your code
   } catch (error) {
     console.error('Error:', error);
     // Show user-friendly message
   }
   ```

5. **Comment your code**:
   ```javascript
   // Calculate attendance percentage
   const percentage = (presentDays / totalDays) * 100;
   ```

### Issue: Login not working
**Solution**: Ensure JWT_SECRET matches in both local .env and server ecosystem.config.js

### Issue: CORS errors
**Solution**: Check server.js CORS configuration includes your domain

### Issue: PM2 not loading environment variables
**Solution**: Use ecosystem.config.js with explicit env variables

### Issue: SSL certificate expired
**Solution**: Certbot auto-renews, but manually run: `sudo certbot renew`

## 📞 Support

For issues or questions, please create an issue in the GitHub repository.

## 📚 Additional Resources

### Learning Resources

**JavaScript & ES6+**:
- [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [JavaScript.info](https://javascript.info/)

**React**:
- [Official React Docs](https://react.dev/)
- [React Tutorial for Beginners](https://react.dev/learn)

**Node.js & Express**:
- [Node.js Official Docs](https://nodejs.org/en/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

**MongoDB & Mongoose**:
- [MongoDB University](https://university.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/guide.html)

**Material-UI**:
- [MUI Documentation](https://mui.com/material-ui/getting-started/)
- [MUI Component Examples](https://mui.com/material-ui/all-components/)

### Recommended Tools

- **VS Code**: Code editor with great JavaScript/React support
- **MongoDB Compass**: GUI for MongoDB database
- **Postman**: API testing tool
- **React Developer Tools**: Browser extension for debugging React
- **Git**: Version control system

### Next Steps for Learning

1. **Understand the Flow**: Follow a request from frontend to backend to database and back
2. **Modify Existing Features**: Start by changing small things (colors, text, validation rules)
3. **Add New Fields**: Try adding a new field to the Student model
4. **Create Simple Components**: Build a basic React component
5. **Read the Code**: Explore the codebase, read comments, understand patterns
6. **Experiment**: Break things, fix them - that's how you learn!

## 🤝 Contributing

If you want to contribute to this project:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

## 📄 License

This project is proprietary software for GenTime School Management System.

## 📞 Support & Contact

For issues, questions, or support:
- Check this README first
- Review the [COMPLETE_PROJECT_DOCUMENTATION.md](COMPLETE_PROJECT_DOCUMENTATION.md)
- Check existing issues in the repository
- Create a new issue with detailed information

---

## 🎉 You're All Set!

Congratulations! You now have a comprehensive understanding of the School Management System.

**Quick Start Checklist**:
- ✅ Installed Node.js and MongoDB
- ✅ Cloned the repository
- ✅ Installed backend dependencies (`cd api && npm install`)
- ✅ Installed frontend dependencies (`cd frontend && npm install`)
- ✅ Created `.env` files for both backend and frontend
- ✅ Started backend server (`npm start` in api folder)
- ✅ Started frontend dev server (`npm run dev` in frontend folder)
- ✅ Accessed application at `http://localhost:5173`

**Remember**:
- Always keep both backend and frontend running during development
- Check the console/terminal for errors
- Use browser DevTools (F12) for debugging frontend
- MongoDB Compass to inspect database
- Have fun learning and building!

---

**Last Updated**: November 1, 2025
**Version**: 2.0.0
**Built with**: MERN Stack (MongoDB, Express.js, React.js, Node.js)
**Documentation**: Comprehensive, beginner-friendly
