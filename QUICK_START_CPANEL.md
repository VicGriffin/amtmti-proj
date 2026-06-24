# AMTMTI cPanel Quick Start - 30 Minute Deployment

## Hosting Credentials (Keep Secure)
```
cPanel URL:     http://54.36.164.223:2082/
Username:       asarqqdn
Password:       B01refZY8:b;O5
SFTP Host:      sftp://54.36.164.223:1624
Domain:         amtmti.com
SMTP Server:    lon105.truehost.cloud:587
```

---

## 5-MINUTE PREP (On Your Computer)

### 1. Build the Project
```bash
cd /vercel/share/v0-project
npm run build
```

### 2. Create Deployment Package
```bash
mkdir ~/amtmti-deploy
cd ~/amtmti-deploy

# Copy production files
cp -r /vercel/share/v0-project/.next .
cp -r /vercel/share/v0-project/public .
cp /vercel/share/v0-project/package.json .
cp /vercel/share/v0-project/package-lock.json .
cp /vercel/share/v0-project/server.js .

# Create archive
tar -czf amtmti-production.tar.gz .next public package.json package-lock.json server.js
```

---

## 10-MINUTE CPANEL SETUP

### 1. Login to cPanel
- URL: http://54.36.164.223:2082/
- User: asarqqdn
- Pass: B01refZY8:b;O5

### 2. Create App Directory
- File Manager → public_html
- Create folder: `amtmti-app`

### 3. Setup Node.js
- Node.js Applications → Create Application
- Node.js version: 20.x
- Startup file: server.js
- Application root: /home/asarqqdn/public_html/amtmti-app
- Click "Create"

---

## 10-MINUTE UPLOAD & SETUP

### 1. Upload via SFTP
```bash
sftp -P 1624 asarqqdn@54.36.164.223
cd public_html/amtmti-app
put amtmti-production.tar.gz
exit
```

### 2. Extract Files (via cPanel Terminal)
```bash
cd ~/public_html/amtmti-app
tar -xzf amtmti-production.tar.gz
rm amtmti-production.tar.gz
npm install --production
```

### 3. Add Environment Variables
In Node.js Applications → Edit Environment Variables:
```
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://amtmti.com
NEXT_PUBLIC_SUPABASE_URL=https://gaoddoliqswebpasdvtg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_KEY
EMAIL_SMTP_HOST=lon105.truehost.cloud
EMAIL_SMTP_PORT=587
EMAIL_SMTP_USER=noreply@amtmti.com
EMAIL_SMTP_PASSWORD=YOUR_PASSWORD
```

### 4. Start Application
- Node.js Applications → Find amtmti-app
- Click "Start"
- Wait 30 seconds

---

## VERIFY DEPLOYMENT (5 minutes)

### 1. Check Status
```bash
# Via cPanel Terminal:
ps aux | grep node
tail -20 ~/.pm2/logs/amtmti-app-out.log
```

### 2. Test Website
- Open: https://amtmti.com
- Should load successfully
- No errors in browser console

### 3. Test Admin
- Visit: https://amtmti.com/admin
- Login with admin credentials
- Verify programs load

---

## COMMON ISSUES & FIXES

### Issue: Page shows 502 Bad Gateway
**Fix:**
1. Go to Node.js Applications
2. Click "Restart"
3. Wait 30 seconds
4. Refresh browser

### Issue: Application won't start
**Fix:**
1. Check logs: `tail -50 ~/.pm2/logs/amtmti-app-out.log`
2. Verify environment variables set
3. Try: `npm install` again
4. Restart application

### Issue: Database connection error
**Fix:**
1. Verify DATABASE_URL in environment
2. Create database in MySQL section
3. Test: `mysql -h localhost -u user -p`

### Issue: Email not sending
**Fix:**
1. Verify email account created
2. Check SMTP_USER and SMTP_PASSWORD
3. Try different port (465 vs 587)

---

## IMPORTANT FILES & LOCATIONS

```
App Directory:      /home/asarqqdn/public_html/amtmti-app
Application File:   server.js
Build Output:       .next/
Public Files:       public/
Logs:              ~/.pm2/logs/amtmti-app-out.log
Environment:        Set in cPanel Node.js app
```

---

## EMERGENCY RESTART

If application crashes, restart immediately:

**Via cPanel:**
1. Node.js Applications
2. Find amtmti-app
3. Click "Restart"
4. Done

**Via Terminal:**
```bash
pm2 restart amtmti-app
```

---

## SSL CERTIFICATE

1. Go to cPanel → SSL/TLS
2. Click "Auto SSL"
3. Select amtmti.com
4. Click "Install"
5. Done (automatic renewal)

---

## DAILY CHECKS

Every morning, verify:
```bash
# Check if running
ps aux | grep node

# Check for errors (last hour)
tail -100 ~/.pm2/logs/amtmti-app-out.log | grep -i error

# Check resource usage in cPanel → Resource Usage
```

---

## BACKUP QUICK COMMAND

Create backup monthly:
```bash
tar -czf amtmti-backup-$(date +%Y%m%d).tar.gz ~/public_html/amtmti-app
```

---

## SUPPORT

- Truehost Support: support@truehost.cloud
- cPanel Docs: https://docs.cpanel.net
- Node.js Docs: https://nodejs.org/docs

---

## GO-LIVE CHECKLIST

Before going public:
- [ ] Website loads: https://amtmti.com ✓
- [ ] Admin works: https://amtmti.com/admin ✓
- [ ] No errors in logs ✓
- [ ] Programs display correctly ✓
- [ ] Database connected ✓
- [ ] Email working ✓
- [ ] SSL certificate active ✓
- [ ] Backups created ✓

**Ready to go live!**
