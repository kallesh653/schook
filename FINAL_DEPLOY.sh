#!/bin/bash
# Copy this entire script and run it on your server

echo "==========================================="
echo "School Management System Deployment"
echo "Frontend: www.gentime.in"
echo "Backend: api.gentime.in"
echo "==========================================="

# Update system and install Node.js
echo "Step 1/10: Updating system and installing Node.js..."
apt update -y
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs nginx git certbot python3-certbot-nginx

# Install PM2
echo "Step 2/10: Installing PM2..."
npm install -g pm2

# Clone repository
echo "Step 3/10: Cloning repository..."
mkdir -p /var/www/schoolm
cd /var/www/schoolm
rm -rf *
git clone https://github.com/kallesh653/schoolm.git .

# Configure backend
echo "Step 4/10: Configuring backend..."
cd /var/www/schoolm/api
cat > .env << 'EOF'
MONGODB_URI=mongodb+srv://schoolm2025:kallesh717@cluster0.ovqn73c.mongodb.net/school_management
JWT_SECRET=LSKDFJDLSJWIEOFFJDSLKJFLJ328929FDOSKJFlsdkfjdslskdfj
PORT=9000
NODE_ENV=production
EOF

echo "Step 5/10: Installing backend dependencies..."
npm install

# Configure frontend
echo "Step 6/10: Configuring frontend..."
cd /var/www/schoolm/frontend
cat > .env << 'EOF'
VITE_API_URL=https://api.gentime.in/api
EOF

echo "Step 7/10: Installing frontend dependencies and building..."
npm install
npm run build

# Setup PM2
echo "Step 8/10: Setting up PM2..."
cd /var/www/schoolm
cat > ecosystem.config.js << 'EOF'
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
EOF

pm2 delete schoolm-api 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Configure Nginx
echo "Step 9/10: Configuring Nginx..."

# Frontend config
cat > /etc/nginx/sites-available/gentime-frontend << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name www.gentime.in gentime.in;
    client_max_body_size 10M;

    location / {
        root /var/www/schoolm/frontend/dist;
        try_files $uri $uri/ /index.html;
        index index.html;
    }

    location /images {
        alias /var/www/schoolm/api/images;
        autoindex off;
    }
}
EOF

# Backend config
cat > /etc/nginx/sites-available/gentime-backend << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name api.gentime.in;
    client_max_body_size 10M;

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
    }
}
EOF

# Enable sites
ln -sf /etc/nginx/sites-available/gentime-frontend /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/gentime-backend /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
nginx -t
systemctl restart nginx
systemctl enable nginx

# Setup firewall
echo "Step 10/10: Setting up firewall..."
ufw allow 'Nginx Full'
ufw allow OpenSSH
yes | ufw enable

# Create directories
mkdir -p /var/www/schoolm/api/images/uploaded/{student,teacher,school}
chmod -R 755 /var/www/schoolm/api/images

echo ""
echo "==========================================="
echo "Deployment Complete!"
echo "==========================================="
echo ""
echo "Services Status:"
pm2 status
echo ""
echo "Nginx Status:"
systemctl status nginx --no-pager | head -10
echo ""
echo "==========================================="
echo "Application URLs:"
echo "  Frontend: http://www.gentime.in"
echo "  Backend: http://api.gentime.in/api"
echo ""
echo "DNS Configuration Required:"
echo "  www.gentime.in  A  72.60.202.218"
echo "  gentime.in      A  72.60.202.218"
echo "  api.gentime.in  A  72.60.202.218"
echo ""
echo "After DNS propagates, run SSL setup:"
echo "  certbot --nginx -d www.gentime.in -d gentime.in"
echo "  certbot --nginx -d api.gentime.in"
echo "==========================================="
