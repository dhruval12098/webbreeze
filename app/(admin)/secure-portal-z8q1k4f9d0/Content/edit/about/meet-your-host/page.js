"use client";

import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import ConfirmationDialog from "../../../../components/common/ConfirmationDialog";
import { updateImage } from '@/app/lib/imageService';
import { meetHostApi } from '@/app/lib/apiClient';
import { supabase } from '@/app/lib/supabaseClient';

const MeetYourHostEditPage = () => {
  const [hostData, setHostData] = useState({
    title: "",
    description: "",
    image: null
  });
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [previousImageUrl, setPreviousImageUrl] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Load existing data from API
  useEffect(() => {
    const fetchHostData = async () => {
      try {
        const response = await meetHostApi.get();
        const { data } = response;

        if (data) {
          const host = data;
          setHostData({
            title: host.title || "",
            description: host.description || "",
            image: host.image_url ? { url: host.image_url, isExisting: true } : null
          });
          setPreviousImageUrl(host.image_url || null);
        }
      } catch (error) {
        console.error('Error fetching meet host data:', error);
        showToast('Error loading meet host data', 'error');
      }
    };

    fetchHostData();
  }, []);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setHostData(prev => ({
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

  // Open delete confirmation dialog
  const openDeleteDialog = () => {
    setShowDeleteDialog(true);
  };

  // Confirm image deletion
  const confirmDelete = () => {
    setHostData(prev => ({
      ...prev,
      image: null
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
    setHostData(prev => ({
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
    try {
      // Handle image update with automatic cleanup
      const imageResult = await updateImage(
        hostData.image?.file || null, 
        previousImageUrl, 
        'about/meet-hosts',
        supabase
      );
      
      if (!imageResult.success && hostData.image?.file) {
        showToast('Error uploading image: ' + imageResult.error, 'error');
        return;
      }

      // Prepare data for database
      const hostSectionData = {
        title: hostData.title,
        description: hostData.description,
        image_url: imageResult.newImageUrl || (hostData.image?.isExisting ? hostData.image.url : null) || null
      };

      // Save using API client
      await meetHostApi.update(hostSectionData);

      // Update previous image URL
      setPreviousImageUrl(hostSectionData.image_url);
      
      setShowSaveDialog(false);
      showToast('Changes saved successfully!', 'success');
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
          Edit Meet Your Host
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
              value={hostData.title}
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
              value={hostData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A3D2E] focus:border-transparent"
              placeholder="Enter description"
            />
          </div>
          
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Image
            </label>
            
            {hostData.image ? (
              <div className="relative inline-block">
                <img 
                  src={hostData.image.preview || hostData.image.url} 
                  alt="Profile preview" 
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
                  id="profile-upload"
                />
                <label 
                  htmlFor="profile-upload" 
                  className="cursor-pointer text-gray-600 hover:text-gray-800"
                >
                  <p>Click to upload profile image</p>
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
        message="Are you sure you want to save these changes to the host information?"
        confirmText="Save"
        cancelText="Cancel"
        type="info"
      />
    </div>
  );
};

export default MeetYourHostEditPage;