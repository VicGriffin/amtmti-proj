# AMTMTI Platform - cPanel Deployment Guide

## Hosting Information
- **Domain**: amtmti.com
- **cPanel URL**: http://54.36.164.223:2082/
- **Username**: asarqqdn
- **Server IP**: 54.36.164.223
- **SFTP Port**: 1624
- **SMTP Server**: lon105.truehost.cloud:587

---

## PHASE 1: PRE-DEPLOYMENT PREPARATION (Local Machine)

### Step 1: Clean Build Locally
```bash
cd /vercel/share/v0-project

# Clean previous builds
rm -rf .next node_modules

# Reinstall dependencies
npm install

# Build the project
npm run build

# Verify build succeeded (should see "Compiled successfully")
```

### Step 2: Prepare Deployment Package
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

# Create deployment archive
tar -czf amtmti-production.tar.gz .next public package.json package-lock.json server.js

# Verify archive (should show files inside)
tar -tzf amtmti-production.tar.gz | head -20
```

### Step 3: Prepare Environment Variables
Create a file: `~/.env-cpanel-production`
```
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://amtmti.com
PORT=3000
HOSTNAME=localhost
NEXT_PUBLIC_SUPABASE_URL=https://gaoddoliqswebpasdvtg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
SUPABASE_JWT_SECRET=YOUR_JWT_SECRET
DATABASE_URL=YOUR_DATABASE_URL
DIRECT_URL=YOUR_DIRECT_URL
ADMIN_EMAIL=admin@amtmti.com
ADMIN_PASSWORD=YOUR_SECURE_PASSWORD
EMAIL_PROVIDER=smtp
EMAIL_SMTP_HOST=lon105.truehost.cloud
EMAIL_SMTP_PORT=587
EMAIL_SMTP_SECURE=false
EMAIL_SMTP_USER=noreply@amtmti.com
EMAIL_SMTP_PASSWORD=YOUR_EMAIL_PASSWORD
EMAIL_FROM=noreply@amtmti.com
COMPANY_EMAIL=info@amtmti.com
NEXT_PUBLIC_AMTMTI_EMAIL=info@amtmti.com
NEXT_PUBLIC_AMTMTI_TRAINING_EMAIL=training@amtmti.com
```

---

## PHASE 2: CPANEL LOGIN & SETUP

### Step 1: Access cPanel
1. Open browser: http://54.36.164.223:2082/
2. Login with:
   - Username: **asarqqdn**
   - Password: **B01refZY8:b;O5**

### Step 2: Create File Manager Directory
1. In cPanel, go to **File Manager**
2. Navigate to **public_html** directory
3. Create new folder: `amtmti-app`
4. Navigate into the new folder

### Step 3: Setup Node.js Application
1. In cPanel, find **Node.js Applications** (under Software)
2. Click **Create Application**
3. Configure:
   - **Node.js version**: 18.x or 20.x (use latest available)
   - **Application mode**: production
   - **Application URL**: https://amtmti.com/
   - **Application startup file**: server.js
   - **Application root**: /home/asarqqdn/public_html/amtmti-app
   - **Application environment**: Production

---

## PHASE 3: UPLOAD PROJECT FILES

### Option A: Using SFTP (Recommended)

#### On Linux/Mac:
```bash
cd ~/amtmti-deployment

# Connect via SFTP
sftp -P 1624 asarqqdn@54.36.164.223

# Inside SFTP session:
cd public_html/amtmti-app
put amtmti-production.tar.gz
exit
```

#### On Windows:
- Use FileZilla or WinSCP
- Host: sftp://54.36.164.223
- Port: 1624
- Username: asarqqdn
- Password: B01refZY8:b;O5
- Upload `amtmti-production.tar.gz` to `public_html/amtmti-app/`

### Option B: Using cPanel File Manager
1. Go to File Manager > public_html/amtmti-app
2. Click **Upload**
3. Select `amtmti-production.tar.gz`
4. Wait for upload to complete

---

## PHASE 4: EXTRACT & SETUP ON SERVER

### Step 1: Extract Files via SSH or cPanel Terminal

**Via cPanel Terminal (easiest):**
1. In cPanel, go to **Terminal** (under Advanced)
2. Run these commands:
```bash
cd ~/public_html/amtmti-app

