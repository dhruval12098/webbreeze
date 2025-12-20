import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config({ path: '.env.local' });

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Loaded' : 'Not loaded');

if (!supabaseUrl) {
  console.error('Error: supabaseUrl is not set');
  process.exit(1);
}

if (!supabaseAnonKey) {
  console.error('Error: supabaseAnonKey is not set');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRoomsTable() {
  console.log('Testing rooms table...');
  
  try {
    // Test if rooms table exists by trying to select from it
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('Error querying rooms table:', error.message);
      // If it's a table doesn't exist error, that's expected since we just created it
      if (error.message.includes('relation "rooms" does not exist')) {
        console.log('Rooms table does not exist yet - this is expected');
      }
    } else {
      console.log('Rooms table exists. Rows:', data?.length || 0);
      if (data && data.length > 0) {
        console.log('Sample data:', data[0]);
      }
    }
  } catch (error) {
    console.log('Error with rooms table:', error.message);
  }
  
  console.log('Test completed.');
}

testRoomsTable();