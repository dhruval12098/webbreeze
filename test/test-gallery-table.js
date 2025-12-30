// Test script to verify gallery table access
import dotenv from 'dotenv';
dotenv.config({ path: './.env.local' });

import { createClient } from '@supabase/supabase-js';

// Create a new Supabase client with the loaded environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testGalleryTable() {
  console.log('Testing gallery table access...');
  
  try {
    // Test if we can access the gallery_images table
    const { data, error, count } = await supabase
      .from('gallery_images')
      .select('*', { count: 'exact' });
      
    if (error) {
      console.log('Error accessing gallery_images table:', error.message);
      console.log('This is expected if the table has not been created yet.');
      return;
    }
    
    console.log('Successfully accessed gallery_images table');
    console.log('Number of records:', count);
    console.log('Sample data:', data.slice(0, 3)); // Show first 3 records
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

// Run the test
testGalleryTable();