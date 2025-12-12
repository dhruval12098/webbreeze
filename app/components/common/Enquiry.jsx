"use client";
import React, { useState, useRef, useEffect } from "react";
import Calendar from "../home/Calendar";

const Enquiry = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const dateRef = useRef(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-[98%] mx-auto rounded-3xl bg-white px-4 md:px-8 lg:px-16 py-12">
      {/* Outer Border */}
      <div className="w-full border rounded-3xl p-3 md:p-4 lg:p-5">
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* LEFT DARK IMAGE BOX */}
          <div
            className="rounded-2xl flex-1 relative overflow-hidden"
            style={{
              margin: "3px",
            }}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80')",
              }}
            ></div>

            {/* Gradient — dark bottom-left */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/40 to-transparent"></div>

            {/* TEXT (bottom-left) */}
            <div className="absolute bottom-8 left-8 text-white max-w-xs">
              <h2
                className="text-3xl md:text-4xl italic mb-3"
                style={{ fontFamily: "Playfair Display" }}
              >
                Enquire Now
              </h2>

              <p
                className="text-sm leading-relaxed opacity-90"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              >
                Have questions or ready to plan your stay? Reach out to us and
                we’ll help you create a peaceful getaway.
              </p>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="flex-1 mt-2 md:mt-0">
            <form className="flex flex-col gap-6">

              <input
                type="text"
                placeholder="Name"
                className="w-full border-b pb-2 focus:outline-none"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              />

              <div className="flex gap-4">
                <input
                  type="email"
                  placeholder="E-mail"
                  className="w-1/2 border-b pb-2 focus:outline-none"
                  style={{ fontFamily: "Plus Jakarta Sans" }}
                />
                <input
                  type="text"
                  placeholder="Number"
                  className="w-1/2 border-b pb-2 focus:outline-none"
                  style={{ fontFamily: "Plus Jakarta Sans" }}
                />
              </div>

              {/* Custom Date Picker */}
              <div className="relative" ref={dateRef}>
                <input
                  type="text"
                  readOnly
                  placeholder="Select Date"
                  value={selectedDate || ""}
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="w-full border-b pb-2 focus:outline-none cursor-pointer"
                  style={{ fontFamily: "Plus Jakarta Sans" }}
                />
                {showCalendar && (
                  <div className="absolute top-full left-0 mt-2 z-10">
                    <Calendar 
                      selectedDate={selectedDate}
                      onDateSelect={(date) => {
                        setSelectedDate(date);
                        setShowCalendar(false);
                      }}
                    />
                  </div>
                )}
              </div>

              <select
                className="w-full border-b pb-2 bg-transparent focus:outline-none"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              >
                <option>Number of Guests</option>
                <option>1 Guest</option>
                <option>2 Guests</option>
                <option>3 Guests</option>
                <option>4 Guests</option>
                <option>5+ Guests</option>
              </select>

              <textarea
                placeholder="Message"
                rows={3}
                className="w-full border-b pb-2 resize-none focus:outline-none"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              ></textarea>

              {/* SUBMIT BUTTON CENTERED */}
              <div className="w-full flex justify-center">
                <button
                  type="submit"
                  className="bg-black text-white px-6 py-2 rounded-full hover:opacity-90 transition"
                  style={{ fontFamily: "Plus Jakarta Sans" }}
                >
                  Submit Enquiry
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Enquiry;