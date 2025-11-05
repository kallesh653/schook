@echo off
REM Quick deployment script for when you just need to push code changes
REM This assumes you've already built and tested locally

echo ==========================================
echo Quick Deployment to VPS
echo ==========================================
echo.

cd "%~dp0"

echo [1/3] Committing and pushing changes...
set /p commit_msg="Enter commit message (or press Enter for default): "
if "!commit_msg!"=="" set commit_msg="Quick update - %date% %time%"

git add .
git commit -m "%commit_msg%"
git push origin main

echo.
echo [2/3] Deploying to server...
ssh root@72.60.202.218 "cd /var/www/schoolm && git pull origin main && cd frontend && npm install && npm run build && pm2 restart schoolm-api && systemctl reload nginx && echo 'DONE!'"

echo.
echo [3/3] Deployment complete!
echo.
echo Remember to:
echo 1. Hard refresh your browser (Ctrl+Shift+R)
echo 2. Clear browser cache if needed
echo 3. Check: https://gentime.in
echo.
pause
