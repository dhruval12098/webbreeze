"use client";
import React from "react";
import { Star } from "lucide-react";
import CardTestimonial from "../components/reviews/CardTestimonial";
import TestimonialForm from "../components/reviews/TestimonialForm";

const Page = () => {
  return (
    <div className="w-full py-24 px-4 sm:px-6 md:px-12 lg:px-20 bg-white">

      {/* MAIN CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">

        {/* LEFT SIDE */}
        <div>
          <h2
            className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl leading-snug italic mb-4"
            style={{ fontFamily: "Playfair Display", fontStyle: "italic", color: "#173A00" }}
          >
            What Our Guests <br />
            Say About Their Stay <br />
            at Breeze & Grains
          </h2>

          <p
            className="text-sm md:text-base max-w-md"
            style={{ fontFamily: "Plus Jakarta Sans", color: "#594B00" }}
          >
            Real stories. Real experiences. Honest memories
            from travelers who stayed with us.
          </p>
        </div>

        {/* RIGHT SIDE — CARD (ONLY PLUS JAKARTA) */}
        <div className="w-full">
          <div className="rounded-2xl border border-gray-200 shadow-sm p-6 pt-8">

            {/* Card Header */}
            <div className="flex justify-between items-center mb-6">
              <h3
                className="text-lg font-semibold"
                style={{ fontFamily: "Plus Jakarta Sans", color: "#594B00" }}
              >
                Over-View
              </h3>

              <button
                className="text-xs px-3 py-1 rounded-full text-white"
                style={{ fontFamily: "Plus Jakarta Sans", backgroundColor: "#594B00" }}
              >
                Reviews & Ratings
              </button>
            </div>

            {/* MAIN RATING SECTION */}
            <div className="flex justify-between items-center mb-6">

              {/* Rating Number */}
              <div
                className="text-4xl sm:text-5xl font-bold"
                style={{ fontFamily: "Plus Jakarta Sans", color: "#594B00" }}
              >
                4.5
              </div>

              {/* Stars + Label */}
              <div className="flex flex-col items-center">
                <div className="flex gap-[3px]">
                  <Star className="w-5 h-5 fill-[#FFD700] text-[#FFD700]" />
                  <Star className="w-5 h-5 fill-[#FFD700] text-[#FFD700]" />
                  <Star className="w-5 h-5 fill-[#FFD700] text-[#FFD700]" />
                  <Star className="w-5 h-5 fill-[#FFD700] text-[#FFD700]" />
                  <Star className="w-5 h-5 fill-[#FFD700] text-[#FFD700]" />
                  <Star className="w-5 h-5 fill-gray-300 text-gray-300" />
                </div>

                <p
                  className="text-[10px] text-gray-500 mt-1"
                  style={{ fontFamily: "Plus Jakarta Sans" }}
                >
                  Based On Earlier Rating
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-gray-200 mb-6"></div>

            {/* Rating Categories */}
            <div className="space-y-6">
              <Category title="Cleanliness" rating="4.7" progress="85%" />
              <Category title="Comfort" rating="4.8" progress="90%" />
              <Category title="Location & Surroundings" rating="4.2" progress="70%" />
              <Category title="Amenities" rating="4.8" progress="90%" />
              <Category title="Value for Money" rating="4.7" progress="85%" />
            </div>

          </div>
        </div>

      </div>

      {/* TESTIMONIAL CARDS SECTION */}
      <div className="mt-16 md:mt-20">
        <h3 
          className="text-2xl sm:text-3xl mb-8 md:mb-12 text-center"
          style={{ fontFamily: "Playfair Display", fontStyle: "italic" }}
        >
          Guest Experiences
        </h3>
        
        <CardTestimonial />
        <TestimonialForm />
      </div>

    </div>
  );
};

/* CATEGORY COMPONENT — Plus Jakarta Sans Only */
const Category = ({ title, rating, progress }) => {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <p
          className="text-sm text-gray-800"
          style={{ fontFamily: "Plus Jakarta Sans" }}
        >
          {title}
        </p>

        <p
          className="text-sm text-gray-800"
          style={{ fontFamily: "Plus Jakarta Sans", color: "#594B00" }}
        >
          {rating}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-[4px] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: progress, backgroundColor: "#594B00" }}
        ></div>
      </div>
    </div>
  );
};

export default Page;