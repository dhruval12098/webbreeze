"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import ConfirmationDialog from "../../../../components/common/ConfirmationDialog";
import { supabase } from '@/app/lib/supabaseClient';
import { uploadImageToStorage, deleteImageFromStorage } from '@/app/lib/imageService';

const RoomAmenitiesEditPage = () => {
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [newAmenity, setNewAmenity] = useState({
    icon: null,
    title: "",
    description: ""
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [amenityToDelete, setAmenityToDelete] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load existing amenities from API
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        console.log('Fetching amenities from API...');
        const response = await fetch('/api/amenities');
        console.log('API response status:', response.status);
        const result = await response.json();
        console.log('Amenities API response:', result);
        
        const { data, success } = result;
        
        if (success && data) {
          console.log('Processing amenities data:', data);
          // Transform data to match component state structure
          const transformedAmenities = data.map(amenity => ({
            id: amenity.id,
            icon: amenity.icon_url ? { url: amenity.icon_url } : null,
            title: amenity.title,
            description: amenity.description
          }));
          console.log('Transformed amenities:', transformedAmenities);
          setAmenitiesList(transformedAmenities);
        } else {
          // Handle case where there might be an error in the response
          console.warn('Failed to fetch amenities or no amenities found');
          setAmenitiesList([]);
        }
      } catch (error) {
        console.error('Error fetching amenities:', error);
        showToast('Error loading amenities', 'error');
        // Set to empty array on error to ensure component renders correctly
        setAmenitiesList([]);
      }
    };

    fetchAmenities();
  }, []);

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
      // Check file size (maximum 2MB)
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > 2) {
        alert(`File exceeds maximum size of 2MB`);
        return;
      }
      
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
  const addAmenity = async () => {
    console.log('Adding amenity:', newAmenity);
    
    // Check if required fields are filled
    if (!newAmenity.title || !newAmenity.description) {
      console.log('Validation failed: title or description missing');
      showToast('Please fill in both title and description', 'error');
      return;
    }
    
    try {
      let iconUrl = null;
      
      // Upload icon if present
      if (newAmenity.icon && newAmenity.icon.file) {
        console.log('Uploading icon...');
        const uploadResult = await uploadImageToStorage(
          newAmenity.icon.file, 
          'amenities', 
          supabase
        );
        console.log('Upload result:', uploadResult);
        
        if (uploadResult.success) {
          iconUrl = uploadResult.publicUrl;
          console.log('Icon uploaded successfully:', iconUrl);
        } else {
          throw new Error(uploadResult.error);
        }
      }
      
      // Save to database
      const amenityData = {
        icon_url: iconUrl,
        title: newAmenity.title,
        description: newAmenity.description
      };
      
      console.log('Sending amenity data to API:', amenityData);
      
      const response = await fetch('/api/amenities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(amenityData)
      });
      
      console.log('API response status:', response.status);
      
      const result = await response.json();
      console.log('API response:', result);
      
      if (result.success) {
        // The Supabase insert operation returns the inserted data
        // We need to get the ID from the returned data
        let newAmenityId;
        if (result.data && result.data.length > 0) {
          newAmenityId = result.data[0].id;
          console.log('New amenity ID:', newAmenityId);
        } else {
          // If no data returned, we need to fetch the newly created amenity
          // This is a fallback approach
          console.log('No data returned from API, fetching all amenities...');
          const fetchResponse = await fetch('/api/amenities');
          const fetchResult = await fetchResponse.json();
          if (fetchResult.success && fetchResult.data && fetchResult.data.length > 0) {
            // Get the last added amenity (assuming it's the one we just added)
            const lastAmenity = fetchResult.data[fetchResult.data.length - 1];
            newAmenityId = lastAmenity.id;
            console.log('Found new amenity ID from list:', newAmenityId);
          } else {
            // Fallback ID generation
            newAmenityId = Date.now();
            console.log('Using fallback ID:', newAmenityId);
          }
        }
        
        setAmenitiesList(prev => [
          ...prev,
          {
            id: newAmenityId,
            icon: iconUrl ? { url: iconUrl } : null,
            title: newAmenity.title,
            description: newAmenity.description
          }
        ]);
        
        // Reset the new amenity form
        setNewAmenity({
          icon: null,
          title: "",
          description: ""
        });
        
        showToast('Amenity added successfully!', 'success');
      } else {
        throw new Error(result.error || 'Failed to save amenity');
      }
    } catch (error) {
      console.error('Error adding amenity:', error);
      showToast('Error adding amenity: ' + error.message, 'error');
    }
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (amenity) => {
    setAmenityToDelete(amenity);
    setShowDeleteDialog(true);
  };

  // Confirm amenity deletion
  const confirmDelete = async () => {
    if (amenityToDelete) {
      setIsDeleting(true);
      try {
        // Delete icon from storage if present
        if (amenityToDelete.icon && amenityToDelete.icon.url) {
          await deleteImageFromStorage(amenityToDelete.icon.url, supabase);
        }
        
        // Delete from database
        const response = await fetch(`/api/amenities/${amenityToDelete.id}`, {
          method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
          setAmenitiesList(prev => prev.filter(amenity => amenity.id !== amenityToDelete.id));
          setShowDeleteDialog(false);
          setAmenityToDelete(null);
          showToast('Amenity deleted successfully!', 'success');
        } else {
          throw new Error(result.error || 'Failed to delete amenity');
        }
      } catch (error) {
        console.error('Error deleting amenity:', error);
        showToast('Error deleting amenity: ' + error.message, 'error');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Open save confirmation dialog
  const openSaveDialog = (e) => {
    e.preventDefault();
    setShowSaveDialog(true);
  };

  // Confirm save action - now actually saves all amenities
  const confirmSave = async () => {
    setIsSaving(true);
    setShowSaveDialog(false);
    
    try {
      // In this implementation, amenities are saved individually when added
      // So "Save Changes" just confirms all changes are saved and refreshes the list
      const response = await fetch('/api/amenities');
      const { data, success } = await response.json();
      
      if (success && data) {
        // Transform data to match component state structure
        const transformedAmenities = data.map(amenity => ({
          id: amenity.id,
          icon: amenity.icon_url ? { url: amenity.icon_url } : null,
          title: amenity.title,
          description: amenity.description
        }));
        setAmenitiesList(transformedAmenities);
        showToast('All changes saved successfully!', 'success');
      } else {
        throw new Error('Failed to refresh amenities');
      }
    } catch (error) {
      console.error('Error refreshing amenities:', error);
      showToast('Error saving changes: ' + error.message, 'error');
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
          Edit Room Amenities
        </h1>
      </div>
      
      <div className="bg-white rounded-2xl shadow-[0_4px_18px_rgba(0,0,0,0.05)] p-6 border border-[#0A3D2E15]">
        <form className="space-y-6" onSubmit={openSaveDialog}>
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
                        PNG, JPG up to 2MB
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
          <div>
            <h3 className="text-lg font-semibold text-[#0A3D2E] mb-4">
              Added Amenities
            </h3>
            
            {amenitiesList.length > 0 ? (
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
                          src={amenity.icon.url || amenity.icon.preview} 
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
                      onClick={() => openDeleteDialog(amenity)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 italic py-4">
                No amenities added yet. Create new amenities above.
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
      
      {/* Save Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onConfirm={confirmSave}
        title="Save Changes"
        message="Are you sure you want to save these changes to the amenities?"
        confirmText={isSaving ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </span>
        ) : "Save Changes"}
        cancelText="Cancel"
        type="info"
      />
      
      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Amenity"
        message="Are you sure you want to delete this amenity? This action cannot be undone."
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

export default RoomAmenitiesEditPage;