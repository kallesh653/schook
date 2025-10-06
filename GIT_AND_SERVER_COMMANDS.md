# Complete Git and Server Commands Guide

This comprehensive guide covers all Git commands and VPS server commands used in the GenTime School Management System project.

---

## Table of Contents
1. [Git Commands - Development Workflow](#git-commands---development-workflow)
2. [Git Commands - Advanced Operations](#git-commands---advanced-operations)
3. [VPS Server Commands - Deployment](#vps-server-commands---deployment)
4. [Nginx Server Commands](#nginx-server-commands)
5. [PM2 Process Manager Commands](#pm2-process-manager-commands)
6. [MongoDB Commands](#mongodb-commands)
7. [Node.js & NPM Commands](#nodejs--npm-commands)
8. [System Administration Commands](#system-administration-commands)
9. [SSL Certificate Commands](#ssl-certificate-commands)
10. [Troubleshooting Commands](#troubleshooting-commands)

---

## Git Commands - Development Workflow

### 1. **Check Repository Status**
```bash
git status
```
**What it does:**
- Shows the current branch name
- Lists modified files (red = not staged, green = staged for commit)
- Shows untracked files (new files not yet added to git)
- Displays if you're ahead/behind the remote repository

**When to use:** Before every commit to see what changes you've made

**Example output:**
```
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  modified:   frontend/src/App.jsx

Untracked files:
  README.md
```

---

### 2. **View Detailed Changes**
```bash
git diff
```
**What it does:**
- Shows line-by-line changes in modified files
- Red lines (with -) = deleted/old content
- Green lines (with +) = added/new content
- Only shows unstaged changes

**View staged changes:**
```bash
git diff --staged
```

**View changes in a specific file:**
```bash
git diff frontend/src/App.jsx
```

---

### 3. **Add Files to Staging Area**

**Add a specific file:**
```bash
git add frontend/src/App.jsx
```

**Add all files in a directory:**
```bash
git add frontend/src/
```

**Add all changed files:**
```bash
git add .
```
or
```bash
git add -A
```

**What it does:**
- Moves files from "working directory" to "staging area"
- Staged files will be included in the next commit
- Use this before `git commit`

**Difference between `.` and `-A`:**
- `git add .` - Adds all files in current directory and subdirectories
- `git add -A` - Adds all files in entire repository (safer option)

---

### 4. **Commit Changes**

**Basic commit:**
```bash
git commit -m "Your commit message here"
```

**Commit with multi-line message (recommended):**
```bash
git commit -m "$(cat <<'EOF'
Add user authentication feature

- Implement JWT token-based authentication
- Add login and registration pages
- Create protected routes for authenticated users
- Add password hashing with bcrypt

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

**What it does:**
- Creates a snapshot of staged changes
- Saves changes to local repository (NOT remote yet)
- Generates a unique commit hash (e.g., `a3f2b1c`)

**Good commit message rules:**
- First line: Brief summary (50 chars max)
- Body: Detailed explanation of what changed and why
- Use present tense: "Add feature" not "Added feature"

**Amend last commit (use carefully):**
```bash
git commit --amend
```
⚠️ **Warning:** Only use if you haven't pushed to remote yet!

---

### 5. **Push Changes to Remote Repository**

**Push to main branch:**
```bash
git push origin main
```

**Force push (dangerous - use only when necessary):**
```bash
git push --force origin main
```
⚠️ **Warning:** This overwrites remote history. Never use on shared branches!

**What it does:**
- Uploads your local commits to GitHub/remote repository
- Updates the remote branch with your changes
- Other team members can now pull your changes

**Common errors:**
- "Updates were rejected" - Someone else pushed first, you need to pull first
- "Authentication failed" - Check your credentials/token

---

### 6. **Pull Changes from Remote**

**Pull latest changes:**
```bash
git pull origin main
```

**What it does:**
- Fetches changes from remote repository
- Merges them into your current branch
- Equivalent to `git fetch` + `git merge`

**If there are conflicts:**
1. Git will mark conflicted files
2. Open files and resolve conflicts (between `<<<<<<<` and `>>>>>>>`)
3. Stage resolved files: `git add filename`
4. Commit: `git commit -m "Resolve merge conflicts"`

---

### 7. **View Commit History**

**View recent commits:**
```bash
git log
```

**Compact one-line view:**
```bash
git log --oneline
```

**View last 5 commits:**
```bash
git log --oneline -5
```

**View commits with file changes:**
```bash
git log --stat
```

**View commits for a specific file:**
```bash
git log frontend/src/App.jsx
```

**Example output:**
```
a3f2b1c Add user authentication
b5e8d4f Fix login bug
c9a1f3e Update README
```

---

### 8. **Create and Manage Branches**

**View all branches:**
```bash
git branch
```
(* indicates current branch)

**Create new branch:**
```bash
git branch feature-name
```

**Switch to branch:**
```bash
git checkout feature-name
```

**Create and switch in one command:**
```bash
git checkout -b feature-name
```

**Delete branch:**
```bash
git branch -d feature-name
```

**Force delete (if unmerged):**
```bash
git branch -D feature-name
```

**What branches are for:**
- Develop features without affecting main code
- Test changes in isolation
- Collaborate without conflicts

---

### 9. **Merge Branches**

**Merge feature branch into current branch:**
```bash
git checkout main
git merge feature-name
```

**What it does:**
- Combines changes from two branches
- Creates a merge commit
- May cause conflicts if same lines were modified

---

### 10. **Stash Changes (Temporary Save)**

**Save current changes without committing:**
```bash
git stash
```

**View stashed changes:**
```bash
git stash list
```

**Apply last stash:**
```bash
git stash pop
```

**Apply specific stash:**
```bash
git stash apply stash@{0}
```

**What it's for:**
- Quickly switch branches without committing
- Save work-in-progress changes
- Clean working directory temporarily

---

## Git Commands - Advanced Operations

### 11. **Reset Commands (DANGEROUS)**

**Unstage files (keep changes):**
```bash
git reset HEAD filename
```

**Undo last commit (keep changes):**
```bash
git reset --soft HEAD~1
```

**Undo last commit and unstage:**
```bash
git reset HEAD~1
```

**Completely delete last commit:**
```bash
git reset --hard HEAD~1
```
⚠️ **WARNING:** This PERMANENTLY deletes changes!

**Reset to specific commit:**
```bash
git reset --hard a3f2b1c
```

**Force sync with remote (nuclear option):**
```bash
git fetch origin
git reset --hard origin/main
```
⚠️ **WARNING:** Deletes ALL local changes!

---

### 12. **Revert Commits (Safe Alternative to Reset)**

**Undo a commit by creating a new commit:**
```bash
git revert a3f2b1c
```

**What's the difference:**
- `reset` - Deletes commit history (dangerous on shared repos)
- `revert` - Creates new commit that undoes changes (safe)

---

### 13. **View Remote Repository Info**

**View remote URLs:**
```bash
git remote -v
```

**Add remote repository:**
```bash
git remote add origin https://github.com/username/repo.git
```

**Change remote URL:**
```bash
git remote set-url origin https://github.com/username/new-repo.git
```

---

### 14. **Tagging Releases**

**Create tag:**
```bash
git tag v1.0.0
```

**Create annotated tag:**
```bash
git tag -a v1.0.0 -m "Version 1.0.0 release"
```

**Push tags:**
```bash
git push origin v1.0.0
```

**Push all tags:**
```bash
git push origin --tags
```

**List tags:**
```bash
git tag
```

---

### 15. **Cherry-Pick (Apply Specific Commit)**

**Apply a commit from another branch:**
```bash
git cherry-pick a3f2b1c
```

**What it's for:**
- Apply bug fix from one branch to another
- Move specific commits between branches

---

### 16. **Clean Untracked Files**

**Preview what will be deleted:**
```bash
git clean -n
```

**Delete untracked files:**
```bash
git clean -f
```

**Delete untracked files and directories:**
```bash
git clean -fd
```

---

## VPS Server Commands - Deployment

### 17. **SSH Connection**

**Connect to VPS:**
```bash
ssh root@72.60.202.218
```

**Connect with specific SSH key:**
```bash
ssh -i ~/.ssh/id_rsa root@72.60.202.218
```

**What it does:**
- Creates secure shell connection to remote server
- Allows you to execute commands on VPS
- Uses port 22 by default

**First time connection:**
- Will ask to verify host fingerprint
- Type "yes" to continue
- Adds server to known_hosts file

**Exit SSH session:**
```bash
exit
```

---

### 18. **File Transfer (SCP)**

**Copy file from local to VPS:**
```bash
scp file.txt root@72.60.202.218:/root/destination/
```

**Copy directory recursively:**
```bash
scp -r frontend/dist/ root@72.60.202.218:/var/www/gentime/
```

**Copy from VPS to local:**
```bash
scp root@72.60.202.218:/root/file.txt ./local-folder/
```

**What it does:**
- Securely copies files over SSH
- `-r` flag for recursive (directories)
- Preserves permissions and timestamps

---

### 19. **Deploy Frontend Build**

**Complete deployment process:**
```bash
# 1. Build frontend locally
cd "d:\final project 1.1\gentime4\school management system\frontend"
npm run build

# 2. Copy build files to VPS
scp -r dist/assets/index-HASH.js root@72.60.202.218:/var/www/gentime/assets/

# 3. Update index.html on VPS
ssh root@72.60.202.218 "cd /var/www/gentime && sed -i 's/index-[^.]*\.js/index-HASH.js/g' index.html"

# 4. Verify update
ssh root@72.60.202.218 "cat /var/www/gentime/index.html | grep 'index-'"
```

**What each step does:**
1. `npm run build` - Creates production-optimized bundle
2. `scp -r` - Copies JavaScript bundle to server
3. `sed -i` - Updates HTML to reference new bundle
4. `cat | grep` - Confirms update was successful

---

### 20. **Deploy Backend Changes**

**Update backend on VPS:**
```bash
# Connect to VPS and execute commands
ssh root@72.60.202.218 "
  cd /root/gentime/api &&
  git pull origin main &&
  PATH=/root/.nvm/versions/node/v22.20.0/bin:\$PATH npm install &&
  PATH=/root/.nvm/versions/node/v22.20.0/bin:\$PATH pm2 restart gentime-api
"
```

**Step-by-step breakdown:**
1. `cd /root/gentime/api` - Navigate to backend directory
2. `git pull origin main` - Download latest code from GitHub
3. `npm install` - Install any new dependencies
4. `pm2 restart gentime-api` - Restart Node.js application

**Why set PATH:**
- VPS uses nvm (Node Version Manager)
- Node.js is not in system PATH by default
- Must specify full path to node/npm/pm2

---

## Nginx Server Commands

### 21. **Nginx Configuration Management**

**Test configuration syntax:**
```bash
nginx -t
```
**What it does:**
- Validates nginx config files
- Checks for syntax errors
- Must pass before reload/restart

**Reload configuration (no downtime):**
```bash
systemctl reload nginx
```
or
```bash
nginx -s reload
```

**Restart Nginx:**
```bash
systemctl restart nginx
```

**Stop Nginx:**
```bash
systemctl stop nginx
```

**Start Nginx:**
```bash
systemctl start nginx
```

**Check Nginx status:**
```bash
systemctl status nginx
```

**Enable Nginx on boot:**
```bash
systemctl enable nginx
```

---

### 22. **View Nginx Logs**

**View error log:**
```bash
tail -f /var/log/nginx/error.log
```

**View access log:**
```bash
tail -f /var/log/nginx/access.log
```

**View last 100 lines:**
```bash
tail -100 /var/log/nginx/error.log
```

**What `-f` does:**
- "Follow" mode - shows new log entries in real-time
- Press Ctrl+C to exit

---

### 23. **Edit Nginx Configuration**

**Main configuration file:**
```bash
nano /etc/nginx/nginx.conf
```

**Site-specific configuration:**
```bash
nano /etc/nginx/sites-available/gentime
```

**After editing:**
```bash
nginx -t                    # Test configuration
systemctl reload nginx      # Apply changes
```

**Common configuration options:**
```nginx
# Increase upload size
client_max_body_size 100M;

# Increase timeout
client_body_timeout 300s;
proxy_read_timeout 300s;

# Enable gzip compression
gzip on;
gzip_types text/plain text/css application/json;
```

---

## PM2 Process Manager Commands

### 24. **PM2 Application Management**

**Start application:**
```bash
pm2 start server.js --name gentime-api
```

**Restart application:**
```bash
pm2 restart gentime-api
```

**Stop application:**
```bash
pm2 stop gentime-api
```

**Delete application from PM2:**
```bash
pm2 delete gentime-api
```

**Restart all applications:**
```bash
pm2 restart all
```

---

### 25. **PM2 Monitoring**

**View all running apps:**
```bash
pm2 list
```
or
```bash
pm2 status
```

**View real-time logs:**
```bash
pm2 logs gentime-api
```

**View last 100 log lines:**
```bash
pm2 logs gentime-api --lines 100
```

**View only errors:**
```bash
pm2 logs gentime-api --err
```

**View logs without streaming:**
```bash
pm2 logs gentime-api --nostream
```

**Monitor CPU and memory:**
```bash
pm2 monit
```

---

### 26. **PM2 Advanced Features**

**View detailed info:**
```bash
pm2 describe gentime-api
```

**Flush logs:**
```bash
pm2 flush
```

**Save PM2 configuration:**
```bash
pm2 save
```

**Resurrect saved apps on reboot:**
```bash
pm2 startup
```

**Update PM2:**
```bash
pm2 update
```

---

## MongoDB Commands

### 27. **MongoDB Connection (if using local DB)**

**Connect to MongoDB:**
```bash
mongosh
```

**Connect with authentication:**
```bash
mongosh -u username -p password
```

**Connect to specific database:**
```bash
mongosh mongodb://localhost:27017/gentime
```

---

### 28. **MongoDB Database Operations**

**Inside mongosh:**

**Show databases:**
```javascript
show dbs
```

**Switch to database:**
```javascript
use gentime
```

**Show collections:**
```javascript
show collections
```

**View collection data:**
```javascript
db.students.find().pretty()
```

**Count documents:**
```javascript
db.students.countDocuments()
```

**Delete collection:**
```javascript
db.students.drop()
```

**Exit mongosh:**
```javascript
exit
```

---

## Node.js & NPM Commands

### 29. **NPM Package Management**

**Install dependencies:**
```bash
npm install
```

**Install specific package:**
```bash
npm install express
```

**Install as dev dependency:**
```bash
npm install --save-dev nodemon
```

**Install globally:**
```bash
npm install -g pm2
```

**Update packages:**
```bash
npm update
```

**Check for outdated packages:**
```bash
npm outdated
```

**Remove package:**
```bash
npm uninstall package-name
```

---

### 30. **NPM Scripts**

**Run development server:**
```bash
npm run dev
```

**Build for production:**
```bash
npm run build
```

**Start production server:**
```bash
npm start
```

**Run tests:**
```bash
npm test
```

**View all available scripts:**
```bash
npm run
```

---

### 31. **Node Version Management (NVM)**

**List installed versions:**
```bash
nvm list
```

**Install Node version:**
```bash
nvm install 22.20.0
```

**Use specific version:**
```bash
nvm use 22.20.0
```

**Set default version:**
```bash
nvm alias default 22.20.0
```

**Check current version:**
```bash
node --version
npm --version
```

---

## System Administration Commands

### 32. **File and Directory Operations**

**List files:**
```bash
ls
ls -la                    # Detailed view with hidden files
ls -lh                    # Human-readable file sizes
```

**Change directory:**
```bash
cd /var/www/gentime
cd ..                     # Go up one level
cd ~                      # Go to home directory
cd -                      # Go to previous directory
```

**Create directory:**
```bash
mkdir folder-name
mkdir -p path/to/folder   # Create parent directories
```

**Remove file:**
```bash
rm file.txt
```

**Remove directory:**
```bash
rm -r folder-name         # Recursive
rm -rf folder-name        # Force recursive (dangerous!)
```

**Copy file:**
```bash
cp source.txt destination.txt
cp -r folder1/ folder2/   # Copy directory
```

**Move/Rename:**
```bash
mv old-name.txt new-name.txt
mv file.txt /new/path/
```

---

### 33. **File Viewing and Editing**

**View file contents:**
```bash
cat file.txt              # Entire file
head file.txt             # First 10 lines
tail file.txt             # Last 10 lines
tail -n 50 file.txt       # Last 50 lines
tail -f file.txt          # Follow mode (real-time)
```

**Edit file:**
```bash
nano file.txt             # Simple editor
vim file.txt              # Advanced editor
```

**Nano shortcuts:**
- `Ctrl+O` - Save
- `Ctrl+X` - Exit
- `Ctrl+W` - Search
- `Ctrl+K` - Cut line

**Search in files:**
```bash
grep "search-term" file.txt
grep -r "search-term" /path/to/dir/    # Recursive
grep -i "search-term" file.txt         # Case-insensitive
```

---

### 34. **File Permissions**

**View permissions:**
```bash
ls -l
```

**Change permissions:**
```bash
chmod 755 file.txt
chmod +x script.sh        # Make executable
chmod -R 755 folder/      # Recursive
```

**Permission numbers:**
- 7 = read+write+execute (rwx)
- 6 = read+write (rw-)
- 5 = read+execute (r-x)
- 4 = read only (r--)

**Change owner:**
```bash
chown user:group file.txt
chown -R www-data:www-data /var/www/
```

---

### 35. **System Information**

**Disk space:**
```bash
df -h                     # All drives
du -sh /var/www/          # Specific folder size
du -sh *                  # Size of each item in current dir
```

**Memory usage:**
```bash
free -h
```

**CPU and process info:**
```bash
top                       # Interactive (press 'q' to quit)
htop                      # Better version (if installed)
ps aux                    # All running processes
```

**System info:**
```bash
uname -a                  # Kernel info
lsb_release -a            # OS version
hostname -I               # IP address
```

---

### 36. **Process Management**

**Find process:**
```bash
ps aux | grep node
```

**Kill process by PID:**
```bash
kill 1234
kill -9 1234              # Force kill
```

**Kill by name:**
```bash
pkill node
killall node
```

**Check port usage:**
```bash
netstat -tulpn | grep 9000
lsof -i :9000
```

---

### 37. **Networking Commands**

**Test connection:**
```bash
ping google.com
ping -c 4 google.com      # Send only 4 packets
```

**DNS lookup:**
```bash
nslookup gentime.in
dig gentime.in
```

**View open ports:**
```bash
netstat -tulpn
ss -tulpn                 # Newer alternative
```

**Download file:**
```bash
wget https://example.com/file.zip
curl -O https://example.com/file.zip
```

**Test API endpoint:**
```bash
curl https://api.gentime.in/api/public-home/data
curl -X POST https://api.gentime.in/api/endpoint -H "Content-Type: application/json" -d '{"key":"value"}'
```

---

## SSL Certificate Commands

### 38. **Certbot (Let's Encrypt)**

**Install certificate:**
```bash
certbot --nginx -d gentime.in -d www.gentime.in -d api.gentime.in
```

**Renew certificates:**
```bash
certbot renew
```

**Test renewal (dry run):**
```bash
certbot renew --dry-run
```

**List certificates:**
```bash
certbot certificates
```

**Delete certificate:**
```bash
certbot delete --cert-name gentime.in
```

**Auto-renewal with cron:**
```bash
crontab -e
# Add line:
0 0 * * * certbot renew --quiet
```

---

## Troubleshooting Commands

### 39. **Check Service Status**

**Check if service is running:**
```bash
systemctl status nginx
systemctl status mongod
systemctl is-active nginx
```

**Enable service on boot:**
```bash
systemctl enable nginx
```

**View service logs:**
```bash
journalctl -u nginx
journalctl -u nginx -f           # Follow mode
journalctl -u nginx --since today
```

---

### 40. **Firewall Commands**

**Check firewall status:**
```bash
ufw status
```

**Allow port:**
```bash
ufw allow 80
ufw allow 443
ufw allow 22
```

**Deny port:**
```bash
ufw deny 9000
```

**Enable firewall:**
```bash
ufw enable
```

---

### 41. **Common Troubleshooting Scenarios**

**Website not loading:**
```bash
# 1. Check Nginx status
systemctl status nginx

# 2. Check Nginx configuration
nginx -t

# 3. Check Nginx error logs
tail -50 /var/log/nginx/error.log

# 4. Check if Nginx is listening
netstat -tulpn | grep 80
```

**API not responding:**
```bash
# 1. Check PM2 status
pm2 status

# 2. Check API logs
pm2 logs gentime-api --lines 50

# 3. Check if port is in use
lsof -i :9000

# 4. Restart API
pm2 restart gentime-api
```

**Git push rejected:**
```bash
# 1. Check git status
git status

# 2. Pull latest changes
git pull origin main

# 3. If conflicts, view them
git diff

# 4. After resolving, push
git push origin main
```

**Build errors:**
```bash
# 1. Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# 2. Clear npm cache
npm cache clean --force

# 3. Check Node version
node --version

# 4. Try building again
npm run build
```

---

## Quick Reference Cheat Sheet

### Daily Git Workflow
```bash
git status                          # Check changes
git add .                           # Stage all changes
git commit -m "message"             # Commit changes
git push origin main                # Push to GitHub
```

### Deploy Frontend
```bash
npm run build                       # Build locally
scp -r dist/assets/* root@IP:/var/www/gentime/assets/
ssh root@IP "cd /var/www/gentime && sed -i 's/index-[^.]*\.js/index-NEWHASH.js/g' index.html"
```

### Deploy Backend
```bash
ssh root@IP "cd /root/gentime/api && git pull && PATH=/root/.nvm/versions/node/v22.20.0/bin:\$PATH pm2 restart gentime-api"
```

### Check Logs
```bash
pm2 logs gentime-api                # API logs
tail -f /var/log/nginx/error.log    # Nginx errors
```

### Restart Services
```bash
pm2 restart gentime-api             # Restart API
systemctl reload nginx              # Reload Nginx
```

---

## Best Practices

### Git Best Practices
1. ✅ Commit frequently with clear messages
2. ✅ Pull before starting work
3. ✅ Test code before committing
4. ✅ Never commit sensitive data (.env files)
5. ✅ Use `.gitignore` for build files
6. ❌ Never force push to shared branches
7. ❌ Never commit directly to main (use feature branches)

### VPS Security Best Practices
1. ✅ Use SSH keys instead of passwords
2. ✅ Keep software updated: `apt update && apt upgrade`
3. ✅ Use firewall (ufw)
4. ✅ Regular backups
5. ✅ Monitor logs regularly
6. ❌ Never run services as root user
7. ❌ Never disable firewall

### Deployment Best Practices
1. ✅ Test locally before deploying
2. ✅ Keep backups before major updates
3. ✅ Use PM2 for Node.js processes
4. ✅ Monitor logs after deployment
5. ✅ Use environment variables for secrets
6. ❌ Never deploy broken code
7. ❌ Never modify production DB directly without backup

---

## Emergency Recovery Commands

### If website is down:
```bash
# Restart everything
ssh root@72.60.202.218 "
  systemctl restart nginx &&
  PATH=/root/.nvm/versions/node/v22.20.0/bin:\$PATH pm2 restart all
"
```

### If git is broken:
```bash
# Nuclear option - reset to remote
git fetch origin
git reset --hard origin/main
```

### If VPS is out of space:
```bash
# Find large files
du -sh /* | sort -h
# Clean PM2 logs
pm2 flush
# Clean old packages
apt autoremove
```

---

## Contact and Support

For issues with:
- **Git**: https://git-scm.com/docs
- **Nginx**: https://nginx.org/en/docs/
- **PM2**: https://pm2.keymetrics.io/docs/
- **Node.js**: https://nodejs.org/docs/

**GenTime Project:**
- Repository: https://github.com/kallesh653/gentime
- Author: Kallesh SK
- Email: [Your email]

---

**Last Updated:** October 2025
**Version:** 2.0.0
