"use client";
import React from "react";
import BookingSidebar from "./BookingSidebar";
import ProgressBar from "./ProgressBar";

const StepThree = ({ goToStep }) => {
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
                  <span style={{ color: "#173A00" }}>01/01/2025</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#173A00" }}>Check-out</span>
                  <span style={{ color: "#173A00" }}>01/03/2025</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#173A00" }}>Guests</span>
                  <span style={{ color: "#173A00" }}>5</span>
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
                  <span style={{ color: "#173A00" }}>Complete Homestay</span>
                  <span style={{ color: "#173A00" }}>₹19,900/-</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#173A00" }}>Nights</span>
                  <span style={{ color: "#173A00" }}>2</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#173A00" }}>GST</span>
                  <span style={{ color: "#173A00" }}>5%</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span style={{ color: "#173A00" }}>Complete Homestay</span>
                  <span style={{ color: "#173A00" }}>₹41,690/-</span>
                </div>
              </div>
            </div>

            {/* BUTTON */}
            <button 
              className="mt-6 w-full bg-[#594B00] text-white p-3 rounded-full font-sans text-base md:text-lg hover:bg-[#594B00]/90 transition"
              style={{ fontFamily: "Plus Jakarta Sans" }}
              onClick={() => goToStep(4)}
            >
              Proceed To Pay ₹41,690/-
            </button>

            {/* FOOTNOTE */}
            <p 
              className="mt-4 text-xs text-[#594B00]/70 font-sans text-center"
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