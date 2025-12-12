"use client";

import React, { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import ReviewSection from "./components/home/ReviewSection";
import OverviewSection from "./components/home/OverviewSection";
import NearbyPlace from "./components/home/NearbyPlace";
import BoatHero from "./components/BoatHero";
import Enquiry from "./components/common/Enquiry";

const Hero = () => {
  const slides = [
    "https://images.unsplash.com/photo-1761839258075-585182da7521?w=1400&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1765127586047-f158d5bd6a33?w=1400&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1765451817006-4a9f9cb3afc4?w=1400&auto=format&fit=crop&q=70",
  ];

  const [index, setIndex] = useState(0);

  // SLIDER ANIMATION
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-[98%] mx-auto rounded-3xl h-screen flex relative overflow-hidden mt-6">

      {/* BACKGROUND SLIDER */}
      <div className="absolute inset-0">
        {slides.map((src, i) => (
          <img
            key={i}
            src={src}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            alt="Slide"
          />
        ))}
      </div>

      {/* DARK FADE AT BOTTOM-LEFT ONLY */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/95 via-black/70 to-transparent pointer-events-none"></div>

      {/* LEFT TEXT */}
      <div className="absolute bottom-12 left-10 text-white max-w-[60%] md:max-w-[40%]">
        <p className="text-sm opacity-90 font-sans">Welcome To</p>

        <h1
          className="text-4xl md:text-5xl italic mt-1"
          style={{ fontFamily: "Playfair Display" }}
        >
          Breeze & Grains
        </h1>

        <p className="text-sm font-sans mt-2 opacity-80">
          Your peaceful Kerala retreat by the backwaters of Alappuzha
        </p>

        {/* BUTTONS */}
        <div className="flex gap-4 mt-6 flex-wrap">
          <button className="px-6 py-2.5 rounded-full bg-white text-black flex items-center gap-2 text-sm hover:bg-gray-200 transition">
            Book Now <ArrowUpRight size={16} />
          </button>

          <button className="px-5 py-2.5 bg-white/20 backdrop-blur-md border border-gray-300 rounded-full text-sm flex items-center gap-3">
            <div className="relative flex w-14 h-6">
              <span className="absolute left-0 w-5 h-5 bg-gray-300 rounded-full"></span>
              <span className="absolute left-3 w-5 h-5 bg-gray-400 rounded-full"></span>
              <span className="absolute left-6 w-5 h-5 bg-gray-300 rounded-full"></span>
            </div>
            Reviews
          </button>
        </div>
      </div>

      {/* PREVIEW SLIDE INDICATORS */}
      <div className="hidden lg:flex absolute bottom-12 right-10 gap-3 items-center">
        {slides.map((url, i) => (
          <img
            key={i}
            src={url}
            className={`rounded-md object-cover border transition-all duration-300
              ${index === i ? "scale-110 border-white shadow-lg" : "opacity-60"}
              w-24 h-16
            `}
          />
        ))}
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <main>
      <Hero />
      <OverviewSection />
      <ReviewSection />
      <NearbyPlace />
      <BoatHero />
      <Enquiry />
    </main>
  );
}
