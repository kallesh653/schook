# Deployment Summary for VPS

## VPS Information
- **IP Address**: 72.60.202.218
- **OS**: Ubuntu 24.04.3 LTS
- **SSH User**: root
- **Backend URL**: https://api.gentime.in/api
- **Frontend URL**: https://www.schoolm.gentime.in

## Files Changed in This Update

### Backend Files (Need to be deployed)
1. `api/controller/homePageContent.controller.js` - NEW
2. `api/model/homePageContent.model.js` - NEW
3. `api/router/homePageContent.router.js` - NEW
4. `api/controller/subject.controller.js` - MODIFIED
5. `api/model/student.model.js` - MODIFIED
6. `api/server.js` - MODIFIED

### Frontend Files (Need to be rebuilt)
1. `frontend/src/school/components/home-page-management/` - NEW (13 files)
2. `frontend/src/school/components/students/Students.jsx` - MODIFIED
3. `frontend/src/yupSchema/studentSchema.js` - MODIFIED
4. `frontend/src/App.jsx` - MODIFIED
5. `frontend/src/school/School.jsx` - MODIFIED

## Quick Deployment Steps

### Step 1: Connect to VPS
```bash
ssh root@72.60.202.218
```

### Step 2: Navigate to Project Directory
```bash
cd /home/admin/school-management-system
```

### Step 3: Pull Latest Changes
```bash
git pull origin main
```

### Step 4: Install Backend Dependencies (if any new packages)
```bash
cd api
npm install
```

### Step 5: Restart Backend with PM2
```bash
pm2 restart school-management-api
pm2 logs school-management-api --lines 50
```
Verify no errors in logs.

### Step 6: Build Frontend
```bash
cd ../frontend
npm install  # If any new packages
npm run build
```

### Step 7: Verify Nginx is Serving New Files
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Step 8: Test Deployment
1. Backend API: `curl https://api.gentime.in/api/health` (if health endpoint exists)
2. Frontend: Open https://www.schoolm.gentime.in in browser
3. Test Student Management: Go to /school/students and test DOB field
4. Test Subject Edit: Edit a subject and verify no server error
5. Test Home Page Management: Go to /school/home-page-management

## Database Notes
- MongoDB Atlas connection is already configured in .env
- New student schema changes will auto-apply when students are created/updated
- homePageContent collection will be created automatically on first use

## PM2 Process Names
- Backend: `school-management-api`
- Check status: `pm2 status`
- View logs: `pm2 logs school-management-api`

## Nginx Configuration
- Frontend files location: `/home/admin/school-management-system/frontend/dist`
- Backend proxy: Port 8000 (configured in api/server.js)

## Post-Deployment Verification Checklist
- [ ] Backend server restarted successfully
- [ ] Frontend built without errors
- [ ] No PM2 errors in logs
- [ ] HTTPS certificates valid
- [ ] Student DOB and admission date fields working
- [ ] Age auto-calculation working
- [ ] Minimum age validation (4 years) working
- [ ] Subject edit/update working without server error
- [ ] Home Page Management accessible at /school/home-page-management
- [ ] File upload working for home page images/videos

## Troubleshooting

### If backend won't restart:
```bash
cd /home/admin/school-management-system/api
pm2 logs school-management-api --lines 100
```
Check for syntax errors or missing dependencies.

### If frontend build fails:
```bash
cd /home/admin/school-management-system/frontend
npm run build -- --verbose
```

### If 502 Bad Gateway:
```bash
pm2 status
# Restart if stopped
pm2 restart school-management-api
```

### If old files are cached:
```bash
# Clear browser cache or:
sudo nginx -s reload
```

## Environment Variables to Verify on VPS
Ensure these are set in `/home/admin/school-management-system/api/.env`:
- `MONGO_URL` (MongoDB Atlas connection string)
- `JWT_SECRET`
- `PORT=8000`

## New Features to Announce to Users
1. **Home Page Management System** - Complete control over public school homepage
2. **Student Date of Birth** - Required field with auto-age calculation
3. **Minimum Age Validation** - Students must be at least 4 years old
4. **Date of Admission** - New field to track student admission dates
5. **Subject Edit Fix** - Subject editing now works without server errors

## Support Information
- Documentation: HOME_PAGE_MANAGEMENT_GUIDE.md
- Implementation Details: IMPLEMENTATION_COMPLETE.md
- Deployment Guide: COMPLETE_DEPLOYMENT_GUIDE.txt
