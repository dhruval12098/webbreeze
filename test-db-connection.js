import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

// Recreate the supabase client with the loaded environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('SUPABASE_URL:', supabaseUrl);
console.log('SUPABASE_ANON_KEY exists:', !!supabaseAnonKey);

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('Testing database connection...');
  
  // Test hero_section table
  try {
    const { data: heroData, error: heroError } = await supabase
      .from('hero_section')
      .select('*')
      .limit(1);
    
    if (heroError) {
      console.log('Error querying hero_section:', heroError.message);
    } else {
      console.log('hero_section table exists. Rows:', heroData?.length || 0);
      if (heroData && heroData.length > 0) {
        console.log('Sample data:', heroData[0]);
      }
    }
  } catch (error) {
    console.log('Error with hero_section:', error.message);
  }
  
  // Test guest_reviews table
  try {
    const { data: reviews, error: reviewsError } = await supabase
      .from('guest_reviews')
      .select('*')
      .limit(1);
    
    if (reviewsError) {
      console.log('Error querying guest_reviews:', reviewsError.message);
    } else {
      console.log('guest_reviews table exists. Rows:', reviews?.length || 0);
      if (reviews && reviews.length > 0) {
        console.log('Sample data:', reviews[0]);
      }
    }
  } catch (error) {
    console.log('Error with guest_reviews:', error.message);
  }
  
  console.log('Test completed.');
}

testConnection();