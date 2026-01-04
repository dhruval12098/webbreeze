import { supabase } from '@/app/lib/supabaseClient';

/**
 * Function to reconcile pending bookings with actual payment status
 * This checks if payments that are still marked as pending actually succeeded
 */
export async function reconcilePendingBookings(userId) {
  try {
    // Get all pending bookings for the user
    const { data: pendingBookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .eq('payment_status', 'pending')
      .gt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // Last 24 hours

    if (error) {
      console.error('Error fetching pending bookings:', error);
      return { success: false, error: error.message };
    }

    if (!pendingBookings || pendingBookings.length === 0) {
      return { success: true, updated: 0 };
    }

    let updatedCount = 0;

    // For each pending booking, verify the payment status with Razorpay
    for (const booking of pendingBookings) {
      if (booking.razorpay_order_id) {
        try {
          // Add a small delay to prevent rate limiting
          await new Promise(resolve => setTimeout(resolve, 200));
          // Verify payment status with Razorpay
          const paymentStatus = await verifyRazorpayPayment(booking.razorpay_order_id);
          
          if (paymentStatus.success && paymentStatus.paymentStatus === 'captured') {
            // Update the booking to confirmed
            const { error: updateError } = await supabase
              .from('bookings')
              .update({
                payment_status: 'success',
                booking_status: 'confirmed',
                transaction_id: paymentStatus.paymentId,
                updated_at: new Date().toISOString()
              })
              .eq('id', booking.id);

            if (updateError) {
              console.error('Error updating booking:', updateError.message || updateError);
            } else {
              updatedCount++;
              
              // Send confirmation email
              try {
                await fetch('/api/send-booking-emails', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ booking_id: booking.id }),
                });
              } catch (emailError) {
                console.error('Email sending failed:', emailError);
                // Don't fail the entire process if email fails
              }
            }
          } else if (paymentStatus.success === false && paymentStatus.paymentStatus === 'failed') {
            // Update the booking to cancelled if payment verification failed
            const { error: updateError } = await supabase
              .from('bookings')
              .update({
                payment_status: 'failed',
                booking_status: 'cancelled',
                updated_at: new Date().toISOString()
              })
              .eq('id', booking.id);

            if (updateError) {
              console.error('Error updating booking to cancelled:', updateError.message || updateError);
            }
          }
        } catch (paymentError) {
          console.error('Error verifying payment for booking:', booking.id, paymentError);
          // Continue with other bookings even if one fails
        }
      }
    }

    return { success: true, updated: updatedCount };
  } catch (error) {
    console.error('Error in reconcilePendingBookings:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Verify payment status with Razorpay
 */
async function verifyRazorpayPayment(orderId) {
  try {
    // In a real implementation, you would call Razorpay's API to verify the payment
    // For now, we'll simulate this with a fetch call to a verification endpoint
    // In production, this should be done server-side for security
    
    const response = await fetch('/api/payments/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ order_id: orderId }),
    });

    // Check if the response status is OK before parsing JSON
    if (!response.ok) {
      console.error('Razorpay API error:', response.status);
      return {
        success: false,
        paymentStatus: 'failed'
      };
    }
    
    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        paymentStatus: result.status,
        paymentId: result.payment_id
      };
    } else {
      return {
        success: false,
        paymentStatus: 'failed'
      };
    }
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    return {
      success: false,
      paymentStatus: 'failed'
    };
  }
}