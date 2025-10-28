# 🚀 VPS Deployment Guide - School Management System

## Complete step-by-step guide to deploy your school management system to a VPS

---

## 📋 Prerequisites

Before starting deployment, ensure you have:

- ✅ VPS with Ubuntu 20.04 or higher
- ✅ Root or sudo access to VPS
- ✅ Domain name (optional but recommended)
- ✅ Git repository access
- ✅ MongoDB database (Atlas or self-hosted)

---

## 🔧 Step 1: Connect to Your VPS

```bash
# SSH into your VPS
ssh root@your_vps_ip
# or if using a specific user
ssh username@your_vps_ip
```

---

## 📦 Step 2: Install Required Software

### Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### Install Node.js 18.x (LTS)

```bash
# Install Node.js repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v18.x.x
npm --version   # Should show 9.x.x or higher
```

### Install Git

```bash
sudo apt install -y git
git --version
```

### Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
pm2 --version
```

### Install Nginx (Web Server)

```bash
sudo apt install -y nginx
sudo systemctl status nginx
```

---

## 📥 Step 3: Clone Your Repository

```bash
# Navigate to deployment directory
cd /var/www

# Clone your repository
git clone https://github.com/yourusername/your-repo.git
cd your-repo

# Or if already cloned, pull latest changes
cd /var/www/school-management-system
git pull origin main
```

---

## ⚙️ Step 4: Configure Environment Variables

### Backend (API) Configuration

```bash
cd api

# Create .env file
nano .env
```

Add the following (adjust values):

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/school_db
# or for local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/school_db

# JWT Secret (use a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_very_long_and_random

# Frontend URL
FRONTEND_URL=https://yourdomain.com
# or for IP-based deployment:
# FRONTEND_URL=http://your_vps_ip:3000

# CORS Origins
CORS_ORIGIN=https://yourdomain.com,http://your_vps_ip:3000

# File Upload
MAX_FILE_SIZE=52428800
UPLOAD_DIR=/var/www/school-management-system/api/uploads

# Email Configuration (if using email features)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# SMS Configuration (if using)
SMS_API_KEY=your_sms_api_key
SMS_SENDER_ID=SchoolSMS
```

Save and exit (Ctrl+X, then Y, then Enter)

### Frontend Configuration

```bash
cd ../frontend

# Create .env file
nano .env
```

Add:

```env
# API Base URL
REACT_APP_API_URL=https://api.yourdomain.com
# or for IP-based:
# REACT_APP_API_URL=http://your_vps_ip:5000/api

# App Configuration
REACT_APP_NAME=School Management System
REACT_APP_VERSION=1.0.0
```

---

## 📦 Step 5: Install Dependencies

### Install Backend Dependencies

```bash
cd /var/www/school-management-system/api
npm install --production
```

### Install Frontend Dependencies

```bash
cd /var/www/school-management-system/frontend
npm install
```

---

## 🏗️ Step 6: Build Frontend

```bash
cd /var/www/school-management-system/frontend
npm run build

# This creates an optimized production build in the 'build' folder
```

---

## 🔐 Step 7: Set Up Permissions

```bash
# Create uploads directory
mkdir -p /var/www/school-management-system/api/uploads/public-home
mkdir -p /var/www/school-management-system/api/uploads/home-page

# Set proper ownership
sudo chown -R www-data:www-data /var/www/school-management-system

# Set proper permissions
sudo chmod -R 755 /var/www/school-management-system
sudo chmod -R 775 /var/www/school-management-system/api/uploads
```

---

## 🚀 Step 8: Start Backend with PM2

```bash
cd /var/www/school-management-system/api

# Start the API server
pm2 start server.js --name "school-api"

# Save PM2 process list
pm2 save

# Set PM2 to start on system boot
pm2 startup systemd
# Follow the command it gives you (usually requires sudo)

# Check status
pm2 status
pm2 logs school-api
```

---

## 🌐 Step 9: Configure Nginx

### Option A: Domain-Based Setup (Recommended)

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/school-system
```

Add this configuration:

```nginx
# API Server (backend)
server {
    listen 80;
    server_name api.yourdomain.com;

    # API endpoints
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Increase timeouts for large uploads
        proxy_connect_timeout 600;
        proxy_send_timeout 600;
        proxy_read_timeout 600;
        send_timeout 600;
    }

    # Serve uploaded files
    location /uploads {
        alias /var/www/school-management-system/api/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Increase client body size for file uploads
    client_max_body_size 50M;
}

