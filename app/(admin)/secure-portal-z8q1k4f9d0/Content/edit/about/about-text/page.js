"use client";

import React, { useState } from "react";
import ConfirmationDialog from "../../../../components/common/ConfirmationDialog";

const AboutTextEditPage = () => {
  const [aboutData, setAboutData] = useState({
    heading: "",
    subheading: ""
  });
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setAboutData(prev => ({
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
    console.log({ aboutData });
    setShowSaveDialog(false);
    // Here you would typically send the data to your backend
  };

  return (
    <div className="w-full min-h-screen bg-white px-6 py-8">
      <h1 className="text-3xl font-semibold tracking-tight mb-8 text-[#0A3D2E]">
        Edit About Text
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
              value={aboutData.heading}
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
              value={aboutData.subheading}
              onChange={(e) => handleInputChange('subheading', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A3D2E] focus:border-transparent"
              placeholder="Enter subheading"
            />
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
        message="Are you sure you want to save these changes to the about section?"
        confirmText="Save"
        cancelText="Cancel"
        type="info"
      />
    </div>
  );
};

export default AboutTextEditPage;