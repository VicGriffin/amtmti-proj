# AMTMTI cPanel Deployment - Command Reference

## Quick Copy-Paste Commands

### STEP 1: LOCAL BUILD (5 minutes)

```bash
# Navigate to project
cd /vercel/share/v0-project

# Install dependencies
npm install

# Build project
npm run build

# Verify success (should show "Compiled successfully")
```

---

### STEP 2: CREATE DEPLOYMENT PACKAGE (5 minutes)

```bash
# Create deployment directory
mkdir -p ~/amtmti-deployment
cd ~/amtmti-deployment

# Copy production files
cp -r /vercel/share/v0-project/.next .
cp -r /vercel/share/v0-project/public .
cp /vercel/share/v0-project/package.json .
cp /vercel/share/v0-project/package-lock.json .
cp /vercel/share/v0-project/server.js .

# Create archive
tar -czf amtmti-production.tar.gz .next public package.json package-lock.json server.js

# Verify archive
tar -tzf amtmti-production.tar.gz | head -20
```

---

### STEP 3: UPLOAD VIA SFTP (5-10 minutes)

**Option A: Command Line (Linux/Mac)**
```bash
cd ~/amtmti-deployment

# Connect to SFTP
sftp -P 1624 asarqqdn@54.36.164.223

# Commands inside SFTP session:
cd public_html/amtmti-app
put amtmti-production.tar.gz
exit
```

**Option B: Windows Users**
Use FileZilla or WinSCP:
- Host: sftp://54.36.164.223
- Port: 1624
- Username: asarqqdn
- Password: B01refZY8:b;O5

---

### STEP 4: EXTRACT ON SERVER (3 minutes)

**Via cPanel Terminal (Easiest):**
1. Go to cPanel → Terminal
2. Run these commands:

```bash
# Navigate to app directory
cd ~/public_html/amtmti-app

# Extract archive
tar -xzf amtmti-production.tar.gz

# Remove archive
rm amtmti-production.tar.gz

# Install dependencies
npm install --production

# Verify files
ls -la
```

---

### STEP 5: SET ENVIRONMENT VARIABLES

**In cPanel:**
1. Node.js Applications → Edit Environment Variables
2. Add these exactly:

```
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://amtmti.com
PORT=3000
HOSTNAME=localhost
NEXT_PUBLIC_SUPABASE_URL=https://gaoddoliqswebpasdvtg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY_HERE
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE
SUPABASE_JWT_SECRET=YOUR_JWT_SECRET_HERE
DATABASE_URL=YOUR_DATABASE_URL_HERE
DIRECT_URL=YOUR_DIRECT_URL_HERE
ADMIN_EMAIL=admin@amtmti.com
ADMIN_PASSWORD=YOUR_SECURE_PASSWORD_HERE
EMAIL_PROVIDER=smtp
EMAIL_SMTP_HOST=lon105.truehost.cloud
EMAIL_SMTP_PORT=587
EMAIL_SMTP_SECURE=false
EMAIL_SMTP_USER=noreply@amtmti.com
EMAIL_SMTP_PASSWORD=YOUR_EMAIL_PASSWORD_HERE
EMAIL_FROM=noreply@amtmti.com
COMPANY_EMAIL=info@amtmti.com
NEXT_PUBLIC_AMTMTI_EMAIL=info@amtmti.com
NEXT_PUBLIC_AMTMTI_TRAINING_EMAIL=training@amtmti.com
```

---

### STEP 6: CREATE .HTACCESS (2 minutes)

**Via cPanel File Manager:**
1. Navigate to public_html
2. Create file: .htaccess
3. Add this content:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
  RewriteRule ^(?!amtmti-app/)(.*)$ amtmti-app/$1 [L]
</IfModule>
```

---

### STEP 7: START APPLICATION (1 minute)

**Via cPanel:**
1. Node.js Applications
2. Find: amtmti-app
3. Click: "Start"
4. Wait 30 seconds

**Or via Terminal:**
```bash
pm2 restart amtmti-app
```

---

### STEP 8: VERIFY DEPLOYMENT

```bash
# Check if Node process running
ps aux | grep node

# View last 50 lines of logs
tail -50 ~/.pm2/logs/amtmti-app-out.log

# Search for errors
grep -i error ~/.pm2/logs/amtmti-app-out.log

# Check server is listening
netstat -tuln | grep 3000

# Check process status
pm2 status
```

---

### STEP 9: TEST WEBSITE

Open browser and test:
- https://amtmti.com (should load)
- https://amtmti.com/admin (should load)
- https://amtmti.com/programs (should show programs)

---

## DATABASE SETUP (Optional - if using local DB)

```bash
# SSH into server
ssh -p 1624 asarqqdn@54.36.164.223

# Create database
mysql -u root -p << EOF
CREATE DATABASE asarqqdn_amtmti;
CREATE USER 'asarqqdn_admin'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON asarqqdn_amtmti.* TO 'asarqqdn_admin'@'localhost';
FLUSH PRIVILEGES;
EXIT;
EOF
```

---

## EMAIL SETUP (Optional)

```bash
# Create email account via cPanel Terminal
# Or use cPanel Email Accounts section:
# 1. Email Accounts → Create Email Account
# 2. Email: noreply@amtmti.com
# 3. Password: Generate strong password
# 4. Save credentials for SMTP_PASSWORD
```

---

## BACKUP COMMANDS

```bash
# Create backup
tar -czf amtmti-backup-$(date +%Y%m%d).tar.gz ~/public_html/amtmti-app

