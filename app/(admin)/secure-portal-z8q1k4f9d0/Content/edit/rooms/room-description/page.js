"use client";

import React, { useState } from "react";
import ConfirmationDialog from "../../../../components/common/ConfirmationDialog";

const RoomDescriptionEditPage = () => {
  const [descriptionTitle, setDescriptionTitle] = useState("");
  const [descriptionContent, setDescriptionContent] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const openSaveDialog = (e) => {
    e.preventDefault();
    setShowSaveDialog(true);
  };

  const confirmSave = () => {
    // Handle form submission
    console.log({ descriptionTitle, descriptionContent });
    setShowSaveDialog(false);
    // Here you would typically send the data to your backend
  };

  return (
    <div className="w-full min-h-screen bg-white px-6 py-8">
      <h1 className="text-3xl font-semibold tracking-tight mb-8 text-[#0A3D2E]">
        Edit Room Description
      </h1>
      {/* Add form fields for room description editing */}
      <div className="bg-white rounded-2xl shadow-[0_4px_18px_rgba(0,0,0,0.05)] p-6 border border-[#0A3D2E15]">
        <form className="space-y-6" onSubmit={openSaveDialog}>
          {/* Form fields will be added here */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description Title
            </label>
            <input
              type="text"
              value={descriptionTitle}
              onChange={(e) => setDescriptionTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A3D2E] focus:border-transparent"
              placeholder="Enter description title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description Content
            </label>
            <textarea
              value={descriptionContent}
              onChange={(e) => setDescriptionContent(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A3D2E] focus:border-transparent"
              placeholder="Enter room description"
              rows={5}
            ></textarea>
          </div>
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
        message="Are you sure you want to save these changes to the room description?"
        confirmText="Save"
        cancelText="Cancel"
        type="info"
      />
    </div>
  );
};

export default RoomDescriptionEditPage;