# Extract archive
tar -xzf amtmti-production.tar.gz

# Remove archive (to save space)
rm amtmti-production.tar.gz

# Verify files extracted
ls -la
```

### Step 2: Install Node Modules
```bash
# Still in ~/public_html/amtmti-app
npm install --production

# Verify installation
ls -la node_modules | head -10
```

### Step 3: Set Environment Variables
1. Go back to **Node.js Applications** in cPanel
2. Find your application (amtmti-app)
3. Click **Edit Environment Variables**
4. Add all variables from `.env-cpanel-production`:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - DATABASE_URL
   - EMAIL_SMTP_PASSWORD
   - etc.

---

## PHASE 5: CONFIGURE REVERSE PROXY

### Step 1: Setup Proxy
1. In cPanel, go to **Node.js Applications**
2. Find your application
3. Ensure it shows:
   - Application URL: https://amtmti.com/
   - Port: 3000 (or assigned port)

### Step 2: Create .htaccess for Reverse Proxy
Via cPanel File Manager, create `.htaccess` in `public_html/`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteRule ^(?!amtmti-app/)(.*)$ amtmti-app/$1 [L]
</IfModule>
```

---

## PHASE 6: SSL CERTIFICATE & DOMAIN

### Step 1: Update Nameservers (if needed)
If domain not pointing to Truehost yet:
1. Go to your domain registrar
2. Update nameservers to:
   - ns1.cloudoon.com (57.128.250.247)
   - ns2.cloudoon.net (49.12.105.164)
   - ns3.cloudoon.org (158.69.211.95)
3. Wait up to 48 hours for propagation

### Step 2: Install SSL Certificate
1. In cPanel, go to **SSL/TLS**
2. Click **Auto SSL** or **Issue Certificate**
3. Select domain: amtmti.com
4. Click **Install Certificate**

### Step 3: Force HTTPS
1. Edit `.htaccess` in `public_html/`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
  RewriteRule ^(?!amtmti-app/)(.*)$ amtmti-app/$1 [L]
</IfModule>
```

---

## PHASE 7: DATABASE SETUP

### Step 1: Create Database
1. In cPanel, go to **MySQL Databases**
2. Click **Create New Database**
3. Name: `asarqqdn_amtmti`
4. Click **Create Database**

### Step 2: Create Database User
1. Go to **MySQL Users**
2. Click **Create New User**
3. Username: `asarqqdn_admin`
4. Password: Generate strong password
5. Click **Create User**

### Step 3: Add User to Database
1. Scroll to **Add User to Database**
2. Select user and database
3. Click **Add**
4. Check all privileges
5. Click **Make Changes**

### Step 4: Update Environment Variable
Update `DATABASE_URL` in Node.js environment:
```
DATABASE_URL=mysql://asarqqdn_admin:PASSWORD@localhost/asarqqdn_amtmti
```

---

## PHASE 8: EMAIL SETUP

### Step 1: Create Email Account
1. In cPanel, go to **Email Accounts**
2. Click **Create Email Account**
3. Email: noreply@amtmti.com
4. Password: Generate strong password
5. Quota: 500MB
6. Click **Create Account**

### Step 2: Update SMTP Credentials
In Node.js Environment Variables, update:
```
EMAIL_SMTP_USER=noreply@amtmti.com
EMAIL_SMTP_PASSWORD=YOUR_EMAIL_PASSWORD
```

---

## PHASE 9: START APPLICATION

### Step 1: Start Node.js Application
1. Go to cPanel **Node.js Applications**
2. Find your app (amtmti-app)
3. If status is "Off", click **Start**
4. Wait 30 seconds for startup

### Step 2: Verify Running
In cPanel Terminal:
```bash
# Check if Node process is running
ps aux | grep node

