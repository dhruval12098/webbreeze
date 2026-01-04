"use client";
import React, { useState, useEffect } from "react";
import BookingSidebar from "./BookingSidebar";
import ProgressBar from "./ProgressBar";
import { useAuth } from '@/app/context/AuthContext';

const StepTwo = ({ goToStep }) => {
  const [guestDetails, setGuestDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
    totalGuests: 1,
    specialRequests: ''
  });
  const [isProceeding, setIsProceeding] = useState(false);
  
  const { user, isAuthenticated, loading } = useAuth();
  
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
  
  // Load booking data from sessionStorage and user details
  useEffect(() => {
    // Load user details if available
    if (user) {
      setGuestDetails(prev => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email
      }));
    }
    
    // Load booking data from sessionStorage
    const storedBookingData = sessionStorage.getItem('bookingData');
    if (storedBookingData) {
      const bookingData = JSON.parse(storedBookingData);
      setGuestDetails(prev => ({
        ...prev,
        fullName: bookingData.fullName || user?.name || prev.fullName,
        email: bookingData.email || user?.email || prev.email,
        phone: bookingData.phone || prev.phone,
        totalGuests: bookingData.totalGuests || prev.totalGuests,
        specialRequests: bookingData.specialRequests || prev.specialRequests
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGuestDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProceed = () => {
    setIsProceeding(true);
    
    // Load existing booking data from sessionStorage
    const storedBookingData = sessionStorage.getItem('bookingData');
    let bookingData = {};
    
    if (storedBookingData) {
      bookingData = JSON.parse(storedBookingData);
    }
    
    // Add guest details to booking data
    const updatedBookingData = {
      ...bookingData,
      ...guestDetails
    };
    
    // Save updated booking data to sessionStorage
    sessionStorage.setItem('bookingData', JSON.stringify(updatedBookingData));
    
    // Add a small delay to show the loading state
    setTimeout(() => {
      setIsProceeding(false);
      goToStep(3);
    }, 500);
  };

  return (
    <div className="w-full min-h-[80vh] flex justify-center items-start py-8 md:py-12">
      {/* WRAPPER */}
      <section className="w-[95%] md:w-[90%] min-h-[80vh] flex flex-col md:flex-row rounded-2xl overflow-hidden border border-[#594B00]/20 shadow-sm">
        {/* LEFT SIDEBAR */}
        <BookingSidebar />

        {/* RIGHT SIDE */}
        <div className="w-full md:w-[70%] p-6 md:p-12 flex flex-col items-center">
          {/* PROGRESS BAR */}
          <ProgressBar active={2} onBack={goToStep} />

          {/* TITLE */}
          <h2 
            className="text-2xl md:text-3xl font-serif text-center mb-6 md:mb-8"
            style={{ fontFamily: "Playfair Display", fontStyle: "italic", color: "#173A00" }}
          >
            Guest Details
          </h2>

          {/* FORM CARD */}
          <div className="border border-[#594B00]/20 rounded-2xl p-6 md:p-10 w-full max-w-2xl bg-white shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
            {/* Full Name */}
            <div className="mb-5">
              <label 
                className="font-sans text-sm"
                style={{ fontFamily: "Plus Jakarta Sans", color: "#173A00" }}
              >
                *Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={guestDetails.fullName}
                onChange={handleChange}
                placeholder="Name"
                className="w-full bg-[#FFFBE6] p-3 rounded-full font-sans outline-none mt-1 border border-[#594B00]/30"
                style={{ fontFamily: "Plus Jakarta Sans", color: "#173A00" }}
              />
            </div>

            {/* Email */}
            <div className="mb-5">
              <label 
                className="font-sans text-sm"
                style={{ fontFamily: "Plus Jakarta Sans", color: "#173A00" }}
              >
                *Email Address
              </label>
              <input
                type="email"
                name="email"
                value={guestDetails.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full bg-[#FFFBE6] p-3 rounded-full font-sans outline-none mt-1 border border-[#594B00]/30"
                style={{ fontFamily: "Plus Jakarta Sans", color: "#173A00" }}
              />
            </div>

            {/* Phone */}
            <div className="mb-5">
              <label 
                className="font-sans text-sm"
                style={{ fontFamily: "Plus Jakarta Sans", color: "#173A00" }}
              >
                *Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={guestDetails.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full bg-[#FFFBE6] p-3 rounded-full font-sans outline-none mt-1 border border-[#594B00]/30"
                style={{ fontFamily: "Plus Jakarta Sans", color: "#173A00" }}
              />
            </div>

            {/* Guests */}
            <div className="mb-5">
              <label 
                className="font-sans text-sm"
                style={{ fontFamily: "Plus Jakarta Sans", color: "#173A00" }}
              >
                Number of Guests
              </label>
              <input
                type="number"
                name="totalGuests"
                value={guestDetails.totalGuests}
                onChange={handleChange}
                min="1"
                placeholder="0"
                className="w-full bg-[#FFFBE6] p-3 rounded-full font-sans outline-none mt-1 border border-[#594B00]/30"
                style={{ fontFamily: "Plus Jakarta Sans", color: "#173A00" }}
              />
            </div>

            {/* Message */}
            <div className="mb-5">
              <label 
                className="font-sans text-sm"
                style={{ fontFamily: "Plus Jakarta Sans", color: "#173A00" }}
              >
                Special Requests
              </label>
              <textarea
                name="specialRequests"
                value={guestDetails.specialRequests}
                onChange={handleChange}
                placeholder="Add Your Special Request here"
                className="w-full bg-[#FFFBE6] p-3 rounded-xl font-sans outline-none mt-1 min-h-[120px] border border-[#594B00]/30"
                style={{ fontFamily: "Plus Jakarta Sans", color: "#173A00" }}
              ></textarea>
            </div>

            {/* BUTTON */}
            <button
              className="mt-4 w-full bg-[#594B00] text-white p-3 rounded-full font-sans hover:bg-[#594B00]/90 transition"
              style={{ fontFamily: "Plus Jakarta Sans" }}
              onClick={handleProceed}
              disabled={isProceeding}
            >
              {isProceeding ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Proceeding...
                </div>
              ) : 'Proceed'}
            </button>

            {/* FOOTNOTE */}
            <p 
              className="mt-4 text-xs text-[#594B00] font-sans text-center"
              style={{ fontFamily: "Plus Jakarta Sans" }}
            >
              *Choose your stay dates. Price per night varies by room type.*
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StepTwo;