"use client";
import React from 'react';
import { CheckCircle } from 'lucide-react';
import BookingSidebar from './BookingSidebar';
import ProgressBar from './ProgressBar';

const Confirmation = ({ goToStep }) => {
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
          <ProgressBar active={4} onBack={goToStep} />

          {/* Success Icon */}
          <CheckCircle className="mx-auto text-green-500 w-20 h-20 mb-6 mt-6" />

          {/* Thank You Message */}
          <h1 
            className="text-3xl font-sans-serif font-bold mb-2 text-center"
            style={{ fontFamily: "Plus Jakarta Sans", fontStyle: "semibold" }}
          >
            Booking Confirmed!
          </h1>
          <p 
            className="text-gray-600 mb-6 text-center"
            style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 600 }}
          >
            Thank you for choosing our homestay. Your booking has been successfully processed.
          </p>

          {/* Booking Summary Card */}
          <div className="bg-gray-50 rounded-2xl p-8 text-left w-[90%] shadow-sm mb-6">
            <h2 
              className="text-lg font-semibold mb-4"
              style={{ fontFamily: "Playfair Display" }}
            >
              Booking Summary
            </h2>
            <div className="flex justify-between mb-2">
              <span 
                className="font-sans text-gray-700"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              >
                Check-in:
              </span>
              <span 
                className="font-sans font-medium"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              >
                01/01/2025
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span 
                className="font-sans text-gray-700"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              >
                Check-out:
              </span>
              <span 
                className="font-sans font-medium"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              >
                03/01/2025
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span 
                className="font-sans text-gray-700"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              >
                Guests:
              </span>
              <span 
                className="font-sans font-medium"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              >
                5
              </span>
            </div>
            <div className="flex justify-between font-bold mt-3 pt-3 border-t border-gray-200">
              <span
                style={{ fontFamily: "Plus Jakarta Sans" }}
              >
                Total:
              </span>
              <span
                style={{ fontFamily: "Plus Jakarta Sans" }}
              >
                ₹41,690/-
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <button 
            className="w-full bg-black text-white p-3 rounded-full font-sans text-lg mb-3 hover:bg-gray-900 transition"
            style={{ fontFamily: "Plus Jakarta Sans" }}
          >
            View Your Booking
          </button>
          <button 
            className="w-full bg-gray-200 text-gray-800 p-3 rounded-full font-sans text-lg hover:bg-gray-300 transition"
            style={{ fontFamily: "Plus Jakarta Sans" }}
          >
            Back to Home
          </button>

        </div>
      </section>
    </div>
  );
};

export default Confirmation;