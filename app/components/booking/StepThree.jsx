"use client";
import React, { useState, useEffect } from "react";
import BookingSidebar from "./BookingSidebar";
import ProgressBar from "./ProgressBar";
import { useAuth } from "@/app/context/AuthContext";

const StepThree = ({ goToStep }) => {
  const [bookingData, setBookingData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const { user, token, isAuthenticated, loading } = useAuth();
  
  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);
  
  // Redirect to login if not authenticated and not in payment processing
  useEffect(() => {
    const isPaymentProcessing = sessionStorage.getItem('isPaymentProcessing');
    if (!loading && !isAuthenticated && !isPaymentProcessing) {
      alert('Please log in to continue with your booking');
      window.location.href = '/login';
    }
  }, [isAuthenticated, loading]);
  
  // Don't render if not authenticated and not in payment processing
  if (!loading && !isAuthenticated && !sessionStorage.getItem('isPaymentProcessing')) {
    return null; // The redirect will happen before this renders
  }
  
  // Get booking data from sessionStorage
  useEffect(() => {
    const storedBookingData = sessionStorage.getItem('bookingData');
    if (storedBookingData) {
      setBookingData(JSON.parse(storedBookingData));
    }
  }, []);
  
  // Cleanup: Reset payment processing state when component unmounts
  useEffect(() => {
    return () => {
      setIsPaymentProcessing(false);
    };
  }, []);

  const handleBookingSubmit = async () => {
    if (!isAuthenticated) {
      alert('Please log in to complete your booking');
      window.location.href = '/login';
      return;
    }

    if (!bookingData) {
      alert('Booking data is missing. Please go back and try again.');
      return;
    }
    
    setIsSubmitting(true);

    // Convert 12-hour time format to 24-hour format for database
    let checkInTime24 = bookingData.checkInTime;
    if (bookingData.checkInTime) {
      const [time, period] = bookingData.checkInTime.split(' ');
      let [hours, minutes] = time.split(':');
      
      hours = parseInt(hours, 10);
      
      if (period === 'AM' && hours === 12) {
        hours = 0;
      } else if (period === 'PM' && hours !== 12) {
        hours += 12;
      }
      
      // Format hours to ensure it's always 2 digits
      const formattedHours = hours.toString().padStart(2, '0');
      checkInTime24 = `${formattedHours}:${minutes}`;
    }

    try {
      // First, create the booking with pending status
      const bookingResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          room_id: bookingData.room_id,
          check_in_date: bookingData.checkInDate,
          check_out_date: bookingData.checkOutDate,
          check_in_time: checkInTime24,
          total_guests: bookingData.totalGuests || 1,
          special_requests: bookingData.specialRequests || '',
          phone: bookingData.phone || '',
          total_amount: bookingData.totalAmount,
          payment_status: 'pending',
          booking_status: 'pending',
          razorpay_order_id: null // Will be set after order creation
        }),
      });

      const bookingResult = await bookingResponse.json();

      if (!bookingResult.success || !bookingResult.data) {
        alert('Failed to create booking. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Store the booking ID to use later
      const bookingId = bookingResult.data.id;

      // Create Razorpay order
      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: bookingData.totalAmount }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.orderId) {
        alert('Failed to create payment order. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Update the booking with the Razorpay order ID
      const updateResponse = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          razorpay_order_id: orderData.orderId
        }),
      });

      if (!updateResponse.ok) {
        console.error('Failed to update booking with order ID');
      }

      // Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: 'Breeze and Grains',
        description: 'Room Booking Payment',
        handler: async function (response) {
          console.log('Razorpay payment handler executed');
          console.log('Payment response:', response);
          
          // Set payment processing state to show loading screen
          setIsPaymentProcessing(true);
          
          // Store payment result in sessionStorage
          sessionStorage.setItem('paymentResult', 'success');
          sessionStorage.setItem('paymentResponse', JSON.stringify(response));
          
          // Store flag in sessionStorage to indicate payment processing for AuthContext
          sessionStorage.setItem('isPaymentProcessing', 'true');
          
          // Update the existing booking with payment details
          try {
            console.log('Updating booking with payment details...');
            const updateBookingResponse = await fetch(`/api/bookings/${bookingId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                transaction_id: response.razorpay_payment_id,
                payment_status: 'success',
                booking_status: 'confirmed'
              }),
            });

            const updateResult = await updateBookingResponse.json();
            console.log('Booking update response:', updateResult);

            if (updateResult.success) {
              console.log('Booking updated successfully, redirecting to confirmation');
              
              // Store booking ID in sessionStorage for confirmation page
              sessionStorage.setItem('bookingData', JSON.stringify(updateResult.data));
              
              // Set a server-confirmed marker
              sessionStorage.setItem('bookingConfirmed', 'true');
              
              // Send confirmation email
              try {
                console.log('Sending confirmation email...');
                await fetch('/api/send-booking-emails', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ booking_id: bookingId }),
                });
                console.log('Confirmation email sent');
              } catch (emailError) {
                console.error('Email sending failed:', emailError);
                // Don't block the flow if email fails
              }
              
              goToStep(4);
            } else {
              console.error('Booking update failed:', updateResult.error);
              // Redirect to payment failed page on booking failure
              setIsPaymentProcessing(false);
              sessionStorage.setItem('paymentResult', 'failed');
              window.location.href = '/payment-failed';
            }
          } catch (error) {
            console.error('Booking update error:', error);
            alert('An error occurred while confirming your booking. Please contact support.');
            setIsPaymentProcessing(false); // Reset loading state on error
            sessionStorage.setItem('paymentResult', 'failed');
            window.location.href = '/payment-failed';
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#594B00',
        },
      };

      // Add event handlers for payment failure/cancellation
      options.modal = {
        ondismiss: function() {
          // This runs when user closes the payment modal without completing payment
          setIsSubmitting(false);
          setIsPaymentProcessing(false);
          // Clear payment processing flag
          sessionStorage.removeItem('isPaymentProcessing');
          alert('Payment was cancelled. Please try again if you wish to complete your booking.');
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment initiation error:', error);
      // Clear payment processing flag on error
      sessionStorage.removeItem('isPaymentProcessing');
      alert('An error occurred while initiating payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <p>Loading booking details...</p>
      </div>
    );
  }

  // Show loading screen during payment processing
  if (isPaymentProcessing) {
    return (
      <div className="w-full min-h-screen flex justify-center items-start py-8 md:py-12 bg-gray-50">
        {/* WRAPPER */}
        <section className="w-[95%] md:w-[90%] min-h-screen flex flex-col md:flex-row rounded-2xl overflow-hidden border border-[#594B00]/20 shadow-sm bg-white">
          {/* LEFT SIDEBAR */}
          <BookingSidebar>
            {/* You can add static content like "Book Your Stay" here */}
          </BookingSidebar>

          {/* RIGHT SIDE */}
          <div className="w-full md:w-[70%] p-6 md:p-12 flex flex-col items-center justify-center">
            {/* PROGRESS BAR */}
            <ProgressBar active={3} onBack={goToStep} />
            
            {/* LOADING CONTENT */}
            <div className="flex flex-col items-center justify-center text-center w-full max-w-2xl">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#594B00] mb-6"></div>
              <h2 
                className="text-2xl md:text-3xl font-serif text-center mb-4"
                style={{ fontFamily: "Playfair Display", fontStyle: "italic", color: "#173A00" }}>
                Processing Your Payment
              </h2>
              <p className="text-base text-[#173A00] mb-2" style={{ fontFamily: "Plus Jakarta Sans" }}>
                Please wait while we confirm your booking...
              </p>
              <p className="text-sm text-[#173A00]/70" style={{ fontFamily: "Plus Jakarta Sans" }}>
                This may take a few moments
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-start py-8 md:py-12 bg-gray-50">
      {/* WRAPPER */}
      <section className="w-[95%] md:w-[90%] min-h-screen flex flex-col md:flex-row rounded-2xl overflow-hidden border border-[#594B00]/20 shadow-sm bg-white">
        {/* LEFT SIDEBAR */}
        <BookingSidebar>
          {/* You can add static content like "Book Your Stay" here */}
        </BookingSidebar>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-[70%] p-6 md:p-12 flex flex-col items-center">
          {/* PROGRESS BAR */}
          <ProgressBar active={3} onBack={goToStep} />

          {/* TITLE */}
          <h2 
            className="text-2xl md:text-3xl font-serif text-center mb-6 md:mb-8"
            style={{ fontFamily: "Playfair Display", fontStyle: "italic", color: "#173A00" }}
          >
            Booking Summary
          </h2>

          {/* SUMMARY CARD */}
          <div className="border border-[#594B00]/20 rounded-2xl p-6 md:p-10 w-full max-w-2xl bg-white shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
            {/* STAY DETAILS */}
            <div className="mb-6">
              <span 
                className="text-xs bg-[#FFFBE6] px-2 py-1 rounded font-sans uppercase"
                style={{ fontFamily: "Plus Jakarta Sans", color: "#173A00" }}
              >
                Stay Details
              </span>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between">
                  <span style={{ color: "#173A00" }}>Check-in</span>
                  <span style={{ color: "#173A00" }}>{new Date(bookingData.checkInDate).toLocaleDateString('en-GB')}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#173A00" }}>Check-out</span>
                  <span style={{ color: "#173A00" }}>{new Date(bookingData.checkOutDate).toLocaleDateString('en-GB')}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#173A00" }}>Guests</span>
                  <span style={{ color: "#173A00" }}>{bookingData.totalGuests || 1}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#173A00" }}>Check-in Time</span>
                  <span style={{ color: "#173A00" }}>{bookingData.checkInTime || 'Flexible'}</span>
                </div>
              </div>
            </div>

            {/* PAYMENT DETAILS */}
            <div>
              <span 
                className="text-xs bg-[#FFFBE6] px-2 py-1 rounded font-sans uppercase"
                style={{ fontFamily: "Plus Jakarta Sans", color: "#173A00" }}
              >
                Payment Details
              </span>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between">
                  <span style={{ color: "#173A00" }}>Room Charge</span>
                  <span style={{ color: "#173A00" }}>₹{bookingData.totalAmount ? (bookingData.totalAmount / 1.05).toFixed(2) : '0.00'}/-</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#173A00" }}>Nights</span>
                  <span style={{ color: "#173A00" }}>{bookingData.nights || 1}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#173A00" }}>GST</span>
                  <span style={{ color: "#173A00" }}>5%</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span style={{ color: "#173A00" }}>Total Amount</span>
                  <span style={{ color: "#173A00" }}>₹{bookingData.totalAmount || '0.00'}/-</span>
                </div>
              </div>
            </div>

            {/* SPECIAL REQUESTS */}
            {bookingData.specialRequests && (
              <div className="mt-6">
                <span 
                  className="text-xs bg-[#FFFBE6] px-2 py-1 rounded font-sans uppercase"
                  style={{ fontFamily: "Plus Jakarta Sans", color: "#173A00" }}
                >
                  Special Requests
                </span>
                <div className="mt-2">
                  <p style={{ color: "#173A00" }}>{bookingData.specialRequests}</p>
                </div>
              </div>
            )}

            {/* BUTTON */}
            <button 
              className="mt-6 w-full bg-[#594B00] text-white p-3 rounded-full font-sans text-base md:text-lg hover:bg-[#594B00]/90 transition"
              style={{ fontFamily: "Plus Jakarta Sans" }}
              onClick={handleBookingSubmit}
            disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : `Proceed To Pay ₹${bookingData.totalAmount || '0.00'}/-`}
            </button>

            {/* FOOTNOTE */}
            <p 
              className="mt-4 text-xs text-[#173A00] font-sans text-center"
              style={{ fontFamily: "Plus Jakarta Sans" }}
            >
              *Your booking will be confirmed upon successful payment.*
            </p>
            
            {/* PAYMENT NOTE */}
            <div className="mt-6 p-4 bg-[#FFFBE6] rounded-lg border border-[#594B00]/30">
              <p className="text-xs text-[#173A00] font-sans text-center" style={{ fontFamily: "Plus Jakarta Sans" }}>
                <strong>Note:</strong><br />
                • In case of payment issues, connect to the owner with payment screenshot or call them<br />
                • If payment stops and you're back to steps, complete payment from the profile page
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StepThree;