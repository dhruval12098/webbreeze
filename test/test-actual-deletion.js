// Test actual image deletion from Supabase storage
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

// Test actual deletion
async function testActualDeletion() {
  console.log('=== Testing Actual Image Deletion ===');
  
  const imageUrl = 'https://chqifmkaufgeqcicduuq.supabase.co/storage/v1/object/public/homestay-images/rooms/1765649724170-image8.jpg';
  const fileName = 'rooms/1765649724170-image8.jpg';
  
  console.log('Attempting to delete image from storage...');
  console.log('Bucket: homestay-images');
  console.log('File path:', fileName);
  
  try {
    // Try to delete the image
    const { data, error } = await supabase
      .storage
      .from('homestay-images')
      .remove([fileName]);
    
    console.log('Supabase response:');
    console.log('Data:', data);
    console.log('Error:', error);
    
    if (error) {
      console.error('Deletion failed:', error.message);
    } else if (data && data.length > 0) {
      console.log('Image deleted successfully!');
    } else {
      console.log('No files were deleted - file may not exist or already deleted');
    }
    
  } catch (error) {
    console.error('Unexpected error during deletion:', error);
  }
  
  console.log('=== Test completed ===');
}

testActualDeletion();