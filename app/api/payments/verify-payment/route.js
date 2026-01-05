import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  try {
    const { orderId, bookingId } = await request.json();

    // Validate input
    if (!orderId || !bookingId) {
      return NextResponse.json(
        { error: 'Order ID and Booking ID are required' },
        { status: 400 }
      );
    }

    console.log('Verifying payment for order:', orderId, 'and booking:', bookingId);

    // Fetch booking from database to verify it exists
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (bookingError) {
      console.error('Error fetching booking:', bookingError);
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Verify payment status with Razorpay
    try {
      const order = await razorpay.orders.fetch(orderId);
      console.log('Razorpay order status:', order.status, 'amount_paid:', order.amount_paid, 'amount_due:', order.amount_due);

      // If order is paid (amount_due is 0), update booking status
      if (order.status === 'paid' || order.amount_due === 0) {
        // Get payment details
        const payments = await razorpay.orders.fetchPayments(orderId);
        const successfulPayment = payments.items.find(payment => payment.status === 'captured');

        if (successfulPayment) {
          console.log('Found successful payment:', successfulPayment.id);

          // Update booking with payment details
          const { data: updatedBooking, error: updateError } = await supabase
            .from('bookings')
            .update({
              transaction_id: successfulPayment.id,
              payment_status: 'success',
              booking_status: 'confirmed',
              payment_method: successfulPayment.method,
              payment_amount: successfulPayment.amount / 100, // Convert from paise to rupees
              payment_date: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('id', bookingId)
            .select()
            .single();

          if (updateError) {
            console.error('Error updating booking:', updateError);
            return NextResponse.json(
              { error: 'Failed to update booking status' },
              { status: 500 }
            );
          }

          console.log('Booking updated successfully:', updatedBooking.id);

          // Send confirmation email asynchronously (don't await)
          sendBookingConfirmationEmail(updatedBooking).catch(err => 
            console.error('Failed to send booking confirmation email:', err)
          );

          return NextResponse.json({
            success: true,
            message: 'Payment verified and booking updated',
            booking: updatedBooking
          });
        } else {
          console.log('No successful payment found for order:', orderId);
          return NextResponse.json({
            success: false,
            message: 'Payment not completed yet',
            orderStatus: order.status
          });
        }
      } else {
        console.log('Order not fully paid. Status:', order.status, 'Amount due:', order.amount_due);
        return NextResponse.json({
          success: false,
          message: 'Payment not completed yet',
          orderStatus: order.status,
          amount_due: order.amount_due / 100
        });
      }
    } catch (razorpayError) {
      console.error('Error verifying payment with Razorpay:', razorpayError);
      return NextResponse.json(
        { error: 'Failed to verify payment with Razorpay' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in payment verification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Send booking confirmation email (async, no await needed)
async function sendBookingConfirmationEmail(booking) {
  console.log('Sending booking confirmation email for booking:', booking.id);
  
  // Fetch user details to get email
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('email, name')
    .eq('id', booking.user_id)
    .single();

  if (userError) {
    console.error('Error fetching user for email:', userError);
    return;
  }

  console.log('Sending confirmation email to:', user.email);
  
  // Send email notification via API
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const emailResponse = await fetch(`${baseUrl}/api/send-booking-emails`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      booking_id: booking.id,
      user_email: user.email,
      user_name: user.name
    }),
  });

  if (!emailResponse.ok) {
    console.error('Failed to send booking confirmation email');
  } else {
    console.log('Booking confirmation email sent successfully');
  }
}