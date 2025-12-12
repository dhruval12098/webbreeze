"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import ConfirmationDialog from "../../../../components/common/ConfirmationDialog";

const OurStoryEditPage = () => {
  const [storyData, setStoryData] = useState({
    heading: "",
    subheading: "",
    image: null
  });
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setStoryData(prev => ({
          ...prev,
          image: {
            file: file,
            preview: e.target.result
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image
  const removeImage = () => {
    setStoryData(prev => ({
      ...prev,
      image: null
    }));
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setStoryData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Open save confirmation dialog
  const openSaveDialog = (e) => {
    e.preventDefault();
    setShowSaveDialog(true);
  };

  // Confirm save action
  const confirmSave = () => {
    // Handle form submission
    console.log({ storyData });
    setShowSaveDialog(false);
    // Here you would typically send the data to your backend
  };

  return (
    <div className="w-full min-h-screen bg-white px-6 py-8">
      <h1 className="text-3xl font-semibold tracking-tight mb-8 text-[#0A3D2E]">
        Edit Our Story
      </h1>
      
      <div className="bg-white rounded-2xl shadow-[0_4px_18px_rgba(0,0,0,0.05)] p-6 border border-[#0A3D2E15]">
        <form className="space-y-6" onSubmit={openSaveDialog}>
          {/* Heading */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Heading
            </label>
            <input
              type="text"
              value={storyData.heading}
              onChange={(e) => handleInputChange('heading', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A3D2E] focus:border-transparent"
              placeholder="Enter heading"
            />
          </div>
          
          {/* Subheading */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subheading
            </label>
            <input
              type="text"
              value={storyData.subheading}
              onChange={(e) => handleInputChange('subheading', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A3D2E] focus:border-transparent"
              placeholder="Enter subheading"
            />
          </div>
          
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Story Image
            </label>
            
            {storyData.image ? (
              <div className="relative inline-block">
                <img 
                  src={storyData.image.preview} 
                  alt="Story preview" 
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  className="hidden" 
                  id="story-upload"
                />
                <label 
                  htmlFor="story-upload" 
                  className="cursor-pointer text-gray-600 hover:text-gray-800"
                >
                  <p>Click to upload story image</p>
                  <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 5MB</p>
                </label>
              </div>
            )}
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#0A3D2E] text-white px-6 py-2 rounded-xl hover:bg-[#082f24] transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Save Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onConfirm={confirmSave}
        title="Save Changes"
        message="Are you sure you want to save these changes to the story section?"
        confirmText="Save"
        cancelText="Cancel"
        type="info"
      />
    </div>
  );
};

export default OurStoryEditPage;