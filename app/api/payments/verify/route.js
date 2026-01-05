import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request) {
  try {
    const { order_id } = await request.json();

    if (!order_id) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Initialize Razorpay instance
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    
    try {
      // Fetch order details from Razorpay
      const order = await razorpay.orders.fetch(order_id);
      
      // Get the payments associated with this order to check actual payment status
      const payments = await razorpay.orders.fetchPayments(order_id);
      
      // Look for a captured payment
      const capturedPayment = payments.items.find(payment => payment.status === 'captured');
      
      if (capturedPayment) {
        // Payment was captured successfully
        return NextResponse.json({
          success: true,
          status: 'captured',
          payment_id: capturedPayment.id,
          order_id: order_id,
          amount: order.amount,
          amount_paid: order.amount_paid,
          amount_due: order.amount_due
        });
      } else {
        // Check if there are any failed payments
        const failedPayment = payments.items.find(payment => payment.status === 'failed');
        if (failedPayment) {
          return NextResponse.json({
            success: false,
            status: 'failed',
            payment_id: failedPayment.id,
            order_id: order_id,
            amount: order.amount,
            amount_paid: order.amount_paid,
            amount_due: order.amount_due
          });
        } else {
          // Payment might still be pending or processing
          return NextResponse.json({
            success: false,
            status: order.status,
            payment_id: null,
            order_id: order_id,
            amount: order.amount,
            amount_paid: order.amount_paid,
            amount_due: order.amount_due
          });
        }
      }
    } catch (razorpayError) {
      // If the order doesn't exist in Razorpay, return failed status
      console.error('Razorpay order verification error:', razorpayError);
      return NextResponse.json({
        success: false,
        status: 'failed',
        error: razorpayError.message
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}