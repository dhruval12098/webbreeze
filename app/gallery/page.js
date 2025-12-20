"use client";
import React, { useState, useEffect } from "react";

const GalleryPage = () => {
  const [tab, setTab] = useState("photos");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(true);
  const [galleryImages, setGalleryImages] = useState({ guest: [], homestay: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load images from API
  useEffect(() => {
    const loadGalleryImages = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/gallery-images');
        const result = await response.json();
        
        if (result.success) {
          // Separate images by gallery type
          const guestImages = result.images.filter(img => img.gallery_type === 'guest');
          const homestayImages = result.images.filter(img => img.gallery_type === 'homestay');
          
          setGalleryImages({
            guest: guestImages.map(img => img.image_url),
            homestay: homestayImages.map(img => img.image_url)
          });
        } else {
          setError(result.error || 'Failed to load images');
        }
      } catch (err) {
        setError('Failed to load images: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadGalleryImages();
  }, []);

  // Get current images based on active tab
  const currentImages = tab === "photos" ? galleryImages.guest : galleryImages.homestay;

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

  if (loading) {
    return (
      <div className="w-[80%] min-h-screen pt-10 pb-20 flex flex-col items-center mx-auto">
        <div className="text-center">
          <p>Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-[80%] min-h-screen pt-10 pb-20 flex flex-col items-center mx-auto">
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

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
            Guest
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
            Homestay
          </button>
        </div>
      </div>

      {/* ---- MOBILE VIEW ---- */}
      <div className="w-full md:hidden">
        {currentImages.length > 0 ? (
          <>
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
          </>
        ) : (
          <div className="text-center py-10">
            <p>No images available in this gallery</p>
          </div>
        )}
      </div>

      {/* ---- DESKTOP VIEW ---- */}
      <div className="hidden md:block w-full">
        {/* ---- PHOTOS TAB CONTENT ---- */}
        {tab === "photos" && (
          <div className="w-full">
            {galleryImages.guest.length > 0 ? (
              <>
                {/* ---- SECTION 1 ---- */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div 
                    className="h-72 md:h-96 bg-cover bg-center rounded-2xl"
                    style={{ backgroundImage: `url('${galleryImages.guest[0]}')` }}
                  ></div>
                  {galleryImages.guest.length > 1 && (
                    <div 
                      className="h-72 md:h-96 bg-cover bg-center rounded-2xl"
                      style={{ backgroundImage: `url('${galleryImages.guest[1]}')` }}
                    ></div>
                  )}
                </div>

                {/* ---- SECTION 2 ---- */}
                {galleryImages.guest.length > 2 && (
                  <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Left Wide Box */}
                    <div 
                      className="md:col-span-2 h-[500px] bg-cover bg-center rounded-2xl"
                      style={{ backgroundImage: `url('${galleryImages.guest[2]}')` }}
                    ></div>

                    {/* Right Stacked Boxes */}
                    <div className="flex flex-col gap-4">
                      {galleryImages.guest.length > 3 && (
                        <div 
                          className="h-[240px] bg-cover bg-center rounded-2xl"
                          style={{ backgroundImage: `url('${galleryImages.guest[3]}')` }}
                        ></div>
                      )}
                      {galleryImages.guest.length > 4 && (
                        <div 
                          className="h-[240px] bg-cover bg-center rounded-2xl"
                          style={{ backgroundImage: `url('${galleryImages.guest[4]}')` }}
                        ></div>
                      )}
                    </div>
                  </div>
                )}

                {/* ---- SECTION 3 ---- */}
                {galleryImages.guest.length > 5 && (
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div 
                      className="h-72 md:h-96 bg-cover bg-center rounded-2xl"
                      style={{ backgroundImage: `url('${galleryImages.guest[5]}')` }}
                    ></div>
                    {galleryImages.guest.length > 6 && (
                      <div 
                        className="h-72 md:h-96 bg-cover bg-center rounded-2xl"
                        style={{ backgroundImage: `url('${galleryImages.guest[6]}')` }}
                      ></div>
                    )}
                  </div>
                )}

                {/* ---- SECTION 4 ---- */}
                {galleryImages.guest.length > 7 && (
                  <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Left Stacked Boxes */}
                    <div className="flex flex-col gap-4">
                      {galleryImages.guest.length > 7 && (
                        <div 
                          className="h-[240px] bg-cover bg-center rounded-2xl"
                          style={{ backgroundImage: `url('${galleryImages.guest[7]}')` }}
                        ></div>
                      )}
                      {galleryImages.guest.length > 8 && (
                        <div 
                          className="h-[240px] bg-cover bg-center rounded-2xl"
                          style={{ backgroundImage: `url('${galleryImages.guest[8]}')` }}
                        ></div>
                      )}
                    </div>

                    {/* Right Wide Box */}
                    {galleryImages.guest.length > 9 && (
                      <div 
                        className="md:col-span-2 h-[500px] bg-cover bg-center rounded-2xl"
                        style={{ backgroundImage: `url('${galleryImages.guest[9]}')` }}
                      ></div>
                    )}
                  </div>
                )}

                {/* ---- SECTION 5 ---- */}
                {galleryImages.guest.length > 10 && (
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div 
                      className="h-72 md:h-96 bg-cover bg-center rounded-2xl"
                      style={{ backgroundImage: `url('${galleryImages.guest[10]}')` }}
                    ></div>
                    {galleryImages.guest.length > 11 && (
                      <div 
                        className="h-72 md:h-96 bg-cover bg-center rounded-2xl"
                        style={{ backgroundImage: `url('${galleryImages.guest[11]}')` }}
                      ></div>
                    )}
                  </div>
                )}

                {/* ---- SECTION 6 ---- */}
                {galleryImages.guest.length > 12 && (
                  <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    {galleryImages.guest.length > 12 && (
                      <div 
                        className="h-[300px] bg-cover bg-center rounded-2xl"
                        style={{ backgroundImage: `url('${galleryImages.guest[12]}')` }}
                      ></div>
                    )}
                    {galleryImages.guest.length > 13 && (
                      <div 
                        className="h-[300px] bg-cover bg-center rounded-2xl"
                        style={{ backgroundImage: `url('${galleryImages.guest[13]}')` }}
                      ></div>
                    )}
                    {galleryImages.guest.length > 14 && (
                      <div 
                        className="h-[300px] bg-cover bg-center rounded-2xl"
                        style={{ backgroundImage: `url('${galleryImages.guest[14]}')` }}
                      ></div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-10">
                <p>No images available in the Guest gallery</p>
              </div>
            )}
          </div>
        )}

        {/* ---- ROOMS TAB CONTENT ---- */}
        {tab === "rooms" && (
          <div className="w-full">
            {galleryImages.homestay.length > 0 ? (
              <>
                {/* ---- SECTION 1 ---- */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div 
                    className="h-72 md:h-96 bg-cover bg-center rounded-2xl"
                    style={{ backgroundImage: `url('${galleryImages.homestay[0]}')` }}
                  ></div>
                  {galleryImages.homestay.length > 1 && (
                    <div 
                      className="h-72 md:h-96 bg-cover bg-center rounded-2xl"
                      style={{ backgroundImage: `url('${galleryImages.homestay[1]}')` }}
                    ></div>
                  )}
                </div>

                {/* ---- SECTION 2 ---- */}
                {galleryImages.homestay.length > 2 && (
                  <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Left Wide Box */}
                    <div 
                      className="md:col-span-2 h-[500px] bg-cover bg-center rounded-2xl"
                      style={{ backgroundImage: `url('${galleryImages.homestay[2]}')` }}
                    ></div>

                    {/* Right Stacked Boxes */}
                    <div className="flex flex-col gap-4">
                      {galleryImages.homestay.length > 3 && (
                        <div 
                          className="h-[240px] bg-cover bg-center rounded-2xl"
                          style={{ backgroundImage: `url('${galleryImages.homestay[3]}')` }}
                        ></div>
                      )}
                      {galleryImages.homestay.length > 4 && (
                        <div 
                          className="h-[240px] bg-cover bg-center rounded-2xl"
                          style={{ backgroundImage: `url('${galleryImages.homestay[4]}')` }}
                        ></div>
                      )}
                    </div>
                  </div>
                )}

                {/* ---- SECTION 3 ---- */}
                {galleryImages.homestay.length > 5 && (
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div 
                      className="h-72 md:h-96 bg-cover bg-center rounded-2xl"
                      style={{ backgroundImage: `url('${galleryImages.homestay[5]}')` }}
                    ></div>
                    {galleryImages.homestay.length > 6 && (
                      <div 
                        className="h-72 md:h-96 bg-cover bg-center rounded-2xl"
                        style={{ backgroundImage: `url('${galleryImages.homestay[6]}')` }}
                      ></div>
                    )}
                  </div>
                )}

                {/* ---- SECTION 4 ---- */}
                {galleryImages.homestay.length > 7 && (
                  <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                    {galleryImages.homestay.length > 7 && (
                      <div 
                        className="h-[300px] bg-cover bg-center rounded-2xl"
                        style={{ backgroundImage: `url('${galleryImages.homestay[7]}')` }}
                      ></div>
                    )}
                    {galleryImages.homestay.length > 8 && (
                      <div 
                        className="h-[300px] bg-cover bg-center rounded-2xl"
                        style={{ backgroundImage: `url('${galleryImages.homestay[8]}')` }}
                      ></div>
                    )}
                    {galleryImages.homestay.length > 9 && (
                      <div 
                        className="h-[300px] bg-cover bg-center rounded-2xl"
                        style={{ backgroundImage: `url('${galleryImages.homestay[9]}')` }}
                      ></div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-10">
                <p>No images available in the Homestay gallery</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;