# AMTMTI Platform - Course Management System

## Overview

A comprehensive course management and student enrollment platform built with Next.js, PostgreSQL, and Supabase. Features full program administration, student enrollment workflows, and membership approval systems—optimized for both traditional hosting (cPanel) and modern cloud platforms.

**Status**: ✅ **Production Ready**

---

## Quick Links

- **Getting Started**: See [SETUP.md](./SETUP.md)
- **Deployment Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **cPanel Setup**: See [CPANEL_DEPLOYMENT.md](./CPANEL_DEPLOYMENT.md)
- **Implementation Details**: See [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

---

## Key Features

### Program Management
- Create, update, and delete training programs
- Manage program metadata (level, mode, duration, fees, outcomes)
- Mark programs as featured for homepage display
- Comprehensive admin interface at `/admin/programs`

### Student Enrollment
- Students can enroll in programs via REST API
- Automatic duplicate prevention
- Real-time enrollment tracking
- Enrollment statuses: active, completed, dropped, suspended

### Membership System
- **Auto-Creation**: Memberships automatically created when students enroll
- **Approval Workflow**: Admins can approve or reject memberships
- **Notes & Feedback**: Add approval notes or rejection reasons
- **Admin Interface**: Full membership management at `/admin/memberships`
- **Status Tracking**: Pending → Approved/Rejected → Active

### Admin Dashboard
- Centralized management at `/admin`
- Program statistics and quick access
- Enrollment management
- Message and membership administration

---

## Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Next.js | 16.2.6 |
| Runtime | Node.js | 18.0.0+ |
| UI Library | React | 19.2+ |
| Database | PostgreSQL | 12+ |
| Database Service | Supabase | Latest |
| Styling | Tailwind CSS | 4.2.0 |
| Components | shadcn/ui | Latest |
| ORM | Prisma | 7.8.0 |
| Authentication | Supabase Auth | v2 |

---

## Project Structure

```
amtmti-proj/
├── app/
│   ├── admin/                    # Admin dashboard
│   │   ├── programs/             # Program CRUD (CREATE, READ, UPDATE, DELETE)
│   │   ├── memberships/          # Membership approval system
│   │   ├── enrollments/          # Enrollment management
│   │   ├── page.tsx              # Admin dashboard home
│   │   └── login/                # Admin authentication
│   ├── api/
│   │   ├── admin/
│   │   │   ├── programs/         # Program CRUD APIs
│   │   │   ├── membership/       # Membership approval APIs
│   │   │   └── enrollments/      # Admin enrollment APIs
│   │   ├── student/
│   │   │   └── enrollments/      # Student enrollment API
│   │   ├── contact/              # Contact form handling
│   │   └── ...
│   ├── dashboard/                # User dashboard (if applicable)
│   └── page.tsx                  # Public homepage
├── components/
│   ├── admin/                    # Admin UI components
│   ├── ui/                       # Reusable shadcn components
│   └── marketing/                # Marketing components
├── lib/
│   ├── supabase/                 # Supabase client setup
│   ├── admin-auth.ts             # Admin authentication
│   └── utilities/                # Helper functions
├── supabase/
│   └── migrations/               # Database migrations
├── public/                       # Static assets
├── next.config.js                # Next.js config (cPanel optimized)
├── server.js                     # Production server (cPanel compatible)
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── .env.example                  # Environment template
├── SETUP.md                      # Quick start guide
├── DEPLOYMENT.md                 # Deployment guide
├── CPANEL_DEPLOYMENT.md          # cPanel instructions
└── README_PROJECT.md             # This file
```

---

## Getting Started

### Prerequisites

- Node.js v18.0.0 or higher
- npm, pnpm, or yarn
- PostgreSQL database (via Supabase or self-hosted)
- Email service account (for notifications)

### Installation

```bash
# 1. Clone repository
git clone https://github.com/VicGriffin/amtmti-proj.git
cd amtmti-proj

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local

# 4. Configure .env.local with your credentials
# See SETUP.md for detailed configuration

# 5. Build application
npm run build

# 6. Start development server
npm run dev

# Visit http://localhost:3000
```

See [SETUP.md](./SETUP.md) for detailed instructions.

---

## API Endpoints

### Program Management (Admin)

```bash
# List programs
GET /api/admin/programs

# Create program
POST /api/admin/programs

# Update program
PUT /api/admin/programs

# Delete program
DELETE /api/admin/programs?id={id}
```

### Membership Management (Admin)

```bash
# List memberships with filters
GET /api/admin/membership/list?status={status}&programId={id}

# Approve membership
POST /api/admin/membership/{id}/approve

# Reject membership
POST /api/admin/membership/{id}/reject
```

### Student Enrollment

```bash
# List student enrollments
GET /api/student/enrollments

# Create enrollment (auto-creates membership)
POST /api/student/enrollments
```

See [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) for complete API documentation.

---

## Database Schema

### Key Tables

**enrollments**
- `id` - UUID primary key
- `user_id` - Student reference
- `program_id` - Program reference
- `status` - active | completed | dropped | suspended
- `enrolled_at`, `completed_at`, `created_at`, `updated_at`

**memberships**
- `id` - UUID primary key
- `user_id` - Student reference
- `enrollment_id` - Enrollment reference
- `program_id` - Program reference
- `status` - pending | approved | rejected | suspended | cancelled
- `tier` - student | staff | partner
- `approval_notes` - Admin approval notes
- `rejection_reason` - Rejection reason
- `approved_at`, `approved_by` - Approval audit trail

**programs** (existing)
- Core program information
- Categories, levels, modes, fees
- Learning methods and outcomes

See database migration file for complete schema definition.

---

## Environment Variables

### Required

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Admin
ADMIN_EMAIL=admin@amtmti.africa
ADMIN_SECRET=your-secure-secret

# Email (choose one provider)
EMAIL_PROVIDER=nodemailer
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_PORT=465
EMAIL_SMTP_SECURE=true
EMAIL_SMTP_USER=your-email@gmail.com
EMAIL_SMTP_PASSWORD=your-app-password
```

See `.env.example` for all available variables.

---

## Deployment

### cPanel Hosting

1. Prepare files: `zip -r amtmti.zip . --exclude "node_modules/*" ".next/*"`
2. Upload via File Manager
3. Create Node.js app in cPanel
4. Set environment variables
5. Run: `npm install && npm run build`
6. Start application: `npm start`

See [CPANEL_DEPLOYMENT.md](./CPANEL_DEPLOYMENT.md) for detailed instructions.

### Traditional VPS

1. SSH to server
2. Clone repository
3. Create `.env.local` with credentials
4. Build: `npm run build`
5. Use PM2: `pm2 start "npm start" --name "amtmti"`
6. Configure Nginx reverse proxy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Cloud Platforms (Vercel, AWS, etc.)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for cloud-specific setup.

---

## Admin Access

1. Navigate to `https://your-domain.com/admin/login`
2. Enter credentials from `.env.local`:
   - Email: `ADMIN_EMAIL`
   - Secret: `ADMIN_SECRET`
3. Access admin features:
   - `/admin/programs` - Program management
   - `/admin/memberships` - Membership approval
   - `/admin/enrollments` - Enrollment tracking

---

## Common Tasks

### Create a Program

```bash
curl -X POST http://localhost:3000/api/admin/programs \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "mtm-foundations",
    "title": "MTM Foundations",
    "category": "pharmacists",
    "level": "Certificate",
    "mode": "Online",
    "duration": "8 weeks",
    "fees_ksh": 28000,
    "summary": "Program description",
    "outcomes": ["Outcome 1"],
    "featured": true,
    "status": "published"
  }'
```

### Enroll a Student

```bash
curl -X POST http://localhost:3000/api/student/enrollments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{"program_id": "program-uuid"}'
```

### Approve Membership

```bash
curl -X POST http://localhost:3000/api/admin/membership/{id}/approve \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Approved - excellent qualifications",
    "adminId": "admin-uuid"
  }'
```

---

## Documentation

- **[SETUP.md](./SETUP.md)** - Quick start and local development
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide
- **[CPANEL_DEPLOYMENT.md](./CPANEL_DEPLOYMENT.md)** - cPanel specific setup
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Technical details

---

## Security

- ✅ Row Level Security (RLS) policies
- ✅ Admin authentication required
- ✅ Input validation on all endpoints
- ✅ SQL injection prevention
- ✅ Security headers on all responses
- ✅ Environment variables for secrets
- ✅ .gitignore configured for safety

---

## Troubleshooting

### Application Won't Start

```bash
# Check environment variables
cat .env.local

# Test database connection
psql $DATABASE_URL -c "SELECT 1"

# Rebuild application
npm run build

# Check logs
npm run start
```

### Build Fails

```bash
# Clear cache
rm -rf .next node_modules package-lock.json

# Reinstall
npm install

# Rebuild
npm run build
```

See [SETUP.md](./SETUP.md) for more troubleshooting tips.

---

## Performance Optimization

- ✅ Next.js standalone build for reduced server load
- ✅ Database indexes on frequently queried columns
- ✅ Image optimization enabled
- ✅ Code splitting and lazy loading
- ✅ Security headers for page performance
- ✅ CSS purging enabled

---

## Monitoring & Maintenance

### Regular Tasks

- Monitor server logs
- Update dependencies: `npm audit fix`
- Backup database weekly
- Review admin access logs
- Test disaster recovery

### Recommended Tools

- PM2 for process monitoring
- Sentry for error tracking
- Supabase dashboard for database metrics
- LogRocket for user session replay

---

## Support & Resources

- **Next.js**: https://nextjs.org/docs
- **Supabase**: https://supabase.com/docs
- **PostgreSQL**: https://www.postgresql.org/docs/
- **PM2**: https://pm2.keymetrics.io/

---

## Version Information

- **Node.js**: 18.0.0+
- **Next.js**: 16.2.6
- **React**: 19.2+
- **PostgreSQL**: 12+
- **Supabase**: Latest

---

## License

Private project - AMTMTI Platform

---

## Summary

The AMTMTI Platform is a complete course management solution with:

✅ Full program administration  
✅ Student enrollment workflows  
✅ Membership approval system  
✅ Auto-membership creation on enrollment  
✅ Comprehensive admin dashboard  
✅ Optimized for cPanel hosting  
✅ Cloud-ready architecture  
✅ Complete documentation  

**Status**: Production Ready

**Next Steps**:
1. Read [SETUP.md](./SETUP.md) for local development
2. Read [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment
3. Configure `.env.local`
4. Build and test: `npm run build && npm start`
5. Deploy to your environment

---

**Last Updated**: June 24, 2026  
**Status**: ✅ **READY FOR PRODUCTION**
