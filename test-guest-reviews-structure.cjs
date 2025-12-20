require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testGuestReviewsStructure() {
  console.log('Testing guest_reviews table structure...');
  
  try {
    // Get table info
    const { data, error } = await supabase
      .from('guest_reviews')
      .select('*')
      .limit(1);
      
    if (error) {
      console.error('Error querying guest_reviews table:', error);
      return;
    }
    
    console.log('Table exists and is accessible');
    console.log('Sample row structure:', JSON.stringify(data[0], null, 2));
    
    // Get column info
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'guest_reviews');
      
    if (columnsError) {
      console.error('Error getting column info:', columnsError);
      return;
    }
    
    console.log('Table columns:');
    columns.forEach(column => {
      console.log(`  ${column.column_name} (${column.data_type}) - ${column.is_nullable}`);
    });
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testGuestReviewsStructure();