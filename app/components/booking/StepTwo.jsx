"use client";
import React from "react";
import BookingSidebar from "./BookingSidebar";
import ProgressBar from "./ProgressBar";

const StepTwo = ({ goToStep }) => {
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
            style={{ fontFamily: "Playfair Display", fontStyle: "italic", color: "#594B00" }}
          >
            Guest Details
          </h2>

          {/* FORM CARD */}
          <div className="border border-[#594B00]/20 rounded-2xl p-6 md:p-10 w-full max-w-2xl bg-white shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
            {/* Full Name */}
            <div className="mb-5">
              <label 
                className="font-sans text-sm"
                style={{ fontFamily: "Plus Jakarta Sans", color: "#594B00" }}
              >
                *Full Name
              </label>
              <input
                type="text"
                placeholder="Name"
                className="w-full bg-[#FFFBE6] p-3 rounded-full font-sans outline-none mt-1 border border-[#594B00]/30"
                style={{ fontFamily: "Plus Jakarta Sans", color: "#594B00" }}
              />
            </div>

            {/* Email */}
            <div className="mb-5">
              <label 
                className="font-sans text-sm"
                style={{ fontFamily: "Plus Jakarta Sans", color: "#594B00" }}
              >
                *Email Address
              </label>
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-[#FFFBE6] p-3 rounded-full font-sans outline-none mt-1 border border-[#594B00]/30"
                style={{ fontFamily: "Plus Jakarta Sans", color: "#594B00" }}
              />
            </div>

            {/* Phone */}
            <div className="mb-5">
              <label 
                className="font-sans text-sm"
                style={{ fontFamily: "Plus Jakarta Sans", color: "#594B00" }}
              >
                *Phone Number
              </label>
              <input
                type="tel"
                placeholder="Phone"
                className="w-full bg-[#FFFBE6] p-3 rounded-full font-sans outline-none mt-1 border border-[#594B00]/30"
                style={{ fontFamily: "Plus Jakarta Sans", color: "#594B00" }}
              />
            </div>

            {/* Guests */}
            <div className="mb-5">
              <label 
                className="font-sans text-sm"
                style={{ fontFamily: "Plus Jakarta Sans", color: "#594B00" }}
              >
                Number of Guests
              </label>
              <input
                type="number"
                placeholder="0"
                className="w-full bg-[#FFFBE6] p-3 rounded-full font-sans outline-none mt-1 border border-[#594B00]/30"
                style={{ fontFamily: "Plus Jakarta Sans", color: "#594B00" }}
              />
            </div>

            {/* Message */}
            <div className="mb-5">
              <label 
                className="font-sans text-sm"
                style={{ fontFamily: "Plus Jakarta Sans", color: "#594B00" }}
              >
                Message
              </label>
              <textarea
                placeholder="Add Your Special Request here"
                className="w-full bg-[#FFFBE6] p-3 rounded-xl font-sans outline-none mt-1 min-h-[120px] border border-[#594B00]/30"
                style={{ fontFamily: "Plus Jakarta Sans", color: "#594B00" }}
              ></textarea>
            </div>

            {/* BUTTON */}
            <button
              className="mt-4 w-full bg-[#594B00] text-white p-3 rounded-full font-sans hover:bg-[#594B00]/90 transition"
              style={{ fontFamily: "Plus Jakarta Sans" }}
              onClick={() => goToStep(3)}
            >
              Proceed
            </button>

            {/* FOOTNOTE */}
            <p 
              className="mt-4 text-xs text-[#594B00]/70 font-sans text-center"
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

export default StepTwo;