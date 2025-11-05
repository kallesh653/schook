@echo off
setlocal enabledelayedexpansion

echo ==========================================
echo School Management System - Smart Deployment
echo ==========================================
echo.

REM Step 1: Check for uncommitted changes
echo [1/8] Checking for uncommitted changes...
cd "%~dp0"
git status --short > temp_status.txt
set /p changes=<temp_status.txt
del temp_status.txt

if not "!changes!"=="" (
    echo WARNING: You have uncommitted changes!
    echo.
    git status
    echo.
    set /p commit_choice="Do you want to commit these changes? (y/n): "
    if /i "!commit_choice!"=="y" (
        set /p commit_msg="Enter commit message: "
        git add .
        git commit -m "!commit_msg!"
    ) else (
        echo Please commit or stash your changes before deploying.
        pause
        exit /b 1
    )
)

REM Step 2: Push to GitHub
echo.
echo [2/8] Pushing latest code to GitHub...
git push origin main
if errorlevel 1 (
    echo ERROR: Failed to push to GitHub
    pause
    exit /b 1
)

REM Step 3: Build frontend locally to verify
echo.
echo [3/8] Building frontend locally to verify...
cd frontend
call npm run build
if errorlevel 1 (
    echo ERROR: Frontend build failed!
    pause
    exit /b 1
)
cd ..

REM Step 4: Update version check file
echo.
echo [4/8] Updating version check file...
set BUILD_TIME=%date% %time%
set BUILD_ID=%RANDOM%%RANDOM%
echo ^<!DOCTYPE html^> > check-version.html
echo ^<html^> >> check-version.html
echo ^<head^> >> check-version.html
echo     ^<meta charset="UTF-8"^> >> check-version.html
echo     ^<title^>Version Check^</title^> >> check-version.html
echo     ^<style^> >> check-version.html
echo         body { font-family: Arial; padding: 50px; background: #f0f0f0; } >> check-version.html
echo         .box { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); } >> check-version.html
echo         .success { color: green; font-weight: bold; font-size: 24px; } >> check-version.html
echo         .info { color: #666; margin-top: 20px; } >> check-version.html
echo     ^</style^> >> check-version.html
echo ^</head^> >> check-version.html
echo ^<body^> >> check-version.html
echo     ^<div class="box"^> >> check-version.html
echo         ^<h1^>✅ Deployment Version Check^</h1^> >> check-version.html
echo         ^<p class="success"^>Build Time: %BUILD_TIME%^</p^> >> check-version.html
echo         ^<p class="success"^>Build ID: %BUILD_ID%^</p^> >> check-version.html
echo         ^<p^>^<a href="/"^>Go to Main Site^</a^>^</p^> >> check-version.html
echo     ^</div^> >> check-version.html
echo ^</body^> >> check-version.html
echo ^</html^> >> check-version.html

REM Step 5: Commit and push version file
echo.
echo [5/8] Committing version check file...
git add check-version.html
git commit -m "Update deployment version: %BUILD_TIME%"
git push origin main

REM Step 6: Deploy to server with cache clearing
echo.
echo [6/8] Deploying to VPS server...
echo Connecting to 72.60.202.218...
echo.

ssh root@72.60.202.218 "cd /var/www/schoolm && git fetch origin && git reset --hard origin/main && cd frontend && npm install && npm run build && cd .. && pm2 restart schoolm-api && echo '# Clear nginx cache' && systemctl reload nginx && echo 'DEPLOYMENT COMPLETE - Build ID: %BUILD_ID%' && ls -lh frontend/dist/assets/ | grep index"

if errorlevel 1 (
    echo.
    echo ERROR: Deployment failed!
    echo Please check the server connection and logs.
    pause
    exit /b 1
)

REM Step 7: Verify deployment
echo.
echo [7/8] Verifying deployment...
timeout /t 5 /nobreak > nul
curl -s -o nul -w "HTTP Status: %%{http_code}\n" https://gentime.in/check-version.html

REM Step 8: Instructions
echo.
echo [8/8] Deployment completed successfully!
echo.
echo ==========================================
echo IMPORTANT: Clear Your Browser Cache!
echo ==========================================
echo.
echo Chrome/Edge: Press Ctrl+Shift+Delete
echo Firefox: Press Ctrl+Shift+Delete
echo Safari: Press Cmd+Option+E
echo.
echo OR use Hard Refresh:
echo - Chrome/Firefox/Edge: Ctrl+F5 or Ctrl+Shift+R
echo - Safari: Cmd+Shift+R
echo.
echo Check deployment at:
echo - Main site: https://gentime.in
echo - Version check: https://gentime.in/check-version.html
echo - API: https://api.gentime.in/api/health
echo.
echo ==========================================
pause
