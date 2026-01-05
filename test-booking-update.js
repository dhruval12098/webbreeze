import { createClient } from '@supabase/supabase-js';
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

console.log('Environment variables loaded:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Present' : 'Missing');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Present' : 'Missing');

// Test the connection
async function testConnection() {
  try {
    console.log('Testing connection to Supabase...');
    
    // Try to fetch the booking with the specific order ID
    const razorpayOrderId = 'order_S0CPef5rUBYPTe';
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('razorpay_order_id', razorpayOrderId)
      .single();
    
    if (fetchError) {
      console.log('Booking not found or error occurred:', fetchError.message);
      return;
    }
    
    console.log('Found booking:', booking);
    
    // Update the booking with the correct transaction ID
    const { data: updatedBooking, error: updateError } = await supabase
      .from('bookings')
      .update({
        transaction_id: 'pay_S0CPq5qCS2NNlr',
        payment_status: 'success',
        booking_status: 'confirmed',
        updated_at: new Date().toISOString()
      })
      .eq('razorpay_order_id', razorpayOrderId)
      .select()
      .single();
    
    if (updateError) {
      console.log('Error updating booking:', updateError);
      return;
    }
    
    console.log('Successfully updated booking:', {
      id: updatedBooking.id,
      razorpay_order_id: updatedBooking.razorpay_order_id,
      transaction_id: updatedBooking.transaction_id,
      payment_status: updatedBooking.payment_status,
      booking_status: updatedBooking.booking_status
    });
  } catch (error) {
    console.error('Error in testConnection:', error);
  }
}

testConnection();