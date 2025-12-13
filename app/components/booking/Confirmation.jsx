"use client";
import React from 'react';
import { CheckCircle } from 'lucide-react';
import BookingSidebar from './BookingSidebar';
import ProgressBar from './ProgressBar';

const Confirmation = ({ goToStep }) => {
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
          <ProgressBar active={4} onBack={goToStep} />

          {/* Success Icon */}
          <CheckCircle className="mx-auto text-green-500 w-16 h-16 md:w-20 md:h-20 mb-6 mt-6" />

          {/* Thank You Message */}
          <h1 
            className="text-2xl md:text-3xl font-sans-serif font-bold mb-2 text-center"
            style={{ fontFamily: "Plus Jakarta Sans", fontStyle: "semibold", color: "#594B00" }}
          >
            Booking Confirmed!
          </h1>
          <p 
            className="mb-6 text-center text-sm md:text-base"
            style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 600, color: "#173A00" }}
          >
            Thank you for choosing our homestay. Your booking has been successfully processed.
          </p>

          {/* Booking Summary Card */}
          <div className="bg-[#FFFBE6] rounded-2xl p-6 md:p-8 text-left w-full max-w-2xl shadow-sm mb-6">
            <h2 
              className="text-lg font-semibold mb-4"
              style={{ fontFamily: "Playfair Display", color: "#594B00" }}
            >
              Booking Summary
            </h2>
            <div className="flex justify-between mb-2">
              <span 
                className="font-sans text-sm"
                style={{ fontFamily: "Plus Jakarta Sans", color: "#173A00" }}
              >
                Check-in:
              </span>
              <span 
                className="font-sans font-medium text-sm"
                style={{ fontFamily: "Plus Jakarta Sans", color: "#173A00" }}
              >
                01/01/2025
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span 
                className="font-sans text-sm"
                style={{ fontFamily: "Plus Jakarta Sans", color: "#173A00" }}
              >
                Check-out:
              </span>
              <span 
                className="font-sans font-medium text-sm"
                style={{ fontFamily: "Plus Jakarta Sans", color: "#173A00" }}
              >
                01/03/2025
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span 
                className="font-sans text-sm"
                style={{ fontFamily: "Plus Jakarta Sans", color: "#173A00" }}
              >
                Guests:
              </span>
              <span 
                className="font-sans font-medium text-sm"
                style={{ fontFamily: "Plus Jakarta Sans", color: "#173A00" }}
              >
                5
              </span>
            </div>
            <div className="flex justify-between font-bold mt-3 pt-3 border-t border-gray-200">
              <span
                style={{ fontFamily: "Plus Jakarta Sans", color: "#173A00" }}
              >
                Total:
              </span>
              <span
                style={{ fontFamily: "Plus Jakarta Sans", color: "#173A00" }}
              >
                ₹41,690/-
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <button 
            className="w-full max-w-2xl bg-[#594B00] text-white p-3 rounded-full font-sans text-base md:text-lg mb-3 hover:bg-[#594B00]/90 transition"
            style={{ fontFamily: "Plus Jakarta Sans" }}
            onClick={() => window.location.href = "/profile"}
          >
            View Your Booking
          </button>
          <button 
            className="w-full max-w-2xl bg-[#FFFBE6] text-[#594B00] p-3 rounded-full font-sans text-base md:text-lg hover:bg-[#594B00]/10 transition border border-[#594B00]/30"
            style={{ fontFamily: "Plus Jakarta Sans" }}
            onClick={() => window.location.href = "/"}
          >
            Back to Home
          </button>
        </div>
      </section>
    </div>
  );
};

export default Confirmation;