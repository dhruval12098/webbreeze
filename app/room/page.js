"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar, ArrowUpRight, X } from "lucide-react";
import Description from "../components/room/Description";
import ReviewSection from "../components/home/ReviewSection";
import CalendarComponent from "../components/home/Calendar";
import { supabase } from '../lib/supabaseClient';

const Page = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [roomData, setRoomData] = useState(null);
  const [amenitiesData, setAmenitiesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAmenity, setSelectedAmenity] = useState(null);
  const [showAmenityModal, setShowAmenityModal] = useState(false);
  const calendarRef = useRef(null);

  // Fetch room data from Supabase
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const { data, error } = await supabase
          .from('rooms')
          .select('*')
          .limit(1);

        if (data && data.length > 0) {
          setRoomData(data[0]);
        } else {
          // Fallback to static data if no data in database
          setRoomData({
            title: "Deluxe Room",
            label: "Entire Homestay",
            price: "19,000",
            description: "Your peaceful Kerala retreat by the backwaters of Alappuzha. Experience tranquility and comfort in our beautifully designed deluxe room with stunning views.",
            image1_url: '/image/image8.jpg',
            image2_url: '/image/image1.jpg',
            image3_url: '/image/image2.jpg',
            image4_url: '/image/image3.jpg',
            image5_url: '/image/image4.jpg'
          });
        }
      } catch (error) {
        console.error('Error fetching room data:', error);
        // Fallback to static data on error
        setRoomData({
          title: "Deluxe Room",
          label: "Entire Homestay",
          price: "19,000",
          description: "Your peaceful Kerala retreat by the backwaters of Alappuzha. Experience tranquility and comfort in our beautifully designed deluxe room with stunning views.",
          image1_url: '/image/image8.jpg',
          image2_url: '/image/image1.jpg',
          image3_url: '/image/image2.jpg',
          image4_url: '/image/image3.jpg',
          image5_url: '/image/image4.jpg'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, []);

  // Fetch amenities data from API
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const response = await fetch('/api/amenities');
        const { data, success } = await response.json();
        
        if (success && data) {
          setAmenitiesData(data);
        }
      } catch (error) {
        console.error('Error fetching amenities:', error);
      }
    };

    fetchAmenities();
  }, []);

  // Image array from room data
  const images = roomData ? [
    roomData.image1_url,
    roomData.image2_url,
    roomData.image3_url,
    roomData.image4_url,
    roomData.image5_url
  ].filter(url => url) : [];

  // Auto-rotate images every 3 seconds
  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000);

      return () => clearInterval(interval);
    }
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

  // Open amenity details modal
  const openAmenityModal = (amenity) => {
    setSelectedAmenity(amenity);
    setShowAmenityModal(true);
  };

  // Close amenity details modal
  const closeAmenityModal = () => {
    setShowAmenityModal(false);
    setSelectedAmenity(null);
  };

  // Render amenity icon based on URL or fallback to generic icon
  const renderAmenityIcon = (iconUrl) => {
    if (iconUrl) {
      return (
        <img 
          src={iconUrl} 
          alt="Amenity icon" 
          className="w-8 h-8 object-contain"
        />
      );
    }
    
    // Fallback icon if no image is available
    return (
      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
        <span className="text-xs text-gray-500">★</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="w-[98%] mx-auto rounded-3xl bg-white min-h-screen px-4 md:px-8 lg:px-12 py-12 flex items-center justify-center">
        <div className="text-lg">Loading room details...</div>
      </div>
    );
  }

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
                {roomData?.title || "Deluxe Room"}
              </h1>

              <p
                className="text-sm mt-3 leading-relaxed"
                style={{ fontFamily: "Plus Jakarta Sans", color: "#594B00" }}
              >
                {roomData?.description || "Your peaceful Kerala retreat by the backwaters of Alappuzha. Experience tranquility and comfort in our beautifully designed deluxe room with stunning views."}
              </p>

              {/* Price */}
              <div className="flex items-center gap-3 mt-6">
                <p className="text-3xl font-semibold" style={{ color: "#594B00" }}>₹{roomData?.price || "19,000"}/-</p>
                <span className="px-3 py-1 bg-[#594B00] text-white text-xs rounded-full">
                  {roomData?.label || "Entire Homestay"}
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
                      <div className="absolute top-full left-0 right-0 mt-2 z-10" ref={calendarRef}>
                        <CalendarComponent 
                          roomId={roomData?.id}
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
                    onClick={() => {
                      // Store room data in sessionStorage before navigating
                      if (roomData) {
                        sessionStorage.setItem('selectedRoom', JSON.stringify({
                          id: roomData.id,
                          title: roomData.title,
                          price: roomData.price,
                          label: roomData.label,
                          description: roomData.description
                        }));
                      }
                      window.location.href = "/booking";
                    }}
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
                  {amenitiesData.map((amenity) => (
                    <div key={amenity.id} className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => openAmenityModal(amenity)}>
                      <div className="w-16 h-16 bg-[#FFFBE6] rounded-full flex items-center justify-center">
                        {renderAmenityIcon(amenity.icon_url)}
                      </div>
                      <p
                        className="text-xs mt-2 text-center"
                        style={{ fontFamily: "Plus Jakarta Sans", color: "#594B00" }}
                      >
                        {amenity.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col">
            {/* IMAGE CONTAINER with Auto-rotating main image */}
            <div className="border rounded-2xl p-4">
              {images.length > 0 && (
                <div 
                  className="w-full h-80 bg-cover bg-center rounded-xl transition-all duration-700 ease-in-out"
                  style={{ 
                    backgroundImage: `url('${images[currentImageIndex]}')`,
                  }}
                ></div>
              )}
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
                    onClick={() => {
                      if (item === "PRIVACY POLICY") {
                        window.location.href = "/privacy";
                      } else if (item === "TERMS & CONDITIONS") {
                        window.location.href = "/terms";
                      } else if (item === "CANCELLATION POLICY") {
                        window.location.href = "/cancellation";
                      }
                    }}
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
            {images.length > 0 && (
              <div 
                className="w-full h-80 bg-cover bg-center rounded-xl transition-all duration-700 ease-in-out"
                style={{ 
                  backgroundImage: `url('${images[currentImageIndex]}')`,
                }}
              ></div>
            )}
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
              {roomData?.title || "Deluxe Room"}
            </h1>

            <p
              className="text-sm mt-3 leading-relaxed"
              style={{ fontFamily: "Plus Jakarta Sans", color: "#594B00" }}
            >
              {roomData?.description || "Your peaceful Kerala retreat by the backwaters of Alappuzha. Experience tranquility and comfort in our beautifully designed deluxe room with stunning views."}
            </p>

            {/* Price */}
            <div className="flex items-center gap-3 mt-6">
              <p className="text-3xl font-semibold" style={{ color: "#594B00" }}>₹{roomData?.price || "19,000"}/-</p>
              <span className="px-3 py-1 bg-[#594B00] text-white text-xs rounded-full">
                {roomData?.label || "Entire Homestay"}
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
                  <div className="absolute top-full left-0 right-0 mt-2 z-10" ref={calendarRef}>
                    <CalendarComponent 
                      roomId={roomData?.id}
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
                onClick={() => {
                  // Store room data in sessionStorage before navigating
                  if (roomData) {
                    sessionStorage.setItem('selectedRoom', JSON.stringify({
                      id: roomData.id,
                      title: roomData.title,
                      price: roomData.price,
                      label: roomData.label,
                      description: roomData.description
                    }));
                  }
                  window.location.href = "/booking";
                }}
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
                {amenitiesData.map((amenity) => (
                  <div key={amenity.id} className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => openAmenityModal(amenity)}>
                    <div className="w-14 h-14 bg-[#FFFBE6] rounded-full flex items-center justify-center">
                      {renderAmenityIcon(amenity.icon_url)}
                    </div>
                    <p
                      className="text-xs mt-2 text-center"
                      style={{ fontFamily: "Plus Jakarta Sans", color: "#594B00" }}
                    >
                      {amenity.title}
                    </p>
                  </div>
                ))}
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
                  onClick={() => {
                    if (item === "PRIVACY POLICY") {
                      window.location.href = "/privacy";
                    } else if (item === "TERMS & CONDITIONS") {
                      window.location.href = "/terms";
                    } else if (item === "CANCELLATION POLICY") {
                      window.location.href = "/cancellation";
                    }
                  }}
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

      {/* Amenity Details Modal */}
      {showAmenityModal && selectedAmenity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={closeAmenityModal}
          />
          
          <div className="relative bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col z-10">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b p-4" style={{ backgroundColor: "#FFFBE6" }}>
              <h3
                className="text-xl font-semibold"
                style={{ fontFamily: "Playfair Display", color: "#594B00" }}
              >
                Amenity Details
              </h3>
              <button
                onClick={closeAmenityModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 flex-grow overflow-y-auto">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-[#FFFBE6] rounded-full flex items-center justify-center mb-4">
                  {renderAmenityIcon(selectedAmenity.icon_url)}
                </div>
                <h4
                  className="text-2xl font-semibold text-center"
                  style={{ color: "#594B00" }}
                >
                  {selectedAmenity.title}
                </h4>
              </div>
              
              <p
                className="text-gray-700 leading-relaxed"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              >
                {selectedAmenity.description}
              </p>
            </div>
            
            {/* Modal Footer */}
            <div className="p-4 border-t">
              <button
                onClick={closeAmenityModal}
                className="w-full py-3 bg-[#594B00] text-white rounded-full font-medium"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Page;