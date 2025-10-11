# School Management System - Custom Domain Deployment

## Domain Configuration
- **Frontend**: www.gentime.in
- **Backend API**: api.gentime.in
- **Server IP**: 72.60.202.218

---

## Step 1: Configure DNS Records

Before deploying, you **MUST** configure these DNS records in your domain registrar (GoDaddy, Namecheap, etc.):

### DNS A Records to Add:

| Type | Name/Host | Value/Points To | TTL |
|------|-----------|-----------------|-----|
| A | @ | 72.60.202.218 | 3600 |
| A | www | 72.60.202.218 | 3600 |
| A | api | 72.60.202.218 | 3600 |

**Wait 5-30 minutes for DNS propagation** before proceeding to deployment.

---

## Step 2: Connect to Server and Deploy

### Connect via SSH:
```bash
ssh root@72.60.202.218
```
Password: `Kallesh717653@`

### Run This Single Command to Deploy Everything:

Copy and paste this entire command block:

```bash
apt update && apt upgrade -y && \
curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
apt install -y nodejs nginx git certbot python3-certbot-nginx && \
npm install -g pm2 && \
mkdir -p /var/www/schoolm && cd /var/www/schoolm && \
git clone https://github.com/kallesh653/schoolm.git . && \
cd api && \
printf "MONGODB_URI=mongodb+srv://schoolm2025:kallesh717@cluster0.ovqn73c.mongodb.net/school_management\nJWT_SECRET=LSKDFJDLSJWIEOFFJDSLKJFLJ328929FDOSKJFlsdkfjdslskdfj\nPORT=9000\nNODE_ENV=production" > .env && \
npm install && \
cd ../frontend && \
printf "VITE_API_URL=https://api.gentime.in/api" > .env && \
npm install && npm run build && \
cd .. && \
printf 'module.exports={apps:[{name:"schoolm-api",script:"./api/index.js",cwd:"/var/www/schoolm",instances:1,autorestart:true,watch:false,max_memory_restart:"1G",env:{NODE_ENV:"production",PORT:9000}}]};' > ecosystem.config.js && \
pm2 start ecosystem.config.js && pm2 save && pm2 startup && \
printf 'server{listen 80;server_name www.gentime.in gentime.in;client_max_body_size 10M;location /{root /var/www/schoolm/frontend/dist;try_files $uri $uri/ /index.html;index index.html;}location /images{alias /var/www/schoolm/api/images;autoindex off;}}' > /etc/nginx/sites-available/gentime-frontend && \
printf 'server{listen 80;server_name api.gentime.in;client_max_body_size 10M;location /{proxy_pass http://localhost:9000;proxy_http_version 1.1;proxy_set_header Upgrade $http_upgrade;proxy_set_header Connection "upgrade";proxy_set_header Host $host;proxy_set_header X-Real-IP $remote_addr;proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;proxy_set_header X-Forwarded-Proto $scheme;proxy_cache_bypass $http_upgrade;}}' > /etc/nginx/sites-available/gentime-backend && \
ln -sf /etc/nginx/sites-available/gentime-frontend /etc/nginx/sites-enabled/ && \
ln -sf /etc/nginx/sites-available/gentime-backend /etc/nginx/sites-enabled/ && \
rm -f /etc/nginx/sites-enabled/default && \
nginx -t && systemctl restart nginx && systemctl enable nginx && \
ufw allow 'Nginx Full' && ufw allow OpenSSH && yes | ufw enable && \
mkdir -p /var/www/schoolm/api/images/uploaded/student /var/www/schoolm/api/images/uploaded/teacher /var/www/schoolm/api/images/uploaded/school && \
chmod -R 755 /var/www/schoolm/api/images && \
echo "Deployment Complete!" && pm2 status
```

---

## Step 3: Set Up SSL Certificates

After DNS propagation (wait 5-30 minutes), run these commands on the server:

```bash
# For frontend (www.gentime.in)
certbot --nginx -d www.gentime.in -d gentime.in

# For backend (api.gentime.in)
certbot --nginx -d api.gentime.in
```

---

## Access Your Application

- **Frontend**: https://www.gentime.in
- **Backend API**: https://api.gentime.in/api

---

## Useful Commands

```bash
# Check backend status
pm2 status

# View backend logs
pm2 logs schoolm-api

# Restart backend
pm2 restart schoolm-api

# Check Nginx status
systemctl status nginx

# Restart Nginx
systemctl restart nginx

# View Nginx error logs
tail -f /var/log/nginx/error.log
```

---

## Update Application

When you push changes to GitHub:

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

### Backend not starting
```bash
pm2 logs schoolm-api --lines 50
```

### Frontend not loading
```bash
cd /var/www/schoolm/frontend
npm run build
```

### SSL errors
```bash
# Check DNS first
nslookup www.gentime.in
nslookup api.gentime.in

# Retry SSL
certbot --nginx -d www.gentime.in -d gentime.in
certbot --nginx -d api.gentime.in
```
