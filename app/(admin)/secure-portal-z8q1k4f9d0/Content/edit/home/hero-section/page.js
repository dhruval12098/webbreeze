"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import ConfirmationDialog from "../../../../components/common/ConfirmationDialog";

const HeroSectionEditPage = () => {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

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
          
          if (newImages.length === Math.min(files.length, 3 - images.length)) {
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

  const confirmDelete = () => {
    setImages(images.filter(image => image.id !== imageToDelete));
    setShowDeleteDialog(false);
    setImageToDelete(null);
  };

  const openSaveDialog = (e) => {
    e.preventDefault();
    setShowSaveDialog(true);
  };

  const confirmSave = () => {
    // Handle form submission
    console.log({ title, subtitle, images });
    setShowSaveDialog(false);
    // Here you would typically send the data to your backend
  };

  const removeImage = (id) => {
    setImages(images.filter(image => image.id !== id));
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
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mb-4">
                {images.map((image) => (
                  <div key={image.id} className="relative">
                    <img 
                      src={image.preview} 
                      alt="Preview" 
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => openDeleteDialog(image.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Upload Button */}
            {images.length < 3 && (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  className="hidden" 
                  id="image-upload" 
                  disabled={images.length >= 3}
                />
                <label 
                  htmlFor="image-upload" 
                  className="cursor-pointer text-gray-600 hover:text-gray-800"
                >
                  <p>Click to upload images</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {images.length}/3 images uploaded
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
        message="Are you sure you want to save these changes to the hero section?"
        confirmText="Save"
        cancelText="Cancel"
        type="info"
      />
    </div>
  );
};

export default HeroSectionEditPage;