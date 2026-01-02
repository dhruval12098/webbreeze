"use client";

import React, { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import ConfirmationDialog from "../../../../components/common/ConfirmationDialog";
import { supabase } from '@/app/lib/supabaseClient';
import { updateImage, deleteImageFromStorage } from '@/app/lib/imageService';
import { heroSectionApi } from '@/app/lib/apiClient';
import { useAuth } from "../../../../../../context/AuthContext";

const HeroSectionEditPage = () => {
  const { token } = useAuth();
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [existingImageData, setExistingImageData] = useState([]);
  const [previousImageUrls, setPreviousImageUrls] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load existing data from API
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await heroSectionApi.get(token);
        const { data } = response;

        if (data) {
          const heroData = data;
          setTitle(heroData.title || "");
          setSubtitle(heroData.subtitle || "");
          
          // Store previous image URLs for cleanup
          if (heroData.image_urls) {
            setPreviousImageUrls([...heroData.image_urls]);
            
            // Load existing images
            const imageObjects = heroData.image_urls.map((url, index) => ({
              id: `existing-${index}`,
              url: url,
              isExisting: true
            }));
            setExistingImageData(imageObjects);
          }
        }
      } catch (error) {
        console.error('Error fetching hero section data:', error);
        showToast('Error loading hero section data', 'error');
      }
    };

    fetchHeroData();
  }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];

    files.forEach(file => {
      if (images.length + newImages.length < 3) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newImages.push({
            id: Date.now() + Math.random(),
            file: file,
            preview: e.target.result
          });
          
          if (newImages.length === Math.min(files.length, 3 - (existingImageData.length + images.length))) {
            setImages(prev => [...prev, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const openDeleteDialog = (id) => {
    setImageToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      // Check if it's an existing image or newly uploaded
      if (imageToDelete && imageToDelete.startsWith && imageToDelete.startsWith('existing-')) {
        const imageToRemove = existingImageData.find(img => img.id === imageToDelete);
        if (imageToRemove) {
          // Delete from storage immediately using centralized service
          const result = await deleteImageFromStorage(imageToRemove.url, supabase);
          if (result && result.success) {
            console.log('Image deleted from storage successfully');
          } else {
            console.error('Failed to delete image from storage:', result ? result.error : 'Unknown error');
          }
          // Remove from previousImageUrls tracking
          setPreviousImageUrls(prev => prev.filter(url => url !== imageToRemove.url));
        }      setExistingImageData(existingImageData.filter(image => image.id !== imageToDelete));
      } else {
        setImages(images.filter(image => image.id !== imageToDelete));
      }
      setShowDeleteDialog(false);
      setImageToDelete(null);
      showToast('Image deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting image:', error);
      showToast('Error deleting image: ' + error.message, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const openSaveDialog = (e) => {
    e.preventDefault();
    setShowSaveDialog(true);
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  const confirmSave = async () => {
    if (isSaving) return; // Prevent multiple saves
    setIsSaving(true);
    try {
      // Upload new images to Supabase storage
      const imageUrls = [];
      
      // Add existing images that weren't deleted
      existingImageData.forEach(img => imageUrls.push(img.url));
      
      // Upload new images
      const newImageUrls = [];
      for (const image of images) {
        if (image.file) {
          // Check if the same image file is being uploaded again (duplicate check)
          const fileName = image.file.name;
          const isDuplicate = previousImageUrls.some(url => url && url.includes(fileName));
          if (isDuplicate) {
            showToast(`Image ${image.file.name} already saved. Using existing copy.`, 'info');
            continue;
          }
          
          // Use centralized upload service
          const uploadResult = await updateImage(image.file, null, 'hero', supabase);
          
          if (uploadResult.success) {
            imageUrls.push(uploadResult.newImageUrl);
            newImageUrls.push(uploadResult.newImageUrl);
          } else {
            console.error('Upload error:', uploadResult.error);
            showToast('Error uploading images', 'error');
            return;
          }
        }
      }

      // Save to database
      const heroData = {
        title,
        subtitle,
        image_urls: imageUrls
      };

      // Save using API client
      await heroSectionApi.update(heroData, token);

      // Clean up ALL old images from storage that are no longer used
      // This includes both previous images and any images that were replaced
      for (const url of previousImageUrls) {
        // Only delete if it's not in the current image set
        if (!imageUrls.includes(url)) {
          const result = await deleteImageFromStorage(url, supabase);
          if (result && result.success) {
            console.log('Old image deleted from storage successfully:', url);
          } else {
            console.error('Failed to delete old image from storage:', url, result ? result.error : 'Unknown error');
          }
        }
      }      // Update previousImageUrls to current ones for next update
      setPreviousImageUrls([...imageUrls]);
      
      // Clear the new images state after saving
      setImages([]);

      setShowSaveDialog(false);
      
      // Show success toast
      showToast('Hero section updated successfully!', 'success');
    } catch (error) {
      console.error('Save error:', error);
      showToast('Error saving changes', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const removeImage = async (id) => {
    if (id && id.startsWith && id.startsWith('existing-')) {
      const imageToRemove = existingImageData.find(img => img.id === id);
      if (imageToRemove) {
        // Delete from storage immediately using centralized service
        const result = await deleteImageFromStorage(imageToRemove.url, supabase);
        if (result && result.success) {
          console.log('Image deleted from storage successfully');
        } else {
          console.error('Failed to delete image from storage:', result ? result.error : 'Unknown error');
        }
        // Remove from previousImageUrls tracking
        setPreviousImageUrls(prev => prev.filter(url => url !== imageToRemove.url));
      }
      setExistingImageData(existingImageData.filter(image => image.id !== id));
    } else {
      setImages(images.filter(image => image.id !== id));
    }
  };  // Combine existing and new images for display
  const allImages = [...existingImageData, ...images];

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
          Edit Hero Section
        </h1>
      </div>
      
      <div className="bg-white rounded-2xl shadow-[0_4px_18px_rgba(0,0,0,0.05)] p-6 border border-[#0A3D2E15]">
        <form className="space-y-6" onSubmit={openSaveDialog}>
          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Images (Max 3)
            </label>
            
            {/* Image Preview Area */}
            {allImages.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mb-4">
                {allImages.map((image) => (
                  <div key={image.id} className="relative">
                    <img 
                      src={image.preview || image.url} 
                      alt="Preview" 
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => openDeleteDialog(image.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Upload Button */}
            {allImages.length < 3 && (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  className="hidden" 
                  id="image-upload" 
                  disabled={allImages.length >= 3}
                />
                <label 
                  htmlFor="image-upload" 
                  className="cursor-pointer text-gray-600 hover:text-gray-800"
                >
                  <p>Click to upload images</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {allImages.length}/3 images uploaded
                  </p>
                </label>
              </div>
            )}
          </div>
          
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A3D2E] focus:border-transparent"
              placeholder="Enter title"
            />
          </div>
          
          {/* Subtitle Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subtitle
            </label>
            <textarea
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A3D2E] focus:border-transparent"
              placeholder="Enter subtitle"
              rows={3}
            ></textarea>
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
        message="Are you sure you want to delete this image? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />

      {/* Save Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onConfirm={confirmSave}
        title="Save Changes"
        message="Are you sure you want to save these changes to the hero section?"
        confirmText="Save"
        cancelText="Cancel"
        type="info"
        isLoading={isSaving}
      />
    </div>
  );
};

export default HeroSectionEditPage;