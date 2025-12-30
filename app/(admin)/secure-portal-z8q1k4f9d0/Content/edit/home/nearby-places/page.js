"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Save, Trash2 } from "lucide-react";
import ConfirmationDialog from "../../../../components/common/ConfirmationDialog";
import { updateImage, deleteImageFromStorage } from '@/app/lib/imageService';
import { nearbyPlacesApi } from '@/app/lib/apiClient';
import { supabase } from '@/app/lib/supabaseClient';

const NearbyPlacesEditPage = () => {
  // Initialize state for three nearby places with completely isolated objects
  const [nearbyPlaces, setNearbyPlaces] = useState([
    { id: 1, name: "", description: "", image: null },
    { id: 2, name: "", description: "", image: null },
    { id: 3, name: "", description: "", image: null }
  ]);
  const [activeTab, setActiveTab] = useState(1); // Default to first tab
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [imageToDelete, setImageToDelete] = useState({ placeId: null, type: null });
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  // Track original state to determine what has changed
  const [originalPlaces, setOriginalPlaces] = useState({});
  // Track deleted images for proper cleanup
  const [deletedImages, setDeletedImages] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load existing data from API
  useEffect(() => {
    const fetchNearbyPlaces = async () => {
      try {
        const response = await nearbyPlacesApi.getAll();
        const { data } = response;

        if (data && data.length > 0) {
          // Transform data to match component structure
          // Use actual database records and map them to our fixed positions
          const transformedData = nearbyPlaces.map((initialPlace, index) => {
            // Try to find a database record for this position (1-based indexing)
            const dbPlace = data.find(p => p.id === initialPlace.id) || 
                           data[index]; // Fallback to index-based selection
            
            if (dbPlace && dbPlace.id) {
              // Create a completely new place object with the actual database ID
              const updatedPlace = {
                id: dbPlace.id, // Use the actual database ID
                name: dbPlace.title || "",
                description: dbPlace.description || "",
                image: null
              };
              
              if (dbPlace.image_url) {
                updatedPlace.image = {
                  id: 'existing',
                  url: dbPlace.image_url,
                  isExisting: true
                };
              }
              
              return updatedPlace;
            }
            
            // Return the initial place with its predefined ID if no database record
            return { ...initialPlace };
          });
          
          // Ensure we always have exactly 3 places
          const finalData = transformedData.slice(0, 3);
          while (finalData.length < 3) {
            const nextId = finalData.length + 1;
            finalData.push({ id: nextId, name: "", description: "", image: null });
          }
          
          // Set the state after collecting all data
          setNearbyPlaces(finalData);
          setDeletedImages([]); // Initialize deletedImages as empty
          
          // Store original state for change tracking
          const originalState = {};
          finalData.forEach(place => {
            originalState[place.id] = {
              name: place.name,
              description: place.description,
              image_url: place.image ? (place.image.url || null) : null
            };
          });
          setOriginalPlaces(originalState);
        } else {
          // No data in database, use initial state
          setNearbyPlaces(nearbyPlaces);
          const originalState = {};
          nearbyPlaces.forEach(place => {
            originalState[place.id] = {
              name: "",
              description: "",
              image_url: null
            };
          });
          setOriginalPlaces(originalState);
          setDeletedImages([]); // Initialize deletedImages as empty
        }
      } catch (error) {
        console.error('Error fetching nearby places data:', error);
        showToast('Error loading nearby places data', 'error');
      }
    };

    fetchNearbyPlaces();
  }, []);

  // Handle image upload for a specific place
  const handleImageUpload = (placeId, e) => {
    const file = e.target.files[0];
    if (file) {
      console.log(`Uploading image for place ${placeId}:`, file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        // Create a completely new image object with unique properties
        const newImage = {
          id: `${placeId}-${Date.now()}-${Math.random()}`,
          file: file,  // Keep the file for upload
          preview: e.target.result
        };
        
        console.log(`Created new image object for place ${placeId}:`, newImage);
        
        // Update the state with the new image
        setNearbyPlaces(currentPlaces => {
          return currentPlaces.map(place => {
            if (place.id === placeId) {
              console.log(`Place ${placeId} matched, updating image`);
              return { 
                ...place,
                image: newImage
              };
            }
            return place;
          });
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (placeId, type) => {
    setImageToDelete({ placeId, type });
    setShowDeleteDialog(true);
  };

  // Confirm image deletion
  const confirmDelete = async () => {
    setIsDeleting(true);
    const { placeId, type } = imageToDelete;
    console.log(`Confirming deletion for place ${placeId}, type: ${type}`);
    
    // Validate placeId before proceeding
    if (!placeId || isNaN(parseInt(placeId))) {
      console.error('Invalid place ID for deletion:', placeId);
      showToast('Error: Invalid place ID for deletion', 'error');
      setShowDeleteDialog(false);
      setImageToDelete({ placeId: null, type: null });
      return;
    }
    
    if (type === 'image') {
      // Find the place
      const place = nearbyPlaces.find(p => p.id === placeId);
      if (place && place.image) {
        console.log(`Found place ${placeId} with image:`, place.image);
        
        // Track deleted image for storage + DB cleanup
        console.log(`Tracking deleted image for place ${placeId}: ${place.image.url}`);
        setDeletedImages(prev => [...prev, { placeId, url: place.image.url }]);
        
        // Optional: Immediate deletion from storage for better UX
        // This ensures images are deleted even if user doesn't click "Save"
        deleteImageFromStorage(place.image.url, supabase)
          .then(result => {
            if (result.success) {
              console.log('Image deleted from storage successfully');
              // Optionally remove from DB immediately
              // Validate placeId before making the Supabase call
              if (!placeId || isNaN(parseInt(placeId))) {
                console.error('Invalid place ID for Supabase update:', placeId);
                return Promise.resolve();
              }
              return supabase
                .from('nearby_places')
                .update({ image_url: null })
                .eq('id', parseInt(placeId));
            } else {
              console.error('Failed to delete image from storage:', result.error);
              return Promise.resolve();
            }
          })
          .then(dbResult => {
            if (dbResult && dbResult.error) {
              console.error('Failed to update database:', dbResult.error);
            }
          })
          .catch(error => {
            console.error('Error during immediate deletion:', error);
          });

        // Remove from state
        setNearbyPlaces(prevPlaces => 
          prevPlaces.map(p => 
            p.id === placeId 
              ? { ...p, image: null } 
              : { ...p }
          )
        );
      }
    }
    
    setShowDeleteDialog(false);
    setImageToDelete({ placeId: null, type: null });
    setIsDeleting(false);
  };

  // Handle text input changes
  const handleInputChange = (placeId, field, value) => {
    setNearbyPlaces(prevPlaces => {
      return prevPlaces.map(place => {
        if (place.id === placeId) {
          // Return a completely new object for the updated place
          return { 
            id: place.id,
            name: field === 'name' ? value : place.name,
            description: field === 'description' ? value : place.description,
            image: place.image ? { ...place.image } : null
          };
        }
        // Return a completely new object for unchanged places
        return { 
          id: place.id,
          name: place.name,
          description: place.description,
          image: place.image ? { ...place.image } : null
        };
      });
    });
  };

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Open save dialog
  const openSaveDialog = (e) => {
    e.preventDefault();
    setShowSaveDialog(true);
  };

  // Handle save action - renamed from handleSave to confirmSave for consistency
  const confirmSave = async () => {
    setIsSaving(true);
    try {
      // Track all image URLs for cleanup
      const allCurrentImageUrls = [];
      
      // Process each place
      for (const place of nearbyPlaces) {
        let imageUrl = null;

        // Handle image upload if new image is provided
        if (place.image && place.image.file) {
          // Use centralized image service for upload
          const uploadResult = await updateImage(
            place.image.file, 
            place.image.isExisting ? place.image.url : null, 
            'nearby-places',
            supabase
          );
          
          if (uploadResult.success) {
            imageUrl = uploadResult.newImageUrl;
          } else {
            console.error('Upload error for place', place.id, uploadResult.error);
            showToast(`Error uploading image for ${place.name}`, 'error');
            continue;
          }
        } else if (place.image && place.image.isExisting) {
          // Keep existing image
          imageUrl = place.image.url;
        }

        // Track current image URL for cleanup
        if (imageUrl) {
          allCurrentImageUrls.push(imageUrl);
        }

        // Prepare data for database
        const placeData = {
          title: place.name,
          description: place.description,
          image_url: imageUrl || null
        };

        // Validate place ID before making API calls
        if (!place.id || isNaN(parseInt(place.id))) {
          console.error('Invalid place ID:', place.id);
          showToast(`Error saving ${place.name}: Invalid place ID`, 'error');
          continue;
        }

        // Check if record exists
        let operationSuccess = false;
        try {
          const response = await nearbyPlacesApi.getById(place.id);
          const { data: existingData } = response;

          if (existingData && existingData.id) {
            // Update existing record
            console.log(`Updating existing record for place ${place.id}`);
            try {
              await nearbyPlacesApi.update(place.id, placeData);
              operationSuccess = true;
            } catch (updateError) {
              console.error('Update error:', updateError);
              // Extract more detailed error information
              const errorMessage = updateError.message || 'Unknown error occurred';
              showToast(`Error updating ${place.name}: ${errorMessage}`, 'error');
              // Don't continue with the rest of the function if update failed
              continue;
            }
          } else {
            // Insert new record with specific ID
            console.log(`Inserting new record for place ${place.id}`);
            try {
              await nearbyPlacesApi.create({
                id: parseInt(place.id),
                title: place.name,
                description: place.description,
                image_url: imageUrl || null
              });
              operationSuccess = true;
            } catch (insertError) {
              console.error('Insert error:', insertError);
              // Extract more detailed error information
              const errorMessage = insertError.message || 'Unknown error occurred';
              showToast(`Error saving ${place.name}: ${errorMessage}`, 'error');
              // Don't continue with the rest of the function if insert failed
              continue;
            }
          }
        } catch (selectError) {
          console.error('Select error:', selectError);
          // Validate place ID before making API calls
          if (!place.id || isNaN(parseInt(place.id))) {
            console.error('Invalid place ID:', place.id);
            showToast(`Error saving ${place.name}: Invalid place ID`, 'error');
            continue;
          } else {
            // If there's an error checking existence, try to insert
            try {
              await nearbyPlacesApi.create({
                id: parseInt(place.id),
                title: place.name,
                description: place.description,
                image_url: imageUrl || null
              });
              operationSuccess = true;
            } catch (insertError) {
              console.error('Insert error:', insertError);
              // Extract more detailed error information
              const errorMessage = insertError.message || 'Unknown error occurred';
              showToast(`Error saving ${place.name}: ${errorMessage}`, 'error');
              // Don't continue with the rest of the function if insert failed
              continue;
            }
          }
        }

        // Only update the state if the database operation was successful
        if (operationSuccess && imageUrl) {
          setNearbyPlaces(prevPlaces => 
            prevPlaces.map(p => 
              p.id === place.id 
                ? { 
                    ...p, 
                    image: {
                      id: `existing-${place.id}`,
                      url: imageUrl,
                      isExisting: true
                    }
                  } 
                : p
            )
          );
        }
      }

      // Clean up deleted images
      for (const deletedImage of deletedImages) {
        if (deletedImage.imageUrl) {
          // Use centralized image service for deletion - pass supabase client
          const result = await deleteImageFromStorage(deletedImage.imageUrl, supabase);
          if (result.success) {
            console.log('Deleted image from storage:', deletedImage.imageUrl);
          } else {
            console.error('Failed to delete image from storage:', result.error);
          }
        }
      }

      // Clear deleted images tracking
      setDeletedImages([]);
      
      setShowSaveDialog(false);
      showToast('Changes saved successfully!', 'success');
    } catch (error) {
      console.error('Save error:', error);
      // Extract more detailed error information
      const errorMessage = error.message || 'Unknown error occurred';
      showToast(`Error saving changes: ${errorMessage}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Track if all operations are successful
      let allOperationsSuccessful = true;
      
      // Process each place
      for (const place of nearbyPlaces) {
        let imageUrl = null;
        
        // Upload new image if present
        if (place.image && place.image.file) {
          // Use centralized image service for upload
          const uploadResult = await updateImage(
            place.image.file, 
            place.image.isExisting ? place.image.url : null, 
            'nearby-places',
            supabase
          );
          
          if (uploadResult.success) {
            imageUrl = uploadResult.newImageUrl;
          } else {
            console.error('Upload error for place', place.id, uploadResult.error);
            showToast(`Error uploading image for ${place.name}`, 'error');
            allOperationsSuccessful = false;
            continue;
          }
        } else if (place.image && place.image.isExisting) {
          // Keep existing image
          imageUrl = place.image.url;
        }

        // Prepare data for database
        const placeData = {
          title: place.name,
          description: place.description,
          image_url: imageUrl || null
        };

        // Validate place ID before making API calls
        if (!place.id || isNaN(parseInt(place.id))) {
          console.error('Invalid place ID:', place.id);
          showToast(`Error saving ${place.name}: Invalid place ID`, 'error');
          allOperationsSuccessful = false;
          continue;
        }

        // Check if record exists
        let operationSuccess = false;
        try {
          const response = await nearbyPlacesApi.getById(place.id);
          const { data: existingData } = response;

          if (existingData && existingData.id) {
            // Update existing record
            console.log(`Updating existing record for place ${place.id}`);
            try {
              await nearbyPlacesApi.update(place.id, placeData);
              operationSuccess = true;
            } catch (updateError) {
              console.error('Update error:', updateError);
              // Extract more detailed error information
              const errorMessage = updateError.message || 'Unknown error occurred';
              showToast(`Error updating ${place.name}: ${errorMessage}`, 'error');
              allOperationsSuccessful = false;
              // Don't continue with the rest of the function if update failed
              continue;
            }
          } else {
            // Insert new record with specific ID
            console.log(`Inserting new record for place ${place.id}`);
            try {
              await nearbyPlacesApi.create({
                id: parseInt(place.id),
                title: place.name,
                description: place.description,
                image_url: imageUrl || null
              });
              operationSuccess = true;
            } catch (insertError) {
              console.error('Insert error:', insertError);
              // Extract more detailed error information
              const errorMessage = insertError.message || 'Unknown error occurred';
              showToast(`Error saving ${place.name}: ${errorMessage}`, 'error');
              allOperationsSuccessful = false;
              // Don't continue with the rest of the function if insert failed
              continue;
            }
          }
        } catch (selectError) {
          console.error('Select error:', selectError);
          // Validate place ID before making API calls
          if (!place.id || isNaN(parseInt(place.id))) {
            console.error('Invalid place ID:', place.id);
            showToast(`Error saving ${place.name}: Invalid place ID`, 'error');
            allOperationsSuccessful = false;
            continue;
          } else {
            // If there's an error checking existence, try to insert
            try {
              await nearbyPlacesApi.create({
                id: parseInt(place.id),
                title: place.name,
                description: place.description,
                image_url: imageUrl || null
              });
              operationSuccess = true;
            } catch (insertError) {
              console.error('Insert error:', insertError);
              // Extract more detailed error information
              const errorMessage = insertError.message || 'Unknown error occurred';
              showToast(`Error saving ${place.name}: ${errorMessage}`, 'error');
              allOperationsSuccessful = false;
              // Don't continue with the rest of the function if insert failed
              continue;
            }
          }
        }

        // Only update the state if the database operation was successful
        if (operationSuccess && imageUrl) {
          setNearbyPlaces(prevPlaces => 
            prevPlaces.map(p => 
              p.id === place.id 
                ? { 
                    ...p, 
                    image: {
                      id: `existing-${place.id}`,
                      url: imageUrl,
                      isExisting: true
                    }
                  } 
                : p
            )
          );
        } else if (!operationSuccess) {
          allOperationsSuccessful = false;
        }
      }

      // Clean up deleted images
      for (const deletedImage of deletedImages) {
        if (deletedImage.imageUrl) {
          // Use centralized image service for deletion - pass supabase client
          const result = await deleteImageFromStorage(deletedImage.imageUrl, supabase);
          if (result.success) {
            console.log('Deleted image from storage:', deletedImage.imageUrl);
          } else {
            console.error('Failed to delete image from storage:', result.error);
          }
        }
      }

      // Clear deleted images tracking
      setDeletedImages([]);
      
      setShowSaveDialog(false);
      
      // Only show success message if all operations were successful
      if (allOperationsSuccessful) {
        showToast('Changes saved successfully!', 'success');
      } else {
        showToast('Some changes could not be saved. Please check the errors above.', 'error');
      }
    } catch (error) {
      console.error('Save error:', error);
      // Extract more detailed error information
      const errorMessage = error.message || 'Unknown error occurred';
      showToast(`Error saving changes: ${errorMessage}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Get the currently active place
  const activePlace = nearbyPlaces.find(place => place.id === activeTab);
  
  // Debug: Log the current state
  console.log('Current nearbyPlaces state:', nearbyPlaces);
  console.log('Active tab:', activeTab);
  console.log('Active place:', activePlace);
  
  // Debug: Log each place's image to see if they're shared
  nearbyPlaces.forEach((place, index) => {
    console.log(`Place ${place.id} image:`, place.image);
    if (place.image) {
      console.log(`Place ${place.id} image ID:`, place.image.id);
    }
  });

  // Handle image removal (when user clicks the X button)
  const removeImage = (placeId) => {
    console.log(`Removing image for place ${placeId}`);
    
    // Validate placeId before proceeding
    if (!placeId || isNaN(parseInt(placeId))) {
      console.error('Invalid place ID for image removal:', placeId);
      showToast('Error: Invalid place ID for image removal', 'error');
      return;
    }
    
    const place = nearbyPlaces.find(p => p.id === placeId);
    
    if (place?.image?.isExisting && place.image.url) {
      // Track deleted image for storage + DB cleanup
      console.log(`Tracking deleted image for place ${placeId}: ${place.image.url}`);
      setDeletedImages(prev => [...prev, { placeId, url: place.image.url }]);
      
      // Optional: Immediate deletion from storage for better UX
      // This ensures images are deleted even if user doesn't click "Save"
      deleteImageFromStorage(place.image.url, supabase)
        .then(result => {
          if (result.success) {
            console.log('Image deleted from storage successfully');
            // Optionally remove from DB immediately
            // Validate placeId before making the Supabase call
            if (!placeId || isNaN(parseInt(placeId))) {
              console.error('Invalid place ID for Supabase update:', placeId);
              showToast('Error: Invalid place ID for Supabase update', 'error');
              return Promise.resolve();
            }
            return supabase
              .from('nearby_places')
              .update({ image_url: null })
              .eq('id', parseInt(placeId));
          } else {
            console.error('Failed to delete image from storage:', result.error);
            return Promise.resolve();
          }
        })
        .then(dbResult => {
          if (dbResult && dbResult.error) {
            console.error('Failed to update database:', dbResult.error);
          }
        })
        .catch(error => {
          console.error('Error during immediate deletion:', error);
        });
    }

    // Remove from state
    setNearbyPlaces(prevPlaces => 
      prevPlaces.map(p => 
        p.id === placeId ? { ...p, image: null } : { ...p }
      )
    );
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
          Edit Nearby Places
        </h1>
      </div>
      
      <div className="bg-white rounded-2xl shadow-[0_4px_18px_rgba(0,0,0,0.05)] p-6 border border-[#0A3D2E15]">
        <form className="space-y-6" onSubmit={openSaveDialog}>
          {/* Tabs for switching between places */}
          <div className="flex gap-4 border-b border-gray-200 mb-6">
            {[1, 2, 3].map((tabId) => (
              <button
                key={tabId}
                type="button"
                onClick={() => setActiveTab(tabId)}
                className={`pb-3 px-1 text-lg font-medium transition-all ${
                  activeTab === tabId
                    ? "text-[#0A3D2E] border-b-2 border-[#0A3D2E]"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Place {tabId}
              </button>
            ))}
          </div>
          
          {/* Content for the active place */}
          {activePlace && (
            <div className="space-y-4">
              {/* Place Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Place Name
                </label>
                <input
                  type="text"
                  value={activePlace.name}
                  onChange={(e) => handleInputChange(activePlace.id, 'name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A3D2E] focus:border-transparent"
                  placeholder="Enter place name"
                />
              </div>
              
              {/* Place Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={activePlace.description}
                  onChange={(e) => handleInputChange(activePlace.id, 'description', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A3D2E] focus:border-transparent"
                  placeholder="Enter description"
                  rows={4}
                ></textarea>
              </div>
              
              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Images (Max 1)
                </label>
                
                {/* Image Preview Area */}
                {activePlace.image && (
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="relative">
                      {/* Debug: Show which place this image belongs to */}
                      <div className="text-xs text-gray-500 mb-1">Place {activePlace.id}</div>
                      <div className="text-xs text-gray-500 mb-1">Image ID: {activePlace.image.id}</div>
                      <img 
                        src={activePlace.image.preview || activePlace.image.url} 
                        alt={`Preview for place ${activePlace.id}`} 
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => openDeleteDialog(activePlace.id, 'image')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Upload Button */}
                {!activePlace.image && (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleImageUpload(activePlace.id, e)}
                      className="hidden" 
                      id={`image-upload-${activePlace.id}`} 
                    />
                    <label 
                      htmlFor={`image-upload-${activePlace.id}`} 
                      className="cursor-pointer text-gray-600 hover:text-gray-800"
                    >
                      <p>Click to upload image</p>
                      <p className="text-sm text-gray-500 mt-2">
                        0/1 images uploaded
                      </p>
                    </label>
                  </div>
                )}
              </div>
            </div>
          )}
          
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
        title="Save Changes"
        message="Are you sure you want to save these changes to the nearby places?"
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
      />
    </div>
  );
};

export default NearbyPlacesEditPage;