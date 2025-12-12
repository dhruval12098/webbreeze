"use client";
import React, { useState, useRef, useEffect } from "react";
import { AiOutlineCalendar, AiOutlineClockCircle } from "react-icons/ai";
import ProgressBar from "./ProgressBar";
import BookingSidebar from "./BookingSidebar";
import Calendar from "../home/Calendar";
import TimePicker from "./TimePicker";

const StepOne = ({ goToStep }) => {
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [checkInTime, setCheckInTime] = useState(null);
  const [showCheckInCalendar, setShowCheckInCalendar] = useState(false);
  const [showCheckOutCalendar, setShowCheckOutCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  const checkInRef = useRef(null);
  const checkOutRef = useRef(null);
  const timeRef = useRef(null);

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

  // Convert 24-hour time to 12-hour format with AM/PM
  const formatTime = (time24) => {
    if (!time24) return "Select time";
    
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;
    
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <div className="w-full min-h-[80vh] flex justify-center items-start py-12">

      {/* WRAPPER */}
      <section className="w-[90%] min-h-[80vh] flex rounded-2xl overflow-hidden border border-gray-200 shadow-sm">

        {/* LEFT SIDEBAR (REUSABLE) */}
        <BookingSidebar />

        {/* RIGHT CONTENT */}
        <div className="w-[70%] p-12 flex flex-col items-center">

          {/* PROGRESS BAR */}
          <ProgressBar active={1} onBack={goToStep} />

          {/* TITLE */}
          <h2 
            className="text-3xl font-serif text-center"
            style={{ fontFamily: "Playfair Display", fontStyle: "italic" }}
          >
            Select Your Check-in Date <br /> & Time
          </h2>

          {/* FORM CARD */}
          <div className="mt-10 border border-gray-300 rounded-2xl p-8 w-[70%] bg-white">

            {/* Check-in Date */}
            <label 
              className="font-sans text-sm"
              style={{ fontFamily: "Plus Jakarta Sans" }}
            >
              *Select Check-In Date
            </label>
            <div className="mt-1 relative" ref={checkInRef}>
              <div 
                className="w-full bg-gray-200 p-3 rounded-full font-sans outline-none flex justify-between items-center cursor-pointer"
                onClick={() => setShowCheckInCalendar(!showCheckInCalendar)}
              >
                <span>{checkInDate || "Select date"}</span>
                <AiOutlineCalendar className="text-gray-500" size={20} />
              </div>
              
              {/* Calendar Dropdown */}
              {showCheckInCalendar && (
                <div className="absolute top-full left-0 mt-2 z-10">
                  <Calendar 
                    selectedDate={checkInDate}
                    onDateSelect={(date) => {
                      setCheckInDate(date);
                      setShowCheckInCalendar(false);
                    }}
                  />
                </div>
              )}
            </div>

            {/* Check-Out Date */}
            <label 
              className="font-sans text-sm mt-5"
              style={{ fontFamily: "Plus Jakarta Sans" }}
            >
              *Select Check-Out Date
            </label>
            <div className="mt-1 relative" ref={checkOutRef}>
              <div 
                className="w-full bg-gray-200 p-3 rounded-full font-sans outline-none flex justify-between items-center cursor-pointer"
                onClick={() => setShowCheckOutCalendar(!showCheckOutCalendar)}
              >
                <span>{checkOutDate || "Select date"}</span>
                <AiOutlineCalendar className="text-gray-500" size={20} />
              </div>
              
              {/* Calendar Dropdown */}
              {showCheckOutCalendar && (
                <div className="absolute top-full left-0 mt-2 z-10">
                  <Calendar 
                    selectedDate={checkOutDate}
                    onDateSelect={(date) => {
                      setCheckOutDate(date);
                      setShowCheckOutCalendar(false);
                    }}
                  />
                </div>
              )}
            </div>

            {/* Check-In Time */}
            <label 
              className="font-sans text-sm mt-5"
              style={{ fontFamily: "Plus Jakarta Sans" }}
            >
              *Select Check-In Time
            </label>
            <div className="mt-1 relative" ref={timeRef}>
              <div 
                className="w-full bg-gray-200 p-3 rounded-full font-sans outline-none flex justify-between items-center cursor-pointer"
                onClick={() => setShowTimePicker(!showTimePicker)}
              >
                <span>{formatTime(checkInTime)}</span>
                <AiOutlineClockCircle className="text-gray-500" size={20} />
              </div>
              
              {/* Time Picker Dropdown */}
              {showTimePicker && (
                <div className="absolute top-full left-0 mt-2 z-10">
                  <TimePicker 
                    selectedTime={checkInTime}
                    onTimeSelect={(time) => {
                      setCheckInTime(time);
                      setShowTimePicker(false);
                    }}
                  />
                </div>
              )}
            </div>

            {/* CHECKBOXES */}
            <div className="mt-6 space-y-2">
              <label 
                className="flex items-center gap-2 text-sm font-sans text-gray-600"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              >
                <input type="checkbox" />
                I have Read the terms and Condition
              </label>

              <label 
                className="flex items-center gap-2 text-sm font-sans text-gray-600"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              >
                <input type="checkbox" />
                I have Read the Cancellation Policy
              </label>
            </div>

            {/* BUTTON */}
            <button
              className="mt-6 w-full bg-black text-white p-3 rounded-full font-sans"
              style={{ fontFamily: "Plus Jakarta Sans" }}
              onClick={() => goToStep(2)}
            >
              Proceed
            </button>

            {/* TEXT BOTTOM LEFT */}
            <p 
              className="mt-4 text-xs text-gray-500 font-sans text-left"
              style={{ fontFamily: "Plus Jakarta Sans" }}
            >
              *Choose your stay dates. Entire homestay is ₹9,900 per night.*
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StepOne;