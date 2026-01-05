import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
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

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Script to manually update a booking record with the correct transaction ID
 * This addresses the issue where the webhook didn't update the transaction_id field
 */
async function updateBookingTransactionId() {
  try {
    // The order ID from the user's data
    const razorpayOrderId = 'order_S0CPef5rUBYPTe';
    
    // The actual transaction ID from Razorpay dashboard
    const transactionId = 'pay_S0CPq5qCS2NNlr';
    
    console.log(`Updating booking with order ID: ${razorpayOrderId}`);
    console.log(`Setting transaction ID to: ${transactionId}`);
    
    // First, let's fetch the booking to see its current status
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('razorpay_order_id', razorpayOrderId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching booking:', fetchError);
      return;
    }
    
    console.log('Current booking data:', {
      id: booking.id,
      razorpay_order_id: booking.razorpay_order_id,
      transaction_id: booking.transaction_id,
      payment_status: booking.payment_status,
      booking_status: booking.booking_status,
      total_amount: booking.total_amount
    });
    
    // Update the booking with the correct transaction ID and payment status
    const { data: updatedBooking, error: updateError } = await supabase
      .from('bookings')
      .update({
        transaction_id: transactionId,
        payment_status: 'success',
        booking_status: 'confirmed',
        payment_method: 'UPI', // Based on the payment details provided
        payment_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('razorpay_order_id', razorpayOrderId)
      .select()
      .single();
    
    if (updateError) {
      console.error('Error updating booking:', updateError);
      return;
    }
    
    console.log('Successfully updated booking:', {
      id: updatedBooking.id,
      razorpay_order_id: updatedBooking.razorpay_order_id,
      transaction_id: updatedBooking.transaction_id,
      payment_status: updatedBooking.payment_status,
      booking_status: updatedBooking.booking_status,
      updated_at: updatedBooking.updated_at
    });
    
    console.log('Booking transaction ID has been successfully updated!');
    
  } catch (error) {
    console.error('Error in updateBookingTransactionId:', error);
  }
}

// Run the update function
if (import.meta.url === `file://${process.argv[1]}`) {
  updateBookingTransactionId()
    .then(() => {
      console.log('Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Script failed:', error);
      process.exit(1);
    });
}