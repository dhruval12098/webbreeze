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

async function checkBuckets() {
  console.log('Checking if buckets exist...');
  
  try {
    // List all buckets
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error listing buckets:', error);
      return;
    }
    
    console.log('Available buckets:', buckets);
    
    // Check specifically for our buckets
    const homestayExists = buckets.some(bucket => bucket.name === 'homestay-images');
    const reviewExists = buckets.some(bucket => bucket.name === 'review-images');
    
    console.log('homestay-images bucket exists:', homestayExists);
    console.log('review-images bucket exists:', reviewExists);
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkBuckets();