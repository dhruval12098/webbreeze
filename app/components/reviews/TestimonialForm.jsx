import React from "react";
import { BiPlus } from "react-icons/bi";
import { AiFillStar } from "react-icons/ai";

const TestimonialForm = () => {
  return (
    <section className="w-[98%] mx-auto my-12">
      {/* OUTER GRAY BOX */}
      <div className="bg-[#E7F1E7] p-8 rounded-xl">
        
        {/* INNER WHITE BOX */}
        <div className="bg-white p-10 rounded-xl flex gap-10 items-start w-full">
          
          {/* LEFT SIDE */}
          <div className="w-1/3">
            <h2 
              className="text-4xl italic font-serif leading-tight"
              style={{ color: "#594B00" }}
            >
              Write <br /> a Review
            </h2>

            {/* Upload Profile Circle */}
            <div className="relative w-32 h-32 bg-[#FFFBE6] rounded-full mt-10 flex items-center justify-center">
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-[#594B00] text-white rounded-full flex items-center justify-center">
                <BiPlus size={18} />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE (FORM) */}
          <form className="w-2/3 flex flex-col gap-4">
            
            {/* Stars */}
            <div className="flex gap-1 mb-2">
              <AiFillStar className="text-[#594B00]" />
              <AiFillStar className="text-[#594B00]" />
              <AiFillStar className="text-[#594B00]" />
              <AiFillStar className="text-[#594B00]" />
              <AiFillStar className="text-[#594B00]" />
            </div>

            <input
              type="text"
              placeholder="Name"
              className="bg-[#FFFBE6] p-3 rounded-md text-sm outline-none"
              style={{ color: "#173A00" }}
            />

            <input
              type="text"
              placeholder="Designation"
              className="bg-[#FFFBE6] p-3 rounded-md text-sm outline-none"
              style={{ color: "#173A00" }}
            />

            <textarea
              placeholder="Write your Review here"
              className="bg-[#FFFBE6] p-3 rounded-md h-32 text-sm resize-none outline-none"
              style={{ color: "#173A00" }}
            ></textarea>

            <button 
              className="px-10 py-2 rounded-full w-fit ml-auto mt-2"
              style={{ backgroundColor: "#594B00", color: "white" }}
            >
              Submit
            </button>

          </form>
        </div>
      </div>
    </section>
  );
};

export default TestimonialForm;