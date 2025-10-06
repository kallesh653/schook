# Complete VSCode to Git and Server Connection Guide

This guide covers **connecting an existing VSCode project to Git and deploying to a server**, including all possible errors and their solutions.

---

## Table of Contents
1. [Initial Setup - Connect VSCode to Git](#initial-setup---connect-vscode-to-git)
2. [Connect to GitHub Repository](#connect-to-github-repository)
3. [Push Code to GitHub](#push-code-to-github)
4. [Connect to VPS Server](#connect-to-vps-server)
5. [Deploy Code to Server](#deploy-code-to-server)
6. [All Possible Errors & Solutions](#all-possible-errors--solutions)
7. [Daily Workflow After Setup](#daily-workflow-after-setup)
8. [Troubleshooting Common Issues](#troubleshooting-common-issues)

---

## Initial Setup - Connect VSCode to Git

### Step 1: Check if Git is Installed

**Open VSCode Terminal:**
- Press `` Ctrl+` `` (backtick) or
- View → Terminal

**Check Git installation:**
```bash
git --version
```

**Expected output:**
```
git version 2.43.0.windows.1
```

**❌ Error: 'git' is not recognized**

**Solution:**
```bash
# Download and install Git from:
https://git-scm.com/download/win

# During installation:
✅ Select "Git from the command line and also from 3rd-party software"
✅ Select "Use Windows' default console window"
✅ Install

# After installation, restart VSCode
# Try again: git --version
```

---

### Step 2: Configure Git User

**Set your name and email (required for commits):**
```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@gmail.com"
```

**Example:**
```bash
git config --global user.name "Kallesh SK"
git config --global user.email "kallesh@gmail.com"
```

**Verify configuration:**
```bash
git config --global --list
```

**Expected output:**
```
user.name=Kallesh SK
user.email=kallesh@gmail.com
```

---

### Step 3: Initialize Git in Your Project

**Navigate to your project folder in terminal:**
```bash
cd "d:\final project 1.1\gentime4\school management system"
```

**Initialize Git repository:**
```bash
git init
```

**Expected output:**
```
Initialized empty Git repository in d:/final project 1.1/gentime4/school management system/.git/
```

**What this does:**
- Creates a hidden `.git` folder
- Enables version control in your project
- Allows you to track changes

**Verify Git initialized:**
```bash
git status
```

**Expected output:**
```
On branch main (or master)
No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        frontend/
        api/
        ...
```

---

### Step 4: Create .gitignore File

**Why .gitignore:**
- Prevents committing unnecessary files
- Keeps repository clean
- Protects sensitive data (.env files)
- Reduces repository size

**Create .gitignore in project root:**
```bash
# In VSCode terminal
New-Item -ItemType File -Path ".gitignore"
```

**Or in VSCode:**
- Right-click in Explorer
- New File
- Name: `.gitignore`

**Add this content to .gitignore:**
```gitignore
# Dependencies
node_modules/
package-lock.json
.pnp
.pnp.js

# Testing
coverage/
.nyc_output

# Production builds
build/
dist/
.next/
out/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
.pnpm-debug.log*

# OS files
.DS_Store
Thumbs.db
desktop.ini

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# Temporary files
tmp/
temp/
*.tmp

# Database
*.sqlite
*.db

# Uploads
uploads/
public/uploads/

# Cache
.cache/
.parcel-cache/

# PM2
.pm2/

# Backup files
*.backup
*.bak
```

**Save the file (Ctrl+S)**

---

### Step 5: Add Files to Git

**Check what files will be added:**
```bash
git status
```

**Add all files:**
```bash
git add .
```

**What this does:**
- Stages all files for commit
- Respects .gitignore rules
- Does NOT commit yet (just prepares)

**Verify files staged:**
```bash
git status
```

**Expected output:**
```
On branch main
Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
        new file:   frontend/src/App.jsx
        new file:   api/server.js
        ...
```

**❌ Error: warning: LF will be replaced by CRLF**

**What it means:**
- Line ending difference (Windows vs Unix)
- Not critical, just a warning
- Can be ignored or fixed

**Solution (if you want to fix):**
```bash
git config --global core.autocrlf true
```

---

### Step 6: Create First Commit

**Commit the staged files:**
```bash
git commit -m "Initial commit - GenTime School Management System"
```

**Expected output:**
```
[main (root-commit) a1b2c3d] Initial commit - GenTime School Management System
 150 files changed, 45000 insertions(+)
 create mode 100644 frontend/package.json
 create mode 100644 api/server.js
 ...
```

**Verify commit:**
```bash
git log
```

**Expected output:**
```
commit a1b2c3d4e5f6g7h8i9j0 (HEAD -> main)
Author: Kallesh SK <kallesh@gmail.com>
Date:   Mon Oct 6 18:30:00 2025 +0530

    Initial commit - GenTime School Management System
```

**❌ Error: Author identity unknown**

**Error message:**
```
*** Please tell me who you are.

Run

  git config --global user.email "you@example.com"
  git config --global user.name "Your Name"
```

**Solution:**
```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Try commit again
git commit -m "Initial commit - GenTime School Management System"
```

---

## Connect to GitHub Repository

### Step 1: Create GitHub Account (if you don't have one)

**Go to:** https://github.com
**Sign up** with email, username, password
**Verify** email address

---

### Step 2: Create New Repository on GitHub

**Login to GitHub**

**Click "+" icon** (top right) → New repository

**Repository settings:**
- Repository name: `gentime` (or your choice)
- Description: `GenTime School Management System - MERN Stack`
- Visibility: `Public` or `Private`
- ❌ **DO NOT** check "Add a README file"
- ❌ **DO NOT** check "Add .gitignore"
- ❌ **DO NOT** choose a license

**Click "Create repository"**

**You'll see a page with setup instructions**

---

### Step 3: Connect Local Repository to GitHub

**Copy the repository URL from GitHub:**

**HTTPS URL (recommended for beginners):**
```
https://github.com/yourusername/gentime.git
```

**SSH URL (for advanced users):**
```
git@github.com:yourusername/gentime.git
```

**In VSCode terminal, add remote:**
```bash
git remote add origin https://github.com/yourusername/gentime.git
```

**Example:**
```bash
git remote add origin https://github.com/kallesh653/gentime.git
```

**Verify remote added:**
```bash
git remote -v
```

**Expected output:**
```
origin  https://github.com/kallesh653/gentime.git (fetch)
origin  https://github.com/kallesh653/gentime.git (push)
```

**❌ Error: remote origin already exists**

**Solution:**
```bash
# Remove existing remote
git remote remove origin

# Add correct remote
git remote add origin https://github.com/yourusername/gentime.git
```

---

### Step 4: Set Default Branch Name

**Check current branch name:**
```bash
git branch
```

**Output might be:**
```
* master
```
or
```
* main
```

**If it's "master", rename to "main" (modern standard):**
```bash
git branch -M main
```

**Verify:**
```bash
git branch
```

**Expected output:**
```
* main
```

---

## Push Code to GitHub

### Step 1: First Push to GitHub

**Push your code:**
```bash
git push -u origin main
```

**What `-u origin main` means:**
- `-u` = set upstream (remember this branch for future)
- `origin` = the remote name (GitHub)
- `main` = the branch name

**You'll be prompted for GitHub credentials:**

**Option 1: GitHub Personal Access Token (Recommended)**

**GitHub removed password authentication in 2021**
**You MUST use Personal Access Token**

**Create token:**
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: `VSCode GenTime`
4. Select scopes:
   - ✅ repo (all sub-options)
   - ✅ workflow
5. Click "Generate token"
6. **COPY THE TOKEN** (you won't see it again!)
   - Example: `ghp_1234567890abcdefghijklmnopqrstuvwxyz`

**When prompted:**
```
Username for 'https://github.com': yourusername
Password for 'https://yourusername@github.com': [paste-token-here]
```

**Expected output:**
```
Enumerating objects: 250, done.
Counting objects: 100% (250/250), done.
Delta compression using up to 8 threads
Compressing objects: 100% (200/200), done.
Writing objects: 100% (250/250), 5.50 MiB | 2.50 MiB/s, done.
Total 250 (delta 50), reused 0 (delta 0)
remote: Resolving deltas: 100% (50/50), done.
To https://github.com/kallesh653/gentime.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

**Verify on GitHub:**
- Refresh your repository page
- You should see all your files!

---

### Step 2: Save GitHub Credentials (Windows)

**To avoid entering token every time:**

**Install Git Credential Manager (included in Git for Windows)**

**Configure credential helper:**
```bash
git config --global credential.helper wincred
```

**Or use Windows Credential Manager:**
```bash
git config --global credential.helper manager-core
```

**Next push won't ask for credentials**

---

### Step 3: Verify Push Success

**Check GitHub repository:**
- Go to: https://github.com/yourusername/gentime
- Should see all folders: `frontend/`, `api/`, etc.
- Should see your commit message
- Should see `.gitignore` file

**Check in VSCode:**
- Open Source Control panel (Ctrl+Shift+G)
- Should show "0 changes"
- Should show current branch: "main"

---

## Connect to VPS Server

### Step 1: Get VPS Server Details

**You need:**
- Server IP Address: `72.60.202.218`
- Username: `root` (or other user)
- Password or SSH key
- SSH Port: `22` (default)

**From Hostinger:**
1. Login to Hostinger panel
2. Go to VPS section
3. Find your server
4. Get IP, username, password

---

### Step 2: Test SSH Connection from VSCode

**In VSCode terminal:**
```bash
ssh root@72.60.202.218
```

**First time connection:**
```
The authenticity of host '72.60.202.218 (72.60.202.218)' can't be established.
ECDSA key fingerprint is SHA256:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

**Type:** `yes` and press Enter

**Enter password when prompted:**
```
root@72.60.202.218's password: [type-password]
```

**Password won't show as you type (security feature)**

**Expected output:**
```
Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-83-generic x86_64)

Last login: Mon Oct 6 12:00:00 2025 from xxx.xxx.xxx.xxx
root@vps:~#
```

**You're now connected to the server!**

**Exit server:**
```bash
exit
```

**❌ Error: Connection refused**

**Possible causes:**
- Wrong IP address
- Server is down
- Firewall blocking
- Wrong port

**Solution:**
```bash
# Check if using non-standard port
ssh -p 2222 root@72.60.202.218

# Verify server is up (ping)
ping 72.60.202.218

# Contact hosting provider if still fails
```

**❌ Error: Permission denied (publickey)**

**Cause:**
- Server requires SSH key instead of password
- Password authentication disabled

**Solution:**
```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# Press Enter for default location
# Set a passphrase (optional)

# Copy key to server (if you have password access)
ssh-copy-id root@72.60.202.218

# Or manually add key in Hostinger panel
```

---

### Step 3: Setup SSH Config (Optional - Makes Connection Easier)

**Create/edit SSH config file:**

**Windows:**
```bash
notepad ~/.ssh/config
```

**Or create in VSCode:**
```bash
code C:\Users\YourName\.ssh\config
```

**Add this content:**
```
Host gentime-server
    HostName 72.60.202.218
    User root
    Port 22
    IdentityFile ~/.ssh/id_rsa
```

**Save file**

**Now you can connect with:**
```bash
ssh gentime-server
```

**Instead of:**
```bash
ssh root@72.60.202.218
```

---

## Deploy Code to Server

### Step 1: Clone Repository on Server

**Connect to server:**
```bash
ssh root@72.60.202.218
```

**Navigate to home directory:**
```bash
cd /root
```

**Check if Git is installed:**
```bash
git --version
```

**If not installed:**
```bash
apt update
apt install git -y
```

**Clone your repository:**
```bash
git clone https://github.com/kallesh653/gentime.git
```

**If repository is private, you'll need token:**
```
Username for 'https://github.com': kallesh653
Password for 'https://kallesh653@github.com': [paste-github-token]
```

**Expected output:**
```
Cloning into 'gentime'...
remote: Enumerating objects: 250, done.
remote: Counting objects: 100% (250/250), done.
remote: Compressing objects: 100% (200/200), done.
remote: Total 250 (delta 50), reused 250 (delta 50), pack-reused 0
Receiving objects: 100% (250/250), 5.50 MiB | 10.00 MiB/s, done.
Resolving deltas: 100% (50/50), done.
```

**Verify clone:**
```bash
ls -la
```

**Should see:**
```
drwxr-xr-x  5 root root 4096 Oct  6 12:00 gentime
```

**Navigate to project:**
```bash
cd gentime
ls -la
```

**Should see your project files:**
```
drwxr-xr-x  5 root root 4096 Oct  6 12:00 api
drwxr-xr-x  5 root root 4096 Oct  6 12:00 frontend
-rw-r--r--  1 root root  100 Oct  6 12:00 .gitignore
...
```

---

### Step 2: Setup Backend on Server

**Navigate to API directory:**
```bash
cd /root/gentime/api
```

**Install Node.js (if not installed):**
```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

# Activate NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js
nvm install 22.20.0
nvm use 22.20.0
nvm alias default 22.20.0

# Verify
node --version
npm --version
```

**Install dependencies:**
```bash
npm install
```

**Expected output:**
```
added 250 packages, and audited 251 packages in 45s

50 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

**Create .env file:**
```bash
nano .env
```

**Paste your environment variables:**
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/gentime
JWT_SECRET=your-secret-key
PORT=9000
NODE_ENV=production
FRONTEND_URL=https://gentime.in
PRODUCTION_URL=https://gentime.in
```

**Save:** Ctrl+O, Enter, Ctrl+X

**Install PM2:**
```bash
npm install -g pm2
```

**Start backend with PM2:**
```bash
pm2 start server.js --name gentime-api
```

**Expected output:**
```
[PM2] Starting server.js in fork_mode (1 instance)
[PM2] Done.
┌─────┬──────────────┬─────────┬─────────┬──────┬────────┐
│ id  │ name         │ status  │ cpu     │ mem  │ uptime │
├─────┼──────────────┼─────────┼─────────┼──────┼────────┤
│ 0   │ gentime-api  │ online  │ 0%      │ 45MB │ 0s     │
└─────┴──────────────┴─────────┴─────────┴──────┴────────┘
```

**Save PM2 config:**
```bash
pm2 save
pm2 startup
```

**Test backend:**
```bash
curl http://localhost:9000/api/public-home/data
```

**Should return JSON data**

---

### Step 3: Setup Frontend on Server

**On your LOCAL machine (not server):**

**Build frontend:**
```bash
cd "d:\final project 1.1\gentime4\school management system\frontend"
npm run build
```

**Upload to server:**
```bash
scp -r dist/* root@72.60.202.218:/var/www/gentime/
```

**Expected output:**
```
index.html                100%  512    50.5KB/s   00:00
index-abc123.js           100%  2.0MB  1.5MB/s   00:01
index-xyz789.css          100%  21KB   20.5KB/s  00:00
```

---

### Step 4: Configure Nginx

**On server:**

**Create Nginx config:**
```bash
nano /etc/nginx/sites-available/gentime
```

**Paste configuration:**
```nginx
server {
    listen 80;
    server_name gentime.in www.gentime.in;

    root /var/www/gentime;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

server {
    listen 80;
    server_name api.gentime.in;

    client_max_body_size 100M;

    location / {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

**Save and exit**

**Enable site:**
```bash
ln -s /etc/nginx/sites-available/gentime /etc/nginx/sites-enabled/
```

**Test config:**
```bash
nginx -t
```

**Reload Nginx:**
```bash
systemctl reload nginx
```

---

## All Possible Errors & Solutions

### Git Errors

#### Error 1: fatal: not a git repository

**Error message:**
```
fatal: not a git repository (or any of the parent directories): .git
```

**Cause:** Git not initialized in project

**Solution:**
```bash
cd "d:\final project 1.1\gentime4\school management system"
git init
```

---

#### Error 2: failed to push some refs

**Error message:**
```
! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'https://github.com/user/repo.git'
hint: Updates were rejected because the remote contains work that you do
hint: not have locally. This is usually caused by another repository pushing
hint: to the same ref. You may want to first integrate the remote changes
hint: (e.g., 'git pull ...') before pushing again.
```

**Cause:** Remote repository has commits you don't have locally

**Solution 1 (Safe - merge changes):**
```bash
git pull origin main --allow-unrelated-histories
# Resolve any conflicts
git push origin main
```

**Solution 2 (Dangerous - overwrite remote):**
```bash
git push --force origin main
```
⚠️ **Warning:** This deletes remote commits!

---

#### Error 3: Authentication failed

**Error message:**
```
remote: Support for password authentication was removed on August 13, 2021.
remote: Please use a personal access token instead.
fatal: Authentication failed for 'https://github.com/user/repo.git/'
```

**Cause:** GitHub no longer accepts passwords

**Solution:**
```bash
# 1. Create Personal Access Token (see Step 1 in Push section)
# 2. Use token as password

# Or use credential manager
git config --global credential.helper manager-core

# Next push will prompt for credentials
# Enter token as password
```

---

#### Error 4: large files

**Error message:**
```
remote: error: File large-file.mp4 is 150.00 MB; this exceeds GitHub's file size limit of 100.00 MB
```

**Cause:** File larger than 100MB

**Solution:**
```bash
# Add file to .gitignore
echo "large-file.mp4" >> .gitignore

# Remove from Git (keep local file)
git rm --cached large-file.mp4

# Commit
git add .gitignore
git commit -m "Remove large file from Git"
git push origin main

# Or use Git LFS for large files
git lfs install
git lfs track "*.mp4"
git add .gitattributes
git commit -m "Add Git LFS"
```

---

#### Error 5: CRLF/LF warning

**Warning message:**
```
warning: LF will be replaced by CRLF in file.txt
The file will have its original line endings in your working directory
```

**Cause:** Line ending differences (Windows vs Unix)

**Not critical, but to fix:**
```bash
# Windows users
git config --global core.autocrlf true

# Mac/Linux users
git config --global core.autocrlf input

# Ignore the warning
git config --global core.autocrlf false
```

---

#### Error 6: Permission denied (publickey)

**Error message:**
```
Permission denied (publickey).
fatal: Could not read from remote repository.
```

**Cause:** SSH key not configured

**Solution:**
```bash
# Generate SSH key
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# Copy public key
cat ~/.ssh/id_rsa.pub

# Add to GitHub:
# 1. Go to GitHub Settings → SSH and GPG keys
# 2. Click "New SSH key"
# 3. Paste your public key
# 4. Save

# Test connection
ssh -T git@github.com

# Change remote to SSH
git remote set-url origin git@github.com:username/repo.git
```

---

### Server Connection Errors

#### Error 7: Connection refused

**Error message:**
```
ssh: connect to host 72.60.202.218 port 22: Connection refused
```

**Cause:** Server down, firewall, wrong IP

**Solution:**
```bash
# Test ping
ping 72.60.202.218

# Try different port
ssh -p 2222 root@72.60.202.218

# Check server status in hosting panel
# Contact hosting support
```

---

#### Error 8: Connection timeout

**Error message:**
```
ssh: connect to host 72.60.202.218 port 22: Connection timed out
```

**Cause:** Firewall, network issue

**Solution:**
```bash
# Check your internet connection
ping google.com

# Try from different network
# Check firewall settings
# Contact ISP or hosting provider
```

---

#### Error 9: Too many authentication failures

**Error message:**
```
Received disconnect from 72.60.202.218 port 22:2: Too many authentication failures
```

**Cause:** Too many SSH keys tried

**Solution:**
```bash
# Specify identity file
ssh -i ~/.ssh/id_rsa root@72.60.202.218

# Or disable other keys
ssh -o IdentitiesOnly=yes root@72.60.202.218

# Or edit SSH config
nano ~/.ssh/config
# Add: IdentitiesOnly yes
```

---

### Deployment Errors

#### Error 10: npm install fails

**Error message:**
```
npm ERR! code ENOENT
npm ERR! syscall open
npm ERR! path /root/gentime/api/package.json
npm ERR! errno -2
npm ERR! enoent ENOENT: no such file or directory
```

**Cause:** Wrong directory or package.json missing

**Solution:**
```bash
# Check current directory
pwd

# Navigate to correct directory
cd /root/gentime/api

# Verify package.json exists
ls -la package.json

# Try again
npm install
```

---

#### Error 11: Port already in use

**Error message:**
```
Error: listen EADDRINUSE: address already in use :::9000
```

**Cause:** Another process using port 9000

**Solution:**
```bash
# Find process using port
netstat -tulpn | grep 9000
# or
lsof -i :9000

# Kill process
kill -9 [PID]

# Or use different port in .env
nano .env
# Change: PORT=9001

# Restart app
pm2 restart gentime-api
```

---

#### Error 12: MongoDB connection failed

**Error message:**
```
MongooseError: Could not connect to any servers in your MongoDB Atlas cluster
```

**Cause:** Wrong connection string, IP not whitelisted

**Solution:**
```bash
# 1. Check .env file
cat /root/gentime/api/.env

# 2. Go to MongoDB Atlas
# Network Access → Add IP → Add VPS IP (72.60.202.218)

# 3. Verify connection string
# Should be: mongodb+srv://user:password@cluster.mongodb.net/dbname

# 4. Test connection
mongosh "your-connection-string"

# 5. Restart app
pm2 restart gentime-api
```

---

#### Error 13: Nginx 502 Bad Gateway

**Error message:**
```
502 Bad Gateway
nginx/1.18.0 (Ubuntu)
```

**Cause:** Backend not running

**Solution:**
```bash
# Check PM2 status
pm2 status

# If offline, start it
pm2 start server.js --name gentime-api

# Check backend logs
pm2 logs gentime-api

# Test backend directly
curl http://localhost:9000/api/public-home/data

# Check Nginx config
nginx -t

# Reload Nginx
systemctl reload nginx
```

---

#### Error 14: Cannot find module

**Error message:**
```
Error: Cannot find module 'express'
```

**Cause:** Dependencies not installed

**Solution:**
```bash
# Navigate to project
cd /root/gentime/api

# Install dependencies
npm install

# If persists, clear cache
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Restart app
pm2 restart gentime-api
```

---

#### Error 15: Permission denied

**Error message:**
```
EACCES: permission denied, mkdir '/var/www/gentime'
```

**Cause:** Insufficient permissions

**Solution:**
```bash
# Create directory with proper permissions
sudo mkdir -p /var/www/gentime

# Set ownership
sudo chown -R www-data:www-data /var/www/gentime

# Set permissions
sudo chmod -R 755 /var/www/gentime

# Or run as root
sudo su
mkdir -p /var/www/gentime
```

---

## Daily Workflow After Setup

### When You Edit Code in VSCode

**1. Make your changes in VSCode**

**2. Save files (Ctrl+S)**

**3. Stage changes:**
```bash
git add .
```

**4. Commit changes:**
```bash
git commit -m "Describe what you changed"
```

**Example:**
```bash
git commit -m "Add user profile page and update navigation"
```

**5. Push to GitHub:**
```bash
git push origin main
```

**6. Deploy to server:**

**Backend deployment:**
```bash
ssh root@72.60.202.218 "cd /root/gentime/api && git pull origin main && PATH=/root/.nvm/versions/node/v22.20.0/bin:\$PATH pm2 restart gentime-api"
```

**Frontend deployment:**
```bash
# Build locally
cd "d:\final project 1.1\gentime4\school management system\frontend"
npm run build

# Upload
scp -r dist/assets/index-*.js root@72.60.202.218:/var/www/gentime/assets/

# Update HTML
ssh root@72.60.202.218 "cd /var/www/gentime && sed -i 's/index-[^.]*\.js/index-NEWHASH.js/g' index.html"
```

**7. Test in browser:**
- Visit: https://gentime.in
- Hard refresh: Ctrl+Shift+R

---

### Quick Commands Summary

**Check status:**
```bash
git status
```

**Stage all changes:**
```bash
git add .
```

**Commit:**
```bash
git commit -m "Your message"
```

**Push:**
```bash
git push origin main
```

**Pull latest:**
```bash
git pull origin main
```

**View history:**
```bash
git log --oneline -10
```

---

## Troubleshooting Common Issues

### Issue 1: VSCode not detecting Git

**Solution:**
```bash
# Restart VSCode
# Install Git for Windows
# Add Git to PATH
# Restart computer
```

---

### Issue 2: Can't see Source Control panel

**Solution:**
```bash
# Press Ctrl+Shift+G
# Or View → Source Control
# Click Source Control icon in sidebar
```

---

### Issue 3: GitHub asking for password repeatedly

**Solution:**
```bash
# Use credential manager
git config --global credential.helper manager-core

# Or use SSH instead of HTTPS
git remote set-url origin git@github.com:username/repo.git
```

---

### Issue 4: Changes not showing on server

**Solution:**
```bash
# Check if you pushed to GitHub
git log origin/main

# Pull on server
ssh root@72.60.202.218 "cd /root/gentime && git pull origin main"

# Restart services
ssh root@72.60.202.218 "PATH=/root/.nvm/versions/node/v22.20.0/bin:\$PATH pm2 restart all"

# Clear browser cache (Ctrl+Shift+R)
```

---

### Issue 5: Merge conflicts

**When you see:**
```
CONFLICT (content): Merge conflict in file.js
Automatic merge failed; fix conflicts and then commit the result.
```

**Solution:**
```bash
# Open conflicted file in VSCode
# Look for markers:
<<<<<<< HEAD
Your changes
=======
Their changes
>>>>>>> branch-name

# Choose which to keep or combine both
# Remove conflict markers
# Save file

# Stage resolved file
git add file.js

# Commit
git commit -m "Resolve merge conflict"

# Push
git push origin main
```

---

## Complete Workflow Diagram

```
┌─────────────────────────────────────────────────────┐
│ 1. Edit code in VSCode                              │
│    ├─ Make changes                                  │
│    ├─ Test locally (npm run dev)                    │
│    └─ Save files (Ctrl+S)                          │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ 2. Commit to local Git                              │
│    ├─ git add .                                     │
│    ├─ git commit -m "message"                       │
│    └─ git log (verify commit)                       │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ 3. Push to GitHub                                   │
│    ├─ git push origin main                          │
│    ├─ Enter credentials (if needed)                 │
│    └─ Verify on GitHub website                      │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ 4. Deploy to VPS Server                             │
│    ├─ SSH to server                                 │
│    ├─ git pull origin main                          │
│    ├─ npm install (if package.json changed)         │
│    ├─ pm2 restart gentime-api                       │
│    └─ Upload frontend build (if frontend changed)   │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ 5. Test in Production                               │
│    ├─ Visit https://gentime.in                      │
│    ├─ Hard refresh (Ctrl+Shift+R)                  │
│    ├─ Test all features                             │
│    └─ Check logs: pm2 logs gentime-api              │
└─────────────────────────────────────────────────────┘
```

---

## VSCode Extensions for Better Git Experience

### Recommended Extensions

**1. GitLens**
- Enhanced Git features
- Blame annotations
- Commit history
- Install: Search "GitLens" in Extensions (Ctrl+Shift+X)

**2. Git Graph**
- Visual Git history
- Branch visualization
- Install: Search "Git Graph" in Extensions

**3. GitHub Pull Requests**
- Manage PRs from VSCode
- Install: Search "GitHub Pull Requests"

**4. Remote - SSH**
- Edit server files directly
- Install: Search "Remote - SSH"

---

## Final Checklist

### Initial Setup (One Time)
- ✅ Git installed and configured
- ✅ GitHub account created
- ✅ Repository created on GitHub
- ✅ .gitignore file created
- ✅ Local repo connected to GitHub
- ✅ First commit and push successful
- ✅ VPS server accessible via SSH
- ✅ Node.js and PM2 installed on server
- ✅ Repository cloned on server
- ✅ Backend running with PM2
- ✅ Nginx configured
- ✅ Frontend deployed

### Every Code Change
- ✅ Test locally
- ✅ git add .
- ✅ git commit -m "message"
- ✅ git push origin main
- ✅ Deploy to server
- ✅ Test in production

---

## Quick Reference Card

```
╔════════════════════════════════════════════════════╗
║         QUICK GIT COMMANDS REFERENCE               ║
╠════════════════════════════════════════════════════╣
║ Check status          │ git status                 ║
║ Stage all files       │ git add .                  ║
║ Commit changes        │ git commit -m "msg"        ║
║ Push to GitHub        │ git push origin main       ║
║ Pull from GitHub      │ git pull origin main       ║
║ View history          │ git log --oneline          ║
║ Create branch         │ git checkout -b name       ║
║ Switch branch         │ git checkout name          ║
║ Undo last commit      │ git reset --soft HEAD~1    ║
║ Discard changes       │ git checkout -- file       ║
╠════════════════════════════════════════════════════╣
║         SERVER CONNECTION COMMANDS                 ║
╠════════════════════════════════════════════════════╣
║ Connect to server     │ ssh root@72.60.202.218     ║
║ Upload file           │ scp file user@ip:/path     ║
║ Pull latest code      │ git pull origin main       ║
║ Restart backend       │ pm2 restart gentime-api    ║
║ View logs             │ pm2 logs gentime-api       ║
║ Check PM2 status      │ pm2 status                 ║
║ Reload Nginx          │ systemctl reload nginx     ║
╚════════════════════════════════════════════════════╝
```

---

## Getting Help

**Git Issues:**
- Official docs: https://git-scm.com/doc
- GitHub docs: https://docs.github.com

**Server Issues:**
- Hostinger support: https://www.hostinger.com/tutorials
- PM2 docs: https://pm2.keymetrics.io/docs/
- Nginx docs: https://nginx.org/en/docs/

**VSCode Issues:**
- VSCode docs: https://code.visualstudio.com/docs

---

**Guide Version:** 1.0
**Last Updated:** October 2025
**For Project:** GenTime School Management System

---

**Remember:**
- Always test locally before pushing
- Commit frequently with clear messages
- Pull before starting new work
- Never commit .env files
- Keep backups of important files
- Read error messages carefully

**Happy Coding! 🚀**
