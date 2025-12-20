import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config({ path: '.env.local' });

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function cleanupStaleData() {
  console.log('Cleaning up stale room data...');
  
  // Get the current room data
  const { data: rooms, error: fetchError } = await supabase
    .from('rooms')
    .select('*')
    .limit(1);

  if (fetchError) {
    console.error('Error fetching rooms:', fetchError);
    return;
  }

  if (rooms && rooms.length > 0) {
    const room = rooms[0];
    console.log('Current room data:', room);
    
    // Check each image URL and clean up stale references
    const updatedRoomData = {
      image1_url: room.image1_url,
      image2_url: room.image2_url,
      image3_url: room.image3_url,
      image4_url: room.image4_url,
      image5_url: room.image5_url
    };
    
    // For simplicity, let's just set all image URLs to null since we know they're stale
    // In a real application, you'd want to check each one individually
    Object.keys(updatedRoomData).forEach(key => {
      if (updatedRoomData[key]) {
        console.log(`Clearing stale URL for ${key}: ${updatedRoomData[key]}`);
        updatedRoomData[key] = null;
      }
    });
    
    // Update the room record
    const { error: updateError } = await supabase
      .from('rooms')
      .update(updatedRoomData)
      .eq('id', room.id);
      
    if (updateError) {
      console.error('Error updating room:', updateError);
    } else {
      console.log('Room data cleaned up successfully');
    }
  } else {
    console.log('No rooms found');
  }
  
  console.log('Cleanup completed.');
}

cleanupStaleData();