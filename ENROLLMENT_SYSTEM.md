# AMTMTI Program Enrollment System - Enhancement Documentation

## Overview
The AMTMTI Program Enrollment Form has been completely refactored and enhanced to create a professional, comprehensive admissions experience that captures complete applicant information, program details, payment tracking, and generates detailed notification emails for both applicants and administrators.

---

## What's New

### 1. Enhanced Form Workflow (5-Step Process)

The enrollment form now guides applicants through a comprehensive 5-step journey:

#### **Step 1: Contact Information**
- First Name *
- Last Name *
- Email Address *
- Phone Number *
- Validation: Phone uses E.164 international format

#### **Step 2: Personal Details**
- Country * (15+ countries including East Africa)
- Region / County *
- Date of Birth * (18+ years required)
- Gender (optional)

#### **Step 3: Program Selection**
- Intake Month * (January, March, May, July, September, November)
- Course Type * (Certificate, Diploma, Artisan, Short Course)
- Course Selection * (dynamically filtered by type)
- Program details auto-populate from database

#### **Step 4: Professional Information** ⭐ NEW
- Highest Education Level * (Secondary through Doctorate)
- Current Profession * (Pharmacist, Nurse, Physician, etc.)
- Current Employer/Institution *
- Years of Experience * (Less than 1 Year through 15+ Years)
- Preferred Learning Mode * (Online, Hybrid, In-Person)
- Why Interested in Program * (Textarea, min. 10 characters)

#### **Step 5: Application Review** ⭐ NEW
- Complete application summary card displaying:
  - Applicant Information (Name, Email, Phone, Location, DOB)
  - Professional Background (Education, Profession, Employer, Experience)
  - Program Details (Name, Type, Category, Duration, Study Mode, Intake, Fee)
  - Status Indicators (Application: Pending Review, Payment: Pending)
  - Applicant's Interest Reason

### 2. Program Details Auto-Population

When a course is selected:
- **Program Name** - Automatically fetched from database
- **Category** - Program classification
- **Duration** - e.g., "6 Months"
- **Study Mode** - Online/Hybrid/In-Person
- **Fee** - Displayed in Kenyan Shillings (KES) - prevents surprises at submission

**Database Fields Added to `enrollment_applications` Table:**
```sql
program_category text
program_duration text
program_study_mode text
program_fee integer
```

### 3. Comprehensive Application Data Capture

**Education & Professional Background:**
```
highest_education text          -- Secondary School through Doctorate
current_profession text         -- Pharmacist, Nurse, Physician, etc.
employer text                   -- Current employer or institution
years_of_experience text        -- Experience bracket: Less than 1 Year through 15+ Years
interest_reason text            -- Why applicant is interested in program
preferred_learning_mode text    -- Online/Hybrid/In-Person preference
```

### 4. Status Tracking

**Application Status Workflow:**
```
application_status: 'Pending Review' → 'Reviewed' → 'Accepted' / 'Rejected'
payment_status: 'Pending' → 'Completed' / 'Failed'
email_status: 'pending' → 'sent' / 'failed'
```

---

## Database Schema Updates

### Modified Table: `enrollment_applications`

```sql
CREATE TABLE public.enrollment_applications (
  -- Existing fields
  id uuid PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  country text,
  region text,
  date_of_birth text,
  gender text,
  intake text,
  course_type text,
  course_id text,
  course_name text,
  
  -- NEW: Program Details (auto-populated from programs table)
  program_category text,
  program_duration text,
  program_study_mode text,
  program_fee integer,
  
  -- NEW: Professional Information
  highest_education text,
  current_profession text,
  employer text,
  years_of_experience text,
  interest_reason text,
  preferred_learning_mode text,
  
  -- NEW: Enhanced Status Tracking
  application_status text DEFAULT 'Pending Review' CHECK (...),
  payment_status text DEFAULT 'Pending' CHECK (...),
  
  -- Existing tracking fields
  source text DEFAULT 'web_form',
  email_status text DEFAULT 'pending' CHECK (...),
  created_at timestamptz DEFAULT now()
);
```

**Files Updated:**
- `supabase/migrations/20260613160226_init.sql`
- `scripts/001_schema.sql`

---

## Frontend Components

### New Components Created:

**1. `components/marketing/enrollment-step-4.tsx`** ⭐ NEW
- Professional information capture form
- Select dropdowns for education, profession, experience
- Text input for employer
- Textarea for interest reason
- Full validation with Zod

**2. `components/marketing/enrollment-step-5.tsx`** ⭐ NEW
- Application review and confirmation screen
- Displays complete application summary
- Shows program fee prominently
- Status badges (Application, Payment)
- Confirmation message before submission

### Modified Components:

**`components/marketing/enrollment-modal.tsx`**
- Updated to support 5 steps (was 3)
- Progress bar now shows "Step X of 5"
- Program details lookup and display
- Enhanced data flow to API

