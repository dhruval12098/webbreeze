"use client";

import React, { useState } from "react";
import { X, Trash2, Plus } from "lucide-react";
import ConfirmationDialog from "../../../../components/common/ConfirmationDialog";

const GuestReviewsEditPage = () => {
  // Sample initial reviews data
  const [reviews, setReviews] = useState([
    {
      id: 1,
      reviewerName: "John Doe",
      designation: "Business Traveler",
      reviewText: "Amazing experience! The homestay was perfect and the host was very welcoming.",
      rating: 5,
      date: "2023-10-15",
      image: null
    },
    {
      id: 2,
      reviewerName: "Jane Smith",
      designation: "Family Vacation",
      reviewText: "Beautiful location and comfortable stay. Will definitely come back!",
      rating: 4,
      date: "2023-09-22",
      image: null
    },
    {
      id: 3,
      reviewerName: "Robert Johnson",
      designation: "Solo Traveler",
      reviewText: "Good value for money. The place was clean and well maintained.",
      rating: 4,
      date: "2023-08-30",
      image: null
    }
  ]);

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
      // Check file size (maximum 2MB)
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > 2) {
        alert(`File exceeds maximum size of 2MB`);
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
  const confirmDelete = () => {
    if (reviewToDelete) {
      setReviews(prev => prev.filter(review => review.id !== reviewToDelete));
      setShowDeleteDialog(false);
      setReviewToDelete(null);
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
  const handleCreateReview = () => {
    if (newReview.reviewerName && newReview.designation && newReview.reviewText && newReview.rating) {
      const review = {
        id: Date.now(),
        ...newReview,
        rating: parseInt(newReview.rating),
        date: new Date().toISOString().split('T')[0]
      };
      
      setReviews(prev => [...prev, review]);
      setShowCreateDialog(false);
      setNewReview({
        reviewerName: "",
        designation: "",
        reviewText: "",
        rating: "",
        image: null
      });
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
                Reviewer Name
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
                Designation
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
                Review Content
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
                Rating
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
                    <div className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</div>
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