// Simple script to initialize the newsletter_subscribers table
// This script displays the SQL needed to create the table

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initNewsletterTable() {
  console.log('Initializing newsletter_subscribers table...');
  
  try {
    // Read the SQL file
    const sqlFilePath = join(__dirname, 'create-newsletter-table.sql');
    const sqlContent = readFileSync(sqlFilePath, 'utf8');
    
    console.log('Please execute the following SQL in your Supabase SQL editor:\n');
    console.log(sqlContent);
    
    console.log('\nNewsletter table SQL generated. Please run it in your Supabase dashboard.');
  } catch (error) {
    console.error('Initialization error:', error);
  }
}

// Run the initialization
initNewsletterTable();