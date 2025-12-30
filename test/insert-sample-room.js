import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config({ path: '.env.local' });

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function insertSampleRoom() {
  console.log('Inserting sample room data...');
  
  try {
    // Sample room data
    const sampleRoom = {
      title: "Deluxe Homestay",
      label: "Entire Homestay",
      price: "19000",
      description: "Your peaceful Kerala retreat by the backwaters of Alappuzha. Experience tranquility and comfort in our beautifully designed deluxe room with stunning views.",
      image1_url: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&auto=format&fit=crop&q=70",
      image2_url: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&auto=format&fit=crop&q=70",
      image3_url: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&auto=format&fit=crop&q=70",
      image4_url: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&auto=format&fit=crop&q=70",
      image5_url: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&auto=format&fit=crop&q=70"
    };
    
    // Insert the sample room
    const { data, error } = await supabase
      .from('rooms')
      .insert([sampleRoom]);
    
    if (error) {
      console.log('Error inserting sample room:', error.message);
    } else {
      console.log('Sample room inserted successfully!');
    }
  } catch (error) {
    console.log('Error inserting sample room:', error.message);
  }
  
  console.log('Insert operation completed.');
}

insertSampleRoom();