#!/bin/bash

echo "========================================="
echo "GENTIME DEPLOYMENT SCRIPT"
echo "========================================="

# Navigate to project
cd /root/gentime

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# Check if pull was successful
if [ $? -ne 0 ]; then
    echo "❌ Git pull failed! Please check for conflicts."
    exit 1
fi

# Show latest commit
echo ""
echo "Latest commit:"
git log -1 --oneline
echo ""

# Navigate to frontend
cd frontend

# Clean old build
echo "🧹 Cleaning old build files..."
rm -rf dist
rm -rf node_modules/.vite

# Build frontend
echo "🔨 Building frontend..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please check errors above."
    exit 1
fi

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "❌ dist folder not created! Build may have failed."
    exit 1
fi

# Backup current production
echo "💾 Backing up current production..."
BACKUP_DIR="/var/www/gentime_backup_$(date +%Y%m%d_%H%M%S)"
sudo cp -r /var/www/gentime $BACKUP_DIR
echo "Backup saved to: $BACKUP_DIR"

# Deploy new build
echo "🚀 Deploying to production..."
sudo rm -rf /var/www/gentime/*
sudo cp -r dist/* /var/www/gentime/

# Verify files were copied
FILE_COUNT=$(sudo ls -1 /var/www/gentime/ | wc -l)
echo "Files copied to production: $FILE_COUNT"

# Set permissions
echo "🔐 Setting permissions..."
sudo chown -R www-data:www-data /var/www/gentime
sudo chmod -R 755 /var/www/gentime

# Test Nginx configuration
echo "🔍 Testing Nginx configuration..."
sudo nginx -t

# Restart Nginx
echo "🔄 Restarting Nginx..."
sudo systemctl restart nginx

# Check Nginx status
NGINX_STATUS=$(sudo systemctl is-active nginx)
if [ "$NGINX_STATUS" = "active" ]; then
    echo "✅ Nginx is running"
else
    echo "❌ Nginx failed to start!"
    sudo systemctl status nginx
    exit 1
fi

echo ""
echo "========================================="
echo "✅ DEPLOYMENT COMPLETE!"
echo "========================================="
echo ""
echo "🌐 Your site: https://gentime.in"
echo ""
echo "⚠️  IMPORTANT NEXT STEPS:"
echo "1. Clear browser cache:"
echo "   - Windows/Linux: Ctrl + Shift + R"
echo "   - Mac: Cmd + Shift + R"
echo ""
echo "2. Or open in Incognito/Private mode"
echo ""
echo "3. If still showing old site:"
echo "   - Clear browser cache completely"
echo "   - Wait 1-2 minutes for CDN/cache to clear"
echo "   - Try different browser"
echo ""
echo "4. Check browser console (F12) for errors"
echo ""
echo "========================================="
