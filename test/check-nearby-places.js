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

async function checkNearbyPlaces() {
  console.log('Checking nearby places data...');
  
  try {
    // Get all nearby places
    const { data, error } = await supabase
      .from('nearby_places')
      .select('*')
      .order('id');
    
    if (error) {
      console.error('Error fetching nearby places:', error);
      return;
    }
    
    console.log('Nearby places data:');
    console.log(JSON.stringify(data, null, 2));
    
    // Check if any have image URLs
    const placesWithImages = data.filter(place => place.image_url);
    console.log(`\nPlaces with images: ${placesWithImages.length}`);
    
    if (placesWithImages.length > 0) {
      console.log('Image URLs:');
      placesWithImages.forEach(place => {
        console.log(`- Place ${place.id}: ${place.image_url}`);
      });
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkNearbyPlaces();