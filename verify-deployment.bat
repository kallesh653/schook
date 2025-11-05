@echo off
echo ==========================================
echo Deployment Verification Tool
echo ==========================================
echo.

echo Checking local and remote status...
echo.

REM Check local git status
echo [Local Git Status]
cd "%~dp0"
git status --short
if errorlevel 1 (
    echo ERROR: Git command failed
    pause
    exit /b 1
)

REM Check last commit
echo.
echo [Last Commit]
git log -1 --oneline
echo.

REM Check local build
echo [Local Build]
if exist "frontend\dist\index.html" (
    echo ✅ Local build exists
    findstr "assets" frontend\dist\index.html | findstr ".js"
) else (
    echo ❌ Local build not found! Run: npm run build
)
echo.

REM Check remote server
echo [Remote Server Status]
echo Checking server files...
ssh root@72.60.202.218 "cd /var/www/schoolm && echo 'Git Status:' && git status --short && echo '' && echo 'Last Commit:' && git log -1 --oneline && echo '' && echo 'Build Files:' && ls -lh frontend/dist/assets/ | grep 'index-' | tail -5 && echo '' && echo 'PM2 Status:' && pm2 list | grep schoolm && echo '' && echo 'Nginx Status:' && systemctl is-active nginx"

echo.
echo ==========================================
echo Verification URLs
echo ==========================================
echo.
echo Main Site: https://gentime.in
echo Version Check: https://gentime.in/check-version.html
echo API Health: https://api.gentime.in/api/health
echo.
echo Test these URLs in your browser after clearing cache!
echo.
pause
