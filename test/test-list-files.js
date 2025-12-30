import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config({ path: '.env.local' });

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listFiles() {
  console.log('Listing files in homestay-images bucket...');
  
  const { data, error } = await supabase
    .storage
    .from('homestay-images')
    .list('', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' }
    });

  if (error) {
    console.error('Error listing files:', error);
  } else {
    console.log('Files found:', data.length);
    data.forEach(file => {
      console.log(`- ${file.name}`);
    });
    
    // Also list files in the rooms folder specifically
    console.log('\nFiles in rooms folder:');
    const { data: roomFiles, error: roomError } = await supabase
      .storage
      .from('homestay-images')
      .list('rooms', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      });
      
    if (roomError) {
      console.error('Error listing room files:', roomError);
    } else {
      console.log('Room files found:', roomFiles.length);
      roomFiles.forEach(file => {
        console.log(`- rooms/${file.name}`);
      });
    }
  }
  
  console.log('Listing completed.');
}

listFiles();