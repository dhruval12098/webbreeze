"use client";
import React from "react";
import BookingSidebar from "./BookingSidebar";
import ProgressBar from "./ProgressBar";

const StepThree = ({ goToStep }) => {
  return (
    <div className="w-full min-h-screen flex justify-center items-start py-12 bg-gray-50">

      {/* WRAPPER */}
      <section className="w-[90%] min-h-screen flex rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">

        {/* LEFT SIDEBAR */}
        <BookingSidebar>
          {/* You can add static content like "Book Your Stay" here */}
        </BookingSidebar>

        {/* RIGHT SIDE */}
        <div className="w-[70%] p-12 flex flex-col items-center">

          {/* PROGRESS BAR */}
          <ProgressBar active={3} onBack={goToStep} />

          {/* TITLE */}
          <h2 
            className="text-3xl font-serif text-center mb-8"
            style={{ fontFamily: "Playfair Display", fontStyle: "italic" }}
          >
            Booking Summary
          </h2>

          {/* SUMMARY CARD */}
          <div className="border border-gray-300 rounded-2xl p-10 w-[90%] bg-white shadow-[0_2px_6px_rgba(0,0,0,0.05)]">

            {/* STAY DETAILS */}
            <div className="mb-6">
              <span 
                className="text-xs bg-gray-200 px-2 py-1 rounded font-sans uppercase"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              >
                Stay Details
              </span>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between">
                  <span>Check-in Date</span>
                  <span>01/01/2025</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-out Date</span>
                  <span>01/01/2025</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total Nights</span>
                  <span>2 Nights</span>
                </div>
              </div>
            </div>

            {/* DIVIDER */}
            <hr className="border-t border-gray-300 my-4" />

            {/* GUEST DETAILS */}
            <div className="mb-6">
              <span 
                className="text-xs bg-gray-200 px-2 py-1 rounded font-sans uppercase"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              >
                Guest Details
              </span>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between">
                  <span>Name</span>
                  <span>Dhruval A Patel</span>
                </div>
                <div className="flex justify-between">
                  <span>Email</span>
                  <span>dhruval@12gmail.com</span>
                </div>
                <div className="flex justify-between">
                  <span>Number</span>
                  <span>991231232</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Guest</span>
                  <span>5</span>
                </div>
                <div className="flex justify-between">
                  <span>Message</span>
                  <span>Fresh Food and only veg</span>
                </div>
              </div>
            </div>

            {/* DIVIDER */}
            <hr className="border-t border-gray-300 my-4" />

            {/* PRICE BREAKDOWN */}
            <div className="mb-6">
              <span 
                className="text-xs bg-gray-200 px-2 py-1 rounded font-sans uppercase"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              >
                Price Breakdown
              </span>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between">
                  <span>Complete Homestay</span>
                  <span>₹19,900/-</span>
                </div>
                <div className="flex justify-between">
                  <span>Nights</span>
                  <span>2</span>
                </div>
                <div className="flex justify-between">
                  <span>GST</span>
                  <span>5%</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Complete Homestay</span>
                  <span>₹41,690/-</span>
                </div>
              </div>
            </div>

            {/* BUTTON */}
            <button 
              className="mt-4 w-full bg-black text-white p-3 rounded-full font-sans text-lg"
              style={{ fontFamily: "Plus Jakarta Sans" }}
              onClick={() => goToStep(4)}
            >
              Proceed To Pay ₹41,690/-
            </button>

            {/* FOOTNOTE */}
            <p 
              className="mt-4 text-xs text-gray-500 font-sans text-center"
              style={{ fontFamily: "Plus Jakarta Sans" }}
            >
              *Choose your stay dates. Entire homestay is ₹19,900 per night.*
            </p>

          </div>
        </div>
      </section>
    </div>
  );
};

export default StepThree;