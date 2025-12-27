# 🎓 School Management System - Complete ERP Solution

A comprehensive Progressive Web Application (PWA) for managing schools with student portal, teacher management, attendance tracking, examination system, and real-time push notifications.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![React](https://img.shields.io/badge/react-18.3.1-61dafb)
![License](https://img.shields.io/badge/license-MIT-green)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Push Notification Setup](#push-notification-setup)
- [Deployment Guide](#deployment-guide)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)

---

## ✨ Features

### 🎯 Core Features
- **Multi-Role Authentication** - Admin, School, Teacher, Student portals
- **Student Management** - Complete student lifecycle management
- **Teacher Management** - Teacher profiles and assignment tracking
- **Class & Subject Management** - Organize courses, classes, and subjects
- **Attendance System** - Real-time attendance marking and reporting
- **Examination System** - Create exams, mark sheets, and result generation
- **Notice Board** - Announcements and notifications
- **Transport & Hostel** - Fee management for facilities
- **Academic Year Management** - Yearly session handling

### 📱 Progressive Web App Features
- **Offline Support** - Works without internet connection
- **App Installation** - Install on any device (Desktop, Mobile, Tablet)
- **Animated Education Logo** - Beautiful graduation cap with animations
- **Push Notifications** - Real-time notifications for attendance, exams, notices
- **Responsive Design** - Mobile-first approach
- **Fast Performance** - Optimized loading and caching

---

## 🛠 Tech Stack

### Frontend
- React 18.3.1 | Vite 5.4.2 | Material-UI | React Router v6 | Firebase SDK | Axios

### Backend
- Node.js 18+ | Express.js | MongoDB | Mongoose | Firebase Admin SDK | JWT | Bcrypt

### DevOps
- PM2 | Nginx | Ubuntu 20.04+ | Git

---

## 📦 Prerequisites

```bash
Node.js >= 18.0.0
npm >= 9.0.0
MongoDB >= 5.0
Git >= 2.30
Firebase Account (for push notifications)
```

---

## 🚀 Installation

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/school-management-system.git
cd school-management-system
```

### 2. Backend Setup

```bash
cd api
npm install
cp .env.example .env
# Edit .env with your configuration
```

**Backend .env Configuration:**
```env
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/school-db
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
FRONTEND_URL=https://yourdomain.com
```

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.production
# Edit .env.production
```

**Frontend .env.production:**
```env
VITE_API_BASE_URL=https://yourdomain.com/api
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
VITE_FIREBASE_VAPID_KEY=your-vapid-key-from-firebase-console
```

### 4. Build Frontend

```bash
cd frontend
npm run build
```

---

## 🔔 Push Notification Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name (e.g., "School Management System")
4. Click **"Create project"**

### Step 2: Enable Firebase Cloud Messaging

1. In Firebase Console → **Project Settings** (⚙️)
2. Select **Cloud Messaging** tab
3. Under **Web Push certificates** → Click **"Generate key pair"**
4. Copy the **VAPID key** (starts with `B...`)
5. Add to frontend `.env.production` as `VITE_FIREBASE_VAPID_KEY`

### Step 3: Get Firebase Web Configuration

1. Firebase Console → **Project Settings**
2. Scroll to **Your apps** → Click Web icon (`</>`)
3. Register app with nickname
4. Copy the `firebaseConfig` object values
5. Add each value to frontend `.env.production`:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=project-id
VITE_FIREBASE_STORAGE_BUCKET=project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123
VITE_FIREBASE_VAPID_KEY=BMtQ...
```

### Step 4: Download Service Account Key (Backend)

1. Firebase Console → **Project Settings** → **Service accounts**
2. Click **"Generate new private key"**
3. Download the JSON file
4. Rename to `serviceAccountKey.json`
5. Place in `api/config/serviceAccountKey.json`

**⚠️ IMPORTANT:** Never commit this file! It's in `.gitignore`.

### Step 5: Test Push Notifications

#### From Admin Dashboard:
1. Login as Admin/School
2. Go to **Notifications** section
3. Create notification:
   - Title: "Test Notification"
   - Message: "Testing push notifications"
   - Recipients: Select a class
4. Click **Send**

#### Check Backend Logs:
```bash
pm2 logs school-backend --lines 50

# Expected output:
# 🚀 Sending push notifications to X devices...
# ✅ Notifications sent - Success: X, Failed: 0
```

#### Student Side:
1. Student logs in → Sees notification permission banner
2. Clicks **Enable** → Browser asks permission
3. Clicks **Allow**
4. Success! Student will receive push notifications

---

## 🌐 Deployment Guide

### Production Deployment (Ubuntu + Nginx + PM2)

#### 1. Server Setup

```bash
# Connect to server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install PM2
npm install -g pm2

# Install Nginx
apt install -y nginx
```

#### 2. Clone and Setup Backend

```bash
# Create directory
mkdir -p /root/school-management
cd /root/school-management

# Clone repository (FIRST TIME ONLY)
git clone https://github.com/yourusername/school-management-system.git .

# Setup backend
cd api
npm install --production

# Configure environment
nano .env
# Add your configuration

# Add Firebase credentials
nano config/serviceAccountKey.json
# Paste Firebase Admin SDK JSON

# Start with PM2
pm2 start server.js --name school-backend
pm2 save
pm2 startup
```

#### 3. Build and Deploy Frontend

```bash
cd /root/school-management/frontend
npm install
npm run build
# Build output in dist/
```

#### 4. Configure Nginx

```bash
nano /etc/nginx/sites-available/school-management
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    root /root/school-management/frontend/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_types text/plain text/css application/json application/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Service workers - no cache
    location ~* (sw\.js|firebase-messaging-sw\.js)$ {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # API proxy
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }

    # React Router - serve index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Enable and restart:**
```bash
ln -s /etc/nginx/sites-available/school-management /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### 5. Setup SSL (Free with Let's Encrypt)

```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d yourdomain.com -d www.yourdomain.com
certbot renew --dry-run
```

#### 6. Configure Firewall

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

---

## 🔄 Update Deployment Process

### Automated Update Script

Create update script:
```bash
nano /root/school-management/deploy.sh
```

```bash
#!/bin/bash
echo "🚀 Starting deployment..."

cd /root/school-management

# Pull latest code
git pull origin main

# Update backend
cd api
npm install --production
pm2 restart school-backend

# Rebuild frontend
cd ../frontend
npm install
npm run build

# Clear Nginx cache
rm -rf /var/cache/nginx/*
systemctl reload nginx

echo "✅ Deployment complete!"
```

Make executable:
```bash
chmod +x /root/school-management/deploy.sh
```

### Deploy Updates:

```bash
# On your local machine - commit and push
git add .
git commit -m "Your update message"
git push origin main

# On server - run deploy script
ssh root@your-server
cd /root/school-management
./deploy.sh
```

---

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/school
JWT_SECRET=min-32-character-random-secret-key
FRONTEND_URL=https://yourdomain.com
```

### Frontend (.env.production)
```env
VITE_API_BASE_URL=https://yourdomain.com/api
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123
VITE_FIREBASE_VAPID_KEY=your-vapid-key
```

---

## 📡 API Documentation

### Push Notification Endpoints

#### Save FCM Token (Student)
```http
POST /api/notification/save-token
Authorization: Bearer student-token
Content-Type: application/json

{
  "fcmToken": "fcm-token-from-firebase"
}
```

#### Send Notification (Admin/School)
```http
POST /api/notification/send
Authorization: Bearer admin-token

{
  "title": "Holiday Notice",
  "message": "School closed tomorrow",
  "type": "notice",
  "sendToAll": true
}
```

### Attendance Endpoints

#### Check Attendance
```http
GET /api/attendance/check/:classId
Authorization: Bearer teacher-token
```

#### Mark Attendance
```http
POST /api/attendance/mark
Authorization: Bearer teacher-token

{
  "studentId": "id",
  "date": "2025-12-27",
  "status": "present",
  "classId": "class-id"
}
```

---

## 📁 Project Structure

```
school-management-system/
├── api/
│   ├── config/
│   │   ├── firebase.js
│   │   └── serviceAccountKey.json (gitignored)
│   ├── controller/
│   │   ├── notificationController.js
│   │   ├── attendance.controller.js
│   │   └── student.controller.js
│   ├── model/
│   ├── router/
│   ├── .env (gitignored)
│   └── server.js
├── frontend/
│   ├── public/
│   │   ├── sw.js
│   │   ├── firebase-messaging-sw.js
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnimatedEducationLogo.jsx
│   │   │   └── PWAInstallBanner.jsx
│   │   ├── services/
│   │   │   └── notificationService.js
│   │   └── firebase.js
│   └── .env.production (gitignored)
├── .gitignore
└── README.md
```

---

## 🤝 Git Setup

### First Time Setup

```bash
cd "e:\very imp\New folder (4)\desktop\school management  1.1\gentime8\school management system"

# Initialize git (if not already)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: School Management System with PWA and Push Notifications"

# Add remote repository
git remote add origin https://github.com/yourusername/school-management-system.git

# Push to GitHub
git push -u origin main
```

### Daily Workflow

```bash
# Make changes to your code

# Check status
git status

# Add changes
git add .

# Commit with message
git commit -m "Feature: Add new feature description"

# Push to GitHub
git push origin main

# Deploy to server
ssh root@your-server
cd /root/school-management
./deploy.sh
```

---

## 🎯 Features Checklist

- ✅ Multi-role authentication (Admin, School, Teacher, Student)
- ✅ Student management with profiles and images
- ✅ Teacher management and assignment
- ✅ Class and subject organization
- ✅ Real-time attendance tracking
- ✅ Examination and result management
- ✅ Notice board system
- ✅ Progressive Web App (PWA)
- ✅ Professional app installation
- ✅ Animated education logo
- ✅ Push notifications (Firebase FCM)
- ✅ Offline support
- ✅ Mobile responsive design
- ✅ Admin dashboard with statistics
- ✅ Fee management
- ✅ Transport and hostel tracking

---

## 📞 Support

For issues or questions:
- 📧 Email: support@yourschool.com
- 🐛 Issues: GitHub Issues
- 💬 Discord: Join our community

---

## 📄 License

MIT License - See LICENSE file

---

**Made with ❤️ for Education**

🎓 Empowering schools with modern technology
