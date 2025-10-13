@echo off
echo ==========================================
echo School Management System - VPS Deployment
echo ==========================================
echo.
echo Connecting to 72.60.202.218...
echo.

ssh root@72.60.202.218 "apt update -y && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && apt install -y nodejs nginx git certbot python3-certbot-nginx && npm install -g pm2 && mkdir -p /var/www/schoolm && cd /var/www/schoolm && rm -rf * .git && git clone https://github.com/kallesh653/schoolm.git . && cd api && printf 'MONGODB_URI=mongodb+srv://schoolm2025:kallesh717@cluster0.ovqn73c.mongodb.net/school_management\nJWT_SECRET=LSKDFJDLSJWIEOFFJDSLKJFLJ328929FDOSKJFlsdkfjdslskdfj\nPORT=9000\nNODE_ENV=production' > .env && npm install && cd ../frontend && printf 'VITE_API_URL=https://api.gentime.in/api' > .env && npm install && npm run build && cd .. && printf 'module.exports={apps:[{name:\"schoolm-api\",script:\"./api/index.js\",cwd:\"/var/www/schoolm\",instances:1,autorestart:true,watch:false,max_memory_restart:\"1G\",env:{NODE_ENV:\"production\",PORT:9000}}]};' > ecosystem.config.js && pm2 delete schoolm-api 2>/dev/null || true && pm2 start ecosystem.config.js && pm2 save && pm2 startup && printf 'server{listen 80;server_name www.gentime.in gentime.in;client_max_body_size 10M;location /{root /var/www/schoolm/frontend/dist;try_files \$uri \$uri/ /index.html;}location /images{alias /var/www/schoolm/api/images;}}' > /etc/nginx/sites-available/gentime-frontend && printf 'server{listen 80;server_name api.gentime.in;location /{proxy_pass http://localhost:9000;proxy_set_header Host \$host;proxy_set_header X-Real-IP \$remote_addr;}}' > /etc/nginx/sites-available/gentime-backend && ln -sf /etc/nginx/sites-available/gentime-frontend /etc/nginx/sites-enabled/ && ln -sf /etc/nginx/sites-available/gentime-backend /etc/nginx/sites-enabled/ && rm -f /etc/nginx/sites-enabled/default && nginx -t && systemctl restart nginx && systemctl enable nginx && ufw allow 'Nginx Full' && ufw allow OpenSSH && yes | ufw enable && mkdir -p /var/www/schoolm/api/images/uploaded/student /var/www/schoolm/api/images/uploaded/teacher /var/www/schoolm/api/images/uploaded/school && chmod -R 755 /var/www/schoolm/api/images && echo 'DEPLOYMENT COMPLETE!' && pm2 status"

echo.
echo ==========================================
echo Deployment Complete!
echo ==========================================
pause
