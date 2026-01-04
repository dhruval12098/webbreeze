import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    // Get the raw body for signature verification
    const buffer = await request.arrayBuffer();
    const rawBody = Buffer.from(buffer).toString('utf8');
    
    // Get headers
    const signature = request.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
      console.error('Razorpay webhook secret not configured');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    // Verify the signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('Razorpay webhook signature verification failed');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Parse the webhook payload
    const payload = JSON.parse(rawBody);
    const { event, payload: eventData } = payload;

    console.log('Razorpay webhook received:', event);

    // Handle different webhook events
    switch (event) {
      case 'payment.captured':
        await handlePaymentCaptured(eventData.payment);
        break;
      case 'payment.failed':
        await handlePaymentFailed(eventData.payment);
        break;
      case 'order.paid':
        await handleOrderPaid(eventData.order, eventData.payment);
        break;
      default:
        console.log(`Unhandled event: ${event}`);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing Razorpay webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// Handle payment captured event
async function handlePaymentCaptured(payment) {
  try {
    console.log('Processing payment captured event:', payment);

    // Update booking record with payment information
    const { data: booking, error } = await supabase
      .from('bookings')
      .update({
        transaction_id: payment.id,
        payment_status: 'success',
        payment_method: payment.method,
        payment_amount: payment.amount / 100, // Convert from paise to rupees
        payment_date: new Date().toISOString(),
        booking_status: 'confirmed', // Update booking status to confirmed
        updated_at: new Date().toISOString()
      })
      .eq('razorpay_order_id', payment.order_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating booking with payment success:', error);
      throw error;
    }

    console.log('Booking updated with payment success:', booking?.id);

    // Send booking confirmation email
    await sendBookingConfirmationEmail(booking);
  } catch (error) {
    console.error('Error in handlePaymentCaptured:', error);
  }
}

// Handle payment failed event
async function handlePaymentFailed(payment) {
  try {
    console.log('Processing payment failed event:', payment);

    // Update booking record with payment failure
    const { data: booking, error } = await supabase
      .from('bookings')
      .update({
        transaction_id: payment.id,
        payment_status: 'failed',
        payment_method: payment.method,
        payment_amount: payment.amount / 100, // Convert from paise to rupees
        booking_status: 'cancelled', // Update booking status to cancelled
        updated_at: new Date().toISOString()
      })
      .eq('razorpay_order_id', payment.order_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating booking with payment failure:', error);
      throw error;
    }

    console.log('Booking updated with payment failure:', booking?.id);
    
    // Send email notification to customer about failed payment
    if (booking) {
      await sendPaymentFailureEmail(booking);
      
      // Trigger additional payment failure notifications
      try {
        // Using absolute URL for server-side fetch
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        await fetch(`${baseUrl}/api/payment-failed`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            booking_id: booking.id,
            user_email: user?.email,
            user_name: user?.name,
            amount: booking.payment_amount
          }),
        });
      } catch (notificationError) {
        console.error('Error in payment failure notification:', notificationError);
      }
    }
  } catch (error) {
    console.error('Error in handlePaymentFailed:', error);
  }
}

// Function to send booking confirmation email
async function sendBookingConfirmationEmail(booking) {
  try {
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

    // Send email notification
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
    }
  } catch (error) {
    console.error('Error in sendBookingConfirmationEmail:', error);
  }
}

// Function to send payment failure email
async function sendPaymentFailureEmail(booking) {
  try {
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

    // Create a temporary email API endpoint for failed payments
    const emailData = {
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

    // Use nodemailer directly to send the email
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

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error in sendPaymentFailureEmail:', error);
  }
}

// Handle order paid event
async function handleOrderPaid(order, payment) {
  try {
    console.log('Processing order paid event:', order, payment);

    // Update booking record with payment information
    const { data: booking, error } = await supabase
      .from('bookings')
      .update({
        transaction_id: payment.id,
        payment_status: 'success',
        payment_method: payment.method,
        payment_amount: payment.amount / 100, // Convert from paise to rupees
        payment_date: new Date().toISOString(),
        booking_status: 'confirmed', // Update booking status to confirmed
        updated_at: new Date().toISOString()
      })
      .eq('razorpay_order_id', order.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating booking with order paid:', error);
      throw error;
    }

    console.log('Booking updated with order paid:', booking?.id);

    // Send booking confirmation email
    await sendBookingConfirmationEmail(booking);
  } catch (error) {
    console.error('Error in handleOrderPaid:', error);
  }
}