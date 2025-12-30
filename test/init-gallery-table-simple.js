// Simple script to initialize the gallery_images table
// This script uses the existing Supabase client configuration

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { supabase } from './app/lib/supabaseClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initGalleryTable() {
  console.log('Initializing gallery_images table...');
  
  try {
    // Read the SQL file
    const sqlFilePath = join(__dirname, 'create-gallery-table.sql');
    const sqlContent = readFileSync(sqlFilePath, 'utf8');
    
    // Note: Supabase JavaScript client doesn't directly support executing raw SQL
    // You'll need to run the SQL file directly in your Supabase SQL editor
    console.log('Please execute the following SQL in your Supabase SQL editor:\\n');
    console.log(sqlContent);
    
    console.log('\\nGallery table SQL generated. Please run it in your Supabase dashboard.');
  } catch (error) {
    console.error('Initialization error:', error);
  }
}

// Run the initialization
initGalleryTable();