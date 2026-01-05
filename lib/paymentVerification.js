// Utility functions for payment verification

// Function to verify all pending payments for a user
export async function verifyUserPendingPayments(userId) {
  try {
    // First, get all pending bookings for the user
    const response = await fetch('/api/bookings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }

    const bookings = await response.json();
    
    // Filter for pending bookings of this user
    const pendingBookings = bookings.filter(booking => 
      booking.user_id === userId && 
      booking.payment_status === 'pending' &&
      booking.razorpay_order_id
    );

    const results = [];

    // Verify each pending booking
    for (const booking of pendingBookings) {
      const verifyResponse = await fetch('/api/payments/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: booking.razorpay_order_id,
          bookingId: booking.id
        }),
      });

      const result = await verifyResponse.json();
      results.push({
        bookingId: booking.id,
        orderId: booking.razorpay_order_id,
        ...result
      });
    }

    return results;
  } catch (error) {
    console.error('Error verifying user pending payments:', error);
    throw error;
  }
}

// Function to verify a single booking payment
export async function verifyBookingPayment(orderId, bookingId) {
  try {
    const response = await fetch('/api/payments/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
        bookingId
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to verify payment');
    }

    return result;
  } catch (error) {
    console.error('Error verifying booking payment:', error);
    throw error;
  }
}