@echo off
echo ==========================================
echo Deploying Improved Nginx Configuration
echo ==========================================
echo.

echo This will update the nginx configuration on the server
echo to properly handle caching and prevent stale content.
echo.
pause

echo Uploading and applying new nginx configuration...
echo.

REM Upload the new config and apply it
ssh root@72.60.202.218 "cat > /etc/nginx/sites-available/gentime-frontend << 'NGINXEOF'
server {
    listen 80;
    server_name www.gentime.in gentime.in;
    client_max_body_size 10M;
    root /var/www/schoolm/frontend/dist;
    index index.html;

    # Disable caching for HTML files
    location ~* \.html$ {
        add_header Cache-Control \"no-cache, no-store, must-revalidate\";
        add_header Pragma \"no-cache\";
        add_header Expires \"0\";
        try_files \$uri \$uri/ /index.html;
    }

    # Cache static assets with hashed filenames
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        add_header Cache-Control \"public, max-age=31536000, immutable\";
        try_files \$uri =404;
    }

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /images {
        alias /var/www/schoolm/api/images;
        autoindex off;
        add_header Cache-Control \"public, max-age=86400\";
    }

    location /check-version.html {
        add_header Cache-Control \"no-cache, no-store, must-revalidate\";
        add_header Pragma \"no-cache\";
        add_header Expires \"0\";
        try_files \$uri =404;
    }
}
NGINXEOF
ln -sf /etc/nginx/sites-available/gentime-frontend /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx && echo 'Nginx configuration updated successfully!' || echo 'ERROR: Nginx configuration test failed!'"

echo.
echo ==========================================
echo Nginx Configuration Updated!
echo ==========================================
echo.
echo The server now has proper cache control headers:
echo - HTML files: No caching (always fresh)
echo - JS/CSS/Images: Long-term caching (safe due to hashed filenames)
echo.
pause
