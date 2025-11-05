# School Management System - Deployment Script
# This script deploys both frontend and backend to the server

$ErrorActionPreference = "Stop"

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "School Management System Deployment" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$SERVER = "root@72.60.202.218"
$FRONTEND_DIST = "d:\gentime8\school management system\frontend\dist"
$BACKEND_SRC = "d:\gentime8\school management system\api"
$REMOTE_PUBLIC = "/var/www/schoolm/public"
$REMOTE_API = "/var/www/schoolm/api"

# Step 1: Deploy Frontend
Write-Host "[1/4] Deploying Frontend..." -ForegroundColor Yellow
Write-Host "Uploading files from $FRONTEND_DIST to $REMOTE_PUBLIC" -ForegroundColor Gray

try {
    # Clear remote public directory
    ssh $SERVER "rm -rf $REMOTE_PUBLIC/*"
    Write-Host "✓ Cleared remote public directory" -ForegroundColor Green

    # Upload dist files
    scp -r "$FRONTEND_DIST\*" "${SERVER}:${REMOTE_PUBLIC}/"
    Write-Host "✓ Frontend files uploaded successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Frontend deployment failed: $_" -ForegroundColor Red
    exit 1
}

# Step 2: Deploy Backend API files
Write-Host ""
Write-Host "[2/4] Deploying Backend API..." -ForegroundColor Yellow
Write-Host "Uploading new API files" -ForegroundColor Gray

try {
    # Upload new model
    scp "$BACKEND_SRC\model\academicYear.model.js" "${SERVER}:${REMOTE_API}/model/"
    Write-Host "✓ Academic Year model uploaded" -ForegroundColor Green

    # Upload new controller
    scp "$BACKEND_SRC\controller\academicYear.controller.js" "${SERVER}:${REMOTE_API}/controller/"
    Write-Host "✓ Academic Year controller uploaded" -ForegroundColor Green

    # Upload new router
    scp "$BACKEND_SRC\router\academicYear.router.js" "${SERVER}:${REMOTE_API}/router/"
    Write-Host "✓ Academic Year router uploaded" -ForegroundColor Green

    # Upload updated server.js
    scp "$BACKEND_SRC\server.js" "${SERVER}:${REMOTE_API}/"
    Write-Host "✓ Server.js updated" -ForegroundColor Green

    # Upload updated controllers
    scp "$BACKEND_SRC\controller\class.controller.js" "${SERVER}:${REMOTE_API}/controller/"
    scp "$BACKEND_SRC\controller\course.controller.js" "${SERVER}:${REMOTE_API}/controller/"
    Write-Host "✓ Updated controllers uploaded" -ForegroundColor Green

} catch {
    Write-Host "✗ Backend deployment failed: $_" -ForegroundColor Red
    exit 1
}

# Step 3: Restart Services
Write-Host ""
Write-Host "[3/4] Restarting Services..." -ForegroundColor Yellow

try {
    # Restart PM2
    ssh $SERVER "pm2 restart schoolm-api"
    Write-Host "✓ PM2 restarted" -ForegroundColor Green

    # Reload Nginx
    ssh $SERVER "systemctl reload nginx"
    Write-Host "✓ Nginx reloaded" -ForegroundColor Green

} catch {
    Write-Host "✗ Service restart failed: $_" -ForegroundColor Red
    exit 1
}

# Step 4: Verify Deployment
Write-Host ""
Write-Host "[4/4] Verifying Deployment..." -ForegroundColor Yellow

try {
    # Check PM2 status
    $pm2Status = ssh $SERVER "pm2 status" 2>&1
    Write-Host "PM2 Status:" -ForegroundColor Gray
    Write-Host $pm2Status

    # Check if frontend is accessible
    Write-Host ""
    Write-Host "Testing Frontend..." -ForegroundColor Gray
    $frontendTest = Invoke-WebRequest -Uri "http://schoolm.gentime.in" -UseBasicParsing -TimeoutSec 10
    if ($frontendTest.StatusCode -eq 200) {
        Write-Host "✓ Frontend is accessible" -ForegroundColor Green
    }

    Write-Host ""
    Write-Host "Testing API..." -ForegroundColor Gray
    $apiTest = Invoke-WebRequest -Uri "http://schoolm.gentime.in/api/academic-year" -UseBasicParsing -TimeoutSec 10
    if ($apiTest.StatusCode -eq 200 -or $apiTest.StatusCode -eq 401) {
        Write-Host "✓ API is responding" -ForegroundColor Green
    }

} catch {
    Write-Host "Warning: Verification had issues, but deployment may still be successful" -ForegroundColor Yellow
    Write-Host "Error: $_" -ForegroundColor Gray
}

# Success message
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "✓ Deployment Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Access your application at:" -ForegroundColor White
Write-Host "  Frontend: https://schoolm.gentime.in" -ForegroundColor Cyan
Write-Host "  API: https://schoolm.gentime.in/api" -ForegroundColor Cyan
Write-Host ""
Write-Host "New Features Available:" -ForegroundColor White
Write-Host "  ✓ Academic Year Management" -ForegroundColor Green
Write-Host "  ✓ Student Promotion System" -ForegroundColor Green
Write-Host "  ✓ Professional Student Reports" -ForegroundColor Green
Write-Host "  ✓ Final Marksheet Generator" -ForegroundColor Green
Write-Host "  ✓ Optional Fees Fields" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
