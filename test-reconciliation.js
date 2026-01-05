import { reconcilePendingBookings } from './app/lib/paymentReconciliation.js';
import { supabase } from './app/lib/supabaseClient.js';
import fs from 'fs';
import path from 'path';

// Function to parse .env file
function loadEnvFile() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    const lines = envFile.split('\n');
    
    lines.forEach(line => {
      if (line.trim() && !line.startsWith('#')) {
        const [key, ...value] = line.split('=');
        if (key && value) {
          const envKey = key.trim();
          const envValue = value.join('=').trim();
          // Remove quotes if present
          process.env[envKey] = envValue.replace(/(^"|"$|^'|'$)/g, '');
        }
      }
    });
  }
}

// Load environment variables
loadEnvFile();

async function testReconciliation() {
  console.log('Testing reconciliation function...\n');
  
  // Test with a known user ID that has pending bookings
  const userId = '309b3d4c-a341-46f5-b6a4-c8c76fa68829'; // From the booking data we saw earlier
  
  console.log(`Running reconciliation for user: ${userId}`);
  
  try {
    // First, let's check the current state of pending bookings
    console.log('\n1. Checking current pending bookings...');
    const { data: pendingBookings, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .eq('payment_status', 'pending')
      .gt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
    
    if (fetchError) {
      console.error('Error fetching pending bookings:', fetchError);
      return;
    }
    
    console.log(`Found ${pendingBookings.length} pending bookings`);
    
    if (pendingBookings.length > 0) {
      pendingBookings.forEach(booking => {
        console.log(`- Booking ID: ${booking.id}, Order ID: ${booking.razorpay_order_id}, Status: ${booking.payment_status}`);
      });
    }
    
    // Run the reconciliation function
    console.log('\n2. Running reconciliation function...');
    const result = await reconcilePendingBookings(userId);
    
    console.log('Reconciliation result:', result);
    
    // Check if any bookings were updated
    if (result.updated > 0) {
      console.log(`\n✅ Successfully updated ${result.updated} bookings!`);
      
      // Fetch the updated bookings to verify
      const { data: updatedBookings, error: updatedFetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', userId)
        .eq('payment_status', 'success')
        .gt('updated_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()); // Updated in last 5 minutes
      
      if (!updatedFetchError && updatedBookings) {
        console.log('\nUpdated bookings:');
        updatedBookings.forEach(booking => {
          console.log(`- Booking ID: ${booking.id}, Transaction ID: ${booking.transaction_id}, Payment Status: ${booking.payment_status}, Booking Status: ${booking.booking_status}`);
        });
      }
    } else {
      console.log('\nℹ️  No bookings were updated by reconciliation (this could be because they are already properly updated)');
      
      // Let's check the specific booking we know about
      const { data: specificBooking, error: specificError } = await supabase
        .from('bookings')
        .select('*')
        .eq('razorpay_order_id', 'order_S0CPef5rUBYPTe')
        .single();
      
      if (!specificError && specificBooking) {
        console.log(`\nSpecific booking status:`);
        console.log(`- Booking ID: ${specificBooking.id}`);
        console.log(`- Order ID: ${specificBooking.razorpay_order_id}`);
        console.log(`- Transaction ID: ${specificBooking.transaction_id}`);
        console.log(`- Payment Status: ${specificBooking.payment_status}`);
        console.log(`- Booking Status: ${specificBooking.booking_status}`);
        console.log(`- Updated At: ${specificBooking.updated_at}`);
      }
    }
    
    console.log('\n✅ Reconciliation test completed successfully!');
  } catch (error) {
    console.error('❌ Error during reconciliation test:', error);
  }
}

// Run the test
testReconciliation()
  .then(() => {
    console.log('Test script completed');
  })
  .catch((error) => {
    console.error('Test script failed:', error);
  });