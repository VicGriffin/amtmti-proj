-- AMTMTI Platform — Seed data
-- Run after 001_schema.sql and 002_rls.sql

-- ---------------------------------------------------------------------------
-- Program categories
-- ---------------------------------------------------------------------------
insert into public.program_categories (slug, title, description) values
  ('clinicians', 'Clinicians', 'Advanced MTM competencies for frontline clinical decision-making.'),
  ('nurses', 'Nurses', 'Medication safety and adherence training for nursing practice.'),
  ('pharmaceutical-technicians', 'Pharmaceutical Technicians', 'Foundational dispensing and pharmaceutical care skills.'),
  ('pharmaceutical-technologists', 'Pharmaceutical Technologists', 'Technical mastery across the medicines management chain.'),
  ('pharmacists', 'Pharmacists', 'Comprehensive MTM, clinical pharmacy and postgraduate pathways.'),
  ('physicians', 'Physicians', 'Collaborative prescribing and therapeutic optimisation.')
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description;

insert into public.programs (slug, title, category, category_label, level, programme, mode, duration, fees_ksh, summary, outcomes, image, intake, learning_methods, featured) values
  ('mtm-foundations-certificate', 'MTM Foundations Certificate', 'pharmacists', 'Pharmacists', 'Certificate', 'MTM courses', 'Online', '8 weeks', 28000,
    'Build a solid grounding in medication therapy management principles, patient assessment, and care planning.',
    array['Conduct comprehensive medication reviews','Develop patient-centred care plans','Document MTM interventions effectively'], '/images/MTM_for_Pharmacists.png', 'Rolling enrolment', array[
      'Guided modules with readings, case studies, and assessments.',
      'Live sessions and interactive clinics with faculty and peers.',
      'Applied practice tasks that translate learning into patient impact.'
    ], true),
  ('clinical-pharmacy-diploma', 'Clinical Pharmacy Diploma', 'pharmacists', 'Pharmacists', 'Diploma', 'Diploma courses', 'Hybrid', '12 months', 145000,
    'An in-depth clinical programme preparing pharmacists for advanced ward-based and ambulatory care roles.',
    array['Lead therapeutic drug monitoring','Optimise complex medication regimens','Collaborate within multidisciplinary teams'], '/images/clinical_pharmacy.png', 'Rolling enrolment', array[
      'Guided modules with readings, case studies, and assessments.',
      'Live sessions and interactive clinics with faculty and peers.',
      'Applied practice tasks that translate learning into patient impact.'
    ], true),
  ('postgraduate-diploma-mtm', 'Postgraduate Diploma in MTM', 'pharmacists', 'Pharmacists', 'Postgraduate Diploma', 'Diploma courses', 'Hybrid', '18 months', 320000,
    'Our flagship postgraduate pathway for clinical leaders driving medication safety at a systems level.',
    array['Design medication safety programmes','Lead clinical governance initiatives','Conduct practice-based research'], '/images/Pharmaceutical_care.png', 'Rolling enrolment', array[
      'Guided modules with readings, case studies, and assessments.',
      'Live sessions and interactive clinics with faculty and peers.',
      'Applied practice tasks that translate learning into patient impact.'
    ], true),
  ('medication-safety-clinicians', 'Medication Therapy for Clinicians', 'clinicians', 'Clinicians', 'CPD Course', 'Professional Development Courses', 'Online', '4 weeks', 18000,
    'A focused CPD course equipping clinicians with practical medication safety and prescribing tools.',
    array['Identify high-risk prescribing patterns','Apply safe prescribing frameworks','Reduce preventable medication harm'], '/images/MTM_for_Clinicians.png', 'Rolling enrolment', array[
      'Guided modules with readings, case studies, and assessments.',
      'Live sessions and interactive clinics with faculty and peers.',
      'Applied practice tasks that translate learning into patient impact.'
    ], true),
  ('adherence-nursing-certificate', 'Medication Adherence for Nurses', 'nurses', 'Nurses', 'Certificate', 'Certificate courses', 'Online', '6 weeks', 22000,
    'Practical adherence counselling and medication management skills tailored for nursing practice.',
    array['Deliver effective adherence counselling','Support safe medication administration','Educate patients on therapy plans'], '/images/MTM_for_Nurses.png', 'Rolling enrolment', array[
      'Guided modules with readings, case studies, and assessments.',
      'Live sessions and interactive clinics with faculty and peers.',
      'Applied practice tasks that translate learning into patient impact.'
    ], false),
  ('dispensing-technicians-certificate', 'Advanced Dispensing Certificate', 'pharmaceutical-technicians', 'Pharmaceutical Technicians', 'Certificate', 'Certificate courses', 'In-Person', '10 weeks', 26000,
    'Strengthen dispensing accuracy, inventory practice, and patient interaction for technicians.',
    array['Apply accurate dispensing protocols','Manage pharmaceutical inventory','Support pharmaceutical care delivery'], '/images/MTM_for_Pharmaceutical Technicians.jpg', 'Rolling enrolment', array[
      'Guided modules with readings, case studies, and assessments.',
      'Live sessions and interactive clinics with faculty and peers.',
      'Applied practice tasks that translate learning into patient impact.'
    ], false),
  ('pharmaceutical-technology-diploma', 'Pharmaceutical Technology Diploma', 'pharmaceutical-technologists', 'Pharmaceutical Technologists', 'Diploma', 'Diploma courses', 'Hybrid', '12 months', 138000,
    'Technical mastery across formulation, quality, and the medicines management chain.',
    array['Apply quality assurance standards','Support formulation and compounding','Manage the medicines supply chain'], '/images/MTM_for_Pharmaceutical Technologists.png', 'Rolling enrolment', array[
      'Guided modules with readings, case studies, and assessments.',
      'Live sessions and interactive clinics with faculty and peers.',
      'Applied practice tasks that translate learning into patient impact.'
    ], false),
  ('collaborative-prescribing-physicians', 'Collaborative Prescribing for Physicians', 'physicians', 'Physicians', 'CPD Course', 'Professional Development Courses', 'Online', '5 weeks', 24000,
    'Therapeutic optimisation and collaborative MTM practice for prescribing physicians.',
    array['Integrate MTM into clinical workflows','Optimise therapy in complex patients','Collaborate with pharmacy teams'], '/images/MTM_for_Physicians.png', 'Rolling enrolment', array[
      'Guided modules with readings, case studies, and assessments.',
      'Live sessions and interactive clinics with faculty and peers.',
      'Applied practice tasks that translate learning into patient impact.'
    ], false),
  ('antimicrobial-stewardship-certificate', 'Antimicrobial Stewardship Certificate', 'clinicians', 'Clinicians', 'Certificate', 'Certificate courses', 'Online', '6 weeks', 26000,
    'Evidence-based antimicrobial stewardship training for clinicians in hospital and community settings.',
    array['Interpret resistance data','Apply stewardship principles','Support rational antimicrobial use'], NULL, 'Rolling enrolment', array[
      'Guided modules with readings, case studies, and assessments.',
      'Live sessions and interactive clinics with faculty and peers.',
      'Applied practice tasks that translate learning into patient impact.'
    ], false),
  ('patient-counselling-certificate', 'Patient Counselling Certificate', 'nurses', 'Nurses', 'Certificate', 'Certificate courses', 'Hybrid', '5 weeks', 22000,
    'Practical communication and counselling skills for improving medication adherence and patient outcomes.',
    array['Deliver person-centred education','Address adherence barriers','Document counselling outcomes'], NULL, 'Rolling enrolment', array[
      'Guided modules with readings, case studies, and assessments.',
      'Live sessions and interactive clinics with faculty and peers.',
      'Applied practice tasks that translate learning into patient impact.'
    ], false),
  ('mtm-pharmacists', 'Medication Therapy Management for Pharmacists', 'pharmacists', 'Pharmacists', 'Certificate', 'MTM courses', 'Online', '6 months', 45000,
    'MTM-focused coursework tailored for practising pharmacists.',
    array['Comprehensive medication reviews','Patient-centred care plans','MTM documentation'], NULL, 'Rolling enrolment', array[
      'Guided modules with readings, case studies, and assessments.',
      'Live sessions and interactive clinics with faculty and peers.',
      'Applied practice tasks that translate learning into patient impact.'
    ], false),
  ('mtm-pharmaceutical-technologists', 'Medication Therapy Management for Pharmaceutical Technologists', 'pharmaceutical-technologists', 'Pharmaceutical Technologists', 'Certificate', 'MTM courses', 'Online', '6 months', 42000,
    'MTM adaptations for technologists working across formulation and quality assurance.',
    array['Medicines optimisation','Quality-focused MTM','Interprofessional collaboration'], NULL, 'Rolling enrolment', array[
      'Guided modules with readings, case studies, and assessments.',
      'Live sessions and interactive clinics with faculty and peers.',
      'Applied practice tasks that translate learning into patient impact.'
    ], false),
  ('mtm-technicians', 'Medication Therapy Management for Pharmaceutical Technicians', 'pharmaceutical-technicians', 'Pharmaceutical Technicians', 'Certificate', 'MTM courses', 'Online', '4 months', 30000,
    'Practical MTM skills for dispensing technicians and frontline pharmacy staff.',
    array['Safe dispensing practices','Basic MTM interventions','Patient counselling'], NULL, 'Rolling enrolment', array[
      'Guided modules with readings, case studies, and assessments.',
      'Live sessions and interactive clinics with faculty and peers.',
      'Applied practice tasks that translate learning into patient impact.'
    ], false),
  ('mtm-clinicians', 'Medication Therapy Management for Clinicians', 'clinicians', 'Clinicians', 'CPD Course', 'Professional Development Courses', 'Online', '4 weeks', 18000,
    'Short, practical CPD for clinicians on medication safety and optimisation.',
    array['Recognise high-risk prescribing','Apply stewardship principles','Improve prescribing safety'], NULL, 'Rolling enrolment', array[
      'Guided modules with readings, case studies, and assessments.',
      'Live sessions and interactive clinics with faculty and peers.',
      'Applied practice tasks that translate learning into patient impact.'
    ], false),
  ('mtm-physicians', 'Medication Therapy Management for Physicians', 'physicians', 'Physicians', 'CPD Course', 'Professional Development Courses', 'Online', '5 weeks', 24000,
    'Focused MTM practice for prescribing physicians to support therapeutic optimisation.',
    array['Therapeutic optimisation','Interprofessional collaboration','Complex case management'], NULL, 'Rolling enrolment', array[
      'Guided modules with readings, case studies, and assessments.',
      'Live sessions and interactive clinics with faculty and peers.',
      'Applied practice tasks that translate learning into patient impact.'
    ], false),
  ('mtm-nurses', 'Medication Therapy Management for Nurses', 'nurses', 'Nurses', 'Certificate', 'MTM courses', 'Online', '6 weeks', 22000,
    'Practical MTM and adherence counselling skills for nursing practice.',
    array['Adherence counselling','Medication safety checks','Patient education'], NULL, 'Rolling enrolment', array[
      'Guided modules with readings, case studies, and assessments.',
      'Live sessions and interactive clinics with faculty and peers.',
      'Applied practice tasks that translate learning into patient impact.'
    ], false)
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  category_label = excluded.category_label,
  level = excluded.level,
  programme = excluded.programme,
  mode = excluded.mode,
  duration = excluded.duration,
  fees_ksh = excluded.fees_ksh,
  summary = excluded.summary,
  outcomes = excluded.outcomes,
  image = excluded.image,
  intake = excluded.intake,
  learning_methods = excluded.learning_methods,
  featured = excluded.featured,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- Lessons for the flagship programs
