-- Add programme column to programs table
alter table public.programs
add column programme text;

-- Update existing programs with their programme categories
update public.programs set programme = 'MTM courses' where slug in (
  'mtm-foundations-certificate',
  'mtm-pharmacists',
  'mtm-pharmaceutical-technologists',
  'mtm-technicians',
  'mtm-nurses'
);

update public.programs set programme = 'Professional Development Courses' where slug in (
  'mtm-clinicians',
  'mtm-physicians'
);

update public.programs set programme = 'Certificate courses' where level = 'Certificate' and programme is null;

update public.programs set programme = 'Diploma courses' where level = 'Diploma' and programme is null;

update public.programs set programme = 'Short courses' where level = 'CPD Course' and programme is null;
