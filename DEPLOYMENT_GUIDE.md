# 🚀 Deployment Guide - School Management System

## ✅ What's New in This Update

### 1. Academic Year Management System
- **Create and manage academic years** (e.g., 2024-2025)
- **Set current academic year** for the school
- **Automatic status tracking** (upcoming, active, completed)
- **View statistics** for each academic year

### 2. Student Promotion Feature
- **Select students** from current academic year
- **Promote to next year** with one click
- **Optional class promotion** - promote students to next class automatically
- **Bulk promotion** - select multiple students at once

### 3. Professional Student Reports
- **RDLC-style PDF reports** with comprehensive student information
- **Academic performance** analysis with all exam results
- **Attendance summary** with color-coded status
- **Fees breakdown** with payment status

### 4. Final Marksheet Generator
- **Consolidated marksheet** combining all exams
- **Subject-wise breakdown** with exam details
- **Overall performance** summary with grade
- **Professional PDF** download

### 5. Optional Fees Fields
- Total fees and advance fees are now **truly optional**
- Clear UI labels showing "(Optional)"
- Helper text for better user guidance

---

## 📦 Deployment Steps

### Option 1: Automated Deployment (Recommended)

If you have SSH access to the server:

```bash
# Navigate to the project directory
cd "d:\gentime8\school management system"

# Run the deployment script (create this file first)
./deploy.sh
```

### Option 2: Manual Deployment

#### Step 1: Deploy Frontend

```bash
# Connect to server via SSH
ssh root@72.60.202.218

# Navigate to public directory
cd /var/www/schoolm/public

# Backup current files (optional but recommended)
mv /var/www/schoolm/public /var/www/schoolm/public.backup.$(date +%Y%m%d)

# Create new public directory
mkdir -p /var/www/schoolm/public

# Exit SSH
exit

# Upload dist files from your local machine
cd "d:\gentime8\school management system\frontend\dist"
scp -r * root@72.60.202.218:/var/www/schoolm/public/

# OR use WinSCP/FileZilla to upload:
# Source: d:\gentime8\school management system\frontend\dist\*
# Destination: /var/www/schoolm/public/
```

#### Step 2: Deploy Backend (API)

```bash
# Connect to server
ssh root@72.60.202.218

# Navigate to API directory
cd /var/www/schoolm/api

# Backup current files (optional)
cp -r /var/www/schoolm/api /var/www/schoolm/api.backup.$(date +%Y%m%d)

# Exit SSH
exit

# Upload new API files
cd "d:\gentime8\school management system\api"
scp -r model/academicYear.model.js root@72.60.202.218:/var/www/schoolm/api/model/
scp -r controller/academicYear.controller.js root@72.60.202.218:/var/www/schoolm/api/controller/
scp -r router/academicYear.router.js root@72.60.202.218:/var/www/schoolm/api/router/
scp server.js root@72.60.202.218:/var/www/schoolm/api/

# Restart backend services
ssh root@72.60.202.218 "pm2 restart schoolm-api && systemctl reload nginx"
```

#### Step 3: Verify Deployment

```bash
# Check if API is running
ssh root@72.60.202.218 "pm2 status"

# Check nginx status
ssh root@72.60.202.218 "systemctl status nginx"

# Test API endpoint
curl https://schoolm.gentime.in/api/academic-year/current
```

---

## 🔗 Access Links

### Frontend (School Portal)
- **Main URL**: https://schoolm.gentime.in
- **Alternative**: http://schoolm.gentime.in

### Backend API
- **Base URL**: https://schoolm.gentime.in/api
- **Academic Year Endpoint**: https://schoolm.gentime.in/api/academic-year

### Direct IP Access
- **Frontend**: http://72.60.202.218
- **API**: http://72.60.202.218/api

---

## 🎯 Testing the New Features

### 1. Academic Year Management
1. Login as **School Admin**
2. Navigate to **Academic Year** in the sidebar (under Academic section)
3. Click **"Add Academic Year"**
4. Fill in:
   - Academic Year: `2024-2025`
   - Start Date: `2024-06-01`
   - End Date: `2025-05-31`
