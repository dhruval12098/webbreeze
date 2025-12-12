import React from "react";
import { BiSolidQuoteLeft } from "react-icons/bi";

const TestimonialCard = ({ variant = "wide", isFirstRow = false }) => {
  // variant: "wide" or "small"
  // isFirstRow: true for first row cards
  
  // Define color schemes
  const firstRowBg = "#BFA000";     // Dark yellow
  const secondRowBg = "#E7F1E7";    // Light green
  
  const bgColor = isFirstRow ? firstRowBg : secondRowBg;
  
  return (
    <div
      className={`rounded-xl p-6 flex flex-col ${
        variant === "wide" ? "flex-1 h-80" : "w-[40%] h-80"
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
  return (
    <section className="w-[80%] mx-auto my-12"> {/* top & bottom margin added */}
      {/* Row 1: All cards with dark yellow scheme and light text */}
      <div className="flex gap-6 mb-6">
        <TestimonialCard variant="wide" isFirstRow={true} />
        <TestimonialCard variant="small" isFirstRow={true} />
      </div>

      {/* Row 2: All cards with light green scheme */}
      <div className="flex gap-6 mb-6">
        <TestimonialCard variant="small" isFirstRow={false} />
        <TestimonialCard variant="wide" isFirstRow={false} />
      </div>

      {/* Row 3: All cards with dark yellow scheme and light text */}
      <div className="flex gap-6 mb-6">
        <TestimonialCard variant="wide" isFirstRow={true} />
        <TestimonialCard variant="small" isFirstRow={true} />
      </div>

      {/* Row 4: All cards with light green scheme */}
      <div className="flex gap-6">
        <TestimonialCard variant="small" isFirstRow={false} />
        <TestimonialCard variant="wide" isFirstRow={false} />
      </div>
    </section>
  );
};

export default CardTestimonial;