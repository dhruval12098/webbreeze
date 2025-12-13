"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import ConfirmationDialog from "../../../../components/common/ConfirmationDialog";

const NearbyPlacesEditPage = () => {
  // Initialize state for three nearby places
  const [nearbyPlaces, setNearbyPlaces] = useState([
    { id: 1, name: "", description: "", images: [] },
    { id: 2, name: "", description: "", images: [] },
    { id: 3, name: "", description: "", images: [] }
  ]);
  const [activeTab, setActiveTab] = useState(1); // Default to first tab
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Handle image upload for a specific place
  const handleImageUpload = (placeId, e) => {
    const files = Array.from(e.target.files);
    const newImages = [];

    setNearbyPlaces(prevPlaces => 
      prevPlaces.map(place => {
        if (place.id === placeId && place.images.length < 3) {
          const imagesToAdd = Math.min(files.length, 3 - place.images.length);
          
          for (let i = 0; i < imagesToAdd; i++) {
            const file = files[i];
            const reader = new FileReader();
            reader.onload = (e) => {
              const newImage = {
                id: Date.now() + Math.random(),
                file: file,
                preview: e.target.result
              };
              
              setNearbyPlaces(currentPlaces => 
                currentPlaces.map(p => 
                  p.id === placeId 
                    ? { ...p, images: [...p.images, newImage] } 
                    : p
                )
              );
            };
            reader.readAsDataURL(file);
          }
          return place;
        }
        return place;
      })
    );
  };

  // Remove image from a specific place
  const removeImage = (placeId, imageId) => {
    setNearbyPlaces(prevPlaces => 
      prevPlaces.map(place => 
        place.id === placeId 
          ? { ...place, images: place.images.filter(img => img.id !== imageId) } 
          : place
      )
    );
  };

  // Handle text input changes
  const handleInputChange = (placeId, field, value) => {
    setNearbyPlaces(prevPlaces => 
      prevPlaces.map(place => 
        place.id === placeId 
          ? { ...place, [field]: value } 
          : place
      )
    );
  };

  // Open save confirmation dialog
  const openSaveDialog = (e) => {
    e.preventDefault();
    setShowSaveDialog(true);
  };

  // Confirm save action
  const confirmSave = () => {
    // Handle form submission
    console.log({ nearbyPlaces });
    setShowSaveDialog(false);
    // Here you would typically send the data to your backend
  };

  // Get the currently active place
  const activePlace = nearbyPlaces.find(place => place.id === activeTab);

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
          Edit Nearby Places
        </h1>
      </div>
      
      <div className="bg-white rounded-2xl shadow-[0_4px_18px_rgba(0,0,0,0.05)] p-6 border border-[#0A3D2E15]">
        <form className="space-y-6" onSubmit={openSaveDialog}>
          {/* Tabs for switching between places */}
          <div className="flex gap-4 border-b border-gray-200 mb-6">
            {[1, 2, 3].map((tabId) => (
              <button
                key={tabId}
                type="button"
                onClick={() => setActiveTab(tabId)}
                className={`pb-3 px-1 text-lg font-medium transition-all ${
                  activeTab === tabId
                    ? "text-[#0A3D2E] border-b-2 border-[#0A3D2E]"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Place {tabId}
              </button>
            ))}
          </div>
          
          {/* Content for the active place */}
          {activePlace && (
            <div className="space-y-4">
              {/* Place Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Place Name
                </label>
                <input
                  type="text"
                  value={activePlace.name}
                  onChange={(e) => handleInputChange(activePlace.id, 'name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A3D2E] focus:border-transparent"
                  placeholder="Enter place name"
                />
              </div>
              
              {/* Place Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={activePlace.description}
                  onChange={(e) => handleInputChange(activePlace.id, 'description', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A3D2E] focus:border-transparent"
                  placeholder="Enter description"
                  rows={4}
                ></textarea>
              </div>
              
              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Images (Max 3)
                </label>
                
                {/* Image Preview Area */}
                {activePlace.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {activePlace.images.map((image) => (
                      <div key={image.id} className="relative">
                        <img 
                          src={image.preview} 
                          alt="Preview" 
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(activePlace.id, image.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Upload Button */}
                {activePlace.images.length < 3 && (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      onChange={(e) => handleImageUpload(activePlace.id, e)}
                      className="hidden" 
                      id={`image-upload-${activePlace.id}`} 
                      disabled={activePlace.images.length >= 3}
                    />
                    <label 
                      htmlFor={`image-upload-${activePlace.id}`} 
                      className="cursor-pointer text-gray-600 hover:text-gray-800"
                    >
                      <p>Click to upload images</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {activePlace.images.length}/3 images uploaded
                      </p>
                    </label>
                  </div>
                )}
              </div>
            </div>
          )}
          
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
        message="Are you sure you want to save these changes to the nearby places?"
        confirmText="Save"
        cancelText="Cancel"
        type="info"
      />
    </div>
  );
};

export default NearbyPlacesEditPage;