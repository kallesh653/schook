# Quick Deployment Instructions

## Server Information
- **IP**: 72.60.202.218
- **OS**: Ubuntu 24.04.3 LTS
- **User**: root
- **Password**: Kallesh717653@

---

## Option 1: Automated Deployment (Recommended)

### Step 1: Connect to Server
Open your terminal/PowerShell and connect:
```bash
ssh root@72.60.202.218
```
Enter password when prompted: `Kallesh717653@`

### Step 2: Run Deployment Commands
Once connected, copy and paste these commands one by one:

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Verify installation
node --version
npm --version

# Install PM2 globally
npm install -g pm2

# Install Nginx
apt install -y nginx

# Install Git
apt install -y git

# Create and navigate to application directory
mkdir -p /var/www/schoolm
cd /var/www/schoolm

# Clone repository
git clone https://github.com/kallesh653/schoolm.git .

# Configure Backend
cd /var/www/schoolm/api

# Create backend .env file
cat > .env << 'ENVFILE'
MONGODB_URI=mongodb+srv://schoolm2025:kallesh717@cluster0.ovqn73c.mongodb.net/school_management
JWT_SECRET=LSKDFJDLSJWIEOFFJDSLKJFLJ328929FDOSKJFlsdkfjdslskdfj
PORT=9000
NODE_ENV=production
ENVFILE

# Install backend dependencies
npm install

# Configure Frontend
cd /var/www/schoolm/frontend

# Create frontend .env file
cat > .env << 'ENVFILE'
VITE_API_URL=http://72.60.202.218/api
ENVFILE

# Install frontend dependencies
npm install

# Build frontend for production
npm run build

# Create PM2 configuration
cd /var/www/schoolm

cat > ecosystem.config.js << 'ECOFILE'
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
ECOFILE

# Start backend with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Configure Nginx
cat > /etc/nginx/sites-available/schoolm << 'NGINXCONF'
server {
    listen 80;
    server_name 72.60.202.218;

    client_max_body_size 10M;

    # Frontend
    location / {
        root /var/www/schoolm/frontend/dist;
        try_files $uri $uri/ /index.html;
        index index.html;
    }

    # Backend API
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
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Uploaded images
    location /images {
        alias /var/www/schoolm/api/images;
        autoindex off;
    }
}
NGINXCONF

# Enable site
ln -sf /etc/nginx/sites-available/schoolm /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
nginx -t
systemctl restart nginx
systemctl enable nginx

# Configure firewall
ufw allow 'Nginx Full'
ufw allow OpenSSH
ufw allow 22
yes | ufw enable

# Create upload directories
mkdir -p /var/www/schoolm/api/images/uploaded/student
mkdir -p /var/www/schoolm/api/images/uploaded/teacher
mkdir -p /var/www/schoolm/api/images/uploaded/school
chmod -R 755 /var/www/schoolm/api/images

# Check status
echo ""
echo "======================================"
echo "Deployment Complete!"
echo "======================================"
echo ""
pm2 status
echo ""
systemctl status nginx --no-pager -l
echo ""
echo "Application URLs:"
echo "Frontend: http://72.60.202.218"
echo "Backend API: http://72.60.202.218/api"
```

---

## Option 2: Use Deployment Script

If the above doesn't work, use the automated script:

```bash
# Connect to server
ssh root@72.60.202.218

# Download and run deployment script
cd ~
wget https://raw.githubusercontent.com/kallesh653/schoolm/main/server-deploy.sh
chmod +x server-deploy.sh
./server-deploy.sh
```

---

## After Deployment

### Test the Application
1. Open browser and go to: http://72.60.202.218
2. You should see the school management system login page
3. Test API: http://72.60.202.218/api

### Useful Commands

#### Check Backend Status
```bash
pm2 status
pm2 logs schoolm-api
pm2 restart schoolm-api
```

#### Check Nginx Status
```bash
systemctl status nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

#### Update Application
```bash
cd /var/www/schoolm
git pull origin main
cd api && npm install
pm2 restart schoolm-api
cd ../frontend && npm install && npm run build
systemctl restart nginx
```

---

## Troubleshooting

### Backend Not Starting
```bash
cd /var/www/schoolm/api
pm2 logs schoolm-api --lines 100
```

### Frontend Not Loading
```bash
ls -la /var/www/schoolm/frontend/dist
cd /var/www/schoolm/frontend
npm run build
```

### Check Nginx Configuration
```bash
nginx -t
tail -f /var/log/nginx/error.log
```

### Permission Issues
```bash
chown -R root:root /var/www/schoolm
chmod -R 755 /var/www/schoolm
```

---

## Security Recommendations

1. Change root password after deployment:
```bash
passwd
```

2. Create a non-root user for application:
```bash
adduser schoolm
usermod -aG sudo schoolm
```

3. Set up SSH key authentication and disable password auth

4. Set up SSL certificate:
```bash
apt install -y certbot python3-certbot-nginx
# If you have a domain:
certbot --nginx -d yourdomain.com
```

5. Regular security updates:
```bash
apt update && apt upgrade -y
```

---

## Support

If you encounter any issues:
1. Check PM2 logs: `pm2 logs schoolm-api`
2. Check Nginx logs: `tail -f /var/log/nginx/error.log`
3. Verify MongoDB connection from server
4. Ensure all ports are open in firewall