5. Click **Create**

### 2. Student Promotion
1. In Academic Year page, find an existing year
2. Click the **green promotion icon** (TrendingUp)
3. Select students to promote
4. Choose target academic year
5. Optionally map classes (e.g., Class 9 → Class 10)
6. Click **"Promote X Student(s)"**

### 3. Professional Student Reports
1. Go to **Students** section
2. Find any student in the table
3. Click the **blue Assessment icon** (first button)
4. View the report preview
5. Click **"Download Report"** for PDF

### 4. Final Marksheet
1. Navigate to **Final Mark Sheet** in sidebar
2. Select a Class
3. Select a Student
4. View consolidated results from all exams
5. Click **"Download PDF"** for final marksheet

---

## 🛠️ Troubleshooting

### Frontend not updating?
```bash
# Clear browser cache with Ctrl+F5
# Or in browser: Settings → Clear browsing data → Cached images and files
```

### API errors (404)?
```bash
# Restart PM2
ssh root@72.60.202.218 "pm2 restart schoolm-api"

# Check logs
ssh root@72.60.202.218 "pm2 logs schoolm-api"
```

### Database connection issues?
```bash
# Check MongoDB connection in server
ssh root@72.60.202.218 "cd /var/www/schoolm/api && cat .env | grep MONGODB_URI"
```

### Nginx not serving files?
```bash
# Check nginx configuration
ssh root@72.60.202.218 "nginx -t"

# Reload nginx
ssh root@72.60.202.218 "systemctl reload nginx"

# Check nginx error logs
ssh root@72.60.202.218 "tail -f /var/log/nginx/error.log"
```

---

## 📊 Database Changes

The following new collections/models were added:

1. **AcademicYear** collection
   - Stores academic year information
   - Tracks current year status
   - Links to students and marksheets

2. **Student model updated**
   - `academic_year` field already exists (no changes needed)

---

## 🔐 Security Notes

- All academic year routes require **SCHOOL** role authentication
- Student promotion requires **SCHOOL** role
- Academic year deletion checks for associated students
- Class deletion protection already implemented

---

## 📝 API Endpoints Added

### Academic Year Management
- `POST /api/academic-year` - Create academic year
- `GET /api/academic-year` - Get all academic years
- `GET /api/academic-year/current` - Get current year
- `GET /api/academic-year/:id` - Get specific year
- `PUT /api/academic-year/:id` - Update year
- `PUT /api/academic-year/:id/set-current` - Set as current
- `DELETE /api/academic-year/:id` - Delete year
- `GET /api/academic-year/stats/:year` - Get year statistics
- `POST /api/academic-year/promote-students` - Promote students

---

## 📧 Support

If you encounter any issues:
1. Check the browser console (F12)
2. Check PM2 logs: `pm2 logs schoolm-api`
3. Check nginx logs: `tail -f /var/log/nginx/error.log`
4. Verify all files are uploaded correctly

---

## ✨ Summary of Files Changed

### Backend (API)
- ✅ `api/model/academicYear.model.js` - NEW
- ✅ `api/controller/academicYear.controller.js` - NEW
- ✅ `api/router/academicYear.router.js` - NEW
- ✅ `api/server.js` - Updated (added routes)
- ✅ `api/controller/class.controller.js` - Updated (deletion protection)
- ✅ `api/controller/course.controller.js` - Updated (deletion protection)

### Frontend
- ✅ `frontend/src/school/components/academic-year/AcademicYear.jsx` - NEW
- ✅ `frontend/src/school/components/students/StudentReport.jsx` - NEW
- ✅ `frontend/src/school/components/marksheet/FinalMarkSheet.jsx` - Updated (fixed API route)
- ✅ `frontend/src/school/components/students/Students.jsx` - Updated (added report button)
- ✅ `frontend/src/App.jsx` - Updated (added routes)
- ✅ `frontend/src/school/School.jsx` - Updated (added menu item)
- ✅ `frontend/src/yupSchema/studentSchema.js` - Updated (optional fees)

**All changes have been built and are ready for deployment!** 🎉
