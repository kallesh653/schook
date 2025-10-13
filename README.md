# GenTime - School Management System

A complete MERN stack school management system with features for school owners, teachers, and students.

## 🚀 Live Deployment

- **Frontend**: https://www.schoolm.gentime.in
- **Backend API**: https://api.gentime.in/api
- **Server**: Ubuntu 24.04.3 LTS (VPS: 72.60.202.218)

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Local Development](#local-development)
- [Deployment Information](#deployment-information)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Test Credentials](#test-credentials)
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

### For School Owners
- Complete school profile management
- Teacher and student management
- Class and subject configuration
- Fee structure setup
- Notice board management
- Examination scheduling
- Report generation

### For Teachers
- Student attendance tracking
- Grade management
- Examination paper creation
- Class schedule viewing
- Notice publishing

### For Students
- View attendance records
- Access marksheets and results
- Fee payment history
- Notice board access
- Class schedule viewing

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

## 🔧 Common Issues & Solutions

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

## 📄 License

This project is proprietary software for GenTime School Management System.

---

**Last Updated**: October 12, 2025
**Version**: 2.0.0
