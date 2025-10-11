#!/bin/bash
# One-Command Deployment Script - Run this on the server

echo "Starting deployment..." && \
apt update -y && \
apt install -y curl && \
curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
apt install -y nodejs nginx git && \
npm install -g pm2 && \
mkdir -p /var/www/schoolm && \
cd /var/www/schoolm && \
git clone https://github.com/kallesh653/schoolm.git . && \
cd api && \
echo "MONGODB_URI=mongodb+srv://schoolm2025:kallesh717@cluster0.ovqn73c.mongodb.net/school_management
JWT_SECRET=LSKDFJDLSJWIEOFFJDSLKJFLJ328929FDOSKJFlsdkfjdslskdfj
PORT=9000
NODE_ENV=production" > .env && \
npm install && \
cd ../frontend && \
echo "VITE_API_URL=http://72.60.202.218/api" > .env && \
npm install && \
npm run build && \
cd .. && \
echo "module.exports={apps:[{name:'schoolm-api',script:'./api/index.js',cwd:'/var/www/schoolm',instances:1,autorestart:true,watch:false,max_memory_restart:'1G',env:{NODE_ENV:'production',PORT:9000}}]};" > ecosystem.config.js && \
pm2 start ecosystem.config.js && \
pm2 save && \
pm2 startup && \
echo "server{listen 80;server_name 72.60.202.218;client_max_body_size 10M;location /{root /var/www/schoolm/frontend/dist;try_files \$uri \$uri/ /index.html;index index.html;}location /api{proxy_pass http://localhost:9000;proxy_http_version 1.1;proxy_set_header Upgrade \$http_upgrade;proxy_set_header Connection 'upgrade';proxy_set_header Host \$host;proxy_set_header X-Real-IP \$remote_addr;proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;proxy_set_header X-Forwarded-Proto \$scheme;proxy_cache_bypass \$http_upgrade;}location /images{alias /var/www/schoolm/api/images;autoindex off;}}" > /etc/nginx/sites-available/schoolm && \
ln -sf /etc/nginx/sites-available/schoolm /etc/nginx/sites-enabled/ && \
rm -f /etc/nginx/sites-enabled/default && \
nginx -t && \
systemctl restart nginx && \
systemctl enable nginx && \
ufw allow 'Nginx Full' && \
ufw allow OpenSSH && \
yes | ufw enable && \
mkdir -p /var/www/schoolm/api/images/uploaded/student /var/www/schoolm/api/images/uploaded/teacher /var/www/schoolm/api/images/uploaded/school && \
chmod -R 755 /var/www/schoolm/api/images && \
echo "Deployment complete!" && \
pm2 status && \
echo "Access your application at: http://72.60.202.218"
