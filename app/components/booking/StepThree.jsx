"use client";
import React, { useState, useEffect } from "react";
import BookingSidebar from "./BookingSidebar";
import ProgressBar from "./ProgressBar";
import { useAuth } from "@/app/context/AuthContext";

const StepThree = ({ goToStep }) => {
  const [bookingData, setBookingData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, token, isAuthenticated, loading } = useAuth();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      alert('Please log in to continue with your booking');
      window.location.href = '/login';
    }
  }, [isAuthenticated, loading]);
  
  // Don't render if not authenticated
  if (!loading && !isAuthenticated) {
    return null; // The redirect will happen before this renders
  }
  
  // Get booking data from sessionStorage
  useEffect(() => {
    const storedBookingData = sessionStorage.getItem('bookingData');
    if (storedBookingData) {
      setBookingData(JSON.parse(storedBookingData));
    }
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
      const response = await fetch('/api/bookings', {
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
          total_amount: bookingData.totalAmount,
          booking_status: 'confirmed'
        })
      });

      const result = await response.json();

      if (result.success) {
        // Update booking data in sessionStorage with the saved booking from the API
        sessionStorage.setItem('bookingData', JSON.stringify(result.data));
        // Move to confirmation step
        goToStep(4);
      } else {
        alert(`Booking failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      alert('An error occurred while submitting your booking. Please try again.');
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
            style={{ fontFamily: "Playfair Display", fontStyle: "italic", color: "#594B00" }}
          >
            Booking Summary
          </h2>

          {/* SUMMARY CARD */}
          <div className="border border-[#594B00]/20 rounded-2xl p-6 md:p-10 w-full max-w-2xl bg-white shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
            {/* STAY DETAILS */}
            <div className="mb-6">
              <span 
                className="text-xs bg-[#FFFBE6] px-2 py-1 rounded font-sans uppercase"
                style={{ fontFamily: "Plus Jakarta Sans", color: "#594B00" }}
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
                style={{ fontFamily: "Plus Jakarta Sans", color: "#594B00" }}
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
                  style={{ fontFamily: "Plus Jakarta Sans", color: "#594B00" }}
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
              ) : `Proceed To Pay ₹${bookingData.totalAmount || '0.00'}-/`}
            </button>

            {/* FOOTNOTE */}
            <p 
              className="mt-4 text-xs text-[#594B00]/70 font-sans text-center"
              style={{ fontFamily: "Plus Jakarta Sans" }}
            >
              *Your booking will be confirmed upon successful payment.*
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StepThree;