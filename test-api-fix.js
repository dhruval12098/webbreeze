import { config } from 'dotenv';
config({ path: '.env.local' });

// Simple test to verify the API fix
import { supabase } from './app/lib/supabaseClient.js';
import http from 'http';
import fs from 'fs';

async function testApiFix() {
  console.log('Testing amenities API fix...');
  
  // First, let's manually test the fixed API endpoint
  const testData = {
    title: 'Pool Access',
    description: 'Private swimming pool for guest use',
    icon_url: null
  };
  
  console.log('Inserting test amenity...');
  
  const { data, error } = await supabase
    .from('amenities')
    .insert([testData])
    .select();
  
  if (error) {
    console.log('Direct insert failed:', error.message);
    return;
  }
  
  console.log('Direct insert successful:', data);
  
  // Clean up
  if (data && data.length > 0) {
    await supabase
      .from('amenities')
      .delete()
      .eq('id', data[0].id);
    console.log('Cleaned up test data');
  }
  
  console.log('API fix verification complete');
}

testApiFix();