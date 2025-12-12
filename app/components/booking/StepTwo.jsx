"use client";
import React from "react";
import BookingSidebar from "./BookingSidebar";
import ProgressBar from "./ProgressBar";

const StepTwo = ({ goToStep }) => {
  return (
    <div className="w-full min-h-[80vh] flex justify-center items-start py-12">

      {/* WRAPPER */}
      <section className="w-[90%] min-h-[80vh] flex rounded-2xl overflow-hidden border border-gray-200 shadow-sm">

        {/* LEFT SIDEBAR */}
        <BookingSidebar />

        {/* RIGHT SIDE */}
        <div className="w-[70%] p-12 flex flex-col items-center">

          {/* PROGRESS BAR */}
          <ProgressBar active={2} onBack={goToStep} />

          {/* TITLE */}
          <h2 
            className="text-3xl font-serif text-center mb-8"
            style={{ fontFamily: "Playfair Display", fontStyle: "italic" }}
          >
            Guest Details
          </h2>

          {/* FORM CARD */}
          <div className="border border-gray-300 rounded-2xl p-10 w-[80%] bg-white shadow-[0_2px_6px_rgba(0,0,0,0.05)]">

            {/* Full Name */}
            <div className="mb-5">
              <label 
                className="font-sans text-sm"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              >
                *Full Name
              </label>
              <input
                type="text"
                placeholder="Name"
                className="w-full bg-gray-200 p-3 rounded-full font-sans outline-none mt-1"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              />
            </div>

            {/* Phone Number */}
            <div className="mb-5">
              <label 
                className="font-sans text-sm"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              >
                *Phone Number
              </label>
              <input
                type="number"
                placeholder="number"
                className="w-full bg-gray-200 p-3 rounded-full font-sans outline-none mt-1"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              />
            </div>

            {/* Email */}
            <div className="mb-5">
              <label 
                className="font-sans text-sm"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              >
                *Email
              </label>
              <input
                type="email"
                placeholder="your email id here"
                className="w-full bg-gray-200 p-3 rounded-full font-sans outline-none mt-1"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              />
            </div>

            {/* Guests */}
            <div className="mb-5">
              <label 
                className="font-sans text-sm"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              >
                Number of Guests
              </label>
              <input
                type="number"
                placeholder="0"
                className="w-full bg-gray-200 p-3 rounded-full font-sans outline-none mt-1"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              />
            </div>

            {/* Message */}
            <div className="mb-5">
              <label 
                className="font-sans text-sm"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              >
                Message
              </label>
              <textarea
                placeholder="Add Your Special Request here"
                className="w-full bg-gray-200 p-3 rounded-xl font-sans outline-none mt-1 min-h-[120px]"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              ></textarea>
            </div>

            {/* BUTTON */}
            <button
              className="mt-4 w-full bg-black text-white p-3 rounded-full font-sans"
              style={{ fontFamily: "Plus Jakarta Sans" }}
              onClick={() => goToStep(3)}
            >
              Proceed
            </button>

            {/* FOOTNOTE */}
            <p 
              className="mt-4 text-xs text-gray-500 font-sans text-center"
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