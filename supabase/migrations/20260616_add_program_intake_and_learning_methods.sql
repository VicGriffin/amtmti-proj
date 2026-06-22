-- Add intake, image and learning_methods columns to programs
alter table public.programs
  add column if not exists intake text not null default 'Rolling enrolment';

alter table public.programs
  add column if not exists image text;

alter table public.programs
  add column if not exists learning_methods text[] not null default array[
    'Guided modules with readings, case studies, and assessments.',
    'Live sessions and interactive clinics with faculty and peers.',
    'Applied practice tasks that translate learning into patient impact.'
  ];
