"use client";
import React, { useState, useRef, useEffect } from "react";
import { AiOutlineCalendar, AiOutlineClockCircle } from "react-icons/ai";
import ProgressBar from "./ProgressBar";
import BookingSidebar from "./BookingSidebar";
import Calendar from "../home/Calendar";
import TimePicker from "./TimePicker";
import { useAuth } from '@/app/context/AuthContext';

const StepOne = ({ goToStep }) => {
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [checkInTime, setCheckInTime] = useState(null);
  const [showCheckInCalendar, setShowCheckInCalendar] = useState(false);
  const [showCheckOutCalendar, setShowCheckOutCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isProceeding, setIsProceeding] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  
  const checkInRef = useRef(null);
  const checkOutRef = useRef(null);
  const timeRef = useRef(null);
  
  const { isAuthenticated, loading } = useAuth();
  
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

  // Load booking data from sessionStorage
  useEffect(() => {
    const storedBookingData = sessionStorage.getItem('bookingData');
    if (storedBookingData) {
      const parsedBookingData = JSON.parse(storedBookingData);
      setBookingData(parsedBookingData);
      setCheckInDate(parsedBookingData.checkInDate || null);
      setCheckOutDate(parsedBookingData.checkOutDate || null);
      setCheckInTime(parsedBookingData.checkInTime || null);
    }
  }, []);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (checkInRef.current && !checkInRef.current.contains(event.target)) {
        setShowCheckInCalendar(false);
      }
      if (checkOutRef.current && !checkOutRef.current.contains(event.target)) {
        setShowCheckOutCalendar(false);
      }
      if (timeRef.current && !timeRef.current.contains(event.target)) {
        setShowTimePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Format time string for display
  const formatTime = (timeString) => {
    if (!timeString) return "Select time";
    
    // Check if the time is already in 12-hour format (HH:MM AM/PM)
    if (timeString.includes('AM') || timeString.includes('PM')) {
      return timeString;
    }
    
    // If it's in 24-hour format, convert to 12-hour
    const [hours24, minutes] = timeString.split(":");
    let hours = parseInt(hours24, 10);
    let period = 'AM';
    
    if (hours >= 12) {
      period = 'PM';
      if (hours > 12) {
        hours -= 12;
      }
    }
    
    if (hours === 0) {
      hours = 12;
    }
    
    return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  // Calculate number of nights between dates
  const calculateNights = () => {
    if (checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const timeDiff = checkOut.getTime() - checkIn.getTime();
      const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return nights > 0 ? nights : 0;
    }
    return 0;
  };
  
  // Check if a date is today or in the past
  const isPastDate = (dateString) => {
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part for comparison
    return selectedDate < today;
  };
  
  // Check if check-out date is before or same as check-in date
  const isInvalidDateRange = () => {
    if (!checkInDate || !checkOutDate) return false;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    return checkOut <= checkIn;
  };

  // Calculate total amount based on room price and number of nights
  const calculateTotalAmount = () => {
    // Try to get the room price from the selected room in sessionStorage
    const storedRoomData = sessionStorage.getItem('selectedRoom');
    let roomPrice = 9900; // Default price if no room is selected
    
    if (storedRoomData) {
      const room = JSON.parse(storedRoomData);
      roomPrice = parseFloat(room.price) || 9900;
    }
    
    const nights = calculateNights();
    const subtotal = roomPrice * nights;
    const gst = subtotal * 0.05; // 5% GST
    return subtotal + gst;
  };

  const handleProceed = async () => {
    if (!checkInDate || !checkOutDate) {
      alert('Please select both check-in and check-out dates');
      return;
    }
    
    if (checkInDate === checkOutDate) {
      alert('Check-in and check-out dates must be different');
      return;
    }
    
    // Set default check-in time to 12 PM if not selected
    const finalCheckInTime = checkInTime || '12:00 PM';
    
    setIsProceeding(true);
    
    // Load room data from sessionStorage if available
    const storedRoomData = sessionStorage.getItem('selectedRoom');
    let roomData = null;
    
    if (storedRoomData) {
      roomData = JSON.parse(storedRoomData);
    }
    
    // Store booking data in sessionStorage
    const bookingData = {
      room_id: roomData?.id || 'default-room-id',
      room_title: roomData?.title || 'Homestay',
      checkInDate,
      checkOutDate,
      // Set fixed check-out time to 10 AM
      checkInTime: finalCheckInTime,
      checkOutTime: '10:00 AM',
      nights: calculateNights(),
      totalAmount: calculateTotalAmount()
    };
    
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    
    // Add a small delay to show the loading state
    setTimeout(() => {
      setIsProceeding(false);
      goToStep(2);
    }, 500);
  };

  return (
    <div className="w-full min-h-[80vh] flex justify-center items-start py-8 md:py-12">
      {/* WRAPPER */}
      <section className="w-[95%] md:w-[90%] min-h-[80vh] flex flex-col md:flex-row rounded-2xl overflow-hidden border border-[#594B00]/20 shadow-sm">
        {/* LEFT SIDEBAR (REUSABLE) */}
        <BookingSidebar />

        {/* RIGHT CONTENT */}
        <div className="w-full md:w-[70%] p-6 md:p-12 flex flex-col items-center bg-white">
          {/* PROGRESS BAR */}
          <ProgressBar active={1} onBack={goToStep} />

          {/* TITLE */}
          <h2 
            className="text-2xl md:text-3xl font-serif text-center mb-6 md:mb-8"
            style={{ fontFamily: "Playfair Display", fontStyle: "italic", color: "#594B00" }}
          >
            Select Your Check-in Date <br /> & Time
          </h2>

          {/* FORM CARD */}
          <div className="mt-6 md:mt-10 border border-[#594B00]/20 rounded-2xl p-6 md:p-8 w-full max-w-2xl bg-[#FFFBE6]">
            {/* Check-in Date */}
            <label 
              className="font-sans text-sm"
              style={{ fontFamily: "Plus Jakarta Sans", color: "#594B00" }}
            >
              *Select Check-In Date
            </label>
            <div className="mt-1 relative" ref={checkInRef}>
              <div 
                className="w-full bg-white p-3 rounded-full font-sans outline-none flex justify-between items-center cursor-pointer border border-[#594B00]/30"
                style={{ fontFamily: "Plus Jakarta Sans" }}
                onClick={() => setShowCheckInCalendar(!showCheckInCalendar)}
              >
                <span style={{ color: "#594B00" }}>{checkInDate ? new Date(checkInDate).toLocaleDateString('en-GB') : "Select date"}</span>
                <AiOutlineCalendar className="text-[#594B00]" size={20} />
              </div>
              
              {/* Calendar Dropdown */}
              {showCheckInCalendar && (
                <div className="absolute top-full left-0 mt-2 z-10 w-full md:w-auto">
                  <Calendar 
                    selectedDate={checkInDate}
                    roomId={bookingData?.room_id}
                    onDateSelect={(date) => {
                      setCheckInDate(date);
                      setShowCheckInCalendar(false);
                    }}
                  />
                </div>
              )}
            </div>

            {/* Check-out Date */}
            <label 
              className="font-sans text-sm mt-4 block"
              style={{ fontFamily: "Plus Jakarta Sans", color: "#594B00" }}
            >
              *Select Check-Out Date
            </label>
            <div className="mt-1 relative" ref={checkOutRef}>
              <div 
                className={`w-full bg-white p-3 rounded-full font-sans outline-none flex justify-between items-center cursor-pointer border border-[#594B00]/30 ${checkInDate ? '' : 'opacity-50 cursor-not-allowed'}`}
                style={{ fontFamily: "Plus Jakarta Sans" }}
                onClick={checkInDate ? () => setShowCheckOutCalendar(!showCheckOutCalendar) : undefined}
              >
                <span style={{ color: "#594B00" }}>{checkOutDate ? new Date(checkOutDate).toLocaleDateString('en-GB') : "Select date"}</span>
                <AiOutlineCalendar className="text-[#594B00]" size={20} />
              </div>
              
              {/* Calendar Dropdown */}
              {showCheckOutCalendar && (
                <div className="absolute top-full left-0 mt-2 z-10 w-full md:w-auto">
                  <Calendar 
                    selectedDate={checkOutDate}
                    roomId={bookingData?.room_id}
                    onDateSelect={(date) => {
                      setCheckOutDate(date);
                      setShowCheckOutCalendar(false);
                    }}
                  />
                </div>
              )}
            </div>

            {/* Check-in Time */}
            <label 
              className="font-sans text-sm mt-4 block"
              style={{ fontFamily: "Plus Jakarta Sans", color: "#594B00" }}
            >
              *Preferred Check-In Time
            </label>
            <div className="mt-1 relative" ref={timeRef}>
              <div 
                className="w-full bg-white p-3 rounded-full font-sans outline-none flex justify-between items-center cursor-pointer border border-[#594B00]/30"
                style={{ fontFamily: "Plus Jakarta Sans" }}
                onClick={() => setShowTimePicker(!showTimePicker)}
              >
                <span style={{ color: "#594B00" }}>{formatTime(checkInTime)}</span>
                <AiOutlineClockCircle className="text-[#594B00]" size={20} />
              </div>
              
              {/* Time Picker Dropdown */}
              {showTimePicker && (
                <div className="absolute top-full left-0 mt-2 z-10 w-full md:w-auto">
                  <TimePicker 
                    selectedTime={checkInTime}
                    onTimeSelect={(time) => {
                      setCheckInTime(time);
                      setShowTimePicker(false);
                    }}
                    isCheckInTime={true}
                  />
                </div>
              )}
            </div>

            {/* CHECKBOXES */}
            <div className="mt-6 space-y-2">
              <label 
                className="flex items-center gap-2 text-sm font-sans text-[#594B00]"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              >
                <input type="checkbox" className="rounded text-[#594B00] focus:ring-[#594B00]" />
                I have Read the terms and Condition
              </label>

              <label 
                className="flex items-center gap-2 text-sm font-sans text-[#594B00]"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              >
                <input type="checkbox" className="rounded text-[#594B00] focus:ring-[#594B00]" />
                I have Read the Cancellation Policy
              </label>
            </div>

            {/* BUTTON */}
            <button
              className="mt-6 w-full bg-[#594B00] text-white p-3 rounded-full font-sans hover:bg-[#594B00]/90 transition"
              style={{ fontFamily: "Plus Jakarta Sans" }}
              onClick={handleProceed}
              disabled={!checkInDate || !checkOutDate || isProceeding}
            >
              {isProceeding ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Proceeding...
                </div>
              ) : 'Proceed'}
            </button>

            {/* TEXT BOTTOM LEFT */}
            <p 
              className="mt-4 text-xs text-[#594B00]/70 font-sans text-center md:text-left"
              style={{ fontFamily: "Plus Jakarta Sans" }}
            >
              *Choose your stay dates. Entire homestay is ₹9,900 per night.*
            </p>
            
            {/* Display calculated nights and total */}
            {checkInDate && checkOutDate && (
              <div className="mt-4 p-3 bg-white rounded-lg border border-[#594B00]/30">
                <p style={{ color: "#594B00", fontFamily: "Plus Jakarta Sans" }}>
                  Nights: {calculateNights()} | Total: ₹{calculateTotalAmount().toFixed(2)}/-
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default StepOne;