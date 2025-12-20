-- SQL script to create the our_story_section table in Supabase

CREATE TABLE IF NOT EXISTS our_story_section (
  id SERIAL PRIMARY KEY,
  title TEXT,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_our_story_section_updated_at ON our_story_section;
CREATE TRIGGER update_our_story_section_updated_at
  BEFORE UPDATE ON our_story_section
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();