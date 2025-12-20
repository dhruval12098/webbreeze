// Debug the exact flow in room details page
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

// Simulate the exact flow from room details page
async function debugRoomDeletionFlow() {
  console.log('=== Debugging Room Deletion Flow ===');
  
  try {
    // Simulate loading room data (like in useEffect)
    console.log('1. Loading room data...');
    const { data: roomData, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .limit(1);
      
    if (roomError) {
      console.error('Error loading room data:', roomError.message);
      return;
    }
    
    if (!roomData || roomData.length === 0) {
      console.log('No room data found');
      return;
    }
    
    const room = roomData[0];
    console.log('Loaded room:', {
      id: room.id,
      image1_url: room.image1_url
    });
    
    // Simulate the image structure as it would be in state
    const images = [
      room.image1_url ? { url: room.image1_url, isExisting: true } : null,
      room.image2_url ? { url: room.image2_url, isExisting: true } : null,
      room.image3_url ? { url: room.image3_url, isExisting: true } : null,
      room.image4_url ? { url: room.image4_url, isExisting: true } : null,
      room.image5_url ? { url: room.image5_url, isExisting: true } : null
    ];
    
    console.log('2. Images array:', images);
    
    // Simulate deleting the first image (index 0)
    const indexToDelete = 0;
    const imageToRemove = images[indexToDelete];
    
    console.log('3. Image to remove:', imageToRemove);
    
    if (imageToRemove && imageToRemove.isExisting && imageToRemove.url) {
      console.log('4. Processing deletion for existing image:', imageToRemove.url);
      
      // This is the exact code from removeImage function
      const imageFields = ['image1_url', 'image2_url', 'image3_url', 'image4_url', 'image5_url'];
      const fieldName = imageFields[indexToDelete];
      console.log('5. Field name to update:', fieldName);
      
      // Get the existing room ID to update the specific field
      console.log('6. Getting room ID...');
      const { data: existingData, error: selectError } = await supabase
        .from('rooms')
        .select('id')
        .limit(1);
        
      console.log('7. Existing data result:', { existingData, selectError });
      
      if (existingData && existingData.length > 0 && !selectError) {
        console.log('8. Updating database field to null...');
        const { error: updateError } = await supabase
          .from('rooms')
          .update({ [fieldName]: null })
          .eq('id', existingData[0].id);
          
        console.log('9. Database update result:', { updateError });
        
        if (updateError) {
          console.error('Failed to update database:', updateError);
        } else {
          console.log('Database field updated to null successfully');
        }
      } else {
        console.log('No existing room data found or error occurred');
      }
    } else {
      console.log('No existing image found or image is not marked as existing');
    }
    
    console.log('=== Debug flow completed ===');
    
  } catch (error) {
    console.error('Unexpected error during debug:', error);
  }
}

debugRoomDeletionFlow();