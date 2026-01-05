"use client";

import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import ConfirmationDialog from "../../../../components/common/ConfirmationDialog";
import { updateImage } from '@/app/lib/imageService';
import { meetHostApi } from '@/app/lib/apiClient';
import { supabase } from '@/app/lib/supabaseClient';
import { useAuth } from "../../../../../../context/AuthContext";

const MeetYourHostEditPage = () => {
  const { token } = useAuth();
  const [hostData, setHostData] = useState({
    title: "",
    description: "",
    image: null
  });
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [previousImageUrl, setPreviousImageUrl] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [isSaving, setIsSaving] = useState(false);

  // Load existing data from API
  useEffect(() => {
    const fetchHostData = async () => {
      try {
        const response = await meetHostApi.get(token);
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
    if (isSaving) return; // Prevent multiple saves
    setIsSaving(true);
    try {
      // Handle image update with automatic cleanup
      let imageUrl = null;
      if (hostData.image?.file) {
        // Check if the same image file is being uploaded again (duplicate check)
        if (previousImageUrl && hostData.image.file.name === previousImageUrl.split('/').pop()) {
          showToast(`Image ${hostData.image.file.name} already saved. Using existing copy.`, 'info');
          imageUrl = previousImageUrl;
        } else {
          const imageResult = await updateImage(
            hostData.image.file, 
            previousImageUrl, 
            'about/meet-hosts',
            supabase
          );
          
          if (!imageResult.success) {
            showToast('Error uploading image: ' + imageResult.error, 'error');
            return;
          }
          
          imageUrl = imageResult.newImageUrl;
        }
      } else {
        imageUrl = hostData.image?.isExisting ? hostData.image.url : null;
      }

      // Prepare data for database
      const hostSectionData = {
        title: hostData.title,
        description: hostData.description,
        image_url: imageUrl
      };

      // Save using API client
      await meetHostApi.update(hostSectionData, token);

      // Update previous image URL
      setPreviousImageUrl(hostSectionData.image_url);
      
      setShowSaveDialog(false);
      showToast('Changes saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving data:', error);
      showToast('Error saving data', 'error');
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
            <div className="mb-2 text-sm text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-200">
              <strong>Note:</strong> After deleting images, please save changes to prevent accumulation in data storage.
            </div>
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

export default MeetYourHostEditPage;