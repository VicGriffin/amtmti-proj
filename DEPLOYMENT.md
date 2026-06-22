# AMTMTI Platform Build - Deployment Guide

## 📋 Pre-Deployment Checklist

- [x] All features implemented and tested
- [x] TypeScript compilation successful
- [x] Environment variables documented
- [x] Database schemas created
- [x] Email service configured
- [x] Security hardening applied
- [x] Mobile responsiveness verified
- [x] Accessibility standards met

## 🚀 Deployment Instructions

### Prerequisites

- Node.js 18+ installed
- npm or pnpm package manager
- Supabase account with database setup
- Email service account (Resend or SendGrid)
- Vercel account (for recommended deployment)

### Step 1: Environment Setup

```bash
# Copy the environment template
cp .env.example .env.local

# Edit .env.local with your values:
# - Supabase URL and keys
# - Email service API key
# - Company email addresses
```

### Step 2: Install Dependencies

```bash
npm install
# or
pnpm install
```

### Step 3: Local Testing

```bash
# Build the project
npm run build

# Start production server locally
npm run start

# Visit http://localhost:3000
```

### Step 4: Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow the prompts:
# 1. Link to existing project or create new
# 2. Configure build settings (defaults are fine)
# 3. Add environment variables in Vercel dashboard
```

### Step 5: Post-Deployment Verification

```bash
# Test key functionality:
# 1. Visit https://your-domain.vercel.app
# 2. Test enrollment form
# 3. Test contact form
# 4. Test newsletter subscription
# 5. Verify email notifications
```

## 🔧 Required Environment Variables

### Supabase
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Email Service (Choose One)

**Option A: Resend** (Recommended)
```
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_your-key
```

**Option B: SendGrid**
```
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.your-key
```

### Application
```
EMAIL_FROM=noreply@amtmti.africa
COMPANY_EMAIL=admissions@amtmti.africa
NEXT_PUBLIC_AMTMTI_EMAIL=admissions@amtmti.africa
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## 📦 Database Setup

### Create Tables in Supabase

Run the SQL scripts in your Supabase SQL editor:

```bash
# All tables are defined in scripts/001_schema.sql
# Copy and paste into Supabase SQL editor
```

Key tables:
- `enrollment_applications`
- `contact_messages`
- `membership_applications`
- `newsletter_subscribers`

## 🔐 Security Checklist

- [x] Environment variables not in version control
- [x] HTTPS enabled for all domains
- [x] CORS configured properly
- [x] Rate limiting implemented
- [x] Input validation on all forms
- [x] SQL injection prevention via Supabase
- [x] XSS prevention with proper HTML escaping
- [x] CSRF tokens in forms

## 📊 Performance Optimization

- [x] Next.js Image Optimization enabled
- [x] Code splitting configured
- [x] Caching headers set appropriately
- [x] Minification enabled
- [x] Tree shaking enabled
- [x] CSS purging enabled

## 🚨 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Email Not Sending

1. Check API key in environment variables
2. Verify sender email is verified in email service
3. Check email logs in Resend/SendGrid dashboard
4. Test with: `curl -X POST http://localhost:3000/api/enrollment/submit`

### Database Connection Issues

1. Verify Supabase URL and keys
2. Check network connection
3. Verify table schemas exist
4. Check Supabase dashboard for errors

### Deployment Platform Issues

**Vercel:**
- Check build logs in Vercel dashboard
- Ensure all env vars are set
- Verify function timeout settings (30s default)

**AWS:**
- Configure Lambda/ECS settings
- Set up RDS or RDS Proxy for database
- Configure API Gateway

## 📈 Monitoring

### Key Metrics to Monitor

- Page load times
- API response times
- Email delivery success rate
- Form submission success rate
- Error logs
- Database query performance

### Recommended Monitoring Tools

- Vercel Analytics (built-in with Vercel)
- Sentry for error tracking
- LogRocket for user session replay
- Supabase dashboard for database metrics

## 🔄 Continuous Deployment

### GitHub Actions Setup

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 📞 Support

For deployment issues:

1. Check this guide thoroughly
2. Review Vercel documentation: https://vercel.com/docs
3. Review Supabase documentation: https://supabase.com/docs
4. Check GitHub Issues for similar problems
5. Contact deployment platform support

## ✅ Final Verification

Before going live:

```bash
# Run verification script
bash scripts/verify-deployment.sh

# Check all API endpoints work
curl https://your-domain/api/enrollment/submit
curl https://your-domain/api/contact/submit
curl https://your-domain/api/membership/submit
curl https://your-domain/api/newsletter/subscribe

# Test form submissions manually
# Verify emails are being sent
# Check database records are being saved
```

---

**Status: ✅ Ready for Production Deployment**

All systems are operational and the application is ready to be deployed to your production environment.
