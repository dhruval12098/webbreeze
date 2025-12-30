require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsertReview() {
  console.log('Testing insert into guest_reviews table...');
  
  // Sample review data similar to what the form would submit
  const reviewData = {
    reviewer_name: "Test User",
    designation: "Test Designation",
    review_text: "This is a test review from the diagnostic script.",
    rating: 5,
    date: new Date().toISOString().split("T")[0],
    image_url: null
  };
  
  try {
    console.log('Attempting to insert:', reviewData);
    
    const { data, error } = await supabase
      .from('guest_reviews')
      .insert([reviewData])
      .select();
      
    if (error) {
      console.error('Error inserting review:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return;
    }
    
    console.log('Successfully inserted review:', data);
    
    // Clean up - delete the test review
    if (data && data[0] && data[0].id) {
      console.log('Cleaning up test data...');
      const { error: deleteError } = await supabase
        .from('guest_reviews')
        .delete()
        .eq('id', data[0].id);
        
      if (deleteError) {
        console.error('Error cleaning up test data:', deleteError);
      } else {
        console.log('Test data cleaned up successfully');
      }
    }
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testInsertReview();