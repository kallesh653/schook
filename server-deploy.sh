#!/bin/bash

echo "======================================"
echo "Starting Server Deployment"
echo "======================================"

# Update system
echo "Step 1: Updating system packages..."
apt update && apt upgrade -y

# Install Node.js 18.x
echo "Step 2: Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Install PM2
echo "Step 3: Installing PM2..."
npm install -g pm2

# Install Nginx
echo "Step 4: Installing Nginx..."
apt install -y nginx

# Install Git
echo "Step 5: Installing Git..."
apt install -y git

# Create application directory
echo "Step 6: Setting up application directory..."
mkdir -p /var/www/schoolm
cd /var/www/schoolm

# Clone repository
echo "Step 7: Cloning repository from GitHub..."
git clone https://github.com/kallesh653/schoolm.git .

# Configure backend
echo "Step 8: Configuring backend..."
cd /var/www/schoolm/api

cat > .env << 'ENVFILE'
MONGODB_URI=mongodb+srv://schoolm2025:kallesh717@cluster0.ovqn73c.mongodb.net/school_management
JWT_SECRET=LSKDFJDLSJWIEOFFJDSLKJFLJ328929FDOSKJFlsdkfjdslskdfj
PORT=9000
NODE_ENV=production
ENVFILE

echo "Installing backend dependencies..."
npm install

# Configure frontend
echo "Step 9: Configuring frontend..."
cd /var/www/schoolm/frontend

cat > .env << 'ENVFILE'
VITE_API_URL=http://72.60.202.218/api
ENVFILE

echo "Installing frontend dependencies..."
npm install

echo "Building frontend for production..."
npm run build

# Create PM2 ecosystem file
echo "Step 10: Setting up PM2..."
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

pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root

# Configure Nginx
echo "Step 11: Configuring Nginx..."
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

ln -sf /etc/nginx/sites-available/schoolm /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl restart nginx
systemctl enable nginx

# Set up firewall
echo "Step 12: Configuring firewall..."
ufw allow 'Nginx Full'
ufw allow OpenSSH
ufw allow 22
echo "y" | ufw enable

# Create upload directories
echo "Step 13: Setting up upload directories..."
mkdir -p /var/www/schoolm/api/images/uploaded/student
mkdir -p /var/www/schoolm/api/images/uploaded/teacher
mkdir -p /var/www/schoolm/api/images/uploaded/school
chmod -R 755 /var/www/schoolm/api/images

echo ""
echo "======================================"
echo "Deployment Complete!"
echo "======================================"
echo "Frontend: http://72.60.202.218"
echo "Backend API: http://72.60.202.218/api"
echo ""
echo "PM2 Status:"
pm2 status
echo ""
echo "Nginx Status:"
systemctl status nginx --no-pager
