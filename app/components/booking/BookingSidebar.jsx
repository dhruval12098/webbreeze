import React from "react";

const BookingSidebar = () => {
  return (
    <div className="w-full md:w-[30%] bg-[#173A00] border-r border-[#594B00]/30 p-6 md:p-10 flex flex-col justify-between">
      <div>
        <h1 
          className="text-3xl md:text-4xl font-serif italic"
          style={{ color: "#FFFBE6" }}
        >
          Book Your Stay
        </h1>
        <p 
          className="text-sm mt-2 font-sans text-white/80"
          style={{ fontFamily: "Plus Jakarta Sans" }}
        >
          Three step easy Booking
        </p>
        <hr className="w-1/2 mt-4 border-[#594B00]/30" />
      </div>

      <p 
        className="text-xs text-white/60 font-sans"
        style={{ fontFamily: "Plus Jakarta Sans" }}
      >
        *NOTE – Read all Documentation <br /> before Booking
      </p>
    </div>
  );
};

export default BookingSidebar;