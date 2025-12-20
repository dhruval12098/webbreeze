import { supabase } from './supabaseClient';
import { uploadImageToStorage, deleteImageFromStorage } from './imageService';

/**
 * Fetch gallery images
 * @param {string} galleryType - 'guest' or 'homestay'
 * @returns {Object} - Success status and images data or error
 */
export const fetchGalleryImages = async (galleryType = null) => {
  try {
    let query = supabase
      .from('gallery_images')
      .select('*')
      .order('sort_order', { ascending: true });

    if (galleryType) {
      query = query.eq('gallery_type', galleryType);
    }

    const { data, error } = await query;

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, images: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Add a new gallery image
 * @param {File} imageFile - The image file to upload
 * @param {string} galleryType - 'guest' or 'homestay'
 * @param {number} sortOrder - Display order
 * @returns {Object} - Success status and image data or error
 */
export const addGalleryImage = async (imageFile, galleryType, sortOrder = null) => {
  try {
    // Validate inputs
    if (!imageFile || !galleryType) {
      return { success: false, error: 'Image file and gallery type are required' };
    }

    // Validate gallery type
    if (galleryType !== 'guest' && galleryType !== 'homestay') {
      return { success: false, error: 'Invalid gallery type' };
    }

    // Check current count for this gallery type
    const { count, error: countError } = await supabase
      .from('gallery_images')
      .select('*', { count: 'exact', head: true })
      .eq('gallery_type', galleryType);

    if (countError) {
      return { success: false, error: countError.message };
    }

    // Check limits (20 for guest, 30 for homestay)
    const maxImages = galleryType === 'guest' ? 20 : 30;
    if (count >= maxImages) {
      return { 
        success: false, 
        error: `Cannot add more than ${maxImages} images to ${galleryType} gallery` 
      };
    }

    // Check file size (must be less than 1MB = 1024KB)
    const fileSizeKB = Math.round(imageFile.size / 1024);
    if (fileSizeKB > 1024) {
      return { 
        success: false, 
        error: 'Image file size must be less than 1MB' 
      };
    }

    // Create folder path
    const folderPath = `gallery/${galleryType}`;

    // Upload image to storage
    const uploadResult = await uploadImageToStorage(imageFile, folderPath, supabase);

    if (!uploadResult.success) {
      return { success: false, error: uploadResult.error };
    }

    // Save image record to database
    const { data, error } = await supabase
      .from('gallery_images')
      .insert({
        image_url: uploadResult.publicUrl,
        gallery_type: galleryType,
        sort_order: sortOrder,
        file_size_kb: fileSizeKB
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, image: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Delete a gallery image
 * @param {string} imageUrl - URL of the image to delete
 * @returns {Object} - Success status and message or error
 */
export const deleteGalleryImage = async (imageUrl) => {
  try {
    if (!imageUrl) {
      return { success: false, error: 'Image URL is required' };
    }

    // Delete record from database
    const { error: dbError } = await supabase
      .from('gallery_images')
      .delete()
      .eq('image_url', imageUrl);

    if (dbError) {
      return { success: false, error: dbError.message };
    }

    // Also delete the actual image file from storage
    await deleteImageFromStorage(imageUrl, supabase);

    return { success: true, message: 'Image deleted successfully' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Update gallery image sort order
 * @param {number} imageId - ID of the image to update
 * @param {number} sortOrder - New sort order
 * @returns {Object} - Success status and updated image or error
 */
export const updateImageSortOrder = async (imageId, sortOrder) => {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .update({ sort_order: sortOrder })
      .eq('id', imageId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, image: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};