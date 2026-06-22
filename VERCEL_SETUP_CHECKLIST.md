# Vercel Deployment Setup Checklist

Complete this checklist to prepare your project for Vercel deployment.

## Pre-Deployment (Do This First)

### 1. Vercel Account Setup
- [ ] Create/sign into [Vercel account](https://vercel.com/signup)
- [ ] Install [Vercel CLI](https://vercel.com/cli): `npm install -g vercel`
- [ ] Link repository: `vercel link`

### 2. GitHub Setup
- [ ] Repository is public or Vercel has access
- [ ] Default branch is set (main/master)
- [ ] No sensitive data in repository

### 3. External Services
- [ ] Supabase project created and configured
- [ ] Supabase tables created (run SQL schema)
- [ ] Email service account setup (Resend or SendGrid)
- [ ] Domain registered (if using custom domain)

### 4. Environment Variables - Gather These
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Get from Supabase Settings
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Get from Supabase Settings > API
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Get from Supabase Settings > API
- [ ] `RESEND_API_KEY` - Get from Resend dashboard
- [ ] `EMAIL_FROM` - Set to: `noreply@amtmti.africa`
- [ ] `COMPANY_EMAIL` - Set to: `admissions@amtmti.africa`
- [ ] `NEXT_PUBLIC_AMTMTI_EMAIL` - Set to: `admissions@amtmti.africa`

## Vercel Project Setup

### 5. Import Repository
- [ ] Go to [vercel.com/new](https://vercel.com/new)
- [ ] Click "Import Git Repository"
- [ ] Search for `icsa-initiative/amtmti-platform-build`
- [ ] Click "Import"

### 6. Configure Project
- [ ] Project Name: `amtmti-platform` (or your choice)
- [ ] Framework: Should auto-select "Next.js"
- [ ] Root Directory: Leave empty (default)
- [ ] Build Command: Leave as default
- [ ] Output Directory: Leave as default
- [ ] Install Command: Leave as default

### 7. Add Environment Variables
In Vercel dashboard, add these for all environments (Preview, Development, Production):

```
NEXT_PUBLIC_SUPABASE_URL = [your value]
NEXT_PUBLIC_SUPABASE_ANON_KEY = [your value]
SUPABASE_SERVICE_ROLE_KEY = [your value]
EMAIL_PROVIDER = resend
RESEND_API_KEY = [your value]
EMAIL_FROM = noreply@amtmti.africa
COMPANY_EMAIL = admissions@amtmti.africa
NEXT_PUBLIC_AMTMTI_EMAIL = admissions@amtmti.africa
NEXT_PUBLIC_APP_URL = https://your-domain.vercel.app
NEXT_PUBLIC_AUTH_REDIRECT_URL = https://your-domain.vercel.app/auth/callback
```

- [ ] All variables added for Preview
- [ ] All variables added for Production

### 8. Deploy
- [ ] Click "Deploy"
- [ ] Wait for build to complete
- [ ] Note the Vercel URL (e.g., `https://amtmti-platform.vercel.app`)

## Post-Deployment Verification

### 9. Basic Checks
- [ ] Site loads without errors
- [ ] Navigation works
- [ ] No 500 errors in console
- [ ] Environment variables are active (test with API call)

### 10. Functionality Tests
- [ ] Homepage loads
- [ ] Enrollment form opens
- [ ] Form validation works
- [ ] Submission succeeds and shows success message
- [ ] Email is received (check inbox/spam)
- [ ] Database record appears in Supabase

### 11. Security Checks
- [ ] HTTPS is enforced
- [ ] Security headers present (check with DevTools)
- [ ] No sensitive data in client code
- [ ] API keys not exposed
- [ ] Environment variables secure

### 12. Performance Checks
- [ ] Page loads in < 3 seconds
- [ ] Images optimize properly
- [ ] No console warnings
- [ ] Lighthouse score > 80

## Custom Domain Setup

### 13. Add Custom Domain
- [ ] Go to Vercel Project > Settings > Domains
- [ ] Click "Add Domain"
- [ ] Enter domain: `app.amtmti.africa` (or your domain)
- [ ] Update DNS records at registrar
- [ ] Wait for DNS propagation (5-48 hours)
- [ ] Verify domain in Vercel dashboard

### 14. DNS Configuration
At your domain registrar, add:

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.19.43 |
| CNAME | www | cname.vercel-dns.com |

(Use actual values provided by Vercel)

- [ ] DNS records updated
- [ ] Domain pointing to Vercel
- [ ] SSL certificate issued automatically
- [ ] Domain accessible: `https://app.amtmti.africa`

## GitHub Integration Setup

### 15. GitHub Secrets (for CI/CD)
Add these secrets to GitHub repository (Settings > Secrets):

- [ ] `VERCEL_TOKEN` - Get from Vercel account settings
- [ ] `VERCEL_ORG_ID` - Get from Vercel organization settings
- [ ] `VERCEL_PROJECT_ID` - Get from Vercel project settings
- [ ] `VERCEL_SCOPE` - Your Vercel account name

### 16. CI/CD Workflows
- [ ] `.github/workflows/vercel-preview.yml` exists
- [ ] `.github/workflows/vercel-production.yml` exists
- [ ] Push to branch triggers preview deployment
- [ ] Push to main triggers production deployment
- [ ] GitHub Actions page shows successful runs

## Monitoring Setup

### 17. Configure Monitoring
- [ ] Enable Vercel Analytics
- [ ] Setup error tracking (Sentry optional)
- [ ] Configure monitoring alerts
- [ ] Test error handling

### 18. Logging & Debugging
- [ ] Check Vercel deployment logs regularly
- [ ] Monitor function execution
- [ ] Set up error notifications
- [ ] Review build logs for warnings

## Maintenance & Scalability

### 19. Backup & Recovery
- [ ] Test rollback procedure
- [ ] Document rollback steps
- [ ] Keep previous deployment accessible
- [ ] Test restore from database backup

### 20. Scaling Considerations
- [ ] Monitor resource usage
- [ ] Check database query performance
- [ ] Verify API rate limits
- [ ] Plan for traffic spikes

## Documentation

### 21. Documentation
- [ ] [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) reviewed
- [ ] [DEPLOYMENT.md](./DEPLOYMENT.md) updated if needed
- [ ] Team members aware of deployment process
- [ ] Runbook created for common issues

### 22. Handoff
- [ ] Team trained on deployment process
- [ ] Access credentials shared securely
- [ ] Contact list for issues maintained
- [ ] Monitoring dashboard shared

## Final Verification

### 23. Production Readiness
- [ ] All checks passed
- [ ] No outstanding issues
- [ ] Performance meets targets
- [ ] Security hardened

### 24. Go-Live
- [ ] Update domain DNS to production
- [ ] Monitor initial traffic
- [ ] Respond to user feedback
- [ ] Track metrics

## Post-Launch

### 25. Ongoing Maintenance
- [ ] Daily: Check error logs
- [ ] Weekly: Review analytics
- [ ] Monthly: Security updates
- [ ] Quarterly: Performance review

---

## Quick Reference

### Useful Commands
```bash
# View deployments
vercel list

# View logs
vercel logs --follow

# Rollback
vercel rollback

# Environment check
vercel env list

# Local testing
npm run build && npm start
```

### Quick Links
- Vercel Dashboard: https://vercel.com/dashboard
- Project Settings: https://vercel.com/projects/amtmti-platform
- Supabase: https://app.supabase.com
- Resend: https://resend.com/dashboard

---

## Support Contacts

- **Vercel Support**: https://vercel.com/support
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **GitHub Issues**: Create issue in this repo

---

**Status**: Follow this checklist to ensure smooth Vercel deployment
**Last Updated**: June 14, 2026
**Ready**: ✅ Your project is Vercel deployment ready!
