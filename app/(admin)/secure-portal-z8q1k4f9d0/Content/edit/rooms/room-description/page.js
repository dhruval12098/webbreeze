"use client";

import React, { useState, useEffect } from "react";
import ConfirmationDialog from "../../../../components/common/ConfirmationDialog";

const RoomDescriptionEditPage = () => {
  const [descriptionTitle, setDescriptionTitle] = useState("");
  const [descriptionContent, setDescriptionContent] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load existing data from API
  useEffect(() => {
    const fetchDescriptionData = async () => {
      try {
        const response = await fetch('/api/descriptions');
        const result = await response.json();
        
        if (result.success && result.data) {
          setDescriptionTitle(result.data.title || "");
          setDescriptionContent(result.data.content || "");
        }
      } catch (error) {
        console.error('Error fetching description data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDescriptionData();
  }, []);

  const openSaveDialog = (e) => {
    e.preventDefault();
    setShowSaveDialog(true);
  };

  const confirmSave = async () => {
    try {
      const response = await fetch('/api/descriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: descriptionTitle,
          content: descriptionContent,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('Description saved successfully');
      } else {
        console.error('Error saving description:', result.error);
      }
    } catch (error) {
      console.error('Error saving description:', error);
    }
    
    setShowSaveDialog(false);
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-white px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-semibold tracking-tight text-[#0A3D2E]">
            Edit Description
          </h1>
        </div>
        <div className="bg-white rounded-2xl shadow-[0_4px_18px_rgba(0,0,0,0.05)] p-6 border border-[#0A3D2E15]">
          <div className="flex justify-center items-center h-32">
            <div>Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white px-6 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>
        <h1 className="text-3xl font-semibold tracking-tight text-[#0A3D2E]">
          Edit Description
        </h1>
      </div>
      <div className="bg-white rounded-2xl shadow-[0_4px_18px_rgba(0,0,0,0.05)] p-6 border border-[#0A3D2E15]">
        <form className="space-y-6" onSubmit={openSaveDialog}>
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