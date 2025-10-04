# SCHOOL MANAGEMENT SYSTEM - HOSTINGER VPS DEPLOYMENT GUIDE

## 📋 PROJECT OVERVIEW
This is a complete School Management System built with:
- Frontend: React.js + Material-UI (Vite)
- Backend: Node.js + Express.js
- Database: MongoDB Atlas
- Features: Student/Teacher/Admin Management, SMS, Attendance, Fees, Notices

## 🚀 HOSTINGER VPS DEPLOYMENT GUIDE

### STEP 1: PREPARE YOUR HOSTINGER VPS

1. **Purchase & Setup VPS**
   - Login to Hostinger hPanel
   - Go to VPS section and create your server
   - Choose Ubuntu 20.04 LTS or 22.04 LTS
   - Note down your VPS IP address and root password

2. **Connect to VPS via SSH**
   ```bash
   ssh root@your-vps-ip-address
   # Enter your password when prompted
   ```

3. **Update System**
   ```bash
   apt update && apt upgrade -y
   apt install curl wget git nano -y
   ```

### STEP 2: INSTALL REQUIRED SOFTWARE

1. **Install Node.js (v18 LTS)**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   apt-get install -y nodejs

   # Verify installation
   node --version
   npm --version
   ```

2. **Install PM2 (Process Manager)**
   ```bash
   npm install -g pm2
   ```

3. **Install Nginx (Web Server)**
   ```bash
   apt install nginx -y
   systemctl start nginx
   systemctl enable nginx
   ```

4. **Install Certbot (SSL Certificates)**
   ```bash
   apt install certbot python3-certbot-nginx -y
   ```

### STEP 3: CONFIGURE FIREWALL

```bash
# Allow SSH, HTTP, and HTTPS
ufw allow ssh
ufw allow 'Nginx Full'
ufw enable
```

### STEP 4: SETUP PROJECT DIRECTORY

1. **Create Project Directory**
   ```bash
   mkdir -p /var/www/school-management
   cd /var/www/school-management
   ```

2. **Clone/Upload Your Project**

   Option A - Using Git (Recommended):
   ```bash
   git clone https://your-git-repository-url.git .
   ```

   Option B - Upload via FTP/SFTP:
   - Use FileZilla or WinSCP
   - Upload to /var/www/school-management/

   Option C - Upload via Hostinger File Manager:
   - Zip your project locally
   - Upload via hPanel File Manager
   - Extract in /var/www/school-management/

### STEP 5: SETUP BACKEND (API)

1. **Navigate to API Directory**
   ```bash
   cd /var/www/school-management/api
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create Production Environment File**
   ```bash
   nano .env
   ```

   Add the following content:
   ```env
   PORT=5000
   NODE_ENV=production
   JWTSECRET=YOUR_SECURE_JWT_SECRET_HERE
   MONGODB_URI=mongodb+srv://schoolm2025:kallesh717@cluster0.ovqn73c.mongodb.net/school_management

   # SMS Configuration (Optional - Add your SMS provider details)
   SMS_API_KEY=your_sms_api_key
   SMS_SENDER_ID=SCHOOL
   SMS_GATEWAY_URL=https://api.textlocal.in/send/
   SMS_USERNAME=your_sms_username
   SMS_HASH=your_sms_hash
   ```

4. **Test Backend**
   ```bash
   npm start
   # Should show: "Server is running at port => 5000"
   # Press Ctrl+C to stop
   ```

5. **Start Backend with PM2**
   ```bash
   pm2 start server.js --name "school-api"
   pm2 save
   pm2 startup
   ```

### STEP 6: SETUP FRONTEND

1. **Navigate to Frontend Directory**
   ```bash
   cd /var/www/school-management/frontend
   ```

2. **Update Environment Configuration**
   ```bash
   nano src/environment.js
   ```

   Update baseUrl to your domain:
   ```javascript
   export const baseUrl = "https://yourdomain.com/api"
   // or use your VPS IP: "http://your-vps-ip:5000"
   ```

3. **Install Dependencies & Build**
   ```bash
   npm install
   npm run build
   ```

4. **Copy Build to Web Directory**
   ```bash
   cp -r dist/* /var/www/html/
   ```

### STEP 7: CONFIGURE NGINX

1. **Create Nginx Configuration**
   ```bash
   nano /etc/nginx/sites-available/school-management
   ```

2. **Add Configuration**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       root /var/www/html;
       index index.html;

       # Frontend (React)
       location / {
           try_files $uri $uri/ /index.html;
           add_header Cache-Control "no-cache, no-store, must-revalidate";
           add_header Pragma "no-cache";
           add_header Expires "0";
       }

       # Backend API
       location /api/ {
           proxy_pass http://localhost:5000/api/;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
           proxy_read_timeout 300;
           proxy_connect_timeout 300;
           proxy_send_timeout 300;
       }

       # Static files
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

3. **Enable Site**
   ```bash
   ln -s /etc/nginx/sites-available/school-management /etc/nginx/sites-enabled/
   nginx -t
   systemctl reload nginx
   ```

### STEP 8: SETUP DOMAIN (Optional but Recommended)

1. **Point Domain to VPS**
   - In your domain registrar (Hostinger Domain section)
   - Create A record: yourdomain.com → your-vps-ip
   - Create A record: www.yourdomain.com → your-vps-ip

