import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testNewsletterFunctionality() {
  console.log('Testing newsletter functionality...');

  // Test 1: Check if the newsletter_subscribers table exists
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .limit(0); // Just check if the table exists

    if (error) {
      console.log('Error: newsletter_subscribers table does not exist yet.');
      console.log('Please run the SQL from create-newsletter-table.sql in your Supabase dashboard.');
      console.log('Error details:', error.message);
      return;
    }

    console.log('✓ newsletter_subscribers table exists');

    // Test 2: Try inserting a test record
    const testEmail = `test-${Date.now()}@example.com`;
    const { data: insertData, error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email: testEmail }]);

    if (insertError) {
      console.log('Error inserting test record:', insertError.message);
    } else {
      console.log('✓ Successfully inserted test record:', testEmail);

      // Clean up: delete the test record
      const { error: deleteError } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('email', testEmail);

      if (deleteError) {
        console.log('Warning: Could not clean up test record:', deleteError.message);
      } else {
        console.log('✓ Cleaned up test record');
      }
    }
  } catch (error) {
    console.log('Error during testing:', error.message);
  }

  console.log('Newsletter functionality test completed.');
}

testNewsletterFunctionality();