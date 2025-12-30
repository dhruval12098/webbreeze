// Test the image deletion functionality specifically for room details
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

// Test the deletion process step by step
async function testDeletionProcess() {
  console.log('=== Testing Room Image Deletion Process ===');
  
  try {
    // First, let's check if we can access the rooms table
    console.log('1. Checking rooms table...');
    const { data: roomsData, error: roomsError } = await supabase
      .from('rooms')
      .select('*')
      .limit(1);
      
    if (roomsError) {
      console.error('Error accessing rooms table:', roomsError.message);
      return;
    }
    
    console.log('Rooms data:', roomsData);
    
    if (!roomsData || roomsData.length === 0) {
      console.log('No rooms data found');
      return;
    }
    
    const room = roomsData[0];
    console.log('Room data:', room);
    
    // Check if room has image URLs
    const imageUrls = [
      room.image1_url,
      room.image2_url,
      room.image3_url,
      room.image4_url,
      room.image5_url
    ].filter(url => url);
    
    console.log('Image URLs found:', imageUrls);
    
    if (imageUrls.length === 0) {
      console.log('No images found for this room');
      return;
    }
    
    // Try to delete the first image
    const imageUrlToDelete = imageUrls[0];
    console.log('Attempting to delete image:', imageUrlToDelete);
    
    // Test filename extraction
    try {
      const urlObj = new URL(imageUrlToDelete);
      const pathParts = urlObj.pathname.split('/');
      const bucketIndex = pathParts.findIndex(part => part === 'homestay-images');
      if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
        const fileName = pathParts.slice(bucketIndex + 1).join('/');
        console.log('Extracted filename:', fileName);
      } else {
        console.log('Could not extract filename from URL');
        return;
      }
    } catch (error) {
      console.error('Error extracting filename:', error);
      return;
    }
    
    console.log('=== Test completed ===');
    
  } catch (error) {
    console.error('Unexpected error during test:', error);
  }
}

testDeletionProcess();