2. **Setup SSL Certificate**
   ```bash
   certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

### STEP 9: SETUP MONGODB (If not using Atlas)

If you want local MongoDB instead of Atlas:

1. **Install MongoDB**
   ```bash
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   apt-get update
   apt-get install -y mongodb-org
   systemctl start mongod
   systemctl enable mongod
   ```

2. **Update .env file**
   ```env
   MONGODB_URI=mongodb://localhost:27017/school_management
   ```

### STEP 10: FINAL VERIFICATION

1. **Check All Services**
   ```bash
   pm2 status
   systemctl status nginx
   systemctl status mongod  # if using local MongoDB
   ```

2. **Test Website**
   - Open browser: http://your-vps-ip or https://yourdomain.com
   - Test login functionality
   - Test API endpoints: https://yourdomain.com/api/auth/check

3. **Check Logs**
   ```bash
   pm2 logs school-api
   tail -f /var/log/nginx/error.log
   ```

### STEP 11: MAINTENANCE & MONITORING

1. **Auto-restart Services**
   ```bash
   pm2 save
   pm2 startup
   ```

2. **Backup Script** (Create backup.sh)
   ```bash
   nano /root/backup.sh
   ```

   ```bash
   #!/bin/bash
   DATE=$(date +%Y%m%d_%H%M%S)

   # Backup application
   tar -czf /root/backups/school-app-$DATE.tar.gz /var/www/school-management

   # Backup MongoDB (if local)
   mongodump --out /root/backups/mongodb-$DATE

   # Keep only last 7 days
   find /root/backups -name "*.tar.gz" -mtime +7 -delete
   find /root/backups -name "mongodb-*" -mtime +7 -exec rm -rf {} \;
   ```

   ```bash
   chmod +x /root/backup.sh
   mkdir -p /root/backups
   ```

3. **Setup Cron Job for Backups**
   ```bash
   crontab -e
   ```

   Add: `0 2 * * * /root/backup.sh`

### STEP 12: SECURITY HARDENING

1. **Change SSH Port**
   ```bash
   nano /etc/ssh/sshd_config
   # Change Port 22 to Port 2222
   systemctl restart ssh
   ```

2. **Disable Root Login** (After creating sudo user)
   ```bash
   adduser schooladmin
   usermod -aG sudo schooladmin
   # Then in /etc/ssh/sshd_config set: PermitRootLogin no
   ```

3. **Setup Fail2Ban**
   ```bash
   apt install fail2ban -y
   systemctl enable fail2ban
   ```

## 🔧 COMMON ISSUES & SOLUTIONS

### Issue 1: API Not Connecting
**Solution:**
```bash
# Check if API is running
pm2 status
# Check API logs
pm2 logs school-api
# Restart API
pm2 restart school-api
```

### Issue 2: Frontend 404 Errors
**Solution:**
```bash
# Check Nginx config
nginx -t
# Restart Nginx
systemctl restart nginx
```

### Issue 3: Database Connection Failed
**Solution:**
- Check MongoDB Atlas whitelist (add 0.0.0.0/0 for all IPs)
- Verify MONGODB_URI in .env file
- Check if MongoDB service is running (if local)

### Issue 4: SSL Certificate Issues
**Solution:**
```bash
# Renew certificate
certbot renew
# Check certificate status
certbot certificates
```

## 📱 MOBILE RESPONSIVENESS
The system is fully mobile responsive with:
- Responsive navigation drawer
- Mobile-optimized tables with horizontal scroll
- Touch-friendly buttons and forms
- Responsive grid layouts
- Mobile-first design approach

## 🌐 ACCESSING THE SYSTEM

**Admin Access:**
- URL: https://yourdomain.com
- Register as first user (becomes admin)
- Manage schools, students, teachers

**Student Access:**
- URL: https://yourdomain.com
- Login with student credentials
- View attendance, notices, results

**Teacher Access:**
- URL: https://yourdomain.com
- Login with teacher credentials
- Manage attendance, marks, notices

## 📞 SUPPORT INFORMATION

**System Features:**
- ✅ Multi-school support
- ✅ Student management with Aadhaar validation
- ✅ Teacher management (age/qualification optional)
- ✅ SMS notifications (multiple gateways)
- ✅ Attendance tracking
- ✅ Fee management
- ✅ Notice board
- ✅ Examination management
- ✅ Report generation
- ✅ Mobile responsive design

**Default Ports:**
- Frontend: 80/443 (HTTP/HTTPS)
- Backend API: 5000
- MongoDB: 27017 (if local)

**Important Files:**
- Nginx Config: /etc/nginx/sites-available/school-management
- PM2 Process: school-api
- Application: /var/www/school-management
- Environment: /var/www/school-management/api/.env

## 🎯 POST-DEPLOYMENT CHECKLIST

- [ ] VPS setup and access working
- [ ] Node.js and npm installed
- [ ] Project uploaded and dependencies installed
- [ ] Environment variables configured
- [ ] Backend API running via PM2
- [ ] Frontend built and served by Nginx
- [ ] Domain pointed to VPS (if applicable)
- [ ] SSL certificate installed (if domain used)
- [ ] Database connection working
- [ ] All features tested
- [ ] Backup system configured
- [ ] Security hardening completed

## 💡 OPTIMIZATION TIPS

1. **Performance:**
   - Enable Nginx gzip compression
   - Use CDN for static assets
   - Optimize images before upload
   - Monitor RAM/CPU usage

2. **Security:**
   - Regular system updates
   - Strong passwords
   - Firewall configuration
   - Regular backups

3. **Monitoring:**
   - Setup log rotation
   - Monitor disk space
   - Check PM2 status regularly
   - Monitor database performance

---

🎓 **Your School Management System is now ready for production use!**

For any issues or questions, check the logs and ensure all services are running properly.