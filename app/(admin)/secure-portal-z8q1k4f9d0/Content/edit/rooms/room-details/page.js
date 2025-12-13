"use client";

import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import ConfirmationDialog from "../../../../components/common/ConfirmationDialog";

const RoomDetailsEditPage = () => {
  const [activeTab, setActiveTab] = useState("details"); // Default to details tab
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  
  // Room Details State
  const [roomDetails, setRoomDetails] = useState({
    title: "",
    label: "",
    price: "",
    description: "",
    images: []
  });
  
  // Amenities State
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [newAmenity, setNewAmenity] = useState({
    icon: null,
    title: "",
    description: ""
  });

  // Handle image upload for room details
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];

    files.forEach(file => {
      if (roomDetails.images.length + newImages.length < 5) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newImages.push({
            id: Date.now() + Math.random(),
            file: file,
            preview: e.target.result
          });
          
          if (newImages.length === Math.min(files.length, 5 - roomDetails.images.length)) {
            setRoomDetails(prev => ({
              ...prev,
              images: [...prev.images, ...newImages]
            }));
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // Remove image from room details
  const removeImage = (id) => {
    setRoomDetails(prev => ({
      ...prev,
      images: prev.images.filter(image => image.id !== id)
    }));
  };

  // Handle room details input changes
  const handleRoomDetailsChange = (field, value) => {
    // For price field, only allow numbers
    if (field === 'price') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setRoomDetails(prev => ({
        ...prev,
        [field]: numericValue
      }));
    } else {
      setRoomDetails(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Handle new amenity input changes
  const handleNewAmenityChange = (field, value) => {
    setNewAmenity(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle icon upload for new amenity
  const handleIconUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewAmenity(prev => ({
          ...prev,
          icon: {
            file: file,
            preview: e.target.result
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove icon from new amenity
  const removeIcon = () => {
    setNewAmenity(prev => ({
      ...prev,
      icon: null
    }));
  };

  // Add new amenity to the list
  const addAmenity = () => {
    if (newAmenity.title && newAmenity.description) {
      setAmenitiesList(prev => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          ...newAmenity
        }
      ]);
      
      // Reset the new amenity form
      setNewAmenity({
        icon: null,
        title: "",
        description: ""
      });
    }
  };

  // Remove amenity from the list
  const removeAmenity = (id) => {
    setAmenitiesList(prev => prev.filter(amenity => amenity.id !== id));
  };

  // Open save confirmation dialog
  const openSaveDialog = (e) => {
    e.preventDefault();
    setShowSaveDialog(true);
  };

  // Confirm save action
  const confirmSave = () => {
    // Handle form submission
    console.log({ roomDetails, amenitiesList });
    setShowSaveDialog(false);
    // Here you would typically send the data to your backend
  };

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
          Edit Room Details
        </h1>
      </div>
      
      <div className="bg-white rounded-2xl shadow-[0_4px_18px_rgba(0,0,0,0.05)] p-6 border border-[#0A3D2E15]">
        <form className="space-y-6" onSubmit={openSaveDialog}>
          {/* Tabs for switching between Room Details and Amenities */}
          <div className="flex gap-4 border-b border-gray-200 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className={`pb-3 px-1 text-lg font-medium transition-all ${
                activeTab === "details"
                  ? "text-[#0A3D2E] border-b-2 border-[#0A3D2E]"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Room Details
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("amenities")}
              className={`pb-3 px-1 text-lg font-medium transition-all ${
                activeTab === "amenities"
                  ? "text-[#0A3D2E] border-b-2 border-[#0A3D2E]"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Amenities
            </button>
          </div>
          
          {/* Room Details Tab Content */}
          {activeTab === "details" && (
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={roomDetails.title}
                  onChange={(e) => handleRoomDetailsChange('title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A3D2E] focus:border-transparent"
                  placeholder="Enter room title"
                />
              </div>
              
              {/* Label */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Label
                </label>
                <input
                  type="text"
                  value={roomDetails.label}
                  onChange={(e) => handleRoomDetailsChange('label', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A3D2E] focus:border-transparent"
                  placeholder="Enter room label"
                />
              </div>
              
              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="text"
                  value={roomDetails.price}
                  onChange={(e) => handleRoomDetailsChange('price', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A3D2E] focus:border-transparent"
                  placeholder="Enter price (numbers only)"
                />
              </div>
              
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={roomDetails.description}
                  onChange={(e) => handleRoomDetailsChange('description', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A3D2E] focus:border-transparent"
                  placeholder="Enter room description"
                  rows={4}
                ></textarea>
              </div>
              
              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Images (Max 5)
                </label>
                
                {/* Image Preview Area */}
                {roomDetails.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {roomDetails.images.map((image) => (
                      <div key={image.id} className="relative">
                        <img 
                          src={image.preview} 
                          alt="Preview" 
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Upload Button */}
                {roomDetails.images.length < 5 && (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      className="hidden" 
                      id="image-upload" 
                      disabled={roomDetails.images.length >= 5}
                    />
                    <label 
                      htmlFor="image-upload" 
                      className="cursor-pointer text-gray-600 hover:text-gray-800"
                    >
                      <p>Click to upload images</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {roomDetails.images.length}/5 images uploaded
                      </p>
                    </label>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Amenities Tab Content */}
          {activeTab === "amenities" && (
            <div className="space-y-6">
              {/* Create Amenity Section */}
              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#0A3D2E] mb-4">
                  Create New Amenity
                </h3>
                
                <div className="space-y-4">
                  {/* Icon Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Icon
                    </label>
                    
                    {newAmenity.icon ? (
                      <div className="relative inline-block">
                        <img 
                          src={newAmenity.icon.preview} 
                          alt="Icon preview" 
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={removeIcon}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleIconUpload}
                          className="hidden" 
                          id="icon-upload"
                        />
                        <label 
                          htmlFor="icon-upload" 
                          className="cursor-pointer text-gray-600 hover:text-gray-800"
                        >
                          <p>Click to upload icon</p>
                          <p className="text-sm text-gray-500 mt-2">
                            PNG, JPG up to 5MB
                          </p>
                        </label>
                      </div>
                    )}
                  </div>
                  
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={newAmenity.title}
                      onChange={(e) => handleNewAmenityChange('title', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A3D2E] focus:border-transparent"
                      placeholder="Enter amenity title"
                    />
                  </div>
                  
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={newAmenity.description}
                      onChange={(e) => handleNewAmenityChange('description', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A3D2E] focus:border-transparent"
                      placeholder="Enter amenity description"
                      rows={3}
                    ></textarea>
                  </div>
                  
                  {/* Add Button */}
                  <button
                    type="button"
                    onClick={addAmenity}
                    className="flex items-center gap-2 bg-[#0A3D2E] text-white px-4 py-2 rounded-xl hover:bg-[#082f24] transition"
                  >
                    <Plus size={16} />
                    Add Amenity
                  </button>
                </div>
              </div>
              
              {/* Amenities List */}
              {amenitiesList.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-[#0A3D2E] mb-4">
                    Added Amenities
                  </h3>
                  
                  <div className="space-y-4">
                    {amenitiesList.map((amenity) => (
                      <div 
                        key={amenity.id} 
                        className="bg-white rounded-2xl shadow-[0_4px_18px_rgba(0,0,0,0.05)] p-6 border border-[#0A3D2E15] flex justify-between items-start"
                      >
                        <div className="flex gap-4">
                          {/* Icon */}
                          {amenity.icon ? (
                            <img 
                              src={amenity.icon.preview} 
                              alt="Amenity icon" 
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="bg-gray-100 rounded-lg w-12 h-12 flex items-center justify-center">
                              <span className="text-gray-400">Icon</span>
                            </div>
                          )}
                          
                          <div>
                            <h4 className="text-lg font-semibold text-[#0A3D2E]">
                              {amenity.title}
                            </h4>
                            <p className="text-gray-600 mt-1">
                              {amenity.description}
                            </p>
                          </div>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => removeAmenity(amenity.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
        message="Are you sure you want to save these changes to the room details?"
        confirmText="Save"
        cancelText="Cancel"
        type="info"
      />
    </div>
  );
};

export default RoomDetailsEditPage;