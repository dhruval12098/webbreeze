// Note: This service is designed to be used in the browser environment with Next.js
// The supabase client import will be handled by the calling components

/**
 * Extract filename from URL
 * @param {string} url - The full URL of the image
 * @returns {string|null} - The filename or null if extraction fails
 */
export const getFileNameFromUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const bucketIndex = pathParts.findIndex(part => part === 'homestay-images');
    if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
      return pathParts.slice(bucketIndex + 1).join('/');
    }
    return pathParts[pathParts.length - 1];
  } catch (error) {
    console.error('Error extracting filename from URL:', error);
    return null;
  }
};

/**
 * Delete image from Supabase storage
 * @param {string} url - The full URL of the image to delete
 * @param {object} supabaseClient - The Supabase client instance
 * @returns {Object} - Result object with success status and error message if applicable
 */
export const deleteImageFromStorage = async (url, supabaseClient) => {
  console.log('deleteImageFromStorage called with:', { url, supabaseClient: !!supabaseClient });
  
  if (!url) {
    console.log('No URL provided to deleteImageFromStorage');
    return { success: false, error: 'No URL provided' };
  }
  
  // Check if supabaseClient is provided
  if (!supabaseClient) {
    console.log('No Supabase client provided to deleteImageFromStorage');
    return { success: false, error: 'Supabase client not provided' };
  }
  
  const fileName = getFileNameFromUrl(url);
  console.log('Attempting to delete image:', { url, fileName });
  
  if (fileName) {
    console.log('Calling Supabase storage remove with:', fileName);
    // Log the bucket name we're using
    console.log('Using bucket:', 'homestay-images');
    
    const { data, error } = await supabaseClient
      .storage
      .from('homestay-images')
      .remove([fileName]);
    
    console.log('Supabase storage remove response:', { data, error });
    
    if (error) {
      console.error('Error deleting image from storage:', error);
      return { success: false, error: error.message };
    }
    
    // Check if any files were actually deleted
    if (data && data.length > 0) {
      console.log('Successfully deleted image from storage:', data);
      return { success: true };
    } else {
      console.warn('No files were deleted - file may not exist:', fileName);
      // Still return success since the goal is to ensure the file doesn't exist
      return { success: true };
    }
  }
  
  return { success: false, error: 'Could not extract filename from URL' };
};

/**
 * Upload image to Supabase storage
 * @param {File} file - The image file to upload
 * @param {string} folderPath - The folder path within the storage bucket (e.g., 'about/meet-hosts')
 * @param {object} supabaseClient - The Supabase client instance
 * @returns {Object} - Result object with success status, public URL, and error message if applicable
 */
export const uploadImageToStorage = async (file, folderPath, supabaseClient) => {
  if (!file) return { success: false, error: 'No file provided' };
  
  // Check if supabaseClient is provided
  if (!supabaseClient) {
    return { success: false, error: 'Supabase client not provided' };
  }
  
  try {
    const fileName = `${folderPath}/${Date.now()}-${file.name}`;
    console.log('Uploading image with filename:', fileName);
    const { data, error } = await supabaseClient
      .storage
      .from('homestay-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return { success: false, error: error.message };
    } else {
      // Get public URL
      const { data: { publicUrl } } = supabaseClient
        .storage
        .from('homestay-images')
        .getPublicUrl(fileName);
      
      console.log('Successfully uploaded image:', publicUrl);
      return { success: true, publicUrl };
    }
  } catch (error) {
    console.error('Upload exception:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update image with automatic cleanup of previous image
 * @param {File|null} newFile - The new image file to upload (null if removing image)
 * @param {string|null} previousImageUrl - The URL of the previous image to delete
 * @param {string} folderPath - The folder path within the storage bucket
 * @param {object} supabaseClient - The Supabase client instance
 * @returns {Object} - Result object with success status, new image URL (if applicable), and error message if applicable
 */
export const updateImage = async (newFile, previousImageUrl, folderPath, supabaseClient) => {
  // Check if supabaseClient is provided
  if (!supabaseClient) {
    return { success: false, error: 'Supabase client not provided' };
  }
  
  try {
    let newImageUrl = null;
    
    // Delete previous image if exists
    if (previousImageUrl) {
      console.log('Deleting previous image:', previousImageUrl);
      const deleteResult = await deleteImageFromStorage(previousImageUrl, supabaseClient);
      console.log('Delete result:', deleteResult);
    }
    
    // Upload new image if provided
    if (newFile) {
      console.log('Uploading new image');
      const uploadResult = await uploadImageToStorage(newFile, folderPath, supabaseClient);
      if (uploadResult.success) {
        newImageUrl = uploadResult.publicUrl;
      } else {
        return { success: false, error: uploadResult.error };
      }
    }
    
    return { success: true, newImageUrl };
  } catch (error) {
    console.error('Update image error:', error);
    return { success: false, error: error.message };
  }
};