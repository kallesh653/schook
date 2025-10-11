# School Management System - Production Deployment Guide

## Server Details
- **IP Address**: 72.60.202.218
- **OS**: Ubuntu/Debian (recommended)
- **User**: root

## Prerequisites
Before deployment, ensure you have:
1. MongoDB Atlas account with connection string
2. SSH access to the server (root@72.60.202.218)
3. GitHub repository: https://github.com/kallesh653/schoolm.git

---

## Deployment Steps

### Step 1: Connect to Server
```bash
ssh root@72.60.202.218
```

### Step 2: Run Automated Deployment Script
```bash
# Download and run the deployment script
curl -o deploy.sh https://raw.githubusercontent.com/kallesh653/schoolm/main/deploy.sh
chmod +x deploy.sh
./deploy.sh
```

The script will:
- Update system packages
- Install Node.js 18.x, npm, PM2, Nginx, Git
- Clone your repository
- Set up directory structure
- Create environment files (you'll need to edit them)
- Install dependencies
- Build frontend for production
- Configure PM2 process manager
- Configure Nginx reverse proxy
- Set up firewall rules

---

## Manual Deployment (Alternative)

If you prefer manual deployment or the script fails, follow these steps:

### 1. Update System
```bash
apt update && apt upgrade -y
```

### 2. Install Node.js 18.x
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
node --version
npm --version
```

### 3. Install PM2 Process Manager
```bash
npm install -g pm2
```

### 4. Install Nginx
```bash
apt install -y nginx
```

### 5. Install Git
```bash
apt install -y git
```

### 6. Clone Repository
```bash
mkdir -p /var/www/schoolm
cd /var/www/schoolm
git clone https://github.com/kallesh653/schoolm.git .
```

### 7. Configure Backend

Create environment file:
```bash
cd /var/www/schoolm/api
nano .env
```

Add the following (replace with your actual values):
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/school_management?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
PORT=9000
NODE_ENV=production
```

Install dependencies:
```bash
npm install --production
```

### 8. Configure Frontend

Create environment file:
```bash
cd /var/www/schoolm/frontend
nano .env
```

Add:
```env
VITE_API_URL=http://72.60.202.218:9000/api
```

Install dependencies and build:
```bash
npm install
npm run build
```

### 9. Set Up PM2 Ecosystem

Create PM2 configuration:
```bash
cd /var/www/schoolm
nano ecosystem.config.js
```

Add:
```javascript
module.exports = {
  apps: [{
    name: 'schoolm-api',
    script: './api/index.js',
    cwd: '/var/www/schoolm',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 9000
    }
  }]
};
```

Start with PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 10. Configure Nginx

Create Nginx configuration:
```bash
nano /etc/nginx/sites-available/schoolm
```

Add:
```nginx
server {
    listen 80;
    server_name 72.60.202.218;

    # Frontend - Serve static files
    location / {
        root /var/www/schoolm/frontend/dist;
        try_files $uri $uri/ /index.html;
        index index.html;
    }

    # Backend API - Reverse proxy
    location /api {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploaded images
    location /images {
        alias /var/www/schoolm/api/images;
        autoindex off;
    }
}
```

Enable site and restart Nginx:
```bash
ln -sf /etc/nginx/sites-available/schoolm /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
systemctl enable nginx
```

### 11. Configure Firewall
```bash
ufw allow 'Nginx Full'
ufw allow OpenSSH
ufw --force enable
```

### 12. Set Up Upload Directories
```bash
mkdir -p /var/www/schoolm/api/images/uploaded/student
mkdir -p /var/www/schoolm/api/images/uploaded/teacher
mkdir -p /var/www/schoolm/api/images/uploaded/school
chmod -R 755 /var/www/schoolm/api/images
```

---

## Post-Deployment

### Access Your Application
- **Frontend**: http://72.60.202.218
- **Backend API**: http://72.60.202.218/api

### Useful Commands

#### PM2 Management
```bash
pm2 status                  # Check status
pm2 logs schoolm-api        # View logs
pm2 restart schoolm-api     # Restart backend
pm2 stop schoolm-api        # Stop backend
pm2 delete schoolm-api      # Remove from PM2
```

#### Nginx Management
```bash
systemctl status nginx      # Check status
systemctl restart nginx     # Restart Nginx
systemctl stop nginx        # Stop Nginx
nginx -t                    # Test configuration
```

#### View Logs
```bash
# Backend logs
pm2 logs schoolm-api

# Nginx access logs
tail -f /var/log/nginx/access.log

# Nginx error logs
tail -f /var/log/nginx/error.log
```

---

## Updating Deployment

When you push changes to GitHub:

```bash
cd /var/www/schoolm

# Pull latest changes
git pull origin main

# Update backend
cd api
npm install --production
pm2 restart schoolm-api

# Update frontend
cd ../frontend
npm install
npm run build
systemctl restart nginx
```

---

## SSL Certificate (Recommended)

To add HTTPS support with Let's Encrypt:

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get certificate (replace with your domain if you have one)
# For IP address, you'll need to use self-signed certificate
# For domain:
certbot --nginx -d yourdomain.com

# Auto-renewal test
certbot renew --dry-run
```

---

## Troubleshooting

### Backend Not Starting
```bash
# Check PM2 logs
pm2 logs schoolm-api

# Check if MongoDB is accessible
curl -X GET http://localhost:9000/api/health
```

### Frontend Not Loading
```bash
# Check if build exists
ls -la /var/www/schoolm/frontend/dist

# Rebuild frontend
cd /var/www/schoolm/frontend
npm run build
```

### Nginx Errors
```bash
# Test configuration
nginx -t

# Check error logs
tail -f /var/log/nginx/error.log
```

### Permission Issues
```bash
# Fix ownership
chown -R www-data:www-data /var/www/schoolm/frontend/dist
chown -R $USER:$USER /var/www/schoolm/api/images

# Fix permissions
chmod -R 755 /var/www/schoolm
```

---

## Environment Variables Reference

### Backend (.env)
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens (use strong random string)
- `PORT`: Backend port (default: 9000)
- `NODE_ENV`: Set to "production"

### Frontend (.env)
- `VITE_API_URL`: Backend API URL (http://72.60.202.218:9000/api or https://yourdomain.com/api)

---

## Security Recommendations

1. **Change default passwords** in MongoDB
2. **Use strong JWT_SECRET** (generate with: `openssl rand -base64 32`)
3. **Set up SSL certificate** for HTTPS
4. **Regular updates**: `apt update && apt upgrade`
5. **Monitor logs** regularly
6. **Set up backups** for MongoDB
7. **Use environment variables** for all secrets
8. **Configure rate limiting** in Nginx
9. **Set up monitoring** (PM2 Plus, New Relic, etc.)
10. **Regular security audits**: `npm audit`

---

## Contact & Support

For issues or questions:
- GitHub Issues: https://github.com/kallesh653/schoolm/issues
- Check logs first: `pm2 logs schoolm-api`
