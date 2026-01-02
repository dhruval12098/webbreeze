"use client";

import React, { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import ConfirmationDialog from "../../../../components/common/ConfirmationDialog";
import { updateImage } from '@/app/lib/imageService';
import { ourStoryApi } from '@/app/lib/apiClient';
import { supabase } from '@/app/lib/supabaseClient';
import { useAuth } from "../../../../../../context/AuthContext";

const OurStoryEditPage = () => {
  const { token } = useAuth();
  const [storyData, setStoryData] = useState({
    title: "",
    description: "",
    image_url: null
  });
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [previousImageUrl, setPreviousImageUrl] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [isSaving, setIsSaving] = useState(false);

  // Load existing data from API
  useEffect(() => {
    const fetchStoryData = async () => {
      try {
        const response = await ourStoryApi.get(token);
        const { data } = response;

        if (data) {
          const story = data;
          setStoryData({
            title: story.title || "",
            description: story.description || "",
            image_url: story.image_url || null
          });
          setPreviousImageUrl(story.image_url || null);
        }
      } catch (error) {
        console.error('Error fetching our story data:', error);
        showToast('Error loading our story data', 'error');
      }
    };

    fetchStoryData();
  }, []);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Store the file and preview in state
        setStoryData(prev => ({
          ...prev,
          newImageFile: file,
          imagePreview: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Open delete confirmation dialog
  const openDeleteDialog = () => {
    setShowDeleteDialog(true);
  };

  // Confirm image deletion
  const confirmDelete = () => {
    setStoryData(prev => ({
      ...prev,
      image_url: null,
      imagePreview: null,
      newImageFile: null
    }));
    setShowDeleteDialog(false);
    showToast('Image removed successfully!', 'success');
  };

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
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
  const confirmSave = async () => {
    if (isSaving) return; // Prevent multiple saves
    setIsSaving(true);
    try {
      // Handle image update with automatic cleanup
      let imageUrl = storyData.image_url;
      
      // If we have a new image file, upload it
      if (storyData.newImageFile) {
        // Check if the same image file is being uploaded again (duplicate check)
        if (previousImageUrl && storyData.newImageFile.name === previousImageUrl.split('/').pop()) {
          showToast(`Image ${storyData.newImageFile.name} already saved. Using existing copy.`, 'info');
          imageUrl = previousImageUrl;
        } else {
          const imageResult = await updateImage(
            storyData.newImageFile, 
            previousImageUrl, 
            'about/our-story',
            supabase
          );
          
          if (!imageResult.success) {
            showToast('Error uploading image: ' + imageResult.error, 'error');
            return;
          }
          
          imageUrl = imageResult.newImageUrl;
        }
      } 
      // If we're removing an image (no new image and no existing image)
      else if (!storyData.image_url && previousImageUrl) {
        // Delete the previous image
        await updateImage(null, previousImageUrl, 'about/our-story', supabase);
        imageUrl = null;
      }

      // Prepare data for database (exclude temporary fields)
      const storySectionData = {
        title: storyData.title,
        description: storyData.description,
        image_url: imageUrl
      };

      // Save using API client
      const response = await ourStoryApi.update(storySectionData, token);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to save data');
      }

      // Update previous image URL
      setPreviousImageUrl(imageUrl);
      
      // Reset new image file state
      setStoryData(prev => ({
        ...prev,
        newImageFile: null
      }));
      
      setShowSaveDialog(false);
      showToast('Changes saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving data:', error);
      showToast('Error saving data: ' + error.message, 'error');
    } finally {
      setIsSaving(false);
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
          Edit Our Story
        </h1>
      </div>
      
      <div className="bg-white rounded-2xl shadow-[0_4px_18px_rgba(0,0,0,0.05)] p-6 border border-[#0A3D2E15]">
        <form className="space-y-6" onSubmit={openSaveDialog}>
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={storyData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A3D2E] focus:border-transparent"
              placeholder="Enter title"
            />
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={storyData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A3D2E] focus:border-transparent"
              placeholder="Enter description"
            />
          </div>
          
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Story Image
            </label>
            
            {(storyData.imagePreview || storyData.image_url) ? (
              <div className="relative inline-block">
                <img 
                  src={storyData.imagePreview || storyData.image_url} 
                  alt="Story preview" 
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={openDeleteDialog}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <Trash2 size={16} />
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

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
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
        message="Are you sure you want to save these changes to the story section?"
        confirmText={isSaving ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </span>
        ) : "Save"}
        cancelText="Cancel"
        type="info"
        isLoading={isSaving}
      />
    </div>
  );
};

export default OurStoryEditPage;