"use client";

import React, { useState } from "react";
import { BiPlus } from "react-icons/bi";
import { AiFillStar } from "react-icons/ai";
import { guestReviewsApi } from "@/app/lib/apiClient";
import { uploadImageToStorage } from "@/app/lib/imageService";
import { supabase } from "@/app/lib/supabaseClient";
import { toast } from "react-toastify";

const TestimonialForm = () => {
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is an image
      if (!file.type.match('image.*')) {
        toast.error("Please select an image file");
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      setImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = null;
      
      // Upload image if provided
      if (image) {
        const uploadResult = await uploadImageToStorage(image, 'guest-reviews', supabase);
        if (uploadResult.success) {
          imageUrl = uploadResult.publicUrl;
        } else {
          throw new Error(uploadResult.error || "Failed to upload image");
        }
      }

      // Prepare review data
      const reviewData = {
        reviewer_name: name,
        designation: designation,
        review_text: reviewText,
        rating: rating,
        date: new Date().toISOString().split("T")[0],
        image_url: imageUrl
      };

      const response = await guestReviewsApi.create(reviewData);
      
      if (response.success) {
        toast.success("Review submitted successfully!");
        // Reset form
        setName("");
        setDesignation("");
        setReviewText("");
        setRating(5);
        setImage(null);
        setImagePreview(null);
      } else {
        toast.error("Error submitting review: " + (response.error || "Unknown error"));
      }
    } catch (error) {
      toast.error("Error submitting review: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (starRating) => {
    setRating(starRating);
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <AiFillStar
        key={star}
        className={`cursor-pointer text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
        onClick={() => handleStarClick(star)}
      />
    ));
  };

  return (
    <section className="w-[98%] mx-auto my-12">
      {/* OUTER GRAY BOX */}
      <div className="bg-[#E7F1E7] p-8 rounded-xl">
        
        {/* INNER WHITE BOX */}
        <div className="bg-white p-6 md:p-10 rounded-xl w-full">
          
          {/* FLEX CONTAINER WITH RESPONSIVE STACKING */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-center md:items-start w-full">
            
            {/* LEFT SIDE - STACKED ON MOBILE */}
            <div className="w-full md:w-1/3 text-center md:text-left">
              <h2 
                className="text-3xl md:text-4xl italic font-serif leading-tight"
                style={{ color: "#594B00" }}
              >
                Write <br /> a Review
              </h2>

              {/* Upload Profile Circle - Centered on mobile, left-aligned on desktop */}
              <div className="relative w-32 h-32 bg-[#FFFBE6] rounded-full mt-8 flex items-center justify-center mx-auto md:mx-0 overflow-hidden">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  id="image-upload"
                />
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <BiPlus size={24} className="mx-auto" />
                    <p className="text-xs mt-1">Upload Image</p>
                  </div>
                )}
                <label 
                  htmlFor="image-upload"
                  className="absolute bottom-2 right-2 w-6 h-6 bg-[#594B00] text-white rounded-full flex items-center justify-center cursor-pointer z-20"
                >
                  <BiPlus size={18} />
                </label>
              </div>
            </div>

            {/* RIGHT SIDE (FORM) - STACKED ON MOBILE */}
            <form onSubmit={handleSubmit} className="w-full md:w-2/3 flex flex-col gap-4">
              
              {/* Stars */}
              <div className="flex gap-1 mb-2 justify-center md:justify-start">
                {renderStars()}
              </div>

              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#FFFBE6] p-3 rounded-md text-sm outline-none w-full"
                style={{ color: "#173A00" }}
                required
              />

              <input
                type="text"
                placeholder="Designation"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="bg-[#FFFBE6] p-3 rounded-md text-sm outline-none w-full"
                style={{ color: "#173A00" }}
                required
              />

              <textarea
                placeholder="Write your Review here"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="bg-[#FFFBE6] p-3 rounded-md h-32 text-sm resize-none outline-none w-full"
                style={{ color: "#173A00" }}
                required
              ></textarea>

              <button 
                type="submit"
                disabled={isSubmitting}
                className={`px-10 py-2 rounded-full w-fit mx-auto md:ml-auto mt-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{ backgroundColor: "#594B00", color: "white" }}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialForm;