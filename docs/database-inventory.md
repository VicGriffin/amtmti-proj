---
name: database-inventory
description: Definitive inventory of core database tables for migration
metadata:
  type: reference
---

# Database Inventory

The following tables are part of the core application data model that will be migrated from Supabase to Prisma/PostgreSQL. Only these tables are required for the current migration phase.

---

## `profiles`
| Column | Type | Constraints / Defaults |
|--------|------|--------------------------|
| `id` | `uuid` | Primary key, references `auth.users(id)`, `ON DELETE CASCADE` |
| `full_name` | `text` | nullable |
| `email` | `text` | nullable |
| `phone` | `text` | nullable |
| `country` | `text` | nullable |
| `profession` | `text` | nullable |
| `role` | `text` | **NOT NULL**, default `'student'`, check `role IN ('student', 'admin')` |
| `status` | `text` | **NOT NULL**, default `'active'`, check `status IN ('active', 'suspended')` |
| `created_at` | `timestamptz` | **NOT NULL**, default `now()` |
| `updated_at` | `timestamptz` | **NOT NULL**, default `now()` |
| **Indexes** | | Trigger `set_updated_at` updates `updated_at` on row change |

---

## `program_categories`
| Column | Type | Constraints / Defaults |
|--------|------|--------------------------|
| `id` | `uuid` | Primary key, default `gen_random_uuid()` |
| `slug` | `text` | **UNIQUE**, **NOT NULL** |
| `title` | `text` | **NOT NULL** |
| `description` | `text` | nullable |
| `created_at` | `timestamptz` | **NOT NULL**, default `now()` |
| **Indexes** | | None beyond primary key and unique `slug` |

---

## `membership_applications`
| Column | Type | Constraints / Defaults |
|--------|------|--------------------------|
| `id` | `uuid` | Primary key, default `gen_random_uuid()` |
| `user_id` | `uuid` | References `auth.users(id)`, `ON DELETE SET NULL` |
| `name` | `text` | **NOT NULL** |
| `email` | `text` | **NOT NULL** |
| `organization` | `text` | nullable |
| `country` | `text` | nullable |
| `profession` | `text` | nullable |
| `tier` | `text` | **NOT NULL** |
| `reason` | `text` | nullable |
| `email_status` | `text` | **NOT NULL**, default `'pending'`, check `email_status IN ('pending','sent','failed')` |
| `status` | `text` | **NOT NULL**, default `'pending'`, check `status IN ('pending','approved','rejected')` |
| `notes` | `text` | nullable |
| `created_at` | `timestamptz` | **NOT NULL**, default `now()` |
| **Indexes** | | None beyond primary key |

---

## `enrollment_applications`
| Column | Type | Constraints / Defaults |
|--------|------|--------------------------|
| `id` | `uuid` | Primary key, default `gen_random_uuid()` |
| `first_name` | `text` | **NOT NULL** |
| `last_name` | `text` | **NOT NULL** |
| `email` | `text` | **NOT NULL** |
| `phone` | `text` | nullable |
| `country` | `text` | nullable |
| `region` | `text` | nullable |
| `date_of_birth` | `text` | nullable |
| `gender` | `text` | nullable |
| `intake` | `text` | nullable |
| `course_type` | `text` | nullable |
| `course_id` | `text` | nullable |
| `course_name` | `text` | nullable |
| `program_category` | `text` | nullable |
| `program_duration` | `text` | nullable |
| `program_study_mode` | `text` | nullable |
| `program_fee` | `integer` | nullable |
| `highest_education` | `text` | nullable |
| `current_profession` | `text` | nullable |
| `employer` | `text` | nullable |
| `years_of_experience` | `text` | nullable |
| `interest_reason` | `text` | nullable |
| `preferred_learning_mode` | `text` | nullable |
| `application_status` | `text` | **NOT NULL**, default `'Pending Review'`, check `application_status IN ('Pending Review','Reviewed','Accepted','Rejected')` |
| `payment_status` | `text` | **NOT NULL**, default `'Pending'`, check `payment_status IN ('Pending','Completed','Failed')` |
| `source` | `text` | **NOT NULL**, default `'web_form'` |
| `email_status` | `text` | **NOT NULL**, default `'pending'`, check `email_status IN ('pending','sent','failed')` |
| `created_at` | `timestamptz` | **NOT NULL**, default `now()` |
| **Indexes** | | None beyond primary key |

---

## `contact_messages`
| Column | Type | Constraints / Defaults |
|--------|------|--------------------------|
| `id` | `uuid` | Primary key, default `gen_random_uuid()` |
| `name` | `text` | **NOT NULL** |
| `email` | `text` | **NOT NULL** |
| `phone` | `text` | nullable |
| `subject` | `text` | nullable |
| `inquiry_type` | `text` | nullable |
| `source` | `text` | **NOT NULL**, default `'web_form'` |
| `message` | `text` | **NOT NULL** |
| `email_status` | `text` | **NOT NULL**, default `'pending'`, check `email_status IN ('pending','sent','failed')` |
| `status` | `text` | **NOT NULL**, default `'new'`, check `status IN ('new','replied','archived')` |
| `created_at` | `timestamptz` | **NOT NULL**, default `now()` |
| **Indexes** | | None beyond primary key |

---

## `newsletter_subscribers`
| Column | Type | Constraints / Defaults |
|--------|------|--------------------------|
| `id` | `uuid` | Primary key, default `gen_random_uuid()` |
| `email` | `text` | **UNIQUE**, **NOT NULL** |
| `status` | `text` | **NOT NULL**, default `'Active'`, check `status IN ('Active','Cancelled')` |
| `email_status` | `text` | **NOT NULL**, default `'pending'`, check `email_status IN ('pending','sent','failed')` |
| `source` | `text` | **NOT NULL**, default `'web_form'` |
| `created_at` | `timestamptz` | **NOT NULL**, default `now()` |
| **Indexes** | | None beyond primary key and unique `email` |

---

## `programs`
| Column | Type | Constraints / Defaults |
|--------|------|--------------------------|
| `id` | `uuid` | Primary key, default `gen_random_uuid()` |
| `slug` | `text` | **UNIQUE**, **NOT NULL** |
| `title` | `text` | **NOT NULL** |
| `category` | `text` | **NOT NULL** |
| `category_label` | `text` | **NOT NULL** |
| `level` | `text` | **NOT NULL** |
| `mode` | `text` | **NOT NULL** |
| `duration` | `text` | nullable |
| `fees_ksh` | `integer` | **NOT NULL**, default `0` |
| `summary` | `text` | nullable |
| `outcomes` | `text[]` | default `'{}'` |
| `featured` | `boolean` | **NOT NULL**, default `false` |
| `status` | `text` | **NOT NULL**, default `'published'`, check `status IN ('draft','published','archived')` |
| `created_at` | `timestamptz` | **NOT NULL**, default `now()` |
| `updated_at` | `timestamptz` | **NOT NULL**, default `now()` |
| **Indexes** | | `idx_programs_category_id` (added later via migration), `idx_programs_status` on `status` |
---
