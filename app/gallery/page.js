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
          <div className="grid grid-cols-2 gap-4">
            {currentImages.map((img, index) => {
              // Determine the pattern for each image
              const sectionIndex = Math.floor(index / 4);
              const positionInSection = index % 4;
              
              // Define different styles based on position in the 4-image pattern
              if (positionInSection === 0) {
                // First image in each set of 4 - wide image (spans 2 columns)
                return (
                  <div 
                    key={index}
                    className="col-span-2 aspect-[4/3] bg-cover bg-center rounded-2xl"
                    style={{ backgroundImage: `url('${img}')` }}
                    onClick={() => handleImageSelect(index)}
                  ></div>
                );
              } else if (positionInSection === 1 || positionInSection === 2) {
                // Second and third images - regular boxes in 2-column grid
                return (
                  <div 
                    key={index}
                    className="aspect-square bg-cover bg-center rounded-2xl"
                    style={{ backgroundImage: `url('${img}')` }}
                    onClick={() => handleImageSelect(index)}
                  ></div>
                );
              } else {
                // Fourth image - wide image (spans 2 columns)
                return (
                  <div 
                    key={index}
                    className="col-span-2 aspect-[4/3] bg-cover bg-center rounded-2xl"
                    style={{ backgroundImage: `url('${img}')` }}
                    onClick={() => handleImageSelect(index)}
                  ></div>
                );
              }
            })}
          </div>
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
                {/* Dynamic rendering for all guest images */}
                <div className="space-y-6">
                  {/* Process images in groups of 8 */}
                  {Array.from({ length: Math.ceil(galleryImages.guest.length / 8) }, (_, sectionIndex) => {
                    const startIndex = sectionIndex * 8;
                    const remainingImages = galleryImages.guest.length - startIndex;
                    const endIndex = Math.min(startIndex + 8, galleryImages.guest.length);
                    
                    // Get images for this section
                    const sectionImages = galleryImages.guest.slice(startIndex, endIndex);
                    
                    if (remainingImages >= 8) {
                      // Full section with 8 images
                      return (
                        <div key={sectionIndex} className="w-full">
                          {/* Row with 2 large images */}
                          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div 
                              className="h-72 md:h-96 bg-cover bg-center rounded-2xl"
                              style={{ backgroundImage: `url('${sectionImages[0]}')` }}
                            ></div>
                            <div 
                              className="h-72 md:h-96 bg-cover bg-center rounded-2xl"
                              style={{ backgroundImage: `url('${sectionImages[1]}')` }}
                            ></div>
                          </div>
                          
                          {/* Row with 1 wide and 2 small images */}
                          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div 
                              className="md:col-span-2 h-[500px] bg-cover bg-center rounded-2xl"
                              style={{ backgroundImage: `url('${sectionImages[2]}')` }}
                            ></div>
                            <div className="flex flex-col gap-4">
                              <div 
                                className="h-[240px] bg-cover bg-center rounded-2xl"
                                style={{ backgroundImage: `url('${sectionImages[3]}')` }}
                              ></div>
                              <div 
                                className="h-[240px] bg-cover bg-center rounded-2xl"
                                style={{ backgroundImage: `url('${sectionImages[4]}')` }}
                              ></div>
                            </div>
                          </div>
                          
                          {/* Row with 3 small images */}
                          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div 
                              className="h-[300px] bg-cover bg-center rounded-2xl"
                              style={{ backgroundImage: `url('${sectionImages[5]}')` }}
                            ></div>
                            {sectionImages.length > 6 && (
                              <div 
                                className="h-[300px] bg-cover bg-center rounded-2xl"
                                style={{ backgroundImage: `url('${sectionImages[6]}')` }}
                              ></div>
                            )}
                            {sectionImages.length > 7 && (
                              <div 
                                className="h-[300px] bg-cover bg-center rounded-2xl"
                                style={{ backgroundImage: `url('${sectionImages[7]}')` }}
                              ></div>
                            )}
                          </div>
                        </div>
                      );
                    } else if (remainingImages >= 4) {
                      // Section with 4-7 images
                      return (
                        <div key={sectionIndex} className="w-full">
                          {/* Row with 2 images */}
                          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div 
                              className="h-72 md:h-96 bg-cover bg-center rounded-2xl"
                              style={{ backgroundImage: `url('${sectionImages[0]}')` }}
                            ></div>
                            <div 
                              className="h-72 md:h-96 bg-cover bg-center rounded-2xl"
                              style={{ backgroundImage: `url('${sectionImages[1]}')` }}
                            ></div>
                          </div>
                          
                          {/* Row with 1 wide and 1-2 small images */}
                          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div 
                              className="md:col-span-2 h-[500px] bg-cover bg-center rounded-2xl"
                              style={{ backgroundImage: `url('${sectionImages[2]}')` }}
                            ></div>
                            <div className="flex flex-col gap-4">
                              <div 
                                className="h-[240px] bg-cover bg-center rounded-2xl"
                                style={{ backgroundImage: `url('${sectionImages[3]}')` }}
                              ></div>
                              {sectionImages.length > 4 && (
                                <div 
                                  className="h-[240px] bg-cover bg-center rounded-2xl"
                                  style={{ backgroundImage: `url('${sectionImages[4]}')` }}
                                ></div>
                              )}
                            </div>
                          </div>
                          
                          {/* Row with remaining images (for 5-7 total) */}
                          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            {sectionImages.length > 5 && (
                              <div 
                                className="h-[300px] bg-cover bg-center rounded-2xl"
                                style={{ backgroundImage: `url('${sectionImages[5]}')` }}
                              ></div>
                            )}
                            {sectionImages.length > 6 && (
                              <div 
                                className="h-[300px] bg-cover bg-center rounded-2xl"
                                style={{ backgroundImage: `url('${sectionImages[6]}')` }}
                              ></div>
                            )}
                            {sectionImages.length > 7 && (
                              <div 
                                className="h-[300px] bg-cover bg-center rounded-2xl"
                                style={{ backgroundImage: `url('${sectionImages[7]}')` }}
                              ></div>
                            )}
                          </div>
                        </div>
                      );
                    } else if (remainingImages >= 2) {
                      // Section with 2-3 images
                      return (
                        <div key={sectionIndex} className="w-full">
                          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div 
                              className="h-72 md:h-96 bg-cover bg-center rounded-2xl"
                              style={{ backgroundImage: `url('${sectionImages[0]}')` }}
                            ></div>
                            <div 
                              className="h-72 md:h-96 bg-cover bg-center rounded-2xl"
                              style={{ backgroundImage: `url('${sectionImages[1]}')` }}
                            ></div>
                          </div>
                          
                          {sectionImages.length > 2 && (
                            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div 
                                className="h-[300px] bg-cover bg-center rounded-2xl"
                                style={{ backgroundImage: `url('${sectionImages[2]}')` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      );
                    } else {
                      // Section with 1 image
                      return (
                        <div key={sectionIndex} className="w-full">
                          <div className="w-full grid grid-cols-1 gap-4">
                            <div 
                              className="h-72 md:h-96 bg-cover bg-center rounded-2xl"
                              style={{ backgroundImage: `url('${sectionImages[0]}')` }}
                            ></div>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
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
                {/* Dynamic rendering for all homestay images */}
                <div className="space-y-6">
                  {/* Process images in groups of 8 */}
                  {Array.from({ length: Math.ceil(galleryImages.homestay.length / 8) }, (_, sectionIndex) => {
                    const startIndex = sectionIndex * 8;
                    const remainingImages = galleryImages.homestay.length - startIndex;
                    const endIndex = Math.min(startIndex + 8, galleryImages.homestay.length);
                    
                    // Get images for this section
                    const sectionImages = galleryImages.homestay.slice(startIndex, endIndex);
                    
                    if (remainingImages >= 8) {
                      // Full section with 8 images
                      return (
                        <div key={sectionIndex} className="w-full">
                          {/* Row with 2 large images */}
                          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div 
                              className="h-72 md:h-96 bg-cover bg-center rounded-2xl"
                              style={{ backgroundImage: `url('${sectionImages[0]}')` }}
                            ></div>
                            <div 
                              className="h-72 md:h-96 bg-cover bg-center rounded-2xl"
                              style={{ backgroundImage: `url('${sectionImages[1]}')` }}
                            ></div>
                          </div>
                          
                          {/* Row with 1 wide and 2 small images */}
                          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div 
                              className="md:col-span-2 h-[500px] bg-cover bg-center rounded-2xl"
                              style={{ backgroundImage: `url('${sectionImages[2]}')` }}
                            ></div>
                            <div className="flex flex-col gap-4">
                              <div 
                                className="h-[240px] bg-cover bg-center rounded-2xl"
                                style={{ backgroundImage: `url('${sectionImages[3]}')` }}
                              ></div>
                              <div 
                                className="h-[240px] bg-cover bg-center rounded-2xl"
                                style={{ backgroundImage: `url('${sectionImages[4]}')` }}
                              ></div>
                            </div>
                          </div>
                          
                          {/* Row with 3 small images */}
                          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div 
                              className="h-[300px] bg-cover bg-center rounded-2xl"
                              style={{ backgroundImage: `url('${sectionImages[5]}')` }}
                            ></div>
                            {sectionImages.length > 6 && (
                              <div 
                                className="h-[300px] bg-cover bg-center rounded-2xl"
                                style={{ backgroundImage: `url('${sectionImages[6]}')` }}
                              ></div>
                            )}
                            {sectionImages.length > 7 && (
                              <div 
                                className="h-[300px] bg-cover bg-center rounded-2xl"
                                style={{ backgroundImage: `url('${sectionImages[7]}')` }}
                              ></div>
                            )}
                          </div>
                        </div>
                      );
                    } else if (remainingImages >= 4) {
                      // Section with 4-7 images
                      return (
                        <div key={sectionIndex} className="w-full">
                          {/* Row with 2 images */}
                          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div 
                              className="h-72 md:h-96 bg-cover bg-center rounded-2xl"
                              style={{ backgroundImage: `url('${sectionImages[0]}')` }}
                            ></div>
                            <div 
                              className="h-72 md:h-96 bg-cover bg-center rounded-2xl"
                              style={{ backgroundImage: `url('${sectionImages[1]}')` }}
                            ></div>
                          </div>
                          
                          {/* Row with 1 wide and 1-2 small images */}
                          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div 
                              className="md:col-span-2 h-[500px] bg-cover bg-center rounded-2xl"
                              style={{ backgroundImage: `url('${sectionImages[2]}')` }}
                            ></div>
                            <div className="flex flex-col gap-4">
                              <div 
                                className="h-[240px] bg-cover bg-center rounded-2xl"
                                style={{ backgroundImage: `url('${sectionImages[3]}')` }}
                              ></div>
                              {sectionImages.length > 4 && (
                                <div 
                                  className="h-[240px] bg-cover bg-center rounded-2xl"
                                  style={{ backgroundImage: `url('${sectionImages[4]}')` }}
                                ></div>
                              )}
                            </div>
                          </div>
                          
                          {/* Row with remaining images (for 5-7 total) */}
                          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            {sectionImages.length > 5 && (
                              <div 
                                className="h-[300px] bg-cover bg-center rounded-2xl"
                                style={{ backgroundImage: `url('${sectionImages[5]}')` }}
                              ></div>
                            )}
                            {sectionImages.length > 6 && (
                              <div 
                                className="h-[300px] bg-cover bg-center rounded-2xl"
                                style={{ backgroundImage: `url('${sectionImages[6]}')` }}
                              ></div>
                            )}
                            {sectionImages.length > 7 && (
                              <div 
                                className="h-[300px] bg-cover bg-center rounded-2xl"
                                style={{ backgroundImage: `url('${sectionImages[7]}')` }}
                              ></div>
                            )}
                          </div>
                        </div>
                      );
                    } else if (remainingImages >= 2) {
                      // Section with 2-3 images
                      return (
                        <div key={sectionIndex} className="w-full">
                          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div 
                              className="h-72 md:h-96 bg-cover bg-center rounded-2xl"
                              style={{ backgroundImage: `url('${sectionImages[0]}')` }}
                            ></div>
                            <div 
                              className="h-72 md:h-96 bg-cover bg-center rounded-2xl"
                              style={{ backgroundImage: `url('${sectionImages[1]}')` }}
                            ></div>
                          </div>
                          
                          {sectionImages.length > 2 && (
                            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div 
                                className="h-[300px] bg-cover bg-center rounded-2xl"
                                style={{ backgroundImage: `url('${sectionImages[2]}')` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      );
                    } else {
                      // Section with 1 image
                      return (
                        <div key={sectionIndex} className="w-full">
                          <div className="w-full grid grid-cols-1 gap-4">
                            <div 
                              className="h-72 md:h-96 bg-cover bg-center rounded-2xl"
                              style={{ backgroundImage: `url('${sectionImages[0]}')` }}
                            ></div>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
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