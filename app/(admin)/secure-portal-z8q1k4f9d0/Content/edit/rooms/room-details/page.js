"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import ConfirmationDialog from "../../../../components/common/ConfirmationDialog";
import { supabase } from '@/app/lib/supabaseClient';
import { updateImage, deleteImageFromStorage } from '@/app/lib/imageService';
import { roomApi } from '@/app/lib/apiClient';

// Debug the Supabase client import
console.log('Supabase client imported:', supabase);
if (supabase) {
  console.log('Supabase client has storage property:', !!supabase.storage);
}

const RoomDetailsEditPage = () => {
  const [activeTab, setActiveTab] = useState("details"); // Default to details tab
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' }); // Add toast state for notifications
  
  // Room Details State
  const [roomDetails, setRoomDetails] = useState({
    title: "",
    label: "",
    price: "",
    description: "",
    images: Array(5).fill(null) // Changed to fixed array of 5 images
  });
  
  const [previousImageUrls, setPreviousImageUrls] = useState(Array(5).fill(null));

  // Load existing data from API
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await roomApi.getAll();
        const { data } = response;

        if (data && data.length > 0) {
          const room = data[0];
          setRoomDetails({
            title: room.title || "",
            label: room.label || "",
            price: room.price || "",
            description: room.description || "",
            images: [
              room.image1_url ? { url: room.image1_url, isExisting: true } : null,
              room.image2_url ? { url: room.image2_url, isExisting: true } : null,
              room.image3_url ? { url: room.image3_url, isExisting: true } : null,
              room.image4_url ? { url: room.image4_url, isExisting: true } : null,
              room.image5_url ? { url: room.image5_url, isExisting: true } : null
            ]
          });
          
          // Store previous image URLs for cleanup
          setPreviousImageUrls([
            room.image1_url || null,
            room.image2_url || null,
            room.image3_url || null,
            room.image4_url || null,
            room.image5_url || null
          ]);
        }
      } catch (error) {
        console.error('Error fetching room data:', error);
        showToast('Error loading room data', 'error');
      }
    };

    fetchRoomData();
  }, []);

  // Handle image upload for room details (specific to each slot)
  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImages = [...roomDetails.images];
        newImages[index] = {
          file: file,
          preview: e.target.result
        };
        setRoomDetails(prev => ({
          ...prev,
          images: newImages
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (index) => {
    setImageToDelete(index);
    setShowDeleteDialog(true);
  };

  // Confirm image deletion - FIXED to use previousImageUrls and delete immediately
  const confirmDelete = async () => {
    if (imageToDelete !== null) {
      try {
        // CRITICAL FIX: Use previousImageUrls instead of current image URL
        const urlToDelete = previousImageUrls[imageToDelete];
        
        console.log('Attempting to delete image at index:', imageToDelete);
        console.log('URL to delete from previousImageUrls:', urlToDelete);
        
        // If image exists in storage, delete it immediately
        if (urlToDelete) {
          console.log('Deleting image from storage:', urlToDelete);
          
          const deleteResult = await deleteImageFromStorage(urlToDelete, supabase);
          console.log('Delete result:', deleteResult);
          
          if (!deleteResult.success) {
            console.error('Failed to delete image from storage:', deleteResult.error);
            showToast('Failed to delete image from storage: ' + deleteResult.error, 'error');
            // Continue anyway to update UI and DB
          }
          
          // Also update the database to remove the URL reference immediately
          try {
            // Get the current room data
            const response = await roomApi.getAll();
            const { data: existingData } = response;
            
            if (existingData && existingData.length > 0) {
              // Prepare update data - set the specific image field to null
              const updateData = {};
              const imageFieldNames = ['image1_url', 'image2_url', 'image3_url', 'image4_url', 'image5_url'];
              updateData[imageFieldNames[imageToDelete]] = null;
              
              // Update the database
              await roomApi.update(existingData[0].id, updateData);
              console.log('Database updated to remove image reference');
            }
          } catch (dbError) {
            console.error('Error updating database:', dbError);
            showToast('Image deleted from storage but failed to update database: ' + dbError.message, 'error');
            // Don't return here - we still want to update the UI even if DB update fails
          }
        } else {
          console.log('No URL found in previousImageUrls, skipping storage deletion');
        }

        // Remove from local state
        const newImages = [...roomDetails.images];
        newImages[imageToDelete] = null;
        setRoomDetails(prev => ({
          ...prev,
          images: newImages
        }));
        
        // Update previousImageUrls tracking - CRITICAL for future deletes
        const newPreviousUrls = [...previousImageUrls];
        newPreviousUrls[imageToDelete] = null;
        setPreviousImageUrls(newPreviousUrls);
        
        setShowDeleteDialog(false);
        setImageToDelete(null);
        showToast('Image deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting image:', error);
        showToast('Error deleting image: ' + error.message, 'error');
        setShowDeleteDialog(false);
        setImageToDelete(null);
      }
    }
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

  // Open save confirmation dialog
  const openSaveDialog = (e) => {
    e.preventDefault();
    setShowSaveDialog(true);
  };

  // Confirm save action - Enhanced version with proper image handling
  const confirmSave = async () => {
    try {
      // Handle image updates with automatic cleanup for each image slot
      const imageUrls = [];
      
      for (let i = 0; i < 5; i++) {
        const image = roomDetails.images[i];
        const previousUrl = previousImageUrls[i];
        
        // Only process image update if there's a new file for this specific slot
        if (image?.file) {
          // Use updateImage function which handles both deletion and upload
          const imageResult = await updateImage(
            image.file, 
            previousUrl, 
            'rooms',
            supabase
          );
          
          if (!imageResult.success) {
            console.error(`Error processing image for slot ${i}:`, imageResult.error);
            showToast(`Error processing image for slot ${i + 1}: ` + imageResult.error, 'error');
            // Don't continue with save if there's an error
            return;
          }
          
          // Set the new image URL
          imageUrls[i] = imageResult.newImageUrl;
        } else {
          // If no new file for this slot, keep the existing URL or null
          imageUrls[i] = image?.isExisting ? image.url : null;
        }
      }
      
      // Prepare data for database
      const roomData = {
        title: roomDetails.title,
        label: roomDetails.label,
        price: roomDetails.price,
        description: roomDetails.description,
        image1_url: imageUrls[0],
        image2_url: imageUrls[1],
        image3_url: imageUrls[2],
        image4_url: imageUrls[3],
        image5_url: imageUrls[4]
      };

      // Check if record exists
      const response = await roomApi.getAll();
      const { data: existingData } = response;

      if (existingData && existingData.length > 0) {
        // Update existing record
        await roomApi.update(existingData[0].id, roomData);
      } else {
        // Insert new record
        await roomApi.create(roomData);
      }

      // Update previous image URLs
      setPreviousImageUrls([...imageUrls]);
      
      setShowSaveDialog(false);
      showToast('Room details saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving data:', error);
      showToast('Error saving data', 'error');
    }
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
              
              {/* Image Upload Section - 5 Separate Uploaders */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Images (5 slots)
                </label>
                
                <div className="grid grid-cols-5 gap-4">
                  {roomDetails.images.map((image, index) => (
                    <div key={index} className="relative">
                      {image ? (
                        <div className="relative">
                          <img 
                            src={image.preview || image.url} 
                            alt={`Room image ${index + 1}`} 
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => openDeleteDialog(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center h-32 flex flex-col items-center justify-center">
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleImageUpload(e, index)}
                            className="hidden" 
                            id={`image-upload-${index}`}
                          />
                          <label 
                            htmlFor={`image-upload-${index}`} 
                            className="cursor-pointer text-gray-600 hover:text-gray-800 text-xs"
                          >
                            <Plus size={16} className="mx-auto" />
                            <span className="mt-1">Add Image</span>
                          </label>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Amenities Tab Content - Updated to link to the new page */}
          {activeTab === "amenities" && (
            <div className="space-y-6 text-center py-10">
              <h3 className="text-xl font-semibold text-[#0A3D2E]">
                Manage Room Amenities
              </h3>
              <p className="text-gray-600">
                Amenities are now managed on a separate page for better organization.
              </p>
              <a 
                href="/secure-portal-z8q1k4f9d0/Content/edit/rooms/amenities" 
                className="inline-block bg-[#0A3D2E] text-white px-6 py-2 rounded-xl hover:bg-[#082f24] transition"
              >
                Go to Amenities Page
              </a>
            </div>
          )}
          
          {/* Submit Button */}
          {activeTab === "details" && (
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#0A3D2E] text-white px-6 py-2 rounded-xl hover:bg-[#082f24] transition"
              >
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setImageToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Image"
        message="Are you sure you want to remove this image? This action cannot be undone."
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
        message="Are you sure you want to save these changes to the room details?"
        confirmText="Save"
        cancelText="Cancel"
        type="info"
      />
      
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300 ${
          toast.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default RoomDetailsEditPage;