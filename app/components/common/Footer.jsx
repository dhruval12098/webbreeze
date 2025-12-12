'use client'

import React, { useState } from 'react'
import Link from 'next/link'

// Toast Notification Component
const Toast = ({ message, type, isVisible, onClose }) => {
  return (
    <div
      className={`absolute mt-3 left-0 transform transition-all duration-500 ease-out max-w-xs ${
        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`px-4 py-3 rounded-lg shadow-lg border backdrop-blur-sm ${
          type === 'success'
            ? 'bg-green-600/90 border-green-300 text-white'
            : 'bg-red-900/90 border-red-600 text-red-100'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              {type === 'success' ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <p className="text-sm font-medium">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-3 text-gray-400 hover:text-white transition-colors duration-200 flex-shrink-0"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const AnimatedLink = ({ href, children, isExternal = false }) => {
  const text = children;
  
  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative overflow-hidden group"
        style={{ lineHeight: "1.2" }}
      >
        <span className="inline-block">
          {text.split("").map((char, index) => (
            <span
              key={index}
              className="inline-block transition-transform duration-300 ease-out group-hover:-translate-y-full"
              style={{ transitionDelay: `${index * 30}ms` }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>

        <span
          className="absolute top-0 left-0 inline-block translate-y-full"
        >
          {text.split("").map((char, index) => (
            <span
              key={index}
              className="inline-block transition-transform duration-300 ease-out group-hover:-translate-y-full"
              style={{ transitionDelay: `${index * 30}ms` }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
      </a>
    );
  }

  return (
    <Link
      href={href}
      className="block relative overflow-hidden group"
      style={{ lineHeight: "1.2" }}
    >
      <span className="inline-block">
        {text.split("").map((char, index) => (
          <span
            key={index}
            className="inline-block transition-transform duration-300 ease-out group-hover:-translate-y-full"
            style={{ transitionDelay: `${index * 30}ms` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>

      <span
        className="absolute top-0 left-0 inline-block translate-y-full"
      >
        {text.split("").map((char, index) => (
          <span
            key={index}
            className="inline-block transition-transform duration-300 ease-out group-hover:-translate-y-full"
            style={{ transitionDelay: `${index * 30}ms` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </Link>
  );
};

const Footer = () => {
  // Toast notification state
  const [toast, setToast] = useState({
    message: '',
    type: 'success',
    isVisible: false
  });

  // State for bell icon animation
  const [isRinging, setIsRinging] = useState(false);

  // Function to show toast
  const showToast = (message, type = 'success') => {
    setToast({
      message,
      type,
      isVisible: true
    });

    // Auto hide after 5 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }));
    }, 5000);
  };

  // Function to hide toast
  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // Web3Forms handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Add Web3Forms access key - REPLACE WITH YOUR KEY
    formData.append("access_key", "YOUR_ACCESS_KEY_HERE");

    // Start ringing animation
    setIsRinging(true);

    try {
      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: json
      }).then((res) => res.json());

      if (res.success) {
        showToast("Thanks! You're subscribed to our newsletter.", 'success');
        e.target.reset();
      } else {
        showToast("Something went wrong. Please try again.", 'error');
      }
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    } finally {
      // Stop ringing animation after 2 seconds
      setTimeout(() => {
        setIsRinging(false);
      }, 2000);
    }
  };

  return (
    <footer className="relative bg-[#2d5016] text-white px-4 sm:px-6 md:px-12 lg:px-20 pt-8 sm:pt-12 pb-8 sm:pb-12 min-h-screen">
      {/* Top Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start mb-12 sm:mb-16">
        {/* Top Left - Newsletter */}
        <div className="space-y-4 max-w-md mb-8 lg:mb-0">
          <p 
            className="text-base sm:text-lg"
            style={{ fontFamily: "Plus Jakarta Sans" }}
          >
            Sign up for our newsletter <span className="text-xs sm:text-sm">(No spam)</span>
          </p>
          <div className="relative">
            <form
              onSubmit={handleSubmit}
              className="flex items-center border-b border-white/50 max-w-xs"
            >
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="bg-transparent flex-1 py-2 px-2 text-white placeholder-white/60 focus:outline-none text-sm sm:text-base"
                style={{ fontFamily: "Plus Jakarta Sans" }}
                required
              />
              <button 
                type="submit" 
                className={`text-white p-1 transition-all duration-300 ${
                  isRinging ? 'animate-bounce' : 'hover:scale-110'
                }`}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className={isRinging ? 'animate-pulse' : ''}
                >
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
                </svg>
              </button>
            </form>
            
            {/* Toast Notification */}
            <Toast
              message={toast.message}
              type={toast.type}
              isVisible={toast.isVisible}
              onClose={hideToast}
            />
          </div>
        </div>

        {/* Top Right - Navigation Links */}
        <nav 
          className="flex flex-col space-y-2 sm:space-y-3 text-base sm:text-lg"
          style={{ fontFamily: "Plus Jakarta Sans" }}
        >
          <AnimatedLink href="/">Home</AnimatedLink>
          <AnimatedLink href="/room">Room</AnimatedLink>
          <AnimatedLink href="/gallery">Gallery</AnimatedLink>
          <AnimatedLink href="/contact">Contact</AnimatedLink>
          <AnimatedLink href="/reviews">Reviews</AnimatedLink>
          <AnimatedLink href="/about">About</AnimatedLink>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="absolute bottom-8 sm:bottom-12 left-4 sm:left-6 md:left-12 lg:left-20 right-4 sm:right-6 md:right-12 lg:right-20">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 sm:gap-12">
          {/* Bottom Left - Brand Name and Description */}
          <div className="max-w-xl">
            {/* Brand Name */}
            <h2 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-3 sm:mb-4 italic"
              style={{ fontFamily: "Playfair Display", fontStyle: "italic" }}
            >
              Breeze & Grains
            </h2>
            
            {/* Description */}
            <p 
              className="text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8"
              style={{ fontFamily: "Plus Jakarta Sans" }}
            >
              A peaceful homestay by the backwaters of Kerala, offering calm stays, warm hospitality, and a connection to nature.
            </p>

            {/* Social Links */}
            <div 
              className="flex flex-wrap gap-x-6 sm:gap-x-8 gap-y-2 text-base sm:text-lg"
              style={{ fontFamily: "Plus Jakarta Sans" }}
            >
              <AnimatedLink href="https://linkedin.com" isExternal>
                LinkedIn ↗
              </AnimatedLink>
              <AnimatedLink href="https://wa.me/" isExternal>
                Whatsapp ↗
              </AnimatedLink>
              <AnimatedLink href="https://instagram.com" isExternal>
                Instagram ↗
              </AnimatedLink>
            </div>
          </div>

          {/* Bottom Right - Legal Links with Divider */}
          <div 
            className="flex flex-col items-start lg:items-end space-y-2 text-xs sm:text-sm"
            style={{ fontFamily: "Plus Jakarta Sans" }}
          >
            <div className="w-full lg:w-auto border-t border-white/30 pt-3 sm:pt-4 space-y-2">
              <AnimatedLink href="/terms">Terms & Conditions</AnimatedLink>
              <AnimatedLink href="/privacy">Privacy Policy</AnimatedLink>
              <p className="text-white/60">© 2025 Breeze & Grains</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer