import React, { useState } from "react";
import { BiSolidQuoteLeft } from "react-icons/bi";

const TestimonialCard = ({ variant = "wide", isFirstRow = false, isMobile = false }) => {
  // variant: "wide" or "small"
  // isFirstRow: true for first row cards
  // isMobile: true for mobile view
  
  // Define color schemes
  const firstRowBg = "#BFA000";     // Dark yellow
  const secondRowBg = "#E7F1E7";    // Light green
  
  const bgColor = isFirstRow ? firstRowBg : secondRowBg;
  
  return (
    <div
      className={`rounded-xl p-6 flex flex-col ${
        isMobile 
          ? "min-w-full h-80" 
          : variant === "wide" 
            ? "flex-1 h-80" 
            : "w-[40%] h-80"
      }`}
      style={{ backgroundColor: bgColor }}
    >
      {/* Profile */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-14 h-14 bg-gray-600 rounded-full"></div>
        {isFirstRow ? (
          <>
            <p className="font-medium mt-2 text-white">User Name</p>
            <p className="text-sm text-white/80">Company</p>
          </>
        ) : (
          <>
            <p className="font-medium mt-2">User Name</p>
            <p className="text-sm text-gray-600">Company</p>
          </>
        )}
      </div>

      {/* Testimonial box */}
      <div className="bg-white p-6 rounded-xl relative flex-1">
        <BiSolidQuoteLeft
          className="absolute -top-3 left-4 text-gray-400"
          size={36}
          aria-hidden
        />
        {isFirstRow ? (
          <p className="pt-4 text-sm leading-relaxed text-gray-800">
            Romantic spot. Candlelight dinner by the water was unforgettable.
            Highly recommend!
          </p>
        ) : (
          <p className="pt-4 text-sm leading-relaxed text-gray-800">
            Romantic spot. Candlelight dinner by the water was unforgettable.
            Highly recommend!
          </p>
        )}
      </div>
    </div>
  );
};

const CardTestimonial = () => {
  // Mobile slider states
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Sample testimonial data
  const testimonials = [
    { variant: "wide", isFirstRow: true },
    { variant: "small", isFirstRow: true },
    { variant: "small", isFirstRow: false },
    { variant: "wide", isFirstRow: false },
    { variant: "wide", isFirstRow: true },
    { variant: "small", isFirstRow: true },
    { variant: "small", isFirstRow: false },
    { variant: "wide", isFirstRow: false }
  ];

  const totalSlides = Math.ceil(testimonials.length / 2); // 2 testimonials per slide

  // Mobile slider functions
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  const goToSlide = (index) => setCurrentSlide(index);

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) nextSlide();
    if (touchStart - touchEnd < -75) prevSlide();
  };

  return (
    <section className="w-[90%] sm:w-[85%] md:w-[80%] mx-auto my-8 md:my-12">
      {/* Desktop Grid View */}
      <div className="hidden md:block">
        {/* Row 1: All cards with dark yellow scheme and light text */}
        <div className="flex flex-col sm:flex-row gap-6 mb-6">
          <TestimonialCard variant="wide" isFirstRow={true} />
          <TestimonialCard variant="small" isFirstRow={true} />
        </div>

        {/* Row 2: All cards with light green scheme */}
        <div className="flex flex-col sm:flex-row gap-6 mb-6">
          <TestimonialCard variant="small" isFirstRow={false} />
          <TestimonialCard variant="wide" isFirstRow={false} />
        </div>

        {/* Row 3: All cards with dark yellow scheme and light text */}
        <div className="flex flex-col sm:flex-row gap-6 mb-6">
          <TestimonialCard variant="wide" isFirstRow={true} />
          <TestimonialCard variant="small" isFirstRow={true} />
        </div>

        {/* Row 4: All cards with light green scheme */}
        <div className="flex flex-col sm:flex-row gap-6">
          <TestimonialCard variant="small" isFirstRow={false} />
          <TestimonialCard variant="wide" isFirstRow={false} />
        </div>
      </div>

      {/* Mobile Carousel View */}
      <div className="md:hidden relative">
        {/* SWIPE AREA */}
        <div
          className="overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {/* Render testimonials in pairs (2 per slide) */}
            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
              <div key={slideIndex} className="min-w-full px-2">
                <div className="flex flex-col gap-6">
                  <TestimonialCard 
                    {...testimonials[slideIndex * 2]} 
                    isMobile={true} 
                  />
                  {testimonials[slideIndex * 2 + 1] && (
                    <TestimonialCard 
                      {...testimonials[slideIndex * 2 + 1]} 
                      isMobile={true} 
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                currentSlide === index
                  ? "w-8 h-2 bg-[#594B00]"
                  : "w-2 h-2 bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CardTestimonial;