-- ---------------------------------------------------------------------------
insert into public.lessons (program_slug, title, description, position) values
  ('mtm-foundations-certificate', 'Introduction to Medication Therapy Management', 'Overview of MTM and its role in modern care.', 1),
  ('mtm-foundations-certificate', 'Patient Assessment Fundamentals', 'Structured approaches to assessing patients.', 2),
  ('mtm-foundations-certificate', 'Building a Care Plan', 'Designing patient-centred care plans.', 3),
  ('mtm-foundations-certificate', 'Documentation & Follow-up', 'Recording interventions and outcomes.', 4),
  ('clinical-pharmacy-diploma', 'Advanced Pharmacotherapy', 'Deep dive into complex regimens.', 1),
  ('clinical-pharmacy-diploma', 'Therapeutic Drug Monitoring', 'Principles and applied practice.', 2),
  ('clinical-pharmacy-diploma', 'Ward-based Clinical Practice', 'Working within multidisciplinary teams.', 3),
  ('medication-safety-clinicians', 'High-risk Prescribing', 'Recognising dangerous patterns.', 1),
  ('medication-safety-clinicians', 'Safe Prescribing Frameworks', 'Applying systematic safeguards.', 2)
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- News
-- ---------------------------------------------------------------------------
insert into public.news (slug, title, excerpt, body, category, featured) values
  ('amtmti-expands-to-12-countries', 'AMTMTI Expands MTM Training to 12 African Countries', 'A new wave of partnerships brings accredited training to thousands more professionals.', 'AMTMTI is proud to announce expansion across 12 countries through new institutional partnerships...', 'Partnerships', true),
  ('medication-safety-symposium-2026', 'Annual Medication Therapy Symposium Returns', 'Leading researchers gather to share the latest evidence in medication safety.', 'The 2026 symposium will convene experts from across the continent...', 'Events', false),
  ('new-postgraduate-cohort', 'New Postgraduate Diploma Cohort Opens', 'Applications are now open for the flagship postgraduate pathway.', 'Our flagship Postgraduate Diploma in MTM welcomes its newest cohort...', 'Announcements', false)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Events
