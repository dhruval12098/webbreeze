import React from "react";

const BookingSidebar = () => {
  return (
    <div className="w-[30%] bg-[#f5f5f5] border-r border-gray-300 p-10 flex flex-col justify-between">
      <div>
        <h1 className="text-4xl font-serif italic">Book Your Stay</h1>
        <p className="text-sm mt-2 font-sans text-gray-600">
          Three step easy Booking
        </p>
        <hr className="w-1/2 mt-4 border-gray-400" />
      </div>

      <p className="text-xs text-gray-600 font-sans">
        *NOTE – Read all Documentation <br /> before Booking
      </p>
    </div>
  );
};

export default BookingSidebar;
