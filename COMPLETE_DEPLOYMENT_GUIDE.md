# Complete Deployment Guide - GenTime School Management System

This guide covers the **COMPLETE deployment process** from scratch, including all problems encountered in this project and their solutions.

---

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [VPS Server Setup](#vps-server-setup)
3. [Domain Configuration](#domain-configuration)
4. [MongoDB Atlas Setup](#mongodb-atlas-setup)
5. [Backend Deployment](#backend-deployment)
6. [Frontend Deployment](#frontend-deployment)
7. [Nginx Configuration](#nginx-configuration)
8. [SSL Certificate Setup](#ssl-certificate-setup)
9. [Common Problems & Solutions](#common-problems--solutions)
10. [Post-Deployment Testing](#post-deployment-testing)
11. [Continuous Deployment Process](#continuous-deployment-process)
12. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Pre-Deployment Checklist

### ✅ What You Need Before Starting

**1. VPS Server Details:**
- IP Address: `72.60.202.218` (Hostinger VPS)
- SSH Access: `root@72.60.202.218`
- SSH Password or Key
- Minimum Requirements: 2GB RAM, 1 CPU, 20GB Storage

**2. Domain Name:**
- Main domain: `gentime.in`
- Subdomains needed:
  - `www.gentime.in` (frontend)
  - `api.gentime.in` (backend API)

**3. MongoDB Database:**
- MongoDB Atlas account (free tier works)
- Connection string ready
- Database name: `gentime`

**4. GitHub Repository:**
- Repository URL: `https://github.com/kallesh653/gentime`
- Git installed locally
- Access token or SSH key configured

**5. Local Development Environment:**
- Node.js v22.20.0 installed
- NPM installed
- Git installed
- Project cloned and tested locally

---

## VPS Server Setup

### Step 1: Initial Server Connection

**Connect to VPS:**
```bash
ssh root@72.60.202.218
```

**Update system packages:**
```bash
apt update
apt upgrade -y
```

**Why this is important:**
- Security patches
- Latest software versions
- Compatibility with new packages

---

### Step 2: Install Node.js using NVM

**Why NVM instead of apt:**
- Multiple Node versions support
- Easy version switching
- Better for production environments

**Install NVM:**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
```

**Activate NVM:**
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

**Add to .bashrc (permanent):**
```bash
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.bashrc
source ~/.bashrc
```

**Install Node.js:**
```bash
nvm install 22.20.0
nvm use 22.20.0
nvm alias default 22.20.0
```

**Verify installation:**
```bash
node --version    # Should show: v22.20.0
npm --version     # Should show: 10.x.x
```

---

### Step 3: Install PM2 (Process Manager)

**Why PM2:**
- Keeps Node.js app running 24/7
- Auto-restart on crashes
- Log management
- Zero-downtime reloads

**Install PM2 globally:**
```bash
npm install -g pm2
```

**Setup PM2 to start on boot:**
```bash
pm2 startup
```

**This will output a command like:**
```bash
sudo env PATH=$PATH:/root/.nvm/versions/node/v22.20.0/bin /root/.nvm/versions/node/v22.20.0/lib/node_modules/pm2/bin/pm2 startup systemd -u root --hp /root
```

**Run that command** (copy-paste the exact output)

**Verify PM2:**
```bash
pm2 list
```

---

### Step 4: Install Nginx

**Why Nginx:**
- Reverse proxy for Node.js
- Serves static files efficiently
- SSL certificate support
- Load balancing capability

**Install Nginx:**
```bash
apt install nginx -y
```

**Start and enable Nginx:**
```bash
systemctl start nginx
systemctl enable nginx
systemctl status nginx
```

**Test in browser:**
Visit `http://72.60.202.218` - should see Nginx welcome page

---

### Step 5: Install Git

**Install Git:**
```bash
apt install git -y
```

**Configure Git (optional but recommended):**
```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

---

### Step 6: Install Certbot (SSL Certificates)

**Why Certbot:**
- Free SSL certificates from Let's Encrypt
- HTTPS encryption
- Auto-renewal
- SEO benefits

**Install Certbot:**
```bash
apt install certbot python3-certbot-nginx -y
```

---

## Domain Configuration

### Step 1: DNS Settings (Hostinger Domain Panel)

**Login to Hostinger:**
1. Go to https://hpanel.hostinger.com
2. Navigate to Domains → Your domain → DNS Records

**Add/Update DNS Records:**

| Type | Name | Content | TTL |
|------|------|---------|-----|
| A | @ | 72.60.202.218 | 3600 |
| A | www | 72.60.202.218 | 3600 |
| A | api | 72.60.202.218 | 3600 |

**What each record means:**
- `@` → Points `gentime.in` to VPS
- `www` → Points `www.gentime.in` to VPS
- `api` → Points `api.gentime.in` to VPS

**Wait for DNS propagation:**
- Usually takes 5-30 minutes
- Can take up to 24-48 hours in rare cases

**Check DNS propagation:**
```bash
# On your local machine
nslookup gentime.in
nslookup www.gentime.in
nslookup api.gentime.in

# Should all show: 72.60.202.218
```

**Online tools to check:**
- https://dnschecker.org
- https://www.whatsmydns.net

---

### Step 2: Verify Domain Resolution

**Test from VPS:**
```bash
ping gentime.in -c 4
ping www.gentime.in -c 4
ping api.gentime.in -c 4
```

**Expected output:**
```
PING gentime.in (72.60.202.218) 56(84) bytes of data.
64 bytes from gentime.in (72.60.202.218): icmp_seq=1 ttl=64 time=0.025 ms
```

---

## MongoDB Atlas Setup

### Step 1: Create MongoDB Atlas Account

**Sign up:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Choose Free Tier (M0 Sandbox)

---

### Step 2: Create Cluster

**Cluster creation:**
1. Click "Build a Database"
2. Choose FREE tier (M0)
3. Select region (choose closest to VPS location)
4. Cluster name: `gentime-cluster` (or any name)
5. Click "Create Cluster"

**Wait 3-5 minutes** for cluster creation

---

### Step 3: Create Database User

**Navigate to:**
Database Access → Add New Database User

**User details:**
- Authentication Method: Password
- Username: `gentimeuser` (or your choice)
- Password: Generate secure password (SAVE THIS!)
- Database User Privileges: "Read and write to any database"
- Click "Add User"

---

### Step 4: Whitelist IP Address

**Navigate to:**
Network Access → Add IP Address

**Option 1 (Recommended for production):**
- IP Address: `72.60.202.218` (your VPS IP)
- Comment: "GenTime VPS"

**Option 2 (Easy but less secure):**
- IP Address: `0.0.0.0/0` (allow from anywhere)
- Comment: "Allow from anywhere"
- ⚠️ Warning: Less secure, use only for testing

**Click "Confirm"**

---

### Step 5: Get Connection String

**Navigate to:**
Database → Connect → Connect your application

**Copy connection string:**
```
mongodb+srv://gentimeuser:<password>@gentime-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**Replace `<password>` with your actual password:**
```
mongodb+srv://gentimeuser:YourSecurePassword@gentime-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**⚠️ Important:**
- Save this connection string
- Never commit to Git
- Will be used in `.env` file

---

### Step 6: Create Database and Collections

**Connect using MongoDB Compass (locally):**
1. Download MongoDB Compass
2. Paste connection string
3. Connect to cluster

**Or use mongosh:**
```bash
mongosh "mongodb+srv://gentimeuser:YourPassword@gentime-cluster.xxxxx.mongodb.net/"
```

**Create database:**
```javascript
use gentime
```

Collections will be created automatically by the application.

---

## Backend Deployment

### Step 1: Clone Repository on VPS

**Connect to VPS:**
```bash
ssh root@72.60.202.218
```

**Navigate to home directory:**
```bash
cd /root
```

**Clone repository:**
```bash
git clone https://github.com/kallesh653/gentime.git
```

**Navigate to backend:**
```bash
cd gentime/api
```

---

### Step 2: Install Backend Dependencies

**Install packages:**
```bash
npm install
```

**If errors occur:**
```bash
# Clear cache and try again
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

### Step 3: Configure Environment Variables

**Create .env file:**
```bash
nano .env
```

**Paste this content (update with your values):**
```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://gentimeuser:YourPassword@gentime-cluster.xxxxx.mongodb.net/gentime?retryWrites=true&w=majority

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Server Configuration
PORT=9000
NODE_ENV=production

# Frontend URL (for CORS)
FRONTEND_URL=https://gentime.in
PRODUCTION_URL=https://gentime.in

# API URL
API_URL=https://api.gentime.in

# Email Configuration (if using email features)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# SMS Configuration (if using SMS features)
SMS_API_KEY=your-sms-api-key
SMS_SENDER_ID=GENTIME
```

**Save and exit:**
- Press `Ctrl+O` to save
- Press `Enter` to confirm
- Press `Ctrl+X` to exit

**Secure the .env file:**
```bash
chmod 600 .env
```

**Why this matters:**
- Only root user can read .env
- Prevents unauthorized access to secrets

---

### Step 4: Test Backend Locally on VPS

**Start backend:**
```bash
node server.js
```

**Expected output:**
```
MongoDB Atlas is Connected Successfully.
Server is running at port => 9000
```

**Test API endpoint:**
```bash
# Open new terminal and SSH again
ssh root@72.60.202.218

# Test API
curl http://localhost:9000/api/public-home/data
```

**Should return JSON data**

**Stop server:**
Press `Ctrl+C`

---

### Step 5: Start Backend with PM2

**Start with PM2:**
```bash
cd /root/gentime/api
pm2 start server.js --name gentime-api
```

**Verify it's running:**
```bash
pm2 list
```

**Expected output:**
```
┌─────┬──────────────┬─────────┬─────────┬──────┬────────┐
│ id  │ name         │ status  │ cpu     │ mem  │ uptime │
├─────┼──────────────┼─────────┼─────────┼──────┼────────┤
│ 0   │ gentime-api  │ online  │ 0%      │ 45MB │ 5s     │
└─────┴──────────────┴─────────┴─────────┴──────┴────────┘
```

**Check logs:**
```bash
pm2 logs gentime-api
```

**Save PM2 configuration:**
```bash
pm2 save
```

**Test API again:**
```bash
curl http://localhost:9000/api/public-home/data
```

---

## Frontend Deployment

### Step 1: Build Frontend Locally

**On your local machine:**

**Navigate to frontend directory:**
```bash
cd "d:\final project 1.1\gentime4\school management system\frontend"
```

**Update environment variables:**

**Edit `.env` or `src/config.js`:**
```javascript
// Before deployment, set:
export const baseUrl = 'https://api.gentime.in/api';
```

**Install dependencies (if needed):**
```bash
npm install
```

**Build for production:**
```bash
npm run build
```

**Build process:**
- Creates optimized bundle
- Minifies JavaScript
- Generates `dist/` folder
- Takes 1-2 minutes

**Verify build:**
```bash
ls dist/
# Should see: index.html, assets/ folder
```

---

### Step 2: Create Frontend Directory on VPS

**On VPS:**
```bash
mkdir -p /var/www/gentime
```

**Set proper permissions:**
```bash
chown -R www-data:www-data /var/www/gentime
chmod -R 755 /var/www/gentime
```

---

### Step 3: Upload Frontend to VPS

**On local machine:**

**Upload entire dist folder:**
```bash
scp -r "d:\final project 1.1\gentime4\school management system\frontend\dist\"* root@72.60.202.218:/var/www/gentime/
```

**Or upload individual files:**
```bash
# Upload index.html
scp "d:\final project 1.1\gentime4\school management system\frontend\dist\index.html" root@72.60.202.218:/var/www/gentime/

# Upload assets folder
scp -r "d:\final project 1.1\gentime4\school management system\frontend\dist\assets" root@72.60.202.218:/var/www/gentime/
```

**Verify upload on VPS:**
```bash
ssh root@72.60.202.218 "ls -la /var/www/gentime/"
```

**Expected files:**
```
index.html
assets/
  index-XXXXXXXX.js
  index-XXXXXXXX.css
  images/
  fonts/
```

---

### Step 4: Clone Frontend Repository on VPS (Alternative Method)

**On VPS:**
```bash
cd /root/gentime/frontend
npm install
npm run build
cp -r dist/* /var/www/gentime/
```

**This method is useful for:**
- Initial deployment
- Complete rebuild needed
- Testing on VPS directly

---

## Nginx Configuration

### Step 1: Remove Default Nginx Configuration

**Remove default site:**
```bash
rm /etc/nginx/sites-enabled/default
```

---

### Step 2: Create GenTime Nginx Configuration

**Create new config file:**
```bash
nano /etc/nginx/sites-available/gentime
```

**Paste this configuration:**
```nginx
# HTTPS - Main Frontend Server (gentime.in)
server {
    listen 443 ssl http2;
    server_name gentime.in www.gentime.in;

    # SSL certificate paths (will be set by Certbot)
    ssl_certificate /etc/letsencrypt/live/gentime.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/gentime.in/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Frontend root directory
    root /var/www/gentime;
    index index.html;

    # Frontend routing - SPA configuration
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets for better performance
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}

# HTTPS - API Subdomain Server (api.gentime.in)
server {
    listen 443 ssl http2;
    server_name api.gentime.in;

    # SSL certificate paths
    ssl_certificate /etc/letsencrypt/live/gentime.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/gentime.in/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Allow large file uploads for images and videos
    client_max_body_size 100M;
    client_body_timeout 300s;
    proxy_read_timeout 300s;
    proxy_connect_timeout 300s;
    proxy_send_timeout 300s;

    # Proxy all requests to Node.js backend
    location / {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;

        # WebSocket support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';

        # Forward original headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_cache_bypass $http_upgrade;
    }
}

# HTTP to HTTPS Redirect - Main Domain
server {
    listen 80;
    server_name gentime.in www.gentime.in;

    # Redirect all HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

# HTTP to HTTPS Redirect - API Subdomain
server {
    listen 80;
    server_name api.gentime.in;

    # Redirect all HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

# IP Address Server (backup - HTTP only)
server {
    listen 80;
    server_name 72.60.202.218;

    root /var/www/gentime;
    index index.html;

    # Allow large uploads
    client_max_body_size 100M;

    # Frontend routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://localhost:9000/api;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Save and exit:**
- `Ctrl+O` → Save
- `Enter` → Confirm
- `Ctrl+X` → Exit

---

### Step 3: Enable the Configuration

**Create symbolic link:**
```bash
ln -s /etc/nginx/sites-available/gentime /etc/nginx/sites-enabled/
```

**Test Nginx configuration:**
```bash
nginx -t
```

**Expected output:**
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

**If SSL paths don't exist yet:**
You'll see errors about missing certificate files. This is normal - we'll fix this in the next section.

**For now, create temporary HTTP-only config:**
```bash
nano /etc/nginx/sites-available/gentime-http
```

**Temporary HTTP configuration:**
```nginx
# Temporary HTTP configuration (before SSL)
server {
    listen 80;
    server_name gentime.in www.gentime.in;

    root /var/www/gentime;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

server {
    listen 80;
    server_name api.gentime.in;

    client_max_body_size 100M;

    location / {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Enable temporary config:**
```bash
rm /etc/nginx/sites-enabled/gentime
ln -s /etc/nginx/sites-available/gentime-http /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

**Test in browser:**
- `http://gentime.in` → Should show your app
- `http://api.gentime.in/api/public-home/data` → Should return JSON

---

## SSL Certificate Setup

### Step 1: Install SSL Certificates

**Make sure ports are open:**
```bash
ufw allow 80
ufw allow 443
```

**Stop Nginx temporarily (Certbot needs port 80):**
```bash
systemctl stop nginx
```

**Run Certbot:**
```bash
certbot certonly --standalone -d gentime.in -d www.gentime.in -d api.gentime.in
```

**Follow prompts:**
1. Enter email address: `your-email@gmail.com`
2. Agree to terms: `Y`
3. Share email (optional): `N` or `Y`

**Wait for certificate generation...**

**Expected output:**
```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/gentime.in/fullchain.pem
Key is saved at: /etc/letsencrypt/live/gentime.in/privkey.pem
```

---

### Step 2: Configure Nginx with SSL

**Remove temporary HTTP config:**
```bash
rm /etc/nginx/sites-enabled/gentime-http
```

**Enable HTTPS config:**
```bash
ln -s /etc/nginx/sites-available/gentime /etc/nginx/sites-enabled/
```

**Test configuration:**
```bash
nginx -t
```

**Should show:**
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

**Start Nginx:**
```bash
systemctl start nginx
systemctl status nginx
```

---

### Step 3: Test HTTPS

**In browser:**
- `https://gentime.in` → ✅ Should show padlock icon
- `https://www.gentime.in` → ✅ Should work
- `https://api.gentime.in/api/public-home/data` → ✅ Should return JSON
- `http://gentime.in` → Should redirect to HTTPS

---

### Step 4: Setup Auto-Renewal

**Test renewal (dry run):**
```bash
certbot renew --dry-run
```

**If successful, setup cron job:**
```bash
crontab -e
```

**Add this line (runs daily at midnight):**
```cron
0 0 * * * certbot renew --quiet && systemctl reload nginx
```

**Save and exit**

---

## Common Problems & Solutions

### Problem 1: "Network Error" When Uploading Images/Videos

**Symptoms:**
- Large files fail to upload
- "Network Error" in browser console
- Request times out

**Root Cause:**
- Nginx default body size is 1MB
- Backend payload limit too small
- Axios timeout too short

**Solution:**

**1. Update Nginx configuration:**
```bash
nano /etc/nginx/sites-available/gentime
```

**Add in API server block:**
```nginx
client_max_body_size 100M;
client_body_timeout 300s;
proxy_read_timeout 300s;
proxy_connect_timeout 300s;
proxy_send_timeout 300s;
```

**2. Update backend server.js:**
```javascript
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
```

**3. Update frontend axios config:**
```javascript
axios.patch(url, data, {
  timeout: 120000,
  maxContentLength: Infinity,
  maxBodyLength: Infinity
});
```

**4. Reload services:**
```bash
nginx -t
systemctl reload nginx
pm2 restart gentime-api
```

---

### Problem 2: Frontend Not Updating After Deployment

**Symptoms:**
- Old version still showing
- Changes not visible
- Browser cache issue

**Root Cause:**
- Browser service worker caching
- Old bundle files cached
- index.html not updated

**Solution:**

**1. Build with new hash:**
```bash
npm run build
# Creates: dist/assets/index-NEWHASH.js
```

**2. Upload to VPS:**
```bash
scp -r dist/assets/index-NEWHASH.js root@72.60.202.218:/var/www/gentime/assets/
```

**3. Update index.html:**
```bash
ssh root@72.60.202.218 "cd /var/www/gentime && sed -i 's/index-[^.]*\.js/index-NEWHASH.js/g' index.html"
```

**4. Verify update:**
```bash
ssh root@72.60.202.218 "cat /var/www/gentime/index.html | grep 'index-'"
```

**5. Clear browser cache:**
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Or open incognito/private window
- Or clear browser cache completely

---

### Problem 3: API Returns 502 Bad Gateway

**Symptoms:**
- API endpoint shows 502 error
- Nginx is running but can't reach backend
- Browser shows "Bad Gateway"

**Root Cause:**
- Backend not running
- Backend crashed
- Wrong port in Nginx config
- Firewall blocking localhost

**Solution:**

**1. Check if backend is running:**
```bash
pm2 status
```

**2. If not running, start it:**
```bash
pm2 start /root/gentime/api/server.js --name gentime-api
```

**3. Check backend logs:**
```bash
pm2 logs gentime-api
```

**4. Test backend directly:**
```bash
curl http://localhost:9000/api/public-home/data
```

**5. If still failing, check port:**
```bash
netstat -tulpn | grep 9000
```

**6. Restart everything:**
```bash
pm2 restart gentime-api
systemctl restart nginx
```

---

### Problem 4: MongoDB Connection Failed

**Symptoms:**
- "MongoDB Connection Error" in logs
- Backend can't connect to database
- Authentication failed

**Root Cause:**
- Wrong connection string
- IP not whitelisted in Atlas
- Database user not created
- Network issues

**Solution:**

**1. Check .env file:**
```bash
cat /root/gentime/api/.env
```

**2. Test connection string:**
```bash
# Install mongosh if not installed
npm install -g mongosh

# Test connection
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/"
```

**3. Check MongoDB Atlas:**
- Network Access → Add VPS IP (72.60.202.218)
- Database Access → Verify user exists
- Connection string → Copy fresh one

**4. Update .env and restart:**
```bash
nano /root/gentime/api/.env
# Update MONGODB_URI
pm2 restart gentime-api
pm2 logs gentime-api
```

---

### Problem 5: CORS Errors in Browser

**Symptoms:**
- "Access-Control-Allow-Origin" error
- API calls blocked by browser
- Frontend can't reach backend

**Root Cause:**
- CORS not configured in backend
- Wrong origin in CORS settings
- Missing CORS headers

**Solution:**

**1. Check backend CORS config:**
```bash
nano /root/gentime/api/server.js
```

**Should have:**
```javascript
const corsOptions = {
  origin: [
    'https://gentime.in',
    'https://www.gentime.in',
    'http://localhost:5173'
  ],
  credentials: true,
  exposedHeaders: ["Authorization"]
};
app.use(cors(corsOptions));
```

**2. Restart backend:**
```bash
pm2 restart gentime-api
```

**3. Check Nginx proxy headers:**
```nginx
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
```

---

### Problem 6: Database Shows Old Data

**Symptoms:**
- Changes saved but not visible
- Old data still appearing
- Frontend shows outdated info

**Root Cause:**
- Caching in frontend
- Multiple database connections
- Using wrong database

**Solution:**

**1. Clear browser cache:**
```
Hard refresh or incognito mode
```

**2. Check which database is being used:**
```bash
# Connect to MongoDB
mongosh "your-connection-string"

# Show current database
db.getName()

# Should show: gentime
```

**3. Verify data in database:**
```javascript
use gentime
db.publicHomePage.find().pretty()
```

**4. Check backend logs:**
```bash
pm2 logs gentime-api --lines 50
```

---

### Problem 7: VPS Out of Disk Space

**Symptoms:**
- Deployment fails
- "No space left on device"
- Services crashing randomly

**Root Cause:**
- PM2 logs filling up disk
- Old deployments not cleaned
- Large log files

**Solution:**

**1. Check disk usage:**
```bash
df -h
```

**2. Find large files:**
```bash
du -sh /* | sort -h
du -sh /root/.pm2/logs/*
```

**3. Clean PM2 logs:**
```bash
pm2 flush
```

**4. Remove old node_modules:**
```bash
find /root -name "node_modules" -type d -exec du -sh {} \;
# Remove old ones
rm -rf /root/old-project/node_modules
```

**5. Clean package cache:**
```bash
npm cache clean --force
```

**6. Remove old files:**
```bash
apt autoremove
apt clean
```

---

### Problem 8: Git Push Rejected

**Symptoms:**
- `git push` fails
- "Updates were rejected"
- "Failed to push some refs"

**Root Cause:**
- VPS code ahead of local
- Conflicting changes
- Force push needed

**Solution:**

**Option 1 - Pull first:**
```bash
git pull origin main
# Resolve conflicts if any
git push origin main
```

**Option 2 - Force sync VPS with GitHub:**
```bash
ssh root@72.60.202.218 "cd /root/gentime/api && git fetch origin && git reset --hard origin/main"
```

**Option 3 - Stash local changes:**
```bash
git stash
git pull origin main
git stash pop
# Resolve conflicts
git push origin main
```

---

### Problem 9: SSL Certificate Errors

**Symptoms:**
- "Certificate expired"
- "Not secure" warning
- HTTPS not working

**Root Cause:**
- Certificate expired (90 days)
- Auto-renewal failed
- Certbot not running

**Solution:**

**1. Check certificate expiry:**
```bash
certbot certificates
```

**2. Manually renew:**
```bash
systemctl stop nginx
certbot renew
systemctl start nginx
```

**3. Setup auto-renewal:**
```bash
certbot renew --dry-run
```

**4. Check cron job:**
```bash
crontab -l
```

**5. Add if missing:**
```bash
crontab -e
# Add: 0 0 * * * certbot renew --quiet && systemctl reload nginx
```

---

### Problem 10: PM2 Not Starting on Boot

**Symptoms:**
- After VPS reboot, app is down
- PM2 shows no apps
- Manual start needed

**Root Cause:**
- PM2 startup not configured
- systemd service not enabled

**Solution:**

**1. Setup PM2 startup:**
```bash
pm2 startup
```

**2. Run the command it outputs**

**3. Start your app:**
```bash
pm2 start /root/gentime/api/server.js --name gentime-api
```

**4. Save PM2 configuration:**
```bash
pm2 save
```

**5. Test by rebooting:**
```bash
reboot
# Wait 2 minutes, then check
ssh root@72.60.202.218 "pm2 list"
```

---

## Post-Deployment Testing

### Complete Testing Checklist

**1. Frontend Tests:**
```bash
✅ https://gentime.in loads
✅ https://www.gentime.in loads
✅ http://gentime.in redirects to HTTPS
✅ All pages load correctly
✅ Images display properly
✅ Navigation works
✅ Responsive design works on mobile
```

**2. Backend API Tests:**
```bash
# Test public endpoint
curl https://api.gentime.in/api/public-home/data

# Test with browser
Open: https://api.gentime.in/api/public-home/data

✅ Returns JSON data
✅ No CORS errors
✅ Response time < 2 seconds
```

**3. Authentication Tests:**
```bash
✅ Login works
✅ Register works
✅ JWT tokens generated
✅ Protected routes work
✅ Logout works
```

**4. Database Tests:**
```bash
✅ Data saves correctly
✅ Data retrieves correctly
✅ Updates work
✅ Deletes work
✅ No duplicate entries
```

**5. Image Upload Tests:**
```bash
✅ Small images (< 1MB) upload
✅ Large images (< 80MB) upload
✅ Videos upload
✅ Compression works
✅ No "Network Error"
```

**6. SSL/Security Tests:**
```bash
# Test on: https://www.ssllabs.com/ssltest/
✅ SSL certificate valid
✅ Grade A or B
✅ HTTPS enforced
✅ Security headers present
```

**7. Performance Tests:**
```bash
# Test on: https://pagespeed.web.dev/
✅ Load time < 3 seconds
✅ Mobile score > 70
✅ Desktop score > 80
✅ Images optimized
```

---

## Continuous Deployment Process

### Daily Workflow for Code Updates

**1. Make changes locally:**
```bash
# Edit files
# Test locally: npm run dev
```

**2. Commit and push:**
```bash
git add .
git commit -m "Your message"
git push origin main
```

**3. Deploy backend changes:**
```bash
ssh root@72.60.202.218 "cd /root/gentime/api && git pull origin main && PATH=/root/.nvm/versions/node/v22.20.0/bin:\$PATH pm2 restart gentime-api"
```

**4. Build and deploy frontend:**
```bash
# Local machine
npm run build

# Upload
scp -r dist/assets/index-NEWHASH.js root@72.60.202.218:/var/www/gentime/assets/

# Update HTML
ssh root@72.60.202.218 "cd /var/www/gentime && sed -i 's/index-[^.]*\.js/index-NEWHASH.js/g' index.html"
```

**5. Verify deployment:**
```bash
# Check backend logs
ssh root@72.60.202.218 "PATH=/root/.nvm/versions/node/v22.20.0/bin:\$PATH pm2 logs gentime-api --lines 20"

# Test in browser
# Open: https://gentime.in
# Hard refresh: Ctrl+Shift+R
```

---

### Quick Deployment Script

**Create deploy.sh on local machine:**
```bash
#!/bin/bash

echo "🚀 Starting deployment..."

# Build frontend
echo "📦 Building frontend..."
cd "d:\final project 1.1\gentime4\school management system\frontend"
npm run build

# Get new hash
NEW_HASH=$(ls dist/assets/index-*.js | grep -o 'index-[^.]*\.js' | head -1)
echo "📝 New hash: $NEW_HASH"

# Upload
echo "⬆️  Uploading files..."
scp -r dist/assets/$NEW_HASH root@72.60.202.218:/var/www/gentime/assets/

# Update HTML
echo "🔄 Updating index.html..."
ssh root@72.60.202.218 "cd /var/www/gentime && sed -i 's/index-[^.]*\.js/$NEW_HASH/g' index.html"

# Deploy backend
echo "🔧 Deploying backend..."
ssh root@72.60.202.218 "cd /root/gentime/api && git pull origin main && PATH=/root/.nvm/versions/node/v22.20.0/bin:\$PATH pm2 restart gentime-api"

echo "✅ Deployment complete!"
echo "🌐 Visit: https://gentime.in"
```

**Make executable:**
```bash
chmod +x deploy.sh
```

**Run deployment:**
```bash
./deploy.sh
```

---

## Monitoring & Maintenance

### Daily Monitoring

**1. Check application status:**
```bash
ssh root@72.60.202.218 "PATH=/root/.nvm/versions/node/v22.20.0/bin:\$PATH pm2 status"
```

**2. Check recent logs:**
```bash
ssh root@72.60.202.218 "PATH=/root/.nvm/versions/node/v22.20.0/bin:\$PATH pm2 logs gentime-api --lines 50 --nostream"
```

**3. Check Nginx logs:**
```bash
ssh root@72.60.202.218 "tail -50 /var/log/nginx/error.log"
```

**4. Check disk space:**
```bash
ssh root@72.60.202.218 "df -h"
```

**5. Check memory usage:**
```bash
ssh root@72.60.202.218 "free -h"
```

---

### Weekly Maintenance

**1. Update system packages:**
```bash
ssh root@72.60.202.218 "apt update && apt upgrade -y"
```

**2. Clean PM2 logs:**
```bash
ssh root@72.60.202.218 "PATH=/root/.nvm/versions/node/v22.20.0/bin:\$PATH pm2 flush"
```

**3. Check SSL certificate:**
```bash
ssh root@72.60.202.218 "certbot certificates"
```

**4. Backup database:**
```bash
# In MongoDB Atlas dashboard
# Database → Browse Collections → Export
# Or setup automated backups
```

**5. Review error logs:**
```bash
ssh root@72.60.202.218 "grep -i error /var/log/nginx/error.log | tail -20"
```

---

### Monthly Maintenance

**1. Update Node.js (if needed):**
```bash
ssh root@72.60.202.218 "nvm install 22.x.x && nvm use 22.x.x"
```

**2. Update npm packages:**
```bash
ssh root@72.60.202.218 "cd /root/gentime/api && npm update && PATH=/root/.nvm/versions/node/v22.20.0/bin:\$PATH pm2 restart gentime-api"
```

**3. Review security:**
```bash
# Check open ports
ssh root@72.60.202.218 "netstat -tulpn"

# Check firewall
ssh root@72.60.202.218 "ufw status"
```

**4. Performance review:**
```bash
# Test load time
# Review Google Analytics (if installed)
# Check error rates
```

---

## Backup Strategy

### Database Backup

**1. MongoDB Atlas Automated Backups:**
- Enable in Atlas dashboard
- Free tier: Cloud Backup available
- Set retention period: 7 days

**2. Manual Backup:**
```bash
# Using mongodump
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/gentime" --out=/backup/$(date +%Y%m%d)
```

---

### Code Backup

**1. GitHub (Primary):**
- All code already backed up
- Commit history preserved
- Can rollback any time

**2. Local Backup:**
```bash
# Backup entire project
tar -czf gentime-backup-$(date +%Y%m%d).tar.gz "d:\final project 1.1\gentime4\school management system"
```

---

### Server Configuration Backup

**Backup Nginx config:**
```bash
ssh root@72.60.202.218 "tar -czf /root/nginx-backup-$(date +%Y%m%d).tar.gz /etc/nginx/sites-available/"
```

**Backup .env files:**
```bash
ssh root@72.60.202.218 "cp /root/gentime/api/.env /root/backups/env-$(date +%Y%m%d).backup"
```

---

## Emergency Procedures

### Complete System Failure

**If VPS is completely down:**

**1. Contact Hostinger support**
**2. Check server status in Hostinger panel**
**3. Try reboot from panel**
**4. If accessible via SSH:**
```bash
ssh root@72.60.202.218
systemctl status nginx
PATH=/root/.nvm/versions/node/v22.20.0/bin:$PATH pm2 status
systemctl restart nginx
PATH=/root/.nvm/versions/node/v22.20.0/bin:$PATH pm2 restart all
```

---

### Restore from Backup

**If need to deploy to new VPS:**

**1. Follow this guide from Step 1 (VPS Setup)**
**2. Clone repository**
**3. Restore .env file**
**4. Run deployment steps**
**5. Point domain to new VPS IP**

**Total time: 2-3 hours**

---

## Deployment Checklist Summary

### Before First Deployment
- ✅ VPS purchased and accessible
- ✅ Domain purchased and DNS configured
- ✅ MongoDB Atlas setup complete
- ✅ GitHub repository created
- ✅ Local code tested and working

### Initial Setup (One-time)
- ✅ Node.js installed on VPS
- ✅ PM2 installed and configured
- ✅ Nginx installed
- ✅ SSL certificates installed
- ✅ Firewall configured
- ✅ Auto-restart on boot enabled

### Every Deployment
- ✅ Test locally first
- ✅ Commit to GitHub
- ✅ Build frontend
- ✅ Upload frontend files
- ✅ Update backend on VPS
- ✅ Restart services
- ✅ Test in production
- ✅ Monitor logs

---

## Success Metrics

**Your deployment is successful when:**

✅ https://gentime.in loads in < 3 seconds
✅ SSL certificate shows green padlock
✅ All API endpoints respond correctly
✅ Images and videos upload successfully
✅ Authentication works properly
✅ Data persists in MongoDB
✅ No errors in logs
✅ Mobile version works
✅ PM2 shows app as "online"
✅ Nginx status is "active (running)"

---

## Support Resources

**GenTime Project:**
- GitHub: https://github.com/kallesh653/gentime
- Author: Kallesh SK

**Technology Documentation:**
- Node.js: https://nodejs.org/docs/
- Express: https://expressjs.com/
- React: https://react.dev/
- MongoDB: https://www.mongodb.com/docs/
- Nginx: https://nginx.org/en/docs/
- PM2: https://pm2.keymetrics.io/docs/
- Let's Encrypt: https://letsencrypt.org/docs/

**Hosting Support:**
- Hostinger VPS: https://www.hostinger.com/tutorials/vps
- MongoDB Atlas: https://www.mongodb.com/docs/atlas/

---

**Deployment Guide Version:** 2.0
**Last Updated:** October 2025
**Tested On:** Hostinger VPS, Ubuntu 22.04 LTS

---

## Final Notes

This deployment guide is based on **real problems and solutions** encountered during the GenTime School Management System deployment. Every step has been tested and verified.

**Key Lessons Learned:**
1. **Always set Nginx body size limits** (100M for file uploads)
2. **Use image compression** to reduce upload sizes
3. **Configure PM2 auto-restart** to prevent downtime
4. **Hard refresh browser** after deployments (Ctrl+Shift+R)
5. **Monitor logs regularly** to catch issues early
6. **Keep backups** of .env and configs
7. **Test SSL renewal** before certificates expire
8. **Document everything** for future reference

**Remember:**
- Deployment gets easier with practice
- Keep this guide updated with new issues
- Always test locally before deploying
- Monitor the first hour after deployment

---

**Happy Deploying! 🚀**
