"use client";

import React, { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import ConfirmationDialog from "../../../../components/common/ConfirmationDialog";
import { useAuth } from "../../../../../../context/AuthContext";

const ImageGalleryEditPage = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState("guest"); // Default to guest gallery
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  
  // Gallery State
  const [galleries, setGalleries] = useState({
    guest: [],
    homestay: []
  });

  // Load existing images when component mounts
  useEffect(() => {
    loadGalleryImages();
  }, []);

  // Load images from API
  const loadGalleryImages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/gallery-images');
      const result = await response.json();
      
      if (result.success) {
        // Separate images by gallery type
        const guestImages = result.images.filter(img => img.gallery_type === 'guest');
        const homestayImages = result.images.filter(img => img.gallery_type === 'homestay');
        
        setGalleries({
          guest: guestImages.map(img => ({
            id: img.id,
            url: img.image_url,
            name: img.image_url.split('/').pop(),
            size: `${(img.file_size_kb / 1024).toFixed(2)} MB`
          })),
          homestay: homestayImages.map(img => ({
            id: img.id,
            url: img.image_url,
            name: img.image_url.split('/').pop(),
            size: `${(img.file_size_kb / 1024).toFixed(2)} MB`
          }))
        });
      } else {
        setError(result.error || 'Failed to load images');
      }
    } catch (err) {
      setError('Failed to load images: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image upload for a specific gallery
  const handleImageUpload = async (galleryType, e) => {
    const files = Array.from(e.target.files);
    
    // Check if we can add more images (max 30 for homestay, max 20 for guest)
    const currentImages = galleries[galleryType];
    const maxImages = galleryType === "homestay" ? 30 : 20;
    if (currentImages.length >= maxImages) {
      alert(`Maximum of ${maxImages} images allowed for ${galleryType} gallery`);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Check file size (maximum 1MB = 1024KB)
        const fileSizeInKB = file.size / 1024;
        if (fileSizeInKB > 1024) {
          alert(`File ${file.name} exceeds maximum size of 1MB`);
          continue;
        }

        // Check if we can still add more images
        if (currentImages.length + i < maxImages) {
          // Create FormData for upload
          const formData = new FormData();
          formData.append('image', file);
          formData.append('galleryType', galleryType);
          formData.append('sortOrder', currentImages.length + i);

          // Upload to API
          const response = await fetch('/api/gallery-images', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData
          });

          const result = await response.json();
          
          if (result.success) {
            // Add to state
            setGalleries(prev => ({
              ...prev,
              [galleryType]: [
                ...prev[galleryType],
                {
                  id: result.image.id,
                  url: result.image.image_url,
                  name: file.name,
                  size: `${(fileSizeInKB / 1024).toFixed(2)} MB`
                }
              ]
            }));
          } else {
            setError(result.error || 'Failed to upload image');
          }
        }
      }
    } catch (err) {
      setError('Upload failed: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (galleryType, imageId) => {
    setImageToDelete({ galleryType, imageId });
    setShowDeleteDialog(true);
  };

  // Confirm delete action
  const confirmDelete = async () => {
    if (imageToDelete) {
      setIsDeleting(true);
      
      try {
        // Find the image to get its URL
        const image = galleries[imageToDelete.galleryType].find(
          img => img.id === imageToDelete.imageId
        );
        
        if (image) {
          // Delete from API
          const response = await fetch('/api/gallery-images', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              imageUrl: image.url
            })
          });
          
          const result = await response.json();
          
          if (result.success) {
            // Remove from state
            setGalleries(prev => ({
              ...prev,
              [imageToDelete.galleryType]: prev[imageToDelete.galleryType].filter(
                img => img.id !== imageToDelete.imageId
              )
            }));
          } else {
            setError(result.error || 'Failed to delete image');
          }
        }
      } catch (err) {
        setError('Delete failed: ' + err.message);
      } finally {
        setIsDeleting(false);
        setShowDeleteDialog(false);
        setImageToDelete(null);
      }
    }
  };

  // Open save confirmation dialog
  const openSaveDialog = (e) => {
    e.preventDefault();
    setShowSaveDialog(true);
  };

  // Confirm save action
  const confirmSave = () => {
    // Reload images to ensure consistency
    loadGalleryImages();
    setShowSaveDialog(false);
  };

  return (
    <div className="w-full min-h-screen bg-white px-6 py-8">
      {(isLoading || error) && (
        <div className="mb-4 p-4 rounded-lg bg-blue-50 text-blue-800">
          {isLoading && "Processing... Please wait."}
          {error && `Error: ${error}`}
        </div>
      )}
      
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
                  Upload Images (Max 20 images, up to 1 MB each)
                </label>
                
                {/* Image Preview Area */}
                {galleries.guest.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-4">
                    {galleries.guest.map((image) => (
                      <div key={image.id} className="relative group">
                        <img 
                          src={image.url} 
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
                      disabled={galleries.guest.length >= 20 || isLoading}
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
                        PNG, JPG, GIF up to 1MB
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
                  Upload Images (Max 30 images, up to 1MB each)
                </label>
                
                {/* Image Preview Area */}
                {galleries.homestay.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-4">
                    {galleries.homestay.map((image) => (
                      <div key={image.id} className="relative group">
                        <img 
                          src={image.url} 
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
                      disabled={galleries.homestay.length >= 30 || isLoading}
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
                        PNG, JPG, GIF up to 1MB
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
              disabled={isLoading}
            >
              Refresh Gallery
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
        confirmText={isDeleting ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Deleting...
          </span>
        ) : "Delete"}
        cancelText="Cancel"
        type="danger"
      />

      {/* Save Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onConfirm={confirmSave}
        title="Refresh Gallery"
        message="Gallery refreshed successfully!"
        confirmText="OK"
        cancelText=""
        type="info"
      />
    </div>
  );
};

export default ImageGalleryEditPage;