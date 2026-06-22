# Vercel Deployment Guide

This guide will help you deploy the AMTMTI Platform Build to Vercel.

## Prerequisites

- GitHub account with access to this repository
- Vercel account (free tier available)
- Environment variables configured
- Supabase project set up

## Option 1: Deploy from GitHub (Recommended)

### Step 1: Connect Repository to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Select "Import Git Repository"
4. Search for and select `icsa-initiative/amtmti-platform-build`
5. Click "Import"

### Step 2: Configure Project Settings

1. **Project Name**: Keep default or customize (e.g., `amtmti-platform`)
2. **Framework Preset**: Should auto-detect as "Next.js"
3. **Build Command**: Leave as default (`npm run build`)
4. **Output Directory**: Leave as default (`.next`)
5. **Install Command**: Leave as default (`npm install`)

### Step 3: Add Environment Variables

In the "Environment Variables" section, add all required variables:

```
NEXT_PUBLIC_SUPABASE_URL = your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
SUPABASE_SERVICE_ROLE_KEY = your-service-role-key
EMAIL_PROVIDER = resend
RESEND_API_KEY = re_your-key
EMAIL_FROM = noreply@amtmti.africa
COMPANY_EMAIL = admissions@amtmti.africa
NEXT_PUBLIC_AMTMTI_EMAIL = admissions@amtmti.africa
NEXT_PUBLIC_APP_URL = https://your-domain.vercel.app
NEXT_PUBLIC_AUTH_REDIRECT_URL = https://your-domain.vercel.app/auth/callback
```

**Important**: Set these for all environments (Preview, Development, Production)

### Step 4: Deploy

1. Click "Deploy"
2. Wait for the build to complete (usually 2-3 minutes)
3. Once complete, you'll get a deployment URL

## Option 2: Deploy Using Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Link Project

```bash
# In your project directory
vercel link
```

Follow the prompts to create a new project or link to existing one.

### Step 4: Deploy

```bash
vercel
```

For production deployment:

```bash
vercel --prod
```

## Configuration Files

### vercel.json

The `vercel.json` file in the root directory configures:

- Build settings
- Environment variables schema
- Security headers
- API routes caching
- Redirects and rewrites

### .vercelignore

Prevents unnecessary files from being deployed, reducing build time and size.

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | `eyJhbGc...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | `eyJhbGc...` |
| `RESEND_API_KEY` | Resend API key | `re_xxxxx` |
| `EMAIL_FROM` | Sender email | `noreply@amtmti.africa` |
| `COMPANY_EMAIL` | Company email | `admissions@amtmti.africa` |
| `NEXT_PUBLIC_APP_URL` | App URL | `https://amtmti.vercel.app` |

### Optional Variables

| Variable | Description | Default |
|----------|---|---|
| `EMAIL_PROVIDER` | Email service provider | `resend` |
| `SENDGRID_API_KEY` | SendGrid API key (if using SendGrid) | - |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID | - |

## Domains & DNS

### Adding Custom Domain

1. In Vercel dashboard, go to your project
2. Navigate to "Settings" → "Domains"
3. Click "Add Domain"
4. Enter your domain (e.g., `app.amtmti.africa`)
5. Follow DNS instructions to update your domain registrar

### DNS Configuration

Add these records to your domain registrar:

```
Type: A
Name: @
Value: 76.76.19.43

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

(Exact values provided by Vercel)

## Monitoring & Analytics

### Built-in Monitoring

1. **Vercel Analytics**: Automatically enabled
   - Performance metrics
   - Core Web Vitals
   - Usage data

2. **Deployment Status**: View in Vercel dashboard
   - Build logs
   - Runtime logs
   - Error tracking

### View Logs

```bash
# Recent deployments
vercel logs

# Specific deployment
vercel logs <deployment-url>
```

## Continuous Deployment (CD)

Vercel automatically deploys when:

1. **Main branch**: Any push triggers production deployment
2. **Other branches**: Creates preview deployments
3. **Pull requests**: Creates preview deployments

### Configure Branch Settings

1. Go to Project Settings
2. Navigate to "Git"
3. Configure:
   - Production branch: `main` or `master`
   - Preview branches: All others

## Rollback

If deployment goes wrong:

1. Go to Vercel dashboard
2. Navigate to "Deployments"
3. Find the working deployment
4. Click "Redeploy"

Or use CLI:

```bash
vercel rollback
```

## Troubleshooting

### Build Fails

1. Check build logs: `vercel logs <url> --follow`
2. Verify environment variables are set
3. Run locally: `npm run build`
4. Check TypeScript: `npx tsc --noEmit`

### Environment Variables Not Working

1. Verify they're set in Vercel dashboard
2. Check they're set for correct environment (Preview/Production)
3. Restart build: Delete current deployment and redeploy
4. Clear cache: `vercel env pull` locally, verify locally first

### Database Connection Issues

1. Verify Supabase URL and keys are correct
2. Test database connection locally
3. Check Supabase project is active
4. Verify IP whitelist (if applicable)

### Email Not Sending

1. Check Resend/SendGrid dashboard
2. Verify API key is correct
3. Ensure sender email is verified
4. Check email logs in Vercel function logs

## Performance Optimization

### Vercel Optimizations

- Global CDN for static content
- Automatic image optimization
- Edge Functions support
- Incremental Static Regeneration (ISR)

### Check Performance

1. Vercel Analytics dashboard
2. [PageSpeed Insights](https://pagespeed.web.dev)
3. [WebPageTest](https://www.webpagetest.org)

Target metrics:
- FCP < 1.5s
- LCP < 2.5s
- CLS < 0.1

## Scaling

### Auto Scaling

Vercel handles scaling automatically:
- Scale up when traffic increases
- No server management needed
- Pay only for what you use

### Upgrade Plan

If you need more:

1. Go to Vercel dashboard
2. Team Settings → Billing
3. Select appropriate plan

## Security Best Practices

1. **Environment Variables**: Never commit to Git
2. **Secrets**: Use Vercel's environment variables
3. **Access Control**: Limit who can deploy
4. **Monitoring**: Enable error tracking
5. **HTTPS**: Automatically enforced

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/next.js/discussions)
- [Vercel Support](https://vercel.com/support)

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Configure custom domain
3. ✅ Set up monitoring
4. ✅ Enable CI/CD preview deployments
5. ✅ Monitor metrics

---

**Status**: Your project is ready for Vercel deployment!

For questions, refer to the [DEPLOYMENT.md](./DEPLOYMENT.md) guide or [PRODUCTION_STATUS.md](./PRODUCTION_STATUS.md).
