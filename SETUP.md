# AMTMTI Platform - Quick Setup Guide

## Project Overview

This is a full-stack course management platform with:
- **Frontend**: Next.js 16 with React 19
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Hosting**: Ready for cPanel, VPS, or cloud deployment

### Key Features Implemented

✅ **Program Management**
- Admin can create, update, delete programs
- Programs have categories, levels, modes, durations, fees, and learning methods
- Featured programs display on homepage

✅ **Student Enrollment**
- Students can enroll in programs via REST API
- Enrollment triggers automatic membership creation
- Enrollment statuses: active, completed, dropped, suspended

✅ **Membership System**
- Automatic creation when student enrolls
- Admin approval workflow with notes
- Rejection with reasons
- Membership statuses: pending, approved, rejected, suspended, cancelled

✅ **Admin Dashboard**
- Centralized admin interface at `/admin`
- Program management with full CRUD
- Membership approval/rejection system
- Enrollment tracking
- Contact message management

---

## Installation

### 1. Prerequisites

```bash
# Verify Node.js version (need v18+)
node --version

# Should output: v18.x.x or higher
```

### 2. Install Dependencies

```bash
# Clone the repository
git clone https://github.com/VicGriffin/amtmti-proj.git
cd amtmti-proj

# Install dependencies
npm install
# or
pnpm install
yarn install
```

### 3. Configure Environment

```bash
# Copy environment template
cp .env.example .env.local

# Edit with your values
nano .env.local
# or
code .env.local
```

**Required Environment Variables:**

```bash
# Supabase (get from https://supabase.com)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Admin credentials
ADMIN_EMAIL=admin@amtmti.africa
ADMIN_SECRET=your-secure-secret

# Email (choose one provider)
EMAIL_PROVIDER=nodemailer
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_PORT=465
EMAIL_SMTP_SECURE=true
EMAIL_SMTP_USER=your-gmail@gmail.com
EMAIL_SMTP_PASSWORD=your-app-password

# URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Node settings
NODE_ENV=development
PORT=3000
```

### 4. Local Testing

```bash
# Build the application
npm run build

# Start development server
npm run dev

# Or start production build
npm run start

# Visit http://localhost:3000
```

### 5. Access Admin Dashboard

1. Visit `http://localhost:3000/admin/login`
2. Enter credentials from `.env.local`:
   - Email: `admin@amtmti.africa`
   - Secret: `your-secure-secret`
3. Manage programs, memberships, enrollments

---

## API Endpoints

### Program Management (Admin)

```bash
# List all programs
GET /api/admin/programs

# Create program
POST /api/admin/programs
Content-Type: application/json
{
  "slug": "mtm-foundations",
  "title": "MTM Foundations",
  "category": "pharmacists",
  "category_label": "Pharmacists",
  "level": "Certificate",
  "mode": "Online",
  "duration": "8 weeks",
  "fees_ksh": 28000,
  "summary": "Program summary...",
  "outcomes": ["Outcome 1", "Outcome 2"],
  "featured": true,
  "status": "published"
}

# Update program
PUT /api/admin/programs
Content-Type: application/json
{
  "id": "program-uuid",
  ... (same fields as POST)
}

# Delete program
DELETE /api/admin/programs?id=program-uuid
```

### Membership Management (Admin)

```bash
# List pending memberships
GET /api/admin/membership/list?status=pending

# Approve membership
POST /api/admin/membership/{id}/approve
Content-Type: application/json
{
  "notes": "Approved - good qualifications",
  "adminId": "admin-uuid"
}

# Reject membership
POST /api/admin/membership/{id}/reject
Content-Type: application/json
{
  "reason": "Does not meet eligibility criteria",
  "adminId": "admin-uuid"
}
```

### Student Enrollment

```bash
# Get student enrollments
GET /api/student/enrollments
Authorization: Bearer {token}

# Create enrollment (auto-creates membership)
POST /api/student/enrollments
Authorization: Bearer {token}
Content-Type: application/json
{
  "program_id": "program-uuid"
}

# Response:
{
  "enrollment": { ... },
  "membership": { ... }
}
```

---

## Project Structure

```
amtmti-proj/
├── app/
│   ├── admin/                    # Admin dashboard
│   │   ├── programs/             # Program CRUD UI
│   │   ├── memberships/          # Membership approval UI
│   │   ├── enrollments/          # Enrollment management
│   │   ├── page.tsx              # Admin dashboard home
│   │   └── login/                # Admin login
│   ├── api/
│   │   ├── admin/
│   │   │   ├── programs/         # Program APIs
│   │   │   └── membership/       # Membership APIs
│   │   └── student/
│   │       └── enrollments/      # Student enrollment API
│   └── page.tsx                  # Public homepage
├── components/
│   ├── admin/                    # Admin UI components
│   ├── ui/                       # Reusable UI components
│   └── marketing/                # Marketing components
├── lib/
│   ├── supabase/                 # Supabase client setup
│   ├── admin-auth.ts             # Admin authentication
│   └── admin-token.ts            # Token verification
├── supabase/
│   └── migrations/               # Database migrations
├── public/                       # Static assets
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies
├── server.js                     # Production server
├── .env.example                  # Environment template
├── DEPLOYMENT.md                 # Full deployment guide
├── CPANEL_DEPLOYMENT.md          # cPanel specific guide
└── deploy.sh                     # Deployment script
```

---

## Database Schema

### enrollments
- `id` - UUID primary key
- `user_id` - References auth.users
- `program_id` - References programs
- `status` - active | completed | dropped | suspended
- `enrolled_at` - Enrollment timestamp
- `completed_at` - Completion timestamp

### memberships
- `id` - UUID primary key
- `user_id` - References auth.users
- `enrollment_id` - References enrollments
- `program_id` - References programs
- `status` - pending | approved | rejected | suspended | cancelled
- `tier` - student | staff | partner
- `approval_notes` - Admin notes for approval
- `rejection_reason` - Reason for rejection
- `approved_at` - When approved
- `approved_by` - Admin who approved

### programs (existing)
- `id` - UUID primary key
- `slug` - URL-friendly identifier
- `title` - Program name
- `category` - Program category
- `level` - Certificate | Diploma | Postgraduate
- `mode` - Online | In-Person | Hybrid
- `duration` - Course duration
- `fees_ksh` - Program cost
- `summary` - Program description
- `outcomes` - Learning outcomes (array)
- `featured` - Show on homepage
- `status` - draft | published
- `intake` - Enrollment availability
- `learning_methods` - Teaching methods (array)

---

## Deployment

### For cPanel

1. **Upload files** via File Manager or SCP
2. **Create Node.js app** in cPanel
3. **Set environment variables** in cPanel
4. **Run build**: `npm run build`
5. **Start application**: `npm start`

See `CPANEL_DEPLOYMENT.md` for detailed instructions.

### For VPS/Traditional Hosting

1. **SSH into server**
2. **Install Node.js** v18+
3. **Upload project**
4. **Create `.env.local`** with credentials
5. **Build**: `npm run build`
6. **Use PM2**: `pm2 start "npm start" --name "amtmti"`

See `DEPLOYMENT.md` for detailed instructions.

### For Cloud (Vercel, AWS, etc.)

See `DEPLOYMENT.md` for cloud-specific instructions.

---

## Common Tasks

### Create a New Program

```bash
# Via API
curl -X POST http://localhost:3000/api/admin/programs \
  -H "Content-Type: application/json" \
  -H "Cookie: amtmti_admin=your-token" \
  -d '{
    "slug": "new-program",
    "title": "New Program",
    "category": "pharmacists",
    "category_label": "Pharmacists",
    "level": "Certificate",
    "mode": "Online",
    "duration": "6 weeks",
    "fees_ksh": 25000,
    "summary": "Program description",
    "outcomes": ["Outcome 1"],
    "featured": false,
    "status": "published"
  }'

# Or use Admin UI: /admin/programs → Create Program
```

### Approve a Membership

```bash
# Via API
curl -X POST http://localhost:3000/api/admin/membership/{id}/approve \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Approved",
    "adminId": "admin-user-id"
  }'

# Or use Admin UI: /admin/memberships → Expand → Approve
```

### Enroll a Student in a Program

```bash
# Via API (requires student auth token)
curl -X POST http://localhost:3000/api/student/enrollments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {student-token}" \
  -d '{
    "program_id": "program-uuid"
  }'

# Returns: { enrollment: {...}, membership: {...} }
```

---

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Error

- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set
- Check Supabase project is active
- Verify database migrations have run

### Admin Login Not Working

- Verify `ADMIN_EMAIL` and `ADMIN_SECRET` in `.env.local`
- Check that admin token is being set correctly
- Clear browser cookies and try again

### Port Already in Use

```bash
# Change port
PORT=3001 npm start

# Or kill existing process
lsof -i :3000
kill -9 <PID>
```

### Email Not Sending

- Verify `EMAIL_SMTP_HOST`, `EMAIL_SMTP_USER`, `EMAIL_SMTP_PASSWORD`
- For Gmail: use App Password, not regular password
- Check spam/promotions folder
- Verify sender email in SMTP account

---

## Security

- ✅ Never commit `.env.local` to git
- ✅ Use strong admin credentials
- ✅ Enable HTTPS in production
- ✅ Keep dependencies updated: `npm audit fix`
- ✅ Restrict database access
- ✅ Use environment variables for all secrets
- ✅ Implement rate limiting (if needed)
- ✅ Monitor access logs

---

## Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Repository**: https://github.com/VicGriffin/amtmti-proj

---

## Version Information

- **Node.js**: 18.0.0+
- **Next.js**: 16.2.6
- **React**: 19.2+
- **PostgreSQL**: 12+
- **Supabase Auth**: v2

---

**Last Updated**: June 24, 2026
**Status**: ✅ Ready for Deployment