# Download backup
scp -P 1624 asarqqdn@54.36.164.223:~/amtmti-backup-*.tar.gz ~/backups/

# Restore from backup
tar -xzf amtmti-backup-*.tar.gz -C ~/public_html/
```

---

## MONITORING COMMANDS

```bash
# Real-time logs
tail -f ~/.pm2/logs/amtmti-app-out.log

# Last 100 lines
tail -100 ~/.pm2/logs/amtmti-app-out.log

# Search for errors
grep -i error ~/.pm2/logs/amtmti-app-out.log

# Count errors
grep -i error ~/.pm2/logs/amtmti-app-out.log | wc -l

# Follow logs
pm2 logs

# View all processes
pm2 list

# Show full process info
pm2 show amtmti-app
```

---

## RESTART/RESTART COMMANDS

```bash
# Restart application
pm2 restart amtmti-app

# Stop application
pm2 stop amtmti-app

# Start application
pm2 start server.js --name amtmti-app

# Restart ecosystem
pm2 restart ecosystem.config.js

# Kill all
pm2 kill
```

---

## TROUBLESHOOTING COMMANDS

```bash
# Check port usage
netstat -tuln | grep 3000
lsof -i :3000

# Check process
ps aux | grep node
ps aux | grep pm2

# Check logs for specific errors
grep "Error" ~/.pm2/logs/amtmti-app-out.log
grep "ENOENT" ~/.pm2/logs/amtmti-app-out.log

# Check disk space
df -h

# Check memory usage
free -h

# Check CPU usage
top -b -n 1 | head -20

# Check Node version
node -v

# Check npm version
npm -v

# Check package dependencies
npm list
```

---

## UPDATE COMMANDS

```bash
# Update all packages
npm update

# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Clean cache
npm cache clean --force

# Reinstall from scratch
rm -rf node_modules package-lock.json
npm install --production
```

---

## QUICK TROUBLESHOOTING

### Application won't start
```bash
# Clear everything
pm2 kill
cd ~/public_html/amtmti-app
npm install
node server.js

# If that works, restart with pm2
pm2 start server.js --name amtmti-app
```

### 502 Bad Gateway Error
```bash
# Restart
pm2 restart amtmti-app

# Check if running
ps aux | grep node

# Check logs
tail -100 ~/.pm2/logs/amtmti-app-out.log
```

### Database connection error
```bash
# Test connection (if MySQL)
mysql -h localhost -u asarqqdn_admin -p asarqqdn_amtmti

# Check DATABASE_URL
env | grep DATABASE_URL
```

### Email not sending
```bash
# Check email account
grep -i "email\|smtp" ~/.pm2/logs/amtmti-app-out.log

# Verify SMTP settings
cat /etc/hosts | grep smtp
```

---

## SSH CONNECTION

```bash
# Connect to server
ssh -p 1624 asarqqdn@54.36.164.223

# Connect and run command
ssh -p 1624 asarqqdn@54.36.164.223 "ps aux | grep node"

# Copy file from server
scp -P 1624 asarqqdn@54.36.164.223:~/file.txt ~/

# Copy file to server
scp -P 1624 ~/file.txt asarqqdn@54.36.164.223:~/

# SCP directory
scp -P 1624 -r ~/folder asarqqdn@54.36.164.223:~/
```

---

## CREDENTIALS (Keep Secure)

```
cPanel Username:   asarqqdn
cPanel Password:   B01refZY8:b;O5
SFTP Port:         1624
Server IP:         54.36.164.223
Domain:            amtmti.com
SMTP Host:         lon105.truehost.cloud
SMTP Port:         587
```

---

## Important URLs

```
cPanel:            http://54.36.164.223:2082/
Website:           https://amtmti.com
Admin:             https://amtmti.com/admin
Webmail:           http://www.amtmti.com/webmail
```

---

## File Locations on Server

```
App Directory:     /home/asarqqdn/public_html/amtmti-app
Server File:       /home/asarqqdn/public_html/amtmti-app/server.js
Build Output:      /home/asarqqdn/public_html/amtmti-app/.next
Public Files:      /home/asarqqdn/public_html/amtmti-app/public
Logs:              ~/.pm2/logs/amtmti-app-out.log
Environment:       Set in cPanel Node.js app settings
```

---

## Quick Status Check

```bash
# All-in-one status check
echo "=== Node Process ===" && ps aux | grep node && \
echo "=== PM2 Status ===" && pm2 status && \
echo "=== Recent Logs ===" && tail -20 ~/.pm2/logs/amtmti-app-out.log && \
echo "=== Port Listening ===" && netstat -tuln | grep 3000
```

---

**Last Updated**: June 24, 2026  
**Project**: AMTMTI Platform  
**Status**: Ready for Deployment
