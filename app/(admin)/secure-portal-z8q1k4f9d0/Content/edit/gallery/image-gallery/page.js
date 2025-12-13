"use client";

import React, { useState } from "react";
import { X, Trash2 } from "lucide-react";
import ConfirmationDialog from "../../../../components/common/ConfirmationDialog";

const ImageGalleryEditPage = () => {
  const [activeTab, setActiveTab] = useState("guest"); // Default to guest gallery
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  
  // Gallery State
  const [galleries, setGalleries] = useState({
    guest: [],
    homestay: []
  });

  // Handle image upload for a specific gallery
  const handleImageUpload = (galleryType, e) => {
    const files = Array.from(e.target.files);
    const newImages = [];

    // Check if we can add more images (max 30 for homestay, max 20 for guest)
    const currentImages = galleries[galleryType];
    const maxImages = galleryType === "homestay" ? 30 : 20;
    if (currentImages.length >= maxImages) {
      alert(`Maximum of ${maxImages} images allowed for ${galleryType} gallery`);
      return;
    }

    files.forEach(file => {
      // Check file size (maximum 2MB)
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > 2) {
        alert(`File ${file.name} exceeds maximum size of 2MB`);
        return;
      }

      // Check if we can still add more images
      if (currentImages.length + newImages.length < maxImages) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newImages.push({
            id: Date.now() + Math.random(),
            file: file,
            preview: e.target.result,
            name: file.name,
            size: `${fileSizeInMB.toFixed(2)} MB`
          });
          
          // Add images to state when we've processed all files
          if (newImages.length === Math.min(files.length, maxImages - currentImages.length)) {
            setGalleries(prev => ({
              ...prev,
              [galleryType]: [...prev[galleryType], ...newImages]
            }));
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (galleryType, imageId) => {
    setImageToDelete({ galleryType, imageId });
    setShowDeleteDialog(true);
  };

  // Confirm delete action
  const confirmDelete = () => {
    if (imageToDelete) {
      setGalleries(prev => ({
        ...prev,
        [imageToDelete.galleryType]: prev[imageToDelete.galleryType].filter(
          image => image.id !== imageToDelete.imageId
        )
      }));
      setShowDeleteDialog(false);
      setImageToDelete(null);
    }
  };

  // Remove image from a specific gallery
  const removeImage = (galleryType, id) => {
    setGalleries(prev => ({
      ...prev,
      [galleryType]: prev[galleryType].filter(image => image.id !== id)
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
    console.log({ galleries });
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
          Edit Image Gallery
        </h1>
      </div>
      
      <div className="bg-white rounded-2xl shadow-[0_4px_18px_rgba(0,0,0,0.05)] p-6 border border-[#0A3D2E15]">
        <form className="space-y-6" onSubmit={openSaveDialog}>
          {/* Tabs for switching between Guest Gallery and Homestay Gallery */}
          <div className="flex gap-4 border-b border-gray-200 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab("guest")}
              className={`pb-3 px-1 text-lg font-medium transition-all ${
                activeTab === "guest"
                  ? "text-[#0A3D2E] border-b-2 border-[#0A3D2E]"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Guest Gallery
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("homestay")}
              className={`pb-3 px-1 text-lg font-medium transition-all ${
                activeTab === "homestay"
                  ? "text-[#0A3D2E] border-b-2 border-[#0A3D2E]"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Homestay Gallery
            </button>
          </div>
          
          {/* Guest Gallery Tab Content */}
          {activeTab === "guest" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Images (Max 20 images, up to 2 MB each)
                </label>
                
                {/* Image Preview Area */}
                {galleries.guest.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-4">
                    {galleries.guest.map((image) => (
                      <div key={image.id} className="relative group">
                        <img 
                          src={image.preview} 
                          alt="Preview" 
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                          {image.size}
                        </div>
                        <button
                          type="button"
                          onClick={() => openDeleteDialog("guest", image.id)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Upload Button */}
                {galleries.guest.length < 20 && (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      onChange={(e) => handleImageUpload("guest", e)}
                      className="hidden" 
                      id="guest-image-upload" 
                      disabled={galleries.guest.length >= 20}
                    />
                    <label 
                      htmlFor="guest-image-upload" 
                      className="cursor-pointer text-gray-600 hover:text-gray-800"
                    >
                      <p>Click to upload images</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {galleries.guest.length}/20 images uploaded
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG, GIF up to 2MB
                      </p>
                    </label>
                  </div>
                )}
                
                {galleries.guest.length >= 20 && (
                  <p className="text-sm text-gray-500 text-center">
                    Maximum of 20 images reached
                  </p>
                )}
              </div>
            </div>
          )}
          
          {/* Homestay Gallery Tab Content */}
          {activeTab === "homestay" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Images (Max 30 images, up to 2MB each)
                </label>
                
                {/* Image Preview Area */}
                {galleries.homestay.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-4">
                    {galleries.homestay.map((image) => (
                      <div key={image.id} className="relative group">
                        <img 
                          src={image.preview} 
                          alt="Preview" 
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                          {image.size}
                        </div>
                        <button
                          type="button"
                          onClick={() => openDeleteDialog("homestay", image.id)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Upload Button */}
                {galleries.homestay.length < 30 && (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      onChange={(e) => handleImageUpload("homestay", e)}
                      className="hidden" 
                      id="homestay-image-upload" 
                      disabled={galleries.homestay.length >= 30}
                    />
                    <label 
                      htmlFor="homestay-image-upload" 
                      className="cursor-pointer text-gray-600 hover:text-gray-800"
                    >
                      <p>Click to upload images</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {galleries.homestay.length}/30 images uploaded
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG, GIF up to 2MB
                      </p>
                    </label>
                  </div>
                )}
                
                {galleries.homestay.length >= 30 && (
                  <p className="text-sm text-gray-500 text-center">
                    Maximum of 30 images reached
                  </p>
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

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Image"
        message="Are you sure you want to delete this image? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Save Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onConfirm={confirmSave}
        title="Save Changes"
        message="Are you sure you want to save these changes to the image galleries?"
        confirmText="Save"
        cancelText="Cancel"
        type="info"
      />
    </div>
  );
};

export default ImageGalleryEditPage;