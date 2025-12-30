// Script to initialize the gallery_images table
// This script reads the SQL file and executes it against the Supabase database

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: join(__dirname, '.env.local') });

// Supabase credentials (you'll need to set these in your .env.local file)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file');
  process.exit(1);
}

// Create Supabase client with service role key for admin access
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function initGalleryTable() {
  console.log('Initializing gallery_images table...');
  
  try {
    // Read the SQL file
    const sqlFilePath = join(__dirname, 'create-gallery-table.sql');
    const sqlContent = readFileSync(sqlFilePath, 'utf8');
    
    // Split the SQL content into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    // Execute each statement
    for (const statement of statements) {
      console.log('Executing statement:', statement.substring(0, 50) + '...');
      
      const { error } = await supabase.rpc('execute_sql', { sql: statement });
      
      if (error) {
        console.error('Error executing statement:', error);
        // Continue with other statements even if one fails
      } else {
        console.log('Statement executed successfully');
      }
    }
    
    console.log('Gallery table initialization completed.');
  } catch (error) {
    console.error('Initialization error:', error);
  }
}

// Run the initialization
initGalleryTable();