-- ---------------------------------------------------------------------------
insert into public.events (title, description, location, starts_at, speakers) values
  ('Medication Therapy Symposium 2026', 'A continent-wide gathering of MTM researchers and practitioners.', 'Nairobi, Kenya', now() + interval '45 days', array['Prof. Wanjiru Kamau','Dr. Fatima El-Hassan']),
  ('Clinical Pharmacy Masterclass', 'Hands-on training for advanced clinical practice.', 'Online', now() + interval '20 days', array['Dr. Samuel Okoro'])
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Research projects & publications
-- ---------------------------------------------------------------------------
insert into public.research_projects (title, area, summary, status) values
  ('Multi-country Medication Therapy Surveillance', 'Medication Therapy', 'Establishing a shared adverse event reporting framework.', 'active'),
  ('Adherence Interventions in Chronic Care', 'Medication Adherence', 'Evaluating behavioural interventions across primary care.', 'active'),
  ('Clinical Pharmacy Integration Study', 'Clinical Pharmacy', 'Measuring outcomes of embedded pharmacists in wards.', 'completed')
on conflict do nothing;

insert into public.publications (title, authors, journal, year) values
  ('Medication Therapy Management in African Primary Care', 'Kamau W, Okoro S', 'African Journal of Pharmacy', 2025),
  ('Reducing Preventable Medication Harm: A Systems Approach', 'El-Hassan F, et al.', 'Global Health Action', 2024)
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Partners
-- ---------------------------------------------------------------------------
insert into public.partners (name, display_order) values
  ('University of Nairobi', 1),
  ('Kenyatta National Hospital', 2),
  ('WHO AFRO', 3),
  ('Makerere University', 4),
  ('Aga Khan University', 5),
  ('Pharmacy & Poisons Board', 6),
  ('Africa CDC', 7),
  ('University of Ghana', 8)
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Resources
-- ---------------------------------------------------------------------------
insert into public.resources (title, description, category, access) values
  ('MTM Patient Assessment Toolkit', 'A practical toolkit for structured medication reviews.', 'Toolkits', 'public'),
  ('Safe Prescribing Quick Reference', 'Pocket guide to safe prescribing frameworks.', 'Guides', 'public'),
  ('Clinical Pharmacy Case Studies', 'Worked case studies for diploma students.', 'Case Studies', 'course')
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Global announcement (broadcast notification)
-- ---------------------------------------------------------------------------
insert into public.notifications (user_id, title, body, type) values
  (null, 'Welcome to AMTMTI', 'Explore your programs and resources from your dashboard.', 'announcement')
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Promote the admin account (run AFTER the admin user has signed up via /admin/login bootstrap)
-- Replace the email with your ADMIN_EMAIL value if different.
-- ---------------------------------------------------------------------------
-- update public.profiles set role = 'admin' where email = 'admin@amtmti.africa';
