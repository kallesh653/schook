#!/bin/bash

# School Management System Deployment Script
# Server: 72.60.202.218

echo "======================================"
echo "School Management System Deployment"
echo "======================================"

# Update system
echo "1. Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js and npm
echo "2. Installing Node.js and npm..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify Node.js installation
node --version
npm --version

# Install PM2 globally
echo "3. Installing PM2 process manager..."
sudo npm install -g pm2

# Install Nginx
echo "4. Installing Nginx..."
sudo apt install -y nginx

# Install Git
echo "5. Installing Git..."
sudo apt install -y git

# Create application directory
echo "6. Creating application directory..."
sudo mkdir -p /var/www/schoolm
sudo chown -R $USER:$USER /var/www/schoolm
cd /var/www/schoolm

# Clone repository
echo "7. Cloning repository from GitHub..."
git clone https://github.com/kallesh653/schoolm.git .

# Setup backend
echo "8. Setting up backend..."
cd /var/www/schoolm/api

# Create .env file for backend
cat > .env << 'ENVFILE'
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_here
PORT=9000
NODE_ENV=production
ENVFILE

echo "Please edit /var/www/schoolm/api/.env with your actual MongoDB URI and JWT secret"
read -p "Press enter when you've updated the .env file..."

# Install backend dependencies
npm install --production

# Setup frontend
echo "9. Setting up frontend..."
cd /var/www/schoolm/frontend

# Create .env file for frontend
cat > .env << 'ENVFILE'
VITE_API_URL=http://72.60.202.218:9000/api
ENVFILE

# Install frontend dependencies
npm install

# Build frontend for production
echo "10. Building frontend..."
npm run build

# Configure PM2 for backend
echo "11. Configuring PM2..."
cd /var/www/schoolm

# Create PM2 ecosystem file
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
echo "12. Configuring Nginx..."
sudo tee /etc/nginx/sites-available/schoolm << 'NGINXCONF'
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
NGINXCONF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/schoolm /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

# Set up firewall
echo "13. Configuring firewall..."
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw --force enable

# Create upload directories with proper permissions
echo "14. Setting up upload directories..."
mkdir -p /var/www/schoolm/api/images/uploaded/student
mkdir -p /var/www/schoolm/api/images/uploaded/teacher
mkdir -p /var/www/schoolm/api/images/uploaded/school
chmod -R 755 /var/www/schoolm/api/images

echo "======================================"
echo "Deployment Complete!"
echo "======================================"
echo "Frontend: http://72.60.202.218"
echo "Backend API: http://72.60.202.218/api"
echo ""
echo "To check backend status: pm2 status"
echo "To view backend logs: pm2 logs schoolm-api"
echo "To restart backend: pm2 restart schoolm-api"
echo "To check nginx status: sudo systemctl status nginx"
echo ""
echo "IMPORTANT: Update the .env file with your MongoDB URI!"
