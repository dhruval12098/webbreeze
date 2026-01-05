// This is a proxy route to forward requests to the actual webhook handler
import { NextResponse } from 'next/server';

// Import the actual webhook handler
import { POST as WebhookHandler } from '../webhooks/razorpay/route';

export async function POST(request) {
  try {
    // Forward the request to the actual webhook handler
    return await WebhookHandler(request);
  } catch (error) {
    console.error('Error in razorpay webhook proxy:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}