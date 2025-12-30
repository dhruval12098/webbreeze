// Script to create the our_story_section table in Supabase
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
  process.exit(1)
}

if (!supabaseServiceKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
  process.exit(1)
}

// Create a Supabase client with service role key for admin access
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createOurStoryTable() {
  try {
    // Create the our_story_section table
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    })

    if (error) {
      console.error('Error creating table:', error)
      process.exit(1)
    }

    console.log('our_story_section table created successfully!')
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

createOurStoryTable()