# Check application logs
tail -f ~/.pm2/logs/amtmti-app-out.log
```

---

## PHASE 10: TESTING & VERIFICATION

### Step 1: Test Website
1. Open browser: https://amtmti.com
2. Should load successfully
3. Check console for errors (F12)

### Step 2: Test Admin Panel
1. Navigate to: https://amtmti.com/admin
2. Login with admin credentials
3. Test programs management
4. Test membership approval

### Step 3: Check Logs
In cPanel Terminal:
```bash
# View application logs
tail -100 ~/.pm2/logs/amtmti-app-out.log

# Search for errors
grep -i error ~/.pm2/logs/amtmti-app-out.log
```

### Step 4: Monitor Resources
In cPanel, go to **Resource Usage** to monitor:
- CPU usage
- Memory usage
- Disk space

---

## PHASE 11: BACKUP & MAINTENANCE

### Step 1: Schedule Backups
1. In cPanel, go to **Backup Wizard**
2. Select **Backup Home Directory**
3. Download to safe location monthly

### Step 2: Monitor Application Health
Create monthly checklist:
- Check error logs
- Verify SSL certificate (valid until date)
- Test key features (enrollment, approval, etc.)
- Monitor disk space

### Step 3: Update Node Modules
Periodically update packages:
```bash
cd ~/public_html/amtmti-app
npm update
npm audit fix
```

---

## TROUBLESHOOTING

### Issue: Application Won't Start
**Solution:**
```bash
cd ~/public_html/amtmti-app

# Check for errors
npm start

# Clear cache
rm -rf node_modules/.cache

# Reinstall
npm install
```

### Issue: 502 Bad Gateway
**Solution:**
1. Check if Node.js app is running: `ps aux | grep node`
2. Restart application in cPanel Node.js Applications
3. Check logs: `tail -f ~/.pm2/logs/amtmti-app-out.log`

### Issue: Database Connection Error
**Solution:**
1. Verify DATABASE_URL in environment variables
2. Test connection: `mysql -h localhost -u asarqqdn_admin -p`
3. Check database exists: `SHOW DATABASES;`

### Issue: Email Not Sending
**Solution:**
1. Verify email account exists in cPanel
2. Update SMTP credentials in environment
3. Check SMTP port (587 for TLS)
4. Verify firewall allows port 587

### Issue: SSL Certificate Error
**Solution:**
1. Go to cPanel SSL/TLS
2. Install AutoSSL certificate
3. Clear browser cache
4. Wait 5-10 minutes for certificate propagation

---

## QUICK REFERENCE

### Key URLs
- cPanel: http://54.36.164.223:2082/
- Website: https://amtmti.com
- Admin: https://amtmti.com/admin
- Webmail: http://www.amtmti.com/webmail

### Credentials
- cPanel Username: asarqqdn
- cPanel Password: B01refZY8:b;O5
- SFTP Host: sftp://54.36.164.223:1624

### File Locations
- Application Root: /home/asarqqdn/public_html/amtmti-app
- Server.js: /home/asarqqdn/public_html/amtmti-app/server.js
- Logs: ~/.pm2/logs/amtmti-app-out.log

### Important Commands
```bash
# Connect via SSH/Terminal
ssh -p 1624 asarqqdn@54.36.164.223

# Navigate to app
cd ~/public_html/amtmti-app

# Check status
pm2 status

# View logs
pm2 logs

# Restart app
pm2 restart amtmti-app
```

---

## NEXT STEPS

1. Complete all phases in order
2. Test thoroughly after each phase
3. Keep backups of important files
4. Monitor application daily first week
5. Schedule regular maintenance

For support, contact Truehost Cloud: support@truehost.cloud
