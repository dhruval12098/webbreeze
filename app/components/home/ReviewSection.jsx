"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { guestReviewsApi } from "@/app/lib/apiClient";
import { useRouter } from "next/navigation";

const ReviewSection = () => {
  const router = useRouter();
  const [currentReview, setCurrentReview] = useState(0);
  const [revealedChars, setRevealedChars] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averageRating, setAverageRating] = useState(0);

  // Fetch reviews from the database
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await guestReviewsApi.getAll({ limit: 10 });
        
        if (response.success) {
          let fetchedReviews = response.data || [];
          
          // Assign random avatars to reviews without images
          fetchedReviews = fetchedReviews.map(review => {
            if (!review.image_url) {
              const randomAvatarNum = Math.floor(Math.random() * 3);
              // Use 'avatar.jpg' for 0, 'avatar2.jpg' for 1, 'avatar3.jpg' for 2
              const avatarFileName = randomAvatarNum === 0 ? 'avatar.jpg' : `avatar${randomAvatarNum + 1}.jpg`;
              return {
                ...review,
                fallbackAvatar: `/image/review/${avatarFileName}`
              };
            }
            return review;
          });
          
          setReviews(fetchedReviews);
          
          // Calculate average rating
          if (fetchedReviews.length > 0) {
            const totalRating = fetchedReviews.reduce((sum, review) => sum + review.rating, 0);
            const avg = totalRating / fetchedReviews.length;
            setAverageRating(avg.toFixed(1));
          }
        } else {
          setError(response.error || "Failed to fetch reviews");
        }
      } catch (err) {
        setError(err.message || "An error occurred while fetching reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    if (reviews.length > 0) {
      setRevealedChars(0);
      const fullText = reviews[currentReview]?.review_text || "";

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
    }
  }, [currentReview, reviews]);

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  // Auto-slide functionality
  useEffect(() => {
    if (reviews.length <= 1) return; // Don't auto-slide if there's only one review
    
    const autoSlideInterval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000); // Auto-slide every 5 seconds
    
    return () => clearInterval(autoSlideInterval);
  }, [reviews.length]);

  // Show loading state
  if (loading) {
    return (
      <div className="w-full bg-white px-4 py-12 md:py-16 min-h-screen flex items-center border border-neutral-50 rounded-lg">
        <div className="mx-auto w-full" style={{ width: "98%", maxWidth: "1400px" }}>
          <div className="text-center py-12">
            <p>Loading reviews...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full bg-white px-4 py-12 md:py-16 min-h-screen flex items-center border border-neutral-50 rounded-lg">
        <div className="mx-auto w-full" style={{ width: "98%", maxWidth: "1400px" }}>
          <div className="text-center py-12">
            <p>Error loading reviews: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state
  if (reviews.length === 0) {
    return (
      <div className="w-full bg-white px-4 py-12 md:py-16 min-h-screen flex items-center border border-neutral-50 rounded-lg">
        <div className="mx-auto w-full" style={{ width: "98%", maxWidth: "1400px" }}>
          <div className="text-center py-12">
            <p>No reviews available yet.</p>
          </div>
        </div>
      </div>
    );
  }

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
            <button 
              onClick={() => router.push('/reviews')}
              className="bg-[#594B00] text-white px-4 md:px-5 py-2 text-sm font-normal hover:bg-[#594B00]/90 transition-colors rounded-l-md border-r border-[#594B00]"
            >
              View All
            </button>
            <div
              className="bg-white border border-[#122D00] border-l-0 px-4 py-2 rounded-r-md text-sm font-medium"
              style={{ color: "#594B00" }}
            >
              {averageRating}
            </div>
          </div>
        </div>

        {/* Review Carousel */}
        <div className="relative flex items-center justify-center gap-4 md:gap-8 mb-12">
          
          {/* Left Arrow */}
          <button
            onClick={prevReview}
            className="flex-shrink-0 w-9 h-9 md:w-12 md:h-12 bg-[#122D00] rounded-full flex items-center justify-center hover:bg-[#122D00]/90 transition-colors"
            disabled={reviews.length <= 1}
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
                {reviews[currentReview]?.review_text?.slice(0, revealedChars) || ""}
              </span>
              <span style={{ color: "#d4d4d4" }}>
                {reviews[currentReview]?.review_text?.slice(revealedChars) || ""}
              </span>
              "
            </p>

            {/* User Card */}
            <div className="inline-flex items-center gap-3 bg-neutral-200 rounded-full px-5 py-2">
              {reviews[currentReview]?.image_url ? (
                <img 
                  src={reviews[currentReview].image_url} 
                  alt={reviews[currentReview].reviewer_name} 
                  className="w-9 h-9 md:w-10 md:h-10 bg-neutral-400 rounded-full flex-shrink-0 object-cover"
                />
              ) : (
                <img 
                  src={reviews[currentReview].fallbackAvatar} 
                  alt="Default Avatar" 
                  className="w-9 h-9 md:w-10 md:h-10 bg-neutral-400 rounded-full flex-shrink-0 object-cover"
                />
              )}
              <div className="text-left">
                <p className="text-xs md:text-sm font-medium text-neutral-800">
                  {reviews[currentReview]?.reviewer_name || "Anonymous"}
                </p>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < (reviews[currentReview]?.rating || 0)
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
            disabled={reviews.length <= 1}
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
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;