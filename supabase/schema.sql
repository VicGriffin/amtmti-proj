CREATE TABLE program_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE programs
ADD COLUMN category_id UUID REFERENCES program_categories(id);

CREATE INDEX idx_programs_category_id ON programs(category_id);