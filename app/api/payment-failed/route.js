import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { booking_id, user_email, user_name, amount } = await request.json();

    // In a real implementation, you might want to store this info or send specific notifications
    console.log('Payment failed notification received:', { booking_id, user_email, user_name, amount });

    // The payment failure email is sent from the webhook handler
    // This API route can be used for additional notification logic if needed
    console.log('Payment failure notification sent for booking:', booking_id);

    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: 'Payment failure notification processed' 
    });
  } catch (error) {
    console.error('Error processing payment failure notification:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}