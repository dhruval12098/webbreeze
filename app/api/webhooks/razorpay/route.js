import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

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

    // You can add additional logic here like sending confirmation emails
    // await sendBookingConfirmationEmail(booking);
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
  } catch (error) {
    console.error('Error in handlePaymentFailed:', error);
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
        booking_status: 'Confirmed', // Update booking status to confirmed
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

    // You can add additional logic here like sending confirmation emails
    // await sendBookingConfirmationEmail(booking);
  } catch (error) {
    console.error('Error in handleOrderPaid:', error);
  }
}