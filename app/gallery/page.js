"use client";
import React, { useState, useEffect } from "react";

const GalleryPage = () => {
  const [tab, setTab] = useState("photos");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(true);

  // Array of public images for photos tab
  const photoImages = [
    "/image/image1.jpg",
    "/image/image2.jpg",
    "/image/image3.jpg",
    "/image/image4.jpg",
    "/image/image5.jpg",
    "/image/image6.jpg",
    "/image/image7.jpg",
    "/image/image8.jpg",
    "/image/image1.jpg",
    "/image/image2.jpg",
    "/image/image3.jpg",
    "/image/image4.jpg",
    "/image/image5.jpg",
    "/image/image6.jpg",
    "/image/image7.jpg",
    "/image/image8.jpg",
  ];

  // Array of public images for rooms tab
  const roomImages = [
    "/image/image1.jpg",
    "/image/image2.jpg",
    "/image/image3.jpg",
    "/image/image4.jpg",
    "/image/image5.jpg",
    "/image/image6.jpg",
    "/image/image7.jpg",
    "/image/image8.jpg",
    "/image/image1.jpg",
    "/image/image2.jpg",
  ];

  // Get current images based on active tab
  const currentImages = tab === "photos" ? photoImages : roomImages;

  // Auto sliding functionality
  useEffect(() => {
    let interval;
    if (isAutoSliding && currentImages.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % currentImages.length);
      }, 3000); // Change image every 3 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoSliding, tab, currentImages.length]);

  // Handle image selection in mobile view
  const handleImageSelect = (index) => {
    setCurrentIndex(index);
    setIsAutoSliding(false); // Stop auto sliding when user interacts
    // Resume auto sliding after 10 seconds of inactivity
    setTimeout(() => {
      setIsAutoSliding(true);
    }, 10000);
  };

  return (
    <div className="w-[80%] min-h-screen pt-10 pb-20 flex flex-col items-center mx-auto">
      {/* ---- TOGGLE SECTION ---- */}
      <div className="mb-10">
        <div className="inline-flex border border-gray-300 rounded-full">
          <button
            onClick={() => {
              setTab("photos");
              setCurrentIndex(0);
              setIsAutoSliding(true);
            }}
            className={`px-6 py-2 text-sm font-medium transition-colors rounded-full 
              ${tab === "photos" ? "bg-black text-white" : "bg-gray-200 text-gray-700"}`}
          >
            Photos
          </button>

          <button
            onClick={() => {
              setTab("rooms");
              setCurrentIndex(0);
              setIsAutoSliding(true);
            }}
            className={`px-6 py-2 text-sm font-medium transition-colors rounded-full ml-2
              ${tab === "rooms" ? "bg-black text-white" : "bg-gray-200 text-gray-700"}`}
          >
            Rooms
          </button>
        </div>
      </div>

      {/* ---- MOBILE VIEW ---- */}
      <div className="w-full md:hidden">
        {/* Main Image Container - Square */}
        <div 
          className="w-full aspect-square bg-cover bg-center rounded-2xl mb-4"
          style={{ backgroundImage: `url('${currentImages[currentIndex]}')` }}
        ></div>

        {/* Thumbnails */}
        <div className="flex overflow-x-auto gap-2 pb-2">
          {currentImages.map((img, index) => (
            <div
              key={index}
              onClick={() => handleImageSelect(index)}
              className={`flex-shrink-0 w-20 h-20 bg-cover bg-center rounded-lg cursor-pointer border-2 ${
                currentIndex === index ? "border-black" : "border-transparent"
              }`}
              style={{ backgroundImage: `url('${img}')` }}
            ></div>
          ))}
        </div>
      </div>

      {/* ---- DESKTOP VIEW ---- */}
      <div className="hidden md:block w-full">
        {/* ---- PHOTOS TAB CONTENT ---- */}
        {tab === "photos" && (
          <div className="w-full">
            {/* ---- SECTION 1 ---- */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div 
                className="h-72 md:h-96 bg-cover bg-center rounded-2xl"
                style={{ backgroundImage: `url('${photoImages[0]}')` }}
              ></div>
              <div 
                className="h-72 md:h-96 bg-cover bg-center rounded-2xl"
                style={{ backgroundImage: `url('${photoImages[1]}')` }}
              ></div>
            </div>

            {/* ---- SECTION 2 ---- */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Left Wide Box */}
              <div 
                className="md:col-span-2 h-[500px] bg-cover bg-center rounded-2xl"
                style={{ backgroundImage: `url('${photoImages[2]}')` }}
              ></div>

              {/* Right Stacked Boxes */}
              <div className="flex flex-col gap-4">
                <div 
                  className="h-[240px] bg-cover bg-center rounded-2xl"
                  style={{ backgroundImage: `url('${photoImages[3]}')` }}
                ></div>
                <div 
                  className="h-[240px] bg-cover bg-center rounded-2xl"
                  style={{ backgroundImage: `url('${photoImages[4]}')` }}
                ></div>
              </div>
            </div>

            {/* ---- SECTION 3 ---- */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div 
                className="h-72 md:h-96 bg-cover bg-center rounded-2xl"
                style={{ backgroundImage: `url('${photoImages[5]}')` }}
              ></div>
              <div 
                className="h-72 md:h-96 bg-cover bg-center rounded-2xl"
                style={{ backgroundImage: `url('${photoImages[6]}')` }}
              ></div>
            </div>

            {/* ---- SECTION 4 ---- */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Left Stacked Boxes */}
              <div className="flex flex-col gap-4">
                <div 
                  className="h-[240px] bg-cover bg-center rounded-2xl"
                  style={{ backgroundImage: `url('${photoImages[7]}')` }}
                ></div>
                <div 
                  className="h-[240px] bg-cover bg-center rounded-2xl"
                  style={{ backgroundImage: `url('${photoImages[8]}')` }}
                ></div>
              </div>

              {/* Right Wide Box */}
              <div 
                className="md:col-span-2 h-[500px] bg-cover bg-center rounded-2xl"
                style={{ backgroundImage: `url('${photoImages[9]}')` }}
              ></div>
            </div>

            {/* ---- SECTION 5 ---- */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                className="h-72 md:h-96 bg-cover bg-center rounded-2xl"
                style={{ backgroundImage: `url('${photoImages[10]}')` }}
              ></div>
              <div 
                className="h-72 md:h-96 bg-cover bg-center rounded-2xl"
                style={{ backgroundImage: `url('${photoImages[11]}')` }}
              ></div>
            </div>

            {/* ---- SECTION 6 ---- */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div 
                className="h-[300px] bg-cover bg-center rounded-2xl"
                style={{ backgroundImage: `url('${photoImages[12]}')` }}
              ></div>
              <div 
                className="h-[300px] bg-cover bg-center rounded-2xl"
                style={{ backgroundImage: `url('${photoImages[13]}')` }}
              ></div>
              <div 
                className="h-[300px] bg-cover bg-center rounded-2xl"
                style={{ backgroundImage: `url('${photoImages[14]}')` }}
              ></div>
            </div>
          </div>
        )}

        {/* ---- ROOMS TAB CONTENT ---- */}
        {tab === "rooms" && (
          <div className="w-full">
            {/* ---- SECTION 1 ---- */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div 
                className="h-72 md:h-96 bg-cover bg-center rounded-2xl"
                style={{ backgroundImage: `url('${roomImages[0]}')` }}
              ></div>
              <div 
                className="h-72 md:h-96 bg-cover bg-center rounded-2xl"
                style={{ backgroundImage: `url('${roomImages[1]}')` }}
              ></div>
            </div>

            {/* ---- SECTION 2 ---- */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Left Wide Box */}
              <div 
                className="md:col-span-2 h-[500px] bg-cover bg-center rounded-2xl"
                style={{ backgroundImage: `url('${roomImages[2]}')` }}
              ></div>

              {/* Right Stacked Boxes */}
              <div className="flex flex-col gap-4">
                <div 
                  className="h-[240px] bg-cover bg-center rounded-2xl"
                  style={{ backgroundImage: `url('${roomImages[3]}')` }}
                ></div>
                <div 
                  className="h-[240px] bg-cover bg-center rounded-2xl"
                  style={{ backgroundImage: `url('${roomImages[4]}')` }}
                ></div>
              </div>
            </div>

            {/* ---- SECTION 3 ---- */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div 
                className="h-72 md:h-96 bg-cover bg-center rounded-2xl"
                style={{ backgroundImage: `url('${roomImages[5]}')` }}
              ></div>
              <div 
                className="h-72 md:h-96 bg-cover bg-center rounded-2xl"
                style={{ backgroundImage: `url('${roomImages[6]}')` }}
              ></div>
            </div>

            {/* ---- SECTION 4 ---- */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                className="h-[300px] bg-cover bg-center rounded-2xl"
                style={{ backgroundImage: `url('${roomImages[7]}')` }}
              ></div>
              <div 
                className="h-[300px] bg-cover bg-center rounded-2xl"
                style={{ backgroundImage: `url('${roomImages[8]}')` }}
              ></div>
              <div 
                className="h-[300px] bg-cover bg-center rounded-2xl"
                style={{ backgroundImage: `url('${roomImages[9]}')` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;