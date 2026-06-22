# AMTMTI — cPanel Deployment Guide

## Prerequisites on cPanel
- Node.js 20+ (via cPanel Node.js selector)
- Application root mapped to your domain
- Access to `.env` / environment variables panel

---

## Step 1 — Upload & Install

1. Zip the project (exclude `node_modules`, `.next`, `.env.local`):
   ```bash
   zip -r amtmti.zip . --exclude "node_modules/*" --exclude ".next/*" --exclude ".env.local"
   ```
2. Upload `amtmti.zip` via cPanel File Manager → Extract to your app root (e.g. `/home/user/amtmti.africa/`)
3. In **cPanel → Node.js** selector:
   - Node.js version: **20.x** (minimum)
   - Application root: `/home/user/amtmti.africa`
   - Application startup file: `server.js`
   - Click **Create**

---

## Step 2 — Set Environment Variables

In cPanel Node.js → **Environment Variables** (or create `.env.local` in app root):

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_JWT_SECRET=your_jwt_secret
DATABASE_URL=postgresql://postgres:[password]@db.YOUR_PROJECT.supabase.co:5432/postgres
ADMIN_EMAIL=admin@amtmti.africa
ADMIN_PASSWORD=your_strong_password
NEXT_PUBLIC_SITE_URL=https://amtmti.africa
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0

# Email (nodemailer default — or set EMAIL_PROVIDER=resend / sendgrid)
EMAIL_PROVIDER=nodemailer
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_PORT=465
EMAIL_SMTP_SECURE=true
EMAIL_SMTP_USER=your_gmail@gmail.com
EMAIL_SMTP_PASSWORD=your_app_password
EMAIL_FROM=your_gmail@gmail.com
COMPANY_EMAIL=info@amtmti.africa
NEXT_PUBLIC_AMTMTI_EMAIL=info@amtmti.africa
```

---

## Step 3 — Install & Build

Via cPanel Terminal or SSH:

```bash
cd /home/user/amtmti.africa
npm install
npm run build
```

The build creates `.next/standalone/` (due to `output: 'standalone'` in next.config.mjs).

---

## Step 4 — Start the App

Click **Run JS Script → npm start** in cPanel Node.js, or via terminal:
```bash
npm start
```

This runs `node server.js` which starts Next.js on `PORT` (default 3000).

---

## Step 5 — Proxy via .htaccess (Apache → Node)

In your domain's public_html root, create/update `.htaccess`:

```apache
RewriteEngine On
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
```

If `mod_proxy` is not enabled, ask your host to enable it, or use the **Passenger** option in cPanel Node.js.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| 500 on all pages | Check `.env.local` is present with all required vars |
| Admin login fails | Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` in env vars |
| Emails not sending | Set `EMAIL_SMTP_PASSWORD` or `RESEND_API_KEY`; check `EMAIL_PROVIDER` |
| DB errors | Verify `DATABASE_URL` and Supabase service role key |
| Build fails on TS errors | Check `tsconfig.json`; all imports are valid |

---

## Security Checklist

- [ ] `ADMIN_PASSWORD` is strong and unique
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is never exposed to the browser
- [ ] `NODE_ENV=production` is set
- [ ] `.env.local` is **not** committed to git (it's in `.gitignore`)
