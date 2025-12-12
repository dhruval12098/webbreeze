"use client";

import React, { useRef, useEffect, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const OverviewSection = () => {
  const cards = [
    {
      title: "Room's",
      description: "Comfortable stays with beautiful views",
      img: "/image/image1.jpg",
    },
    {
      title: "Services",
      description: "Personal care, housekeeping, and warm hospitality",
      img: "/image/image2.jpg",
    },
    {
      title: "Food",
      description: "Traditional Kerala meals made fresh",
      img: "/image/image3.jpg",
    },
    {
      title: "Location",
      description: "Scenic surroundings and easy access",
      img: "/image/image4.jpg",
    },
  ];

  // DESKTOP REFS
  const scrollRef = useRef(null);
  const cardRefs = useRef([]);

  // MOBILE SLIDER STATES
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const totalSlides = cards.length;

  cardRefs.current = [];
  const addToRefs = (el) => {
    if (el && !cardRefs.current.includes(el)) cardRefs.current.push(el);
  };

  // DESKTOP ARROWS
  const scroll = (dir) => {
    if (scrollRef.current) {
      const amount = 320;
      scrollRef.current.scrollBy({
        left: dir === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  // MOBILE SLIDER
  const nextSlide = () =>
    setCurrentSlide((p) => (p + 1) % totalSlides);

  const prevSlide = () =>
    setCurrentSlide((p) => (p - 1 + totalSlides) % totalSlides);

  const goToSlide = (i) => setCurrentSlide(i);

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);

  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) nextSlide();
    if (touchStart - touchEnd < -75) prevSlide();
  };

  // GSAP DESKTOP ANIMATION
  useEffect(() => {
    gsap.from(cardRefs.current, {
      x: window.innerWidth,
      duration: 1.1,
      ease: "cubic-bezier(0.65, 0, 0.35, 1)",
      stagger: 0.2,
      scrollTrigger: {
        trigger: scrollRef.current,
        start: "top 80%",
      },
    });
  }, []);

  return (
    <div className="w-[98%] mx-auto rounded-3xl bg-white min-h-screen relative overflow-hidden px-4 py-12">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h2
          className="text-3xl md:text-4xl lg:text-5xl italic"
          style={{ fontFamily: "Playfair Display" }}
        >
          Overview
        </h2>

        {/* Desktop arrows */}
        <div className="hidden md:flex gap-3">
          <div
            onClick={() => scroll("left")}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </div>
          <div
            onClick={() => scroll("right")}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* DESKTOP VIEW */}
      <div
        ref={scrollRef}
        className="hidden md:flex gap-6 overflow-x-auto pb-8 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {cards.map((card, index) => {
          const isDark = index === 0 || index === 2;
          const bgColor = isDark ? "#0C550B" : "#FFF9D9";
          const textColor = isDark ? "text-white" : "text-black";
          const shadow = !isDark ? "shadow-xl" : "";

          return (
            <div
              key={index}
              ref={addToRefs}
              className={`flex-shrink-0 w-96 h-[400px] rounded-2xl p-2 flex flex-col ${shadow} ${
                index % 2 === 0 ? "mt-0" : "mt-24"
              }`}
              style={{ backgroundColor: bgColor }}
            >
              {/* IMAGE */}
              <div
                className="h-60 rounded-2xl mb-2 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${card.img})`,
                }}
              ></div>

              {/* TEXT */}
              <div className="relative flex-1 pb-4 px-2 flex flex-col justify-between">
                <div>
                  <h3
                    className={`text-2xl mb-2 italic ${textColor}`}
                    style={{ fontFamily: "Playfair Display" }}
                  >
                    {card.title}
                  </h3>

                  <p
                    className={`text-sm pr-10 ${
                      textColor === "text-white"
                        ? "text-gray-100"
                        : "text-gray-800"
                    }`}
                    style={{ fontFamily: "Plus Jakarta Sans" }}
                  >
                    "{card.description}"
                  </p>
                </div>

                {/* Arrow */}
                <div className="absolute bottom-2 right-2">
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                      isDark ? "border-white" : "border-black"
                    }`}
                  >
                    <ArrowUpRight
                      className="w-4 h-4"
                      strokeWidth={2}
                      color={isDark ? "white" : "black"}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MOBILE VIEW (Slider like services section) */}
      <div className="md:hidden relative mt-4">
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
            {cards.map((card, index) => {
              const isDark = index === 0 || index === 2;

              return (
                <div key={index} className="min-w-full px-2">
                  <div
                    className="rounded-3xl p-3"
                    style={{
                      backgroundColor: isDark ? "#0C550B" : "#FFF9D9",
                    }}
                  >
                    {/* IMAGE */}
                    <div
                      className="h-56 rounded-2xl mb-3 bg-cover bg-center"
                      style={{ backgroundImage: `url(${card.img})` }}
                    ></div>

                    {/* TEXT */}
                    <h3
                      className="text-2xl italic mb-1"
                      style={{ fontFamily: "Playfair Display" }}
                    >
                      {card.title}
                    </h3>
                    <p
                      className="text-sm text-gray-700"
                      style={{ fontFamily: "Plus Jakarta Sans" }}
                    >
                      "{card.description}"
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                currentSlide === index
                  ? "w-8 h-2 bg-black"
                  : "w-2 h-2 bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;
