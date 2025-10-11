# School Management System

A comprehensive MERN stack application for managing school operations including students, teachers, courses, attendance, examinations, and more.

## Features

### For School Administrators
- Dashboard with analytics and statistics
- Student management (registration, records, profiles)
- Teacher management
- Course and class management
- Subject management
- Attendance tracking and reporting
- Examination management
- Fee management
- Marksheet generation
- SMS notifications
- Notice board
- Front page and public home page management

### For Teachers
- Personal profile and details
- View assigned classes and periods
- Manage student attendance
- Create and manage examinations
- View teaching schedule
- Access notice board

### For Students
- Beautiful dashboard with profile cards
- View marks and performance
- Check attendance records
- View class schedule
- Access examination details
- View fee information
- Notice board access

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads
- bcrypt for password hashing

### Frontend
- React.js with Vite
- Material-UI (MUI)
- Redux Toolkit for state management
- React Router v6
- Axios for API calls
- CSS animations and transitions

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB
- npm or yarn

### Backend Setup
1. Navigate to the api folder:
   ```bash
   cd api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file with:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=9000
   ```

4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file with:
   ```
   VITE_API_URL=http://localhost:9000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
school management system/
├── api/                      # Backend
│   ├── auth/                # Authentication middleware
│   ├── controller/          # API controllers
│   ├── model/               # Mongoose models
│   ├── router/              # API routes
│   ├── images/              # Uploaded images
│   └── index.js             # Entry point
├── frontend/                # Frontend
│   ├── src/
│   │   ├── client/          # Public pages
│   │   ├── school/          # School admin pages
│   │   ├── student/         # Student pages
│   │   ├── teacher/         # Teacher pages
│   │   ├── context/         # React context
│   │   ├── guards/          # Route protection
│   │   └── App.jsx          # Main app component
│   └── package.json
└── README.md
```

## Default Credentials

After setting up the database, create initial users with appropriate roles:
- School Admin: SCHOOL role
- Teacher: TEACHER role
- Student: STUDENT role

## API Endpoints

### Authentication
- POST /api/auth/login - User login
- POST /api/auth/logout - User logout

### Students
- POST /api/students/create - Create student
- GET /api/students/school/:schoolId - Get all students
- GET /api/students/:studentId - Get student by ID
- PUT /api/students/:studentId - Update student
- DELETE /api/students/:studentId - Delete student

### Courses
- POST /api/courses/create - Create course
- GET /api/courses/school/:schoolId - Get all courses
- GET /api/courses/:courseId - Get course by ID
- PUT /api/courses/:courseId - Update course
- DELETE /api/courses/:courseId - Delete course

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Contact

For any queries or support, please contact the development team.

