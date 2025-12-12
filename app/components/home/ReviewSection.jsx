"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

// Static Reviews Data
const reviewsData = [
  {
    text: "Such a peaceful and beautiful place. Waking up to the backwater view was the best part of my trip. The rooms were clean and the hosts were very kind. I would love to come back again.",
    userName: "User Name here",
    rating: 4,
  },
  {
    text: "An absolutely stunning property with incredible attention to detail. The staff went above and beyond to make our stay memorable.",
    userName: "Sarah Johnson",
    rating: 5,
  },
  {
    text: "Perfect getaway destination. The ambiance was serene and the amenities exceeded our expectations. Highly recommend!",
    userName: "Michael Chen",
    rating: 4,
  },
];

const ReviewSection = () => {
  const [currentReview, setCurrentReview] = useState(0);
  const [revealedChars, setRevealedChars] = useState(0);

  const reviews = useMemo(() => reviewsData, []);

  useEffect(() => {
    setRevealedChars(0);
    const fullText = reviews[currentReview].text;

    let charIndex = 0;
    let wordPause = 0;

    const interval = setInterval(() => {
      const currentChar = fullText[charIndex];
      if (wordPause > 0) {
        wordPause--;
        return;
      }

      charIndex++;
      setRevealedChars(charIndex);

      if (currentChar === "." || currentChar === "!" || currentChar === "?") {
        wordPause = 8;
      } else if (currentChar === "," || currentChar === ";") {
        wordPause = 4;
      }

      if (charIndex >= fullText.length) {
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [currentReview]);

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <div className="w-full bg-white px-4 py-12 md:py-16 min-h-screen flex items-center border border-neutral-50 rounded-lg">
      <div className="mx-auto w-full" style={{ width: "98%", maxWidth: "1400px" }}>
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 md:mb-16 gap-4">
          <h2
            className="text-4xl md:text-5xl italic"
            style={{ fontFamily: "Playfair Display, serif", color: "#594B00" }}
          >
            Our Reviews
          </h2>

          <div className="flex items-center">
            <button className="bg-[#594B00] text-white px-4 md:px-5 py-2 text-sm font-normal hover:bg-[#594B00]/90 transition-colors rounded-l-md border-r border-[#594B00]">
              View All
            </button>
            <div
              className="bg-white border border-[#122D00] border-l-0 px-4 py-2 rounded-r-md text-sm font-medium"
              style={{ color: "#594B00" }}
            >
              4.5
            </div>
          </div>
        </div>

        {/* Review Carousel */}
        <div className="relative flex items-center justify-center gap-4 md:gap-8 mb-12">
          
          {/* Left Arrow */}
          <button
            onClick={prevReview}
            className="flex-shrink-0 w-9 h-9 md:w-12 md:h-12 bg-[#122D00] rounded-full flex items-center justify-center hover:bg-[#122D00]/90 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </button>

          {/* Review Text Content */}
          <div className="flex-1 text-center max-w-3xl px-2 md:px-0">
            <p
              className="text-lg md:text-xl leading-relaxed mb-6 md:mb-8 font-semibold"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif", color: "#594B00" }}
            >
              "
              <span style={{ color: "#122D00" }}>
                {reviews[currentReview].text.slice(0, revealedChars)}
              </span>
              <span style={{ color: "#d4d4d4" }}>
                {reviews[currentReview].text.slice(revealedChars)}
              </span>
              "
            </p>

            {/* User Card */}
            <div className="inline-flex items-center gap-3 bg-neutral-200 rounded-full px-5 py-2">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-neutral-400 rounded-full flex-shrink-0" />
              <div className="text-left">
                <p className="text-xs md:text-sm font-medium text-neutral-800">
                  {reviews[currentReview].userName}
                </p>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < reviews[currentReview].rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-neutral-300 text-neutral-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextReview}
            className="flex-shrink-0 w-9 h-9 md:w-12 md:h-12 bg-[#122D00] rounded-full flex items-center justify-center hover:bg-[#122D00]/90 transition-colors"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentReview(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentReview ? "bg-[#122D00]" : "bg-neutral-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
