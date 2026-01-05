import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Initialize nodemailer transporter (reuse connection)
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function POST(request) {
  try {
    console.log('Razorpay webhook received - request processing started');
    
    // Get the raw body for signature verification
    const rawBody = await request.text();
    
    // Get headers
    const signature = request.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    console.log('Webhook signature received:', signature);
    console.log('Webhook secret configured:', !!secret);

    if (!secret) {
      console.error('Razorpay webhook secret not configured');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    // Verify the signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    console.log('Expected signature:', expectedSignature);
    console.log('Received signature:', signature);
    console.log('Signature match:', expectedSignature === signature);

    if (expectedSignature !== signature) {
      console.error('Razorpay webhook signature verification failed');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Parse the webhook payload
    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch (parseError) {
      console.error('Failed to parse webhook payload:', parseError);
      console.error('Raw body:', rawBody);
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }
    
    const event = payload.event;
    console.log('Webhook event:', event);

    // Log payment.created events but don't process them
    if (event === 'payment.created') {
      console.log('Payment created event received (not processing):', payload.payload?.payment?.entity?.id);
    }

    // RESPOND IMMEDIATELY TO RAZORPAY (within 5 seconds)
    const response = NextResponse.json({ received: true });

    // Process payment updates asynchronously (don't await)
    processPaymentUpdate(payload).catch(err => {
      console.error('Async payment processing error:', err);
      // Also send error to external logging service if available
      try {
        // Optional: Send to external logging service
        console.log('Payment processing error details:', {
          error: err.message,
          stack: err.stack,
          payload: payload
        });
      } catch (logErr) {
        console.error('Error logging error:', logErr);
      }
    });

    console.log('Webhook response sent to Razorpay');
    return response;

  } catch (error) {
    console.error('Error processing Razorpay webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// Process payment updates asynchronously to avoid timeout
async function processPaymentUpdate(payload) {
  try {
    const event = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;
    const orderEntity = payload.payload?.order?.entity;
    
    console.log('Processing payment update asynchronously:', event);

    if (event === 'payment.captured' && paymentEntity) {
      console.log('About to handle payment captured:', { orderId: paymentEntity.order_id, paymentId: paymentEntity.id });
      await handlePaymentCaptured(paymentEntity);
    } else if (event === 'payment.failed' && paymentEntity) {
      console.log('About to handle payment failed:', { orderId: paymentEntity.order_id, paymentId: paymentEntity.id });
      await handlePaymentFailed(paymentEntity);
    } else if (event === 'order.paid' && orderEntity) {
      console.log('About to handle order paid:', { orderId: orderEntity.id, paymentId: paymentEntity?.id });
      await handleOrderPaid(orderEntity, paymentEntity);
    } else {
      console.log('Unhandled event or missing entity:', { event, hasPaymentEntity: !!paymentEntity, hasOrderEntity: !!orderEntity });
    }
  } catch (error) {
    console.error('Error in async payment processing:', error);
    console.error('Full error details:', {
      message: error.message,
      stack: error.stack,
      payload: payload
    });
    
    // Re-throw the error so it can be caught by the calling function
    throw error;
  }
}

// Handle payment.captured event
async function handlePaymentCaptured(entity) {
  const { id: paymentId, order_id: orderId, method, amount } = entity;
  
  console.log('Processing payment.captured:', { paymentId, orderId });
  
  // First, check if the booking exists
  const { data: existingBooking, error: fetchError } = await supabase
    .from('bookings')
    .select('*')
    .eq('razorpay_order_id', orderId)
    .single();
  
  if (fetchError) {
    console.error('Error fetching existing booking:', fetchError);
    return; // Exit if we can't find the booking
  }
  
  if (!existingBooking) {
    console.error('No booking found with order ID:', orderId);
    return; // Exit if no booking exists
  }
  
  console.log('Found existing booking:', existingBooking.id);
  
  // Update booking with payment details
  console.log('Attempting to update booking with order ID:', orderId);
  const { data: booking, error } = await supabase
    .from('bookings')
    .update({
      transaction_id: paymentId,
      payment_status: 'success',
      booking_status: 'confirmed',
      payment_method: method,
      payment_amount: amount / 100, // Convert from paise to rupees
      payment_date: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('razorpay_order_id', orderId)
    .select('*')
    .single();
  
  if (!error && booking) {
    console.log('Successfully updated booking:', booking.id);
  }

  if (error) {
    console.error('Error updating booking with payment success:', error);
    console.error('Booking update context:', { paymentId, orderId, amount, method });
    
    // Try to find the booking to see its current state
    const { data: currentBooking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('razorpay_order_id', orderId)
      .single();
      
    if (fetchError) {
      console.error('Could not fetch current booking state:', fetchError);
    } else {
      console.log('Current booking state:', currentBooking);
    }
    return;
  }

  console.log('Booking updated with payment success:', booking?.id);
  
  // Send confirmation email asynchronously (don't await)
  if (booking) {
    sendBookingConfirmationEmail(booking).catch(err => 
      console.error('Failed to send booking confirmation email:', err)
    );
  }
}

// Handle payment.failed event
async function handlePaymentFailed(entity) {
  const { id: paymentId, order_id: orderId, method, amount } = entity;
  
  console.log('Processing payment.failed:', { paymentId, orderId });
  
  // First, check if the booking exists
  const { data: existingBooking, error: fetchError } = await supabase
    .from('bookings')
    .select('*')
    .eq('razorpay_order_id', orderId)
    .single();
  
  if (fetchError) {
    console.error('Error fetching existing booking for failure:', fetchError);
    return; // Exit if we can't find the booking
  }
  
  if (!existingBooking) {
    console.error('No booking found with order ID for failure:', orderId);
    return; // Exit if no booking exists
  }
  
  console.log('Found existing booking for failure:', existingBooking.id);
  
  // Update booking with payment failure
  console.log('Attempting to update booking with order ID for failure:', orderId);
  const { data: booking, error } = await supabase
    .from('bookings')
    .update({
      transaction_id: paymentId,
      payment_status: 'failed',
      booking_status: 'cancelled',
      payment_method: method,
      payment_amount: amount / 100, // Convert from paise to rupees
      updated_at: new Date().toISOString()
    })
    .eq('razorpay_order_id', orderId)
    .select('*')
    .single();
  
  if (!error && booking) {
    console.log('Successfully updated booking for failure:', booking.id);
  }

  if (error) {
    console.error('Error updating booking with payment failure:', error);
    console.error('Booking update context for failure:', { paymentId, orderId, amount, method });
    
    // Try to find the booking to see its current state
    const { data: currentBooking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('razorpay_order_id', orderId)
      .single();
      
    if (fetchError) {
      console.error('Could not fetch current booking state:', fetchError);
    } else {
      console.log('Current booking state:', currentBooking);
    }
    return;
  }

  console.log('Booking updated with payment failure:', booking?.id);
  
  // Send failure email asynchronously (don't await)
  if (booking) {
    sendPaymentFailureEmail(booking).catch(err => 
      console.error('Failed to send payment failure email:', err)
    );
  }
}

// Handle order.paid event
async function handleOrderPaid(orderEntity, paymentEntity) {
  const orderId = orderEntity.id;
  const amount = orderEntity.amount;
  const paymentId = paymentEntity?.id;
  const method = paymentEntity?.method;
  
  console.log('Processing order.paid:', { orderId, paymentId });
  
  // First, check if the booking exists
  const { data: existingBooking, error: fetchError } = await supabase
    .from('bookings')
    .select('*')
    .eq('razorpay_order_id', orderId)
    .single();
  
  if (fetchError) {
    console.error('Error fetching existing booking for order.paid:', fetchError);
    return; // Exit if we can't find the booking
  }
  
  if (!existingBooking) {
    console.error('No booking found with order ID for order.paid:', orderId);
    return; // Exit if no booking exists
  }
  
  console.log('Found existing booking for order.paid:', existingBooking.id);
  
  // Update booking with order paid details
  console.log('Attempting to update booking with order ID for order.paid:', orderId);
  const { data: booking, error } = await supabase
    .from('bookings')
    .update({
      transaction_id: paymentId,
      payment_status: 'success',
      booking_status: 'confirmed',
      payment_method: method,
      payment_amount: amount / 100, // Convert from paise to rupees
      payment_date: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('razorpay_order_id', orderId)
    .select('*')
    .single();
  
  if (!error && booking) {
    console.log('Successfully updated booking for order.paid:', booking.id);
  }

  if (error) {
    console.error('Error updating booking with order paid success:', error);
    console.error('Order paid update context:', { orderId, amount, method });
    
    // Try to find the booking to see its current state
    const { data: currentBooking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('razorpay_order_id', orderId)
      .single();
      
    if (fetchError) {
      console.error('Could not fetch current booking state for order.paid:', fetchError);
    } else {
      console.log('Current booking state for order.paid:', currentBooking);
    }
    return;
  }

  console.log('Booking updated with order paid success:', booking?.id);
  
  // Send confirmation email asynchronously (don't await)
  if (booking) {
    sendBookingConfirmationEmail(booking).catch(err => 
      console.error('Failed to send booking confirmation email:', err)
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

// Send payment failure email (async, no await needed)
async function sendPaymentFailureEmail(booking) {
  console.log('Sending payment failure email for booking:', booking.id);
  
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

  console.log('Sending payment failure email to:', user.email);
  
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: user.email,
    subject: 'Payment Failed - Booking Update',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #594B00;">Payment Failed Notification</h2>
        <p>Dear ${user.name},</p>
        <p>We regret to inform you that your payment for booking ID: ${booking.id} has failed.</p>
        <p><strong>Booking Details:</strong></p>
        <ul>
          <li>Booking ID: ${booking.id}</li>
          <li>Room ID: ${booking.room_id}</li>
          <li>Check-in: ${booking.check_in_date}</li>
          <li>Check-out: ${booking.check_out_date}</li>
          <li>Amount: ₹${booking.payment_amount || '0'}</li>
        </ul>
        <p>Your booking status is now marked as failed in our system.</p>
        <p><strong>Refund Information:</strong></p>
        <p>If your payment was deducted, it will be refunded to your original payment method within 5-7 business days. This process is automatic and no action is required from your side.</p>
        <p>If you have any questions or need assistance, please contact us:</p>
        <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <p><strong>Need Help?</strong></p>
          <p>For any queries regarding this failed payment:</p>
          <a href="https://wa.me/919999999999" target="_blank" style="display: inline-block; background-color: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Contact us on WhatsApp</a>
          <p style="margin-top: 10px;">Or email us at: breezegrains@gmail.com</p>
        </div>
        <p>Thank you for choosing Breeze and Grains.</p>
        <p>Best regards,<br>The Breeze and Grains Team</p>
      </div>
    `,
  };

  // Send email without awaiting (fire and forget)
  transporter.sendMail(mailOptions)
    .then(() => console.log('Payment failure email sent successfully'))
    .catch(err => console.error('Email send failed:', err));
}