# School Management System - Windows Deployment Script
# This script will deploy to server: 72.60.202.218

$server = "root@72.60.202.218"
$password = "Kallesh717653@"

Write-Host "======================================"
Write-Host "School Management System Deployment"
Write-Host "======================================"

# Create deployment commands file
$deployCommands = @"
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs nginx git
npm install -g pm2
mkdir -p /var/www/schoolm
cd /var/www/schoolm
git clone https://github.com/kallesh653/schoolm.git .
cd /var/www/schoolm/api
cat > .env << 'ENVFILE'
MONGODB_URI=mongodb+srv://schoolm2025:kallesh717@cluster0.ovqn73c.mongodb.net/school_management
JWT_SECRET=LSKDFJDLSJWIEOFFJDSLKJFLJ328929FDOSKJFlsdkfjdslskdfj
PORT=9000
NODE_ENV=production
ENVFILE
npm install
cd /var/www/schoolm/frontend
cat > .env << 'ENVFILE'
VITE_API_URL=http://72.60.202.218/api
ENVFILE
npm install
npm run build
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
cat > /etc/nginx/sites-available/schoolm << 'NGINXCONF'
server {
    listen 80;
    server_name 72.60.202.218;
    client_max_body_size 10M;
    location / {
        root /var/www/schoolm/frontend/dist;
        try_files `$uri `$uri/ /index.html;
        index index.html;
    }
    location /api {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade `$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host `$host;
        proxy_set_header X-Real-IP `$remote_addr;
        proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto `$scheme;
        proxy_cache_bypass `$http_upgrade;
    }
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
ufw allow 'Nginx Full'
ufw allow OpenSSH
yes | ufw enable
mkdir -p /var/www/schoolm/api/images/uploaded/{student,teacher,school}
chmod -R 755 /var/www/schoolm/api/images
pm2 status
systemctl status nginx --no-pager
"@

Write-Host "`nDeployment commands prepared. To deploy:"
Write-Host "1. Open PowerShell or CMD"
Write-Host "2. Run: ssh root@72.60.202.218"
Write-Host "3. Enter password: Kallesh717653@"
Write-Host "4. Copy and paste all commands from QUICK_DEPLOY.md"
Write-Host "`nOr use PuTTY to connect and run the commands manually."
