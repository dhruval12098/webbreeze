// Test the image deletion functionality for room details
import { deleteImageFromStorage } from './app/lib/imageService.js';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config({ path: '.env.local' });

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test URL (this would be a real URL from your database)
const testUrl = 'https://chqifmkaufgeqcicduuq.supabase.co/storage/v1/object/public/homestay-images/rooms/1765648106301-image4.jpg';

console.log('Testing image deletion for room details...');
console.log('Test URL:', testUrl);

// Test the delete function
async function testDeletion() {
  try {
    console.log('Attempting to delete image from storage...');
    const result = await deleteImageFromStorage(testUrl, supabase);
    console.log('Deletion result:', result);
  } catch (error) {
    console.error('Error during deletion test:', error);
  }
}

testDeletion();