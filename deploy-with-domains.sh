#!/bin/bash

# School Management System Deployment with Custom Domains
# Frontend: www.gentime.in
# Backend: api.gentime.in
# Server: 72.60.202.218

echo "======================================"
echo "School Management System Deployment"
echo "Custom Domains Setup"
echo "======================================"

# Update system
echo "Step 1: Updating system..."
apt update && apt upgrade -y

# Install Node.js 18.x
echo "Step 2: Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PM2, Nginx, Git, Certbot
echo "Step 3: Installing required packages..."
apt install -y nginx git certbot python3-certbot-nginx
npm install -g pm2

# Create application directory
echo "Step 4: Setting up application directory..."
mkdir -p /var/www/schoolm
cd /var/www/schoolm

# Clone repository
echo "Step 5: Cloning repository..."
git clone https://github.com/kallesh653/schoolm.git .

# Configure Backend
echo "Step 6: Configuring backend..."
cd /var/www/schoolm/api

cat > .env << 'ENVFILE'
MONGODB_URI=mongodb+srv://schoolm2025:kallesh717@cluster0.ovqn73c.mongodb.net/school_management
JWT_SECRET=LSKDFJDLSJWIEOFFJDSLKJFLJ328929FDOSKJFlsdkfjdslskdfj
PORT=9000
NODE_ENV=production
ENVFILE

npm install

# Configure Frontend with API domain
echo "Step 7: Configuring frontend..."
cd /var/www/schoolm/frontend

cat > .env << 'ENVFILE'
VITE_API_URL=https://api.gentime.in/api
ENVFILE

npm install
npm run build

# Create PM2 ecosystem
echo "Step 8: Setting up PM2..."
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
pm2 startup

# Configure Nginx for both domains
echo "Step 9: Configuring Nginx..."

# Frontend domain (www.gentime.in)
cat > /etc/nginx/sites-available/gentime-frontend << 'NGINXCONF'
server {
    listen 80;
    listen [::]:80;
    server_name www.gentime.in gentime.in;

    client_max_body_size 10M;

    # Frontend - Serve static files
    location / {
        root /var/www/schoolm/frontend/dist;
        try_files $uri $uri/ /index.html;
        index index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Uploaded images
    location /images {
        alias /var/www/schoolm/api/images;
        autoindex off;
    }
}
NGINXCONF

# Backend domain (api.gentime.in)
cat > /etc/nginx/sites-available/gentime-backend << 'NGINXCONF'
server {
    listen 80;
    listen [::]:80;
    server_name api.gentime.in;

    client_max_body_size 10M;

    # Backend API
    location / {
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
}
NGINXCONF

# Enable sites
ln -sf /etc/nginx/sites-available/gentime-frontend /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/gentime-backend /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
nginx -t
systemctl restart nginx
systemctl enable nginx

# Configure firewall
echo "Step 10: Configuring firewall..."
ufw allow 'Nginx Full'
ufw allow OpenSSH
ufw allow 443/tcp
yes | ufw enable

# Create upload directories
echo "Step 11: Setting up upload directories..."
mkdir -p /var/www/schoolm/api/images/uploaded/student
mkdir -p /var/www/schoolm/api/images/uploaded/teacher
mkdir -p /var/www/schoolm/api/images/uploaded/school
chmod -R 755 /var/www/schoolm/api/images

echo ""
echo "======================================"
echo "Step 12: SSL Certificate Setup"
echo "======================================"
echo ""
echo "IMPORTANT: Before proceeding with SSL, ensure:"
echo "1. DNS A records for www.gentime.in and api.gentime.in point to 72.60.202.218"
echo "2. Wait 5-10 minutes for DNS propagation"
echo ""
read -p "Have you configured DNS? (y/n): " dns_ready

if [ "$dns_ready" = "y" ]; then
    echo "Setting up SSL certificates..."
    
    # Get SSL for frontend
    certbot --nginx -d www.gentime.in -d gentime.in --non-interactive --agree-tos --email kallesh653@gmail.com --redirect
    
    # Get SSL for backend
    certbot --nginx -d api.gentime.in --non-interactive --agree-tos --email kallesh653@gmail.com --redirect
    
    echo "SSL certificates installed successfully!"
else
    echo "Skipping SSL setup. You can run these commands later:"
    echo "  certbot --nginx -d www.gentime.in -d gentime.in"
    echo "  certbot --nginx -d api.gentime.in"
fi

# Test SSL auto-renewal
certbot renew --dry-run

echo ""
echo "======================================"
echo "Deployment Complete!"
echo "======================================"
echo ""
echo "Application URLs:"
echo "  Frontend: https://www.gentime.in"
echo "  Backend API: https://api.gentime.in/api"
echo ""
echo "Services Status:"
pm2 status
echo ""
systemctl status nginx --no-pager
echo ""
echo "DNS Configuration Required:"
echo "  www.gentime.in  A  72.60.202.218"
echo "  gentime.in      A  72.60.202.218"
echo "  api.gentime.in  A  72.60.202.218"
echo ""
echo "After DNS propagation, run SSL setup:"
echo "  certbot --nginx -d www.gentime.in -d gentime.in"
echo "  certbot --nginx -d api.gentime.in"