# Frontend Application
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/school-management-system/frontend/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location /static {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Disable caching for service worker
    location /service-worker.js {
        add_header Cache-Control "no-cache";
        expires off;
    }

    client_max_body_size 50M;
}
```

### Option B: IP-Based Setup (Development)

```bash
sudo nano /etc/nginx/sites-available/school-system
```

```nginx
server {
    listen 80;
    server_name your_vps_ip;

    # Frontend
    location / {
        root /var/www/school-management-system/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        proxy_connect_timeout 600;
        proxy_send_timeout 600;
        proxy_read_timeout 600;
        send_timeout 600;
    }

    # Uploads
    location /uploads {
        alias /var/www/school-management-system/api/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    client_max_body_size 50M;
}
```

### Enable the Configuration

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/school-system /etc/nginx/sites-enabled/

# Remove default configuration
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## 🔒 Step 10: Set Up SSL (HTTPS) - Recommended

### Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### Obtain SSL Certificate

```bash
# For domain-based setup
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Follow the prompts
# Choose option 2 to redirect HTTP to HTTPS
```

### Auto-Renewal Test

```bash
sudo certbot renew --dry-run
```

---

## 🔥 Step 11: Configure Firewall

```bash
# Allow SSH
sudo ufw allow OpenSSH

# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

## 📊 Step 12: Monitoring & Logs

### PM2 Monitoring

```bash
# Check status
pm2 status

# View logs
pm2 logs school-api

# Monitor in real-time
pm2 monit

# View specific logs
pm2 logs school-api --lines 100
pm2 logs school-api --err  # Only errors
```

### Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### System Logs

```bash
# System journal
sudo journalctl -u nginx -f
```

---

## 🔄 Step 13: Deploying Updates

### Automated Update Script

Create a deployment script:

```bash
nano /var/www/school-management-system/deploy.sh
```

Add:

```bash
#!/bin/bash

echo "🚀 Starting deployment..."

# Navigate to project directory
cd /var/www/school-management-system

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Backend updates
echo "⚙️ Updating backend..."
cd api
npm install --production

# Restart API
pm2 restart school-api

# Frontend updates
echo "🎨 Building frontend..."
cd ../frontend
npm install
npm run build

# Clear Nginx cache and restart
echo "🔄 Restarting Nginx..."
sudo systemctl restart nginx

echo "✅ Deployment complete!"
pm2 status
```

Make it executable:

```bash
chmod +x /var/www/school-management-system/deploy.sh
```

Run deployments:

```bash
cd /var/www/school-management-system
./deploy.sh
```

---

## 🐛 Troubleshooting

### Backend Not Starting

```bash
# Check PM2 logs
pm2 logs school-api

# Common issues:
# 1. Port already in use
sudo lsof -i :5000
sudo kill -9 <PID>

# 2. MongoDB connection
# Check MONGODB_URI in .env
# Test connection manually
```

### Frontend Not Loading

```bash
# Check Nginx configuration
sudo nginx -t

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Rebuild frontend
cd /var/www/school-management-system/frontend
npm run build
```

### Upload Errors

```bash
# Check permissions
ls -la /var/www/school-management-system/api/uploads

# Fix permissions
sudo chown -R www-data:www-data /var/www/school-management-system/api/uploads
sudo chmod -R 775 /var/www/school-management-system/api/uploads

# Check Nginx client_max_body_size
sudo nano /etc/nginx/sites-available/school-system
# Ensure: client_max_body_size 50M;
```

### CORS Errors

Update backend .env:

```env
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

Restart API:

```bash
pm2 restart school-api
```

---

## 🔧 Useful Commands

```bash
# PM2 Commands
pm2 list                    # List all processes
pm2 restart school-api      # Restart API
pm2 stop school-api         # Stop API
pm2 delete school-api       # Remove from PM2
pm2 logs school-api         # View logs
pm2 flush                   # Clear logs

# Nginx Commands
sudo systemctl status nginx  # Check status
sudo systemctl restart nginx # Restart
sudo nginx -t               # Test configuration
sudo systemctl reload nginx # Reload config

# System Monitoring
htop                        # CPU/Memory usage
df -h                       # Disk space
free -m                     # Memory usage
```

---

## 📱 Testing Your Deployment

1. **Test Backend API:**
   ```bash
   curl http://your_vps_ip:5000/api/health
   # or
   curl https://api.yourdomain.com/api/health
   ```

2. **Test Frontend:**
   - Open browser: `http://your_vps_ip` or `https://yourdomain.com`
   - Check console for errors (F12)

3. **Test File Upload:**
   - Login to admin panel
   - Try uploading an image to slider
   - Check if image displays on home page

4. **Test Database Connection:**
   - Login/Register functionality
   - Create/Read data

---

## 🎯 Performance Optimization

### Enable Gzip Compression

Add to Nginx configuration:

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
```

### Add Caching Headers

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## 🔐 Security Best Practices

1. **Use strong passwords** for MongoDB and admin accounts
2. **Enable HTTPS** with SSL certificate
3. **Keep software updated** regularly
4. **Set up firewall** (UFW)
5. **Use environment variables** for secrets
6. **Regular backups** of database
7. **Monitor logs** for suspicious activity

---

## 📞 Support

If you encounter issues:
1. Check logs: `pm2 logs school-api`
2. Check Nginx errors: `sudo tail -f /var/log/nginx/error.log`
3. Verify environment variables
4. Ensure all services are running

---

## ✅ Deployment Checklist

- [ ] VPS set up with Ubuntu
- [ ] Node.js 18+ installed
- [ ] MongoDB configured
- [ ] Repository cloned
- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Frontend built
- [ ] PM2 configured and running
- [ ] Nginx configured
- [ ] SSL certificate installed (optional)
- [ ] Firewall configured
- [ ] Uploads working
- [ ] Application accessible
- [ ] Deployment script created

---

## 🎉 Your Application is Live!

Access your school management system at:
- **Frontend:** `https://yourdomain.com` or `http://your_vps_ip`
- **API:** `https://api.yourdomain.com` or `http://your_vps_ip:5000`

---

Generated with ❤️ by Claude Code
