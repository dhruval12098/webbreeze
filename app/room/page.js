"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar, ArrowUpRight, Wifi, Coffee, Tv, Wind, Utensils, Car, Droplets, Users } from "lucide-react";
import Description from "../components/room/Description";
import ReviewSection from "../components/home/ReviewSection";
import CalendarComponent from "../components/home/Calendar";

const Page = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const calendarRef = useRef(null);

  // Image array
  const images = [
    '/image/image8.jpg',
    '/image/image1.jpg',
    '/image/image2.jpg',
    '/image/image3.jpg'
  ];

  // Amenities data
  const amenities = [
    { icon: Wifi, name: "Free WiFi" },
    { icon: Coffee, name: "Breakfast" },
    { icon: Tv, name: "Smart TV" },
    { icon: Wind, name: "AC" },
    { icon: Utensils, name: "Kitchen" },
    { icon: Car, name: "Parking" },
    { icon: Droplets, name: "Hot Water" },
    { icon: Users, name: "Family Room" }
  ];

  // Auto-rotate images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCalendarIconClick = () => {
    setShowCalendar(!showCalendar);
  };

  return (
    <>
      <div className="w-[98%] mx-auto rounded-3xl bg-white min-h-screen px-4 md:px-8 lg:px-12 py-12">
        
        {/* DESKTOP LAYOUT - Hidden on mobile */}
        <div className="hidden md:grid md:grid-cols-2 gap-14 items-stretch">
          
          {/* LEFT COLUMN */}
          <div className="flex flex-col">
            <div>
              <h1
                className="text-4xl md:text-5xl italic"
                style={{ fontFamily: "Playfair Display", color: "#594B00" }}
              >
                Deluxe Room
              </h1>

              <p
                className="text-sm mt-3 leading-relaxed"
                style={{ fontFamily: "Plus Jakarta Sans", color: "#594B00" }}
              >
                Your peaceful Kerala retreat by the backwaters of Alappuzha. Experience tranquility and comfort in our beautifully designed deluxe room with stunning views.
              </p>

              {/* Price */}
              <div className="flex items-center gap-3 mt-6">
                <p className="text-3xl font-semibold" style={{ color: "#594B00" }}>₹19,000/-</p>
                <span className="px-3 py-1 bg-[#594B00] text-white text-xs rounded-full">
                  Entire Homestay
                </span>
              </div>

              {/* Buttons */}
              <div className="mt-7 space-y-3">
                <div className="w-full md:w-[340px] space-y-4">
                  {/* CHECK AVAILABILITY */}
                  <div className="relative" ref={calendarRef}>
                    <button
                      className="w-full bg-[#594B00] text-white py-4 rounded-full flex justify-between items-center px-6 text-sm"
                      style={{ fontFamily: "Plus Jakarta Sans" }}
                      onClick={handleCalendarIconClick}
                    >
                      CHECK AVAILABILITY
                      <div className="w-8 h-8 bg-white text-[#594B00] rounded-full flex items-center justify-center">
                        <Calendar className="w-4 h-4" />
                      </div>
                    </button>
                    
                    {showCalendar && (
                      <div className="absolute top-full left-0 right-0 mt-2 z-10">
                        <CalendarComponent 
                          onDateSelect={(date) => {
                            console.log("Selected date:", date);
                            setShowCalendar(false);
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* BOOK NOW */}
                  <button
                    className="w-full border border-[#594B00] text-[#594B00] py-4 rounded-full flex justify-between items-center px-6 text-sm bg-transparent"
                    style={{ fontFamily: "Plus Jakarta Sans" }}
                  >
                    BOOK NOW
                    <div className="w-8 h-8 bg-[#594B00] text-white rounded-full flex items-center justify-center">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* AMENITIES */}
            <div className="mt-10 border rounded-2xl bg-white flex flex-col flex-1 overflow-hidden">
              <h2
                className="text-xl font-semibold border-b p-4 italic"
                style={{ fontFamily: "Playfair Display", color: "#594B00", backgroundColor: "#FFFBE6" }}
              >
                Amenities
              </h2>

              <div className="p-5 flex-1 overflow-auto">
                <div className="grid grid-cols-4 gap-6">
                  {amenities.map((amenity, i) => {
                    const IconComponent = amenity.icon;
                    return (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div className="w-14 h-14 bg-[#FFFBE6] rounded-full flex items-center justify-center">
                          <IconComponent className="w-6 h-6" style={{ color: "#594B00" }} />
                        </div>
                        <p
                          className="text-xs mt-2 text-center"
                          style={{ fontFamily: "Plus Jakarta Sans", color: "#594B00" }}
                        >
                          {amenity.name}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col">
            {/* IMAGE CONTAINER with Auto-rotating main image */}
            <div className="border rounded-2xl p-4">
              <div 
                className="w-full h-80 bg-cover bg-center rounded-xl transition-all duration-700 ease-in-out"
                style={{ 
                  backgroundImage: `url('${images[currentImageIndex]}')`,
                }}
              ></div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                {images.slice(1, 4).map((img, idx) => (
                  <div 
                    key={idx}
                    className="h-28 bg-cover bg-center rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ backgroundImage: `url('${img}')` }}
                    onClick={() => setCurrentImageIndex(idx + 1)}
                  ></div>
                ))}
              </div>
            </div>

            {/* DOCS */}
            <div className="mt-8 border rounded-2xl flex flex-col flex-1 overflow-hidden">
              <h2
                className="text-xl font-semibold border-b p-4 italic"
                style={{ fontFamily: "Playfair Display", color: "#594B00" }}
              >
                Docs
              </h2>

              <div
                className="divide-y flex-1 overflow-auto"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              >
                {[
                  "PRIVACY POLICY",
                  "TERMS & CONDITIONS",
                  "CANCELLATION POLICY",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
                    style={{ color: "#173A00" }}
                  >
                    {item}
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE LAYOUT - Visible only on mobile */}
        <div className="md:hidden space-y-8">
          
          {/* 1. IMAGE SECTION FIRST with Auto-rotating main image */}
          <div className="border rounded-2xl p-4">
            <div 
              className="w-full h-80 bg-cover bg-center rounded-xl transition-all duration-700 ease-in-out"
              style={{ 
                backgroundImage: `url('${images[currentImageIndex]}')`,
              }}
            ></div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {images.slice(1, 4).map((img, idx) => (
                <div 
                  key={idx}
                  className="h-28 bg-cover bg-center rounded-xl cursor-pointer active:opacity-80 transition-opacity"
                  style={{ backgroundImage: `url('${img}')` }}
                  onClick={() => setCurrentImageIndex(idx + 1)}
                ></div>
              ))}
            </div>
          </div>

          {/* 2. TITLE, PRICE, BUTTONS */}
          <div>
            <h1
              className="text-4xl italic"
              style={{ fontFamily: "Playfair Display", color: "#594B00" }}
            >
              Deluxe Room
            </h1>

            <p
              className="text-sm mt-3 leading-relaxed"
              style={{ fontFamily: "Plus Jakarta Sans", color: "#594B00" }}
            >
              Your peaceful Kerala retreat by the backwaters of Alappuzha. Experience tranquility and comfort in our beautifully designed deluxe room with stunning views.
            </p>

            {/* Price */}
            <div className="flex items-center gap-3 mt-6">
              <p className="text-3xl font-semibold" style={{ color: "#594B00" }}>₹19,000/-</p>
              <span className="px-3 py-1 bg-[#594B00] text-white text-xs rounded-full">
                Entire Homestay
              </span>
            </div>

            {/* Buttons */}
            <div className="mt-7 space-y-4">
              {/* CHECK AVAILABILITY */}
              <div className="relative" ref={calendarRef}>
                <button
                  className="w-full bg-[#594B00] text-white py-4 rounded-full flex justify-between items-center px-6 text-sm"
                  style={{ fontFamily: "Plus Jakarta Sans" }}
                  onClick={handleCalendarIconClick}
                >
                  CHECK AVAILABILITY
                  <div className="w-8 h-8 bg-white text-[#594B00] rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                </button>
                
                {showCalendar && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-10">
                    <CalendarComponent 
                      onDateSelect={(date) => {
                        console.log("Selected date:", date);
                        setShowCalendar(false);
                      }}
                    />
                  </div>
                )}
              </div>

              {/* BOOK NOW */}
              <button
                className="w-full border border-[#594B00] text-[#594B00] py-4 rounded-full flex justify-between items-center px-6 text-sm bg-transparent"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              >
                BOOK NOW
                <div className="w-8 h-8 bg-[#594B00] text-white rounded-full flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>

          {/* 3. AMENITIES */}
          <div className="border rounded-2xl bg-white overflow-hidden">
            <h2
              className="text-xl font-semibold border-b p-4 italic"
              style={{ fontFamily: "Playfair Display", color: "#594B00", backgroundColor: "#FFFBE6" }}
            >
              Amenities
            </h2>

            <div className="p-5">
              <div className="grid grid-cols-4 gap-4">
                {amenities.map((amenity, i) => {
                  const IconComponent = amenity.icon;
                  return (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className="w-12 h-12 bg-[#FFFBE6] rounded-full flex items-center justify-center">
                        <IconComponent className="w-5 h-5" style={{ color: "#594B00" }} />
                      </div>
                      <p
                        className="text-xs mt-2 text-center"
                        style={{ fontFamily: "Plus Jakarta Sans", color: "#594B00" }}
                      >
                        {amenity.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. DOCS */}
          <div className="border rounded-2xl overflow-hidden">
            <h2
              className="text-xl font-semibold border-b p-4 italic"
              style={{ fontFamily: "Playfair Display", color: "#594B00" }}
            >
              Docs
            </h2>

            <div
              className="divide-y"
              style={{ fontFamily: "Plus Jakarta Sans" }}
            >
              {[
                "PRIVACY POLICY",
                "TERMS & CONDITIONS",
                "CANCELLATION POLICY",
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-4 flex justify-between items-center cursor-pointer active:bg-gray-50 transition-colors"
                  style={{ color: "#173A00" }}
                >
                  {item}
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Description Section - Full width outside the white container */}
      <Description />
      <ReviewSection />
    </>
  );
};

export default Page;