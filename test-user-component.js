// Test script to check if user-facing component can fetch data correctly
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUserFacingComponent() {
  console.log('Testing user-facing component data fetch...');
  
  try {
    // Simulate what the NearbyPlace component does
    const { data, error } = await supabase
      .from('nearby_places')
      .select('*')
      .order('id');
    
    if (data && data.length > 0) {
      console.log('Data fetched successfully:');
      data.forEach((place, index) => {
        console.log((index + 1) + '. Place ' + place.id + ': ' + place.title);
        console.log('   Description: ' + (place.description || 'No description'));
        console.log('   Image URL: ' + (place.image_url || 'No image'));
        console.log('');
      });
      
      // Count places with images
      const placesWithImages = data.filter(place => place.image_url);
      console.log('Places with images: ' + placesWithImages.length + '/' + data.length);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the test
testUserFacingComponent();