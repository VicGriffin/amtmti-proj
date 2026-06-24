# 🚀 AMTMTI Platform - START HERE

## Project Status: ✅ READY FOR CPANEL DEPLOYMENT

Welcome! This document helps you get started with deploying the AMTMTI platform to your cPanel hosting.

---

## What You Have

Your AMTMTI Platform is **fully built, tested, and ready to deploy**:

- ✅ Production-ready Next.js application
- ✅ All features implemented (programs, enrollment, membership approval)
- ✅ Database connected (Supabase)
- ✅ Build verified (exit code 0, no errors)
- ✅ cPanel hosting active (amtmti.com)
- ✅ Complete deployment documentation

---

## Hosting Credentials

```
Domain:           amtmti.com
cPanel URL:       http://54.36.164.223:2082/
Username:         asarqqdn
Password:         B01refZY8:b;O5
SFTP Port:        1624
Server IP:        54.36.164.223
```

---

## Choose Your Deployment Path

### Option 1: Quick Deployment (30 minutes)

**Best for**: You have 30-45 minutes and want to deploy now

👉 **Read**: `QUICK_START_CPANEL.md`

This guide has:
- 5-minute local prep
- 10-minute cPanel setup
- 10-minute upload
- 5-minute verification
- Common issues & fixes

**Estimated Time**: 30-45 minutes

---

### Option 2: Comprehensive Deployment (2-3 hours)

**Best for**: You want detailed guidance with explanations

👉 **Read**: `CPANEL_DEPLOYMENT_GUIDE.md`

This guide has:
- 11 complete phases with detailed explanations
- Step-by-step instructions for each phase
- Troubleshooting for each phase
- Post-deployment procedures
- 449 lines of comprehensive guidance

**Estimated Time**: 2-3 hours

---

### Option 3: Track Everything (Parallel Reading)

**Best for**: You want to ensure nothing is missed

👉 **Use**: `DEPLOYMENT_CHECKLIST.md` alongside either guide above

This checklist has:
- Pre-deployment phase
- cPanel setup phase
- File upload phase
- Configuration phase
- Testing phase
- Post-deployment phase

**Estimated Time**: Same as Option 1 or 2, but with checkboxes

---

### Option 4: Copy-Paste Commands

**Best for**: You want exact commands to run

👉 **Use**: `COMMAND_REFERENCE.md`

This reference has:
- Step 1-9 commands ready to copy-paste
- Database setup commands
- Email setup commands
- Monitoring commands
- Troubleshooting commands

**Use alongside**: Options 1, 2, or 3

---

### Option 5: Full Understanding

**Best for**: You want to understand everything before starting

👉 **Start Here**: `DEPLOYMENT_INDEX.md`

Then read in order:
1. DEPLOYMENT_READY.md (status overview)
2. QUICK_START_CPANEL.md (get overview)
3. CPANEL_DEPLOYMENT_GUIDE.md (detailed guide)
4. DEPLOYMENT_CHECKLIST.md (track progress)
5. COMMAND_REFERENCE.md (as needed)

**Estimated Time**: 95 minutes reading + 1-2 hours deployment

---

## Documents Available

| Document | Lines | Purpose | Time |
|----------|-------|---------|------|
| **START_HERE.md** | This file | Quick orientation | 5 min |
| **DEPLOYMENT_INDEX.md** | 394 | Navigation hub | 10 min |
| **DEPLOYMENT_READY.md** | 325 | Status overview | 10 min |
| **QUICK_START_CPANEL.md** | 236 | 30-min deployment | 20 min |
| **CPANEL_DEPLOYMENT_GUIDE.md** | 449 | Comprehensive guide | 30 min |
| **DEPLOYMENT_CHECKLIST.md** | 308 | Progress tracker | - |
| **COMMAND_REFERENCE.md** | 462 | Copy-paste commands | 15 min |

**Total Documentation**: 1,780+ lines

---

## Pre-Deployment Checklist

Before starting, verify:

- [ ] You have cPanel credentials (see above)
- [ ] You have environment variables ready
- [ ] You have Supabase credentials
- [ ] You understand the deployment process
- [ ] You have 1-3 hours available

**All set?** → Continue below

---

## Deployment Overview (77 minutes)

1. **Local Prep** (15 min) - Build project, create deployment package
2. **cPanel Setup** (10 min) - Login, create folder, setup Node.js app
3. **Upload Files** (10 min) - Upload via SFTP
4. **Extract & Install** (5 min) - Extract files, install dependencies
5. **Configuration** (10 min) - Set environment variables
6. **Domain & SSL** (5-30 min) - Configure domain and SSL
7. **Reverse Proxy** (5 min) - Create routing rules
8. **Start App** (2 min) - Click start in cPanel
9. **Testing** (15 min) - Verify everything works

**Plus**: 48 hours for DNS propagation (if nameservers need updating)

---

## What Happens After Deployment

- **Website goes live**: https://amtmti.com
- **Admin dashboard**: https://amtmti.com/admin
- **All features work**: Programs, enrollment, membership approval
- **Emails send**: Student notifications
- **Database connected**: All data persists

---

## If Something Goes Wrong

### Most Common Issues

**1. Page shows 502 error**
- Go to cPanel → Node.js Applications
- Click "Restart"
- Wait 30 seconds
- Refresh browser

**2. Application won't start**
- Check logs: `tail -50 ~/.pm2/logs/amtmti-app-out.log`
- Verify environment variables
- Try npm install again

**3. Database connection error**
- Verify DATABASE_URL in environment
- Create database in MySQL
- Test connection manually

**4. Email not sending**
- Verify email account created
- Check SMTP_USER and SMTP_PASSWORD
- Verify port 587 is open

See `QUICK_START_CPANEL.md` "COMMON ISSUES" section for more help.

---

## Quick Commands Reference

```bash
# Build locally
cd /vercel/share/v0-project && npm run build

# Create deployment package
mkdir ~/amtmti-deployment && cd ~/amtmti-deployment
cp -r /vercel/share/v0-project/.next .
cp -r /vercel/share/v0-project/public .
cp /vercel/share/v0-project/package.json .
cp /vercel/share/v0-project/package-lock.json .
cp /vercel/share/v0-project/server.js .
tar -czf amtmti-production.tar.gz .next public package.json package-lock.json server.js

# Upload via SFTP
sftp -P 1624 asarqqdn@54.36.164.223
# cd public_html/amtmti-app
# put amtmti-production.tar.gz
# exit

# Extract on server (via cPanel Terminal)
cd ~/public_html/amtmti-app
tar -xzf amtmti-production.tar.gz
rm amtmti-production.tar.gz
npm install --production
```

See `COMMAND_REFERENCE.md` for all commands.

---

## Next Steps

### Immediate (Next 5 minutes)

1. Read this document (you're doing it!)
2. Choose your deployment path above
3. Start with the recommended document

### Short-term (Next 1-3 hours)

1. Follow chosen deployment guide
2. Use checklist to track progress
3. Execute each step carefully
4. Test after each phase

### After Deployment

1. Monitor logs daily for first week
2. Test all features thoroughly
3. Create backups monthly
4. Update npm packages quarterly

---

## Support

- **Hosting Support**: support@truehost.cloud
- **cPanel URL**: http://54.36.164.223:2082/
- **Documentation**: All files in project root

---

## Choose Your Path

**⏱️ I have 30 minutes:**
→ Read `QUICK_START_CPANEL.md` and deploy now

**⏱️ I have 2-3 hours:**
→ Read `CPANEL_DEPLOYMENT_GUIDE.md` step-by-step

**⏱️ I want commands:**
→ Use `COMMAND_REFERENCE.md`

**⏱️ I'm new to this:**
→ Read `DEPLOYMENT_INDEX.md` first

**⏱️ I want all details:**
→ Read `DEPLOYMENT_READY.md` then `CPANEL_DEPLOYMENT_GUIDE.md`

---

## Success Verification

After deployment, these should all work:

- ✅ https://amtmti.com loads
- ✅ https://amtmti.com/admin works
- ✅ Programs display
- ✅ Admin can manage programs
- ✅ Membership approval works
- ✅ Emails send
- ✅ No errors in browser console
- ✅ SSL certificate active (green lock)

---

## Project Features Ready to Deploy

- ✅ Program Management (Create, Read, Update, Delete)
- ✅ Student Enrollment System
- ✅ Auto-Membership Creation
- ✅ Admin Membership Approval
- ✅ Admin Dashboard
- ✅ Student Portal
- ✅ Email Notifications
- ✅ Authentication & Security
- ✅ Database Integration
- ✅ Production-Ready Build

---

## Remember

- **Build Status**: ✅ Successful (exit code 0)
- **Errors**: NONE
- **Ready to Deploy**: YES
- **Documentation**: Complete

You are **100% ready to deploy** right now!

---

## Start Now

Choose your path above and click the recommended document.

**Recommended for first-time deployment:**
→ `QUICK_START_CPANEL.md` (30 minutes)

**Good luck! 🚀**

---

**Last Updated**: June 24, 2026  
**Project**: AMTMTI Platform  
**Status**: Ready for Deployment  
**Hosting**: Truehost Cloud cPanel
