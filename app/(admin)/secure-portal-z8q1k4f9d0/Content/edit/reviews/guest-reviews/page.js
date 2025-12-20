"use client";

import React, { useState, useEffect } from "react";
import { X, Trash2, Plus } from "lucide-react";
import ConfirmationDialog from "../../../../components/common/ConfirmationDialog";
import { guestReviewsApi } from "@/app/lib/apiClient";
import { uploadImageToStorage } from "@/app/lib/imageService";
import { supabase } from "@/app/lib/supabaseClient";
import { toast } from "react-toastify";

const GuestReviewsEditPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [newReview, setNewReview] = useState({
    reviewerName: "",
    designation: "",
    reviewText: "",
    rating: "",
    image: null
  });

  // Fetch all reviews from the database
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await guestReviewsApi.getAll();
        
        if (response.success) {
          // Map the API response to match the component's expected structure
          const formattedReviews = response.data.map(review => ({
            id: review.id,
            reviewerName: review.reviewer_name,
            designation: review.designation,
            reviewText: review.review_text,
            rating: review.rating,
            date: review.date,
            image: review.image_url
          }));
          setReviews(formattedReviews);
        } else {
          setError(response.error || "Failed to fetch reviews");
          toast.error("Failed to load reviews: " + (response.error || "Unknown error"));
        }
      } catch (err) {
        setError(err.message || "An error occurred while fetching reviews");
        toast.error("Error loading reviews: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Handle input changes for new review
  const handleInputChange = (field, value) => {
    setNewReview(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle image upload for new review
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (maximum 5MB)
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > 5) {
        toast.error(`File exceeds maximum size of 5MB`);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewReview(prev => ({
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

  // Remove image from new review
  const removeImage = () => {
    setNewReview(prev => ({
      ...prev,
      image: null
    }));
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (reviewId) => {
    setReviewToDelete(reviewId);
    setShowDeleteDialog(true);
  };

  // Confirm delete action
  const confirmDelete = async () => {
    if (reviewToDelete) {
      try {
        const response = await guestReviewsApi.delete(reviewToDelete);
        
        if (response.success) {
          setReviews(prev => prev.filter(review => review.id !== reviewToDelete));
          toast.success("Review deleted successfully!");
        } else {
          toast.error("Failed to delete review: " + (response.error || "Unknown error"));
        }
      } catch (error) {
        toast.error("Error deleting review: " + error.message);
      } finally {
        setShowDeleteDialog(false);
        setReviewToDelete(null);
      }
    }
  };

  // Open create review dialog
  const openCreateDialog = () => {
    setNewReview({
      reviewerName: "",
      designation: "",
      reviewText: "",
      rating: "",
      image: null
    });
    setShowCreateDialog(true);
  };

  // Handle create review
  const handleCreateReview = async () => {
    if (!newReview.reviewerName || !newReview.designation || !newReview.reviewText || !newReview.rating) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      let imageUrl = null;
      
      // Upload image if provided
      if (newReview.image && newReview.image.file) {
        const uploadResult = await uploadImageToStorage(newReview.image.file, 'guest-reviews', supabase);
        if (uploadResult.success) {
          imageUrl = uploadResult.publicUrl;
        } else {
          throw new Error(uploadResult.error || "Failed to upload image");
        }
      }

      // Prepare review data
      const reviewData = {
        reviewer_name: newReview.reviewerName,
        designation: newReview.designation,
        review_text: newReview.reviewText,
        rating: parseInt(newReview.rating),
        date: new Date().toISOString().split('T')[0],
        image_url: imageUrl
      };

      const response = await guestReviewsApi.create(reviewData);
      
      if (response.success && response.data && response.data.length > 0) {
        // Format the new review to match the component's structure
        const newReviewFormatted = {
          id: response.data[0].id,
          reviewerName: response.data[0].reviewer_name,
          designation: response.data[0].designation,
          reviewText: response.data[0].review_text,
          rating: response.data[0].rating,
          date: response.data[0].date,
          image: response.data[0].image_url
        };
        
        setReviews(prev => [...prev, newReviewFormatted]);
        toast.success("Review added successfully!");
        setShowCreateDialog(false);
        setNewReview({
          reviewerName: "",
          designation: "",
          reviewText: "",
          rating: "",
          image: null
        });
      } else {
        throw new Error(response.error || "Failed to create review");
      }
    } catch (error) {
      toast.error("Error adding review: " + error.message);
    }
  };

  // Render star ratings
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <span 
            key={i} 
            className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-white px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-[#0A3D2E]">
            Manage Guest Reviews
          </h1>
        </div>
        <div className="text-center py-12">
          <p>Loading reviews...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full min-h-screen bg-white px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-[#0A3D2E]">
            Manage Guest Reviews
          </h1>
        </div>
        <div className="text-center py-12">
          <p className="text-red-500">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-[#0A3D2E] text-white px-4 py-2 rounded-lg hover:bg-[#082f24]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
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
            Manage Guest Reviews
          </h1>
        </div>
        <button
          onClick={openCreateDialog}
          className="flex items-center gap-2 bg-[#0A3D2E] text-white px-4 py-2 rounded-xl hover:bg-[#082f24] transition"
        >
          <Plus size={16} />
          Add Review
        </button>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-2xl shadow-[0_4px_18px_rgba(0,0,0,0.05)] border border-[#0A3D2E15] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Reviewer</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Designation</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Review</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Rating</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Date</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 text-sm text-gray-900">{review.reviewerName}</td>
                  <td className="py-4 px-6 text-sm text-gray-700">{review.designation}</td>
                  <td className="py-4 px-6 text-sm text-gray-700 max-w-xs truncate">{review.reviewText}</td>
                  <td className="py-4 px-6 text-sm">
                    {renderStars(review.rating)}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500">{review.date}</td>
                  <td className="py-4 px-6 text-sm">
                    <button
                      onClick={() => openDeleteDialog(review.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {reviews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No reviews found. Add your first review!</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Review"
        message="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Create Review Dialog */}
      <ConfirmationDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onConfirm={handleCreateReview}
        title="Add New Review"
        message={
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reviewer Name *
              </label>
              <input
                type="text"
                value={newReview.reviewerName}
                onChange={(e) => handleInputChange('reviewerName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A3D2E] focus:border-transparent"
                placeholder="Enter reviewer name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Designation *
              </label>
              <input
                type="text"
                value={newReview.designation}
                onChange={(e) => handleInputChange('designation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A3D2E] focus:border-transparent"
                placeholder="Enter designation"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Review Content *
              </label>
              <textarea
                value={newReview.reviewText}
                onChange={(e) => handleInputChange('reviewText', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A3D2E] focus:border-transparent"
                placeholder="Enter review content"
                rows={3}
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating *
              </label>
              <select
                value={newReview.rating}
                onChange={(e) => handleInputChange('rating', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A3D2E] focus:border-transparent"
              >
                <option value="">Select rating</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Review Image (Optional)
              </label>
              {newReview.image ? (
                <div className="relative inline-block">
                  <img 
                    src={newReview.image.preview} 
                    alt="Review preview" 
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="hidden" 
                    id="review-image-upload"
                  />
                  <label 
                    htmlFor="review-image-upload" 
                    className="cursor-pointer text-gray-600 hover:text-gray-800 text-sm"
                  >
                    <div>Click to upload image</div>
                    <div className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</div>
                  </label>
                </div>
              )}
            </div>
          </div>
        }
        confirmText="Add Review"
        cancelText="Cancel"
        type="info"
      />
    </div>
  );
};

export default GuestReviewsEditPage;