**`hooks/useEnrollmentForm.ts`**
- Extended initial state to include all new fields
- Added Step 4 validation logic
- Program details interface extended

---

## API Enhancements

### Updated: `app/api/enrollment/submit/route.ts`

**Key Features:**
- Fetches program details from Supabase `programs` table
- Automatically populates: `program_category`, `program_duration`, `program_study_mode`, `program_fee`
- Tracks email delivery status (pending → sent/failed)
- Updates email status in database after sending
- Comprehensive error handling

```typescript
// Fetches program fee from database
const { data: program } = await supabase
  .from('programs')
  .select('fees_ksh, category, duration, mode')
  .eq('id', validatedData.courseId)
  .single()
```

### New Admin APIs:

**`app/api/admin/enrollments/route.ts`** ⭐ NEW
- GET: Fetch all enrollment applications
- Requires admin authentication via cookie token
- Returns paginated list of applications

**`app/api/admin/enrollments/[id]/route.ts`** ⭐ NEW
- GET: Fetch individual enrollment details
- PATCH: Update application or payment status
- Requires admin authentication

---

## Email System Enhancements

### Admin Notification Email
**Subject:** `New Program Enrollment Application`
**Recipient:** `COMPANY_EMAIL`

**Includes:**
- ✅ Applicant Information (Name, Email, Phone, Location, DOB, Gender)
- ✅ Professional Information (Education, Profession, Employer, Experience)
- ✅ Program Information (Name, Category, Duration, Study Mode, Fee)
- ✅ Interest Reason
- ✅ Status (Application & Payment Status)
- ✅ Submission Timestamp

### Applicant Confirmation Email
**Subject:** `Your AMTMTI Program Application Has Been Received`
**Recipient:** Applicant's Email

**Includes:**
- ✅ Personalized greeting
- ✅ Program details summary
- ✅ Current status (Pending Review)
- ✅ Confirmation of fee information
- ✅ Timeline for next steps
- ✅ Contact information for questions

**Template Location:** `lib/email/templates/enrollment.ts`
**Email Module:** `lib/email/enrollment.ts`

**Features:**
- Professional HTML styling
- Currency formatting (KES)
- Date/time localization
- Accessible table layouts

---

## Admin Dashboard

### New Admin Pages:

**1. `app/admin/enrollments/page.tsx`** ⭐ NEW
**Enrollment Applications List**
- Displays all enrollment applications in sortable table
- Columns: Applicant Name, Email, Program, Fee, Application Status, Payment Status, Submitted Date
- Filters by application status
- Color-coded status badges
- CSV export functionality
- Quick-view links to detailed applications

**2. `app/admin/enrollments/[id]/page.tsx`** ⭐ NEW
**Enrollment Detail View**
- Complete application information
- Sections:
  - Contact Information (Email, Phone, Location)
  - Personal Information (DOB, Gender)
  - Professional Background (Education, Profession, Employer, Experience)
  - Program Information (Name, Type, Category, Duration, Study Mode, Fee)
  - Learning Preference
  - Interest Reason (Full text)
  - Management Controls (Status updates)
  - Metadata (Submission date, Email status)

**Status Management:**
- Update Application Status (Pending Review → Reviewed → Accepted/Rejected)
- Update Payment Status (Pending → Completed/Failed)
- Changes persist to database immediately
- Success/error toasts

### Updated Admin Dashboard:

**`app/admin/page.tsx`**
- Real-time stats cards:
  - Enrollments count
  - Contact Messages count
  - Membership Applications count
- Quick links to management pages
- Logout functionality

---

## Validation Schema

**File:** `lib/validations/enrollment.ts`

```typescript
// Step 4 - Professional Information
enrollmentStep4Schema = z.object({
  highestEducation: z.enum([...]),
  currentProfession: z.enum([...]),
  employer: z.string().min(1),
  yearsOfExperience: z.enum([...]),
  interestReason: z.string().min(10),
  preferredLearningMode: z.enum(['Online', 'Hybrid', 'In-Person']),
})
```

---

## Enrollment Flow Diagram

```
┌─────────────────────┐
│  Step 1: Contact    │ ← Basic contact info
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│  Step 2: Personal   │ ← Demographics
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│  Step 3: Program    │ ← Program selection + auto-fee fetch
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│  Step 4: Professional│ ← Background info
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│  Step 5: Review     │ ← Full summary + confirmation
└──────────┬──────────┘
           ↓
     [SUBMIT]
           ↓
┌─────────────────────┐
│  DB Insert          │ ← Saved to enrollment_applications
│  + Fee Lookup       │ ← Auto-populate from programs table
│  + Email Send       │ ← Admin + Applicant notifications
└─────────────────────┘
           ↓
┌─────────────────────┐
│  Success Screen     │ ← Confirmation shown
└─────────────────────┘
```

---

## Environment Variables Required

```env
# Email Configuration (existing)
RESEND_API_KEY=xxxxx
EMAIL_FROM=noreply@amtmti.africa
COMPANY_EMAIL=admissions@amtmti.africa

# Next.js Site URL
NEXT_PUBLIC_SITE_URL=https://amtmti.africa

# Admin Authentication
ADMIN_EMAIL=admin@amtmti.africa
ADMIN_PASSWORD=xxxxx

# Supabase
NEXT_PUBLIC_SUPABASE_URL=xxxxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx
```

---

## Production Readiness Checklist

✅ **Form Validation**
- All fields validated with Zod
- Type-safe throughout
- Error messages clear and helpful

✅ **Email Delivery**
- Admin notifications sent to admin inbox
- Applicant confirmations sent immediately
- Email status tracked in database
- Failed emails flagged for retry

✅ **Database**
- All fields properly indexed
- RLS policies enforced
- email_status tracking enabled
- Default values set

✅ **Admin Visibility**
- Complete enrollment list view
- Detailed application view
- Status update controls
- CSV export for reporting

✅ **UX/Accessibility**
- Framer Motion animations
- Loading states
- Error states with toasts
- Mobile responsive
- Accessible form labels

✅ **Security**
- Admin routes require authentication
- Program fees fetched server-side (not trusting client)
- Email templates sanitized
- Input validation on all endpoints

---

## Testing Recommendations

1. **Form Submission:**
   - Test all 5 steps with valid data
   - Test validation on each step
   - Test back/forward navigation
   - Test review screen displays correctly

2. **Program Details:**
   - Verify program fee displays before submission
   - Verify program details auto-populate in review screen
   - Test with different course types

3. **Email Delivery:**
   - Verify admin receives notification email
   - Verify applicant receives confirmation email
   - Check email formatting in different clients
   - Verify email_status updates in database

4. **Admin Dashboard:**
   - Test enrollment list filtering
   - Test status updates
   - Test CSV export
   - Test viewing individual applications

5. **Edge Cases:**
   - Test with special characters in fields
   - Test with very long interest reasons
   - Test international phone numbers
   - Test special characters in employer names

---

## File Changes Summary

### Database Migrations
- `supabase/migrations/20260613160226_init.sql` - Schema update
- `scripts/001_schema.sql` - Schema update (backup)
- `supabase/migrations/20260613160654_init.sql` - RLS update (added new tables)

### Frontend Components
- `components/marketing/enrollment-step-4.tsx` - NEW
- `components/marketing/enrollment-step-5.tsx` - NEW
- `components/marketing/enrollment-modal.tsx` - UPDATED
- `components/marketing/enrollment-step-1.tsx` - No changes
- `components/marketing/enrollment-step-2.tsx` - No changes
- `components/marketing/enrollment-step-3.tsx` - No changes

### Hooks
- `hooks/useEnrollmentForm.ts` - UPDATED

### Validation
- `lib/validations/enrollment.ts` - UPDATED

### Email System
- `lib/email/enrollment.ts` - UPDATED
- `lib/email/templates/enrollment.ts` - UPDATED

### API Routes
- `app/api/enrollment/submit/route.ts` - UPDATED
- `app/api/admin/enrollments/route.ts` - NEW
- `app/api/admin/enrollments/[id]/route.ts` - NEW

### Admin Pages
- `app/admin/page.tsx` - UPDATED
- `app/admin/enrollments/page.tsx` - NEW
- `app/admin/enrollments/[id]/page.tsx` - NEW

---

## Next Steps

1. **Deploy database migrations:**
   ```bash
   supabase db push
   ```

2. **Update seed data if needed:**
   - Ensure programs table has fees populated
   - Verify program categories and durations

3. **Test in development:**
   - Complete enrollment workflow
   - Email delivery
   - Admin dashboard

4. **Deploy to production:**
   - Run migrations
   - Verify email service
   - Monitor admin dashboard

5. **Monitor:**
   - Email delivery success rate
   - Application submission volume
   - Email status tracking

---

## Support & Troubleshooting

**Issue: Program fee not displaying**
- Verify programs table has fees_ksh populated
- Check network tab for API response
- Verify course_id is correctly selected

**Issue: Emails not sending**
- Check RESEND_API_KEY is set
- Check EMAIL_FROM format is valid
- Check COMPANY_EMAIL is correct
- Review error logs in /api/enrollment/submit

**Issue: Admin dashboard showing 0 enrollments**
- Verify admin_token cookie is set
- Check database has enrollment records
- Verify RLS policies allow admin access

---

## Production Checklist

Before going live:
- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] Email service tested with real addresses
- [ ] Admin authentication working
- [ ] CORS configured for email service
- [ ] SSL/TLS certificates valid
- [ ] Monitoring/alerting setup for email failures
- [ ] Backup strategy confirmed
- [ ] Rollback plan in place
