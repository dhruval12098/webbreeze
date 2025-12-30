// Test the complete deletion flow as it happens in the room details page
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { deleteImageFromStorage } from './app/lib/imageService.js';
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

// Test the complete deletion flow
async function testCompleteDeletionFlow() {
  console.log('=== Testing Complete Deletion Flow ===');
  
  try {
    // First, let's get the current room data
    console.log('1. Getting current room data...');
    const { data: roomsData, error: roomsError } = await supabase
      .from('rooms')
      .select('*')
      .limit(1);
      
    if (roomsError) {
      console.error('Error accessing rooms table:', roomsError.message);
      return;
    }
    
    if (!roomsData || roomsData.length === 0) {
      console.log('No rooms data found');
      return;
    }
    
    const room = roomsData[0];
    console.log('Current room data:', {
      id: room.id,
      image1_url: room.image1_url,
      image2_url: room.image2_url,
      image3_url: room.image3_url,
      image4_url: room.image4_url,
      image5_url: room.image5_url
    });
    
    // Check if we have an image to delete
    if (!room.image1_url) {
      console.log('No image found in image1_url to delete');
      return;
    }
    
    const imageUrlToDelete = room.image1_url;
    console.log('2. Image URL to delete:', imageUrlToDelete);
    
    // Test the deleteImageFromStorage function (same as used in room details page)
    console.log('3. Calling deleteImageFromStorage function...');
    const deleteResult = await deleteImageFromStorage(imageUrlToDelete, supabase);
    console.log('Delete result:', deleteResult);
    
    if (!deleteResult.success) {
      console.error('Failed to delete image from storage:', deleteResult.error);
      return;
    }
    
    console.log('4. Image deleted successfully from storage');
    
    // Now update the database to remove the URL
    console.log('5. Updating database to remove image URL...');
    const { error: updateError } = await supabase
      .from('rooms')
      .update({ image1_url: null })
      .eq('id', room.id);
      
    if (updateError) {
      console.error('Failed to update database:', updateError.message);
      return;
    }
    
    console.log('6. Database updated successfully');
    console.log('=== Complete deletion flow test completed successfully ===');
    
  } catch (error) {
    console.error('Unexpected error during test:', error);
  }
}

testCompleteDeletionFlow();