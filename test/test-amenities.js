import { config } from 'dotenv';
config({ path: '.env.local' });

import { supabase } from './app/lib/supabaseClient.js';

async function testAmenities() {
  console.log('Testing amenities table...');
  
  try {
    const { data, error } = await supabase
      .from('amenities')
      .select('*');
    
    if (error) {
      console.log('Error querying amenities:', error.message);
    } else {
      console.log('amenities table exists. Rows:', data?.length || 0);
      if (data && data.length > 0) {
        console.log('Sample data:', data[0]);
      } else {
        console.log('No amenities found in the table');
      }
    }
  } catch (error) {
    console.log('Error with amenities:', error.message);
  }
  
  console.log('Test completed.');
}

testAmenities();