# AMTMTI cPanel Deployment Checklist

## Pre-Deployment Phase

### Local Machine Setup
- [ ] Clone/download project from Git
- [ ] Run `npm install` to install dependencies
- [ ] Update `.env.development.local` with correct values
- [ ] Run `npm run build` - verify build succeeds
- [ ] Test locally: `npm start` and check https://localhost:3000
- [ ] Verify admin dashboard works
- [ ] Verify database connections work

### Deployment Package Preparation
- [ ] Create deployment directory: `mkdir ~/amtmti-deployment`
- [ ] Copy .next folder to deployment directory
- [ ] Copy public folder to deployment directory
- [ ] Copy package.json to deployment directory
- [ ] Copy package-lock.json to deployment directory
- [ ] Copy server.js to deployment directory
- [ ] Create tar.gz archive: `tar -czf amtmti-production.tar.gz`
- [ ] Verify archive contains all required files

### Environment Configuration
- [ ] Collect Supabase credentials (URL, API keys)
- [ ] Create secure admin password
- [ ] Prepare SMTP email settings
- [ ] Prepare database connection string
- [ ] Generate JWT secret
- [ ] Document all credentials securely

---

## cPanel Setup Phase

### Access & Initial Setup
- [ ] Access cPanel: http://54.36.164.223:2082/
- [ ] Verify login with: asarqqdn / B01refZY8:b;O5
- [ ] Create backup of existing cPanel data

### Directory & File Setup
- [ ] Open File Manager in cPanel
- [ ] Navigate to public_html directory
- [ ] Create new folder: amtmti-app
- [ ] Verify folder permissions (755)

### Node.js Configuration
- [ ] Go to Node.js Applications
- [ ] Click "Create Application"
- [ ] Set Node.js version to 18.x or 20.x
- [ ] Set application mode to "production"
- [ ] Set Application startup file to server.js
- [ ] Set Application root to /home/asarqqdn/public_html/amtmti-app
- [ ] Configure all environment variables
- [ ] Verify configuration saved

---

## File Upload Phase

### Upload Files via SFTP
- [ ] Connect to SFTP: sftp://54.36.164.223:1624
- [ ] Username: asarqqdn
- [ ] Password: B01refZY8:b;O5
- [ ] Navigate to public_html/amtmti-app
- [ ] Upload amtmti-production.tar.gz
- [ ] Verify upload completed

### Extract & Install
- [ ] Open cPanel Terminal
- [ ] Run: `cd ~/public_html/amtmti-app`
- [ ] Run: `tar -xzf amtmti-production.tar.gz`
- [ ] Run: `rm amtmti-production.tar.gz`
- [ ] Run: `npm install --production`
- [ ] Verify all files extracted correctly
- [ ] Verify node_modules directory created

---

## Configuration Phase

### Environment Variables
- [ ] Set NODE_ENV=production
- [ ] Set NEXT_PUBLIC_SITE_URL=https://amtmti.com
- [ ] Set NEXT_PUBLIC_SUPABASE_URL
- [ ] Set NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] Set SUPABASE_SERVICE_ROLE_KEY
- [ ] Set DATABASE_URL
- [ ] Set ADMIN_EMAIL
- [ ] Set ADMIN_PASSWORD
- [ ] Set EMAIL_SMTP_HOST=lon105.truehost.cloud
- [ ] Set EMAIL_SMTP_PORT=587
- [ ] Set EMAIL_SMTP_USER
- [ ] Set EMAIL_SMTP_PASSWORD

### Reverse Proxy & Routing
- [ ] Create .htaccess in public_html/
- [ ] Add HTTPS redirect rules
- [ ] Add reverse proxy rules
- [ ] Test routing works

### Database Setup
- [ ] Create MySQL database: asarqqdn_amtmti
- [ ] Create database user: asarqqdn_admin
- [ ] Add user to database with privileges
- [ ] Test database connection
- [ ] Update DATABASE_URL environment variable

### Email Setup
- [ ] Create email account: noreply@amtmti.com
- [ ] Set email quota to 500MB
- [ ] Update EMAIL_SMTP_USER in environment
- [ ] Update EMAIL_SMTP_PASSWORD in environment
- [ ] Test email sending

---

## Domain & SSL Phase

### Domain Configuration (if needed)
- [ ] Check current nameservers
- [ ] Update nameservers if required:
  - ns1.cloudoon.com
  - ns2.cloudoon.net
  - ns3.cloudoon.org
- [ ] Wait for DNS propagation (up to 48 hours)

### SSL Certificate
- [ ] Go to cPanel SSL/TLS
- [ ] Install AutoSSL or issue certificate
- [ ] Select domain: amtmti.com
- [ ] Verify certificate installed
- [ ] Update .htaccess to force HTTPS
- [ ] Test HTTPS works: https://amtmti.com

---

## Application Start Phase

### Start Application
- [ ] Go to Node.js Applications in cPanel
- [ ] Find amtmti-app
- [ ] Click "Start" if status is "Off"
- [ ] Wait 30 seconds for startup
- [ ] Verify status shows "On"

### Verify Running
- [ ] Check process: `ps aux | grep node`
- [ ] Check logs: `tail -f ~/.pm2/logs/amtmti-app-out.log`
- [ ] Verify no errors in logs
- [ ] Check port 3000 listening

---

## Testing Phase

### Functionality Testing
- [ ] Visit https://amtmti.com - page loads
- [ ] Homepage displays correctly
- [ ] Navigation works
- [ ] Programs page loads with data
- [ ] Program details page works
- [ ] Search functionality works

### Admin Testing
- [ ] Visit https://amtmti.com/admin
- [ ] Admin login works
- [ ] Program management page loads
- [ ] Can create test program
- [ ] Can edit program
- [ ] Membership page loads
- [ ] Can view pending memberships
- [ ] Can approve/reject membership

### Database Testing
- [ ] Check database connection in logs
- [ ] Verify data loads correctly
- [ ] Test create operations
- [ ] Test update operations
- [ ] Test delete operations

### Email Testing
- [ ] Send test email from admin
- [ ] Check email received
- [ ] Verify email formatting
- [ ] Check SMTP logs

### Performance Testing
- [ ] Page load times acceptable
- [ ] Check cPanel resource usage
- [ ] Monitor CPU usage
- [ ] Monitor memory usage
- [ ] Monitor disk usage

---

## Post-Deployment Phase

### Monitoring
- [ ] Monitor logs daily for first week
- [ ] Check error logs: `grep -i error ~/.pm2/logs/amtmti-app-out.log`
- [ ] Verify no resource warnings
- [ ] Test core features daily

### Security
- [ ] Change cPanel password if needed
- [ ] Secure SSH keys
- [ ] Set up firewall rules if available
- [ ] Enable 2FA on cPanel
- [ ] Document security procedures

### Backup & Recovery
- [ ] Download database backup
- [ ] Download application backup
- [ ] Store backups in safe location
- [ ] Document recovery procedures
- [ ] Schedule monthly backups

### Documentation
- [ ] Document login credentials (securely)
- [ ] Document server configuration
- [ ] Document deployment steps taken
- [ ] Document troubleshooting notes
- [ ] Document maintenance schedule

---

## Troubleshooting Checkpoints

### If Application Won't Start
- [ ] Check application logs for errors
- [ ] Verify all environment variables set
- [ ] Verify Node.js version compatible
- [ ] Check file permissions (755 for dirs, 644 for files)
- [ ] Try restarting application from cPanel

### If Pages Show 502 Error
- [ ] Verify Node.js process running
- [ ] Restart application
- [ ] Check reverse proxy configuration
- [ ] Check .htaccess syntax
- [ ] Review cPanel logs

### If Database Connection Fails
- [ ] Verify database name correct
- [ ] Verify database user exists
- [ ] Verify user has database privileges
- [ ] Test connection manually: `mysql -h localhost -u user -p dbname`
- [ ] Check DATABASE_URL format

### If Email Not Sending
- [ ] Verify email account created
- [ ] Verify SMTP credentials correct
- [ ] Check email account enabled
- [ ] Verify port 587 open
- [ ] Check application logs

---

## Maintenance Schedule

### Daily (First Week)
- [ ] Monitor application logs
- [ ] Check for errors
- [ ] Verify core features work
- [ ] Monitor resource usage

### Weekly
- [ ] Review error logs
- [ ] Test all admin functions
- [ ] Verify email delivery
- [ ] Check certificate expiration date

### Monthly
- [ ] Download backups
- [ ] Review performance metrics
- [ ] Update npm packages
- [ ] Test disaster recovery plan

### Quarterly
- [ ] Review security settings
- [ ] Test backup restoration
- [ ] Performance review
- [ ] Update documentation

---

## Emergency Contacts

- **Hosting Support**: support@truehost.cloud
- **cPanel URL**: http://54.36.164.223:2082/
- **Emergency SSH Access**: ssh -p 1624 asarqqdn@54.36.164.223

---

## Sign-Off

- [ ] All checklist items completed
- [ ] All tests passed
- [ ] No critical errors in logs
- [ ] Application running smoothly
- [ ] Team notified of go-live

**Deployment Completed**: ___________  
**Deployed By**: ___________  
**Date**: ___________  
**Notes**: 
