import { supabase } from '@/app/lib/supabaseClient';
import { uploadImageToStorage, deleteImageFromStorage } from '@/app/lib/imageService';
import { authenticateAdminRequest } from '@/app/api/admin/middleware/auth';

// POST /api/images/upload - Upload an image
export async function POST(request) {
  try {
    // For file uploads, we need to handle multipart form data
    // This is a simplified version - in practice, you might want to use a library like formidable or busboy
    
    // Note: Direct file upload via fetch body isn't straightforward in this context
    // This endpoint would typically be called with FormData containing the file
    
    // For now, returning a structured response indicating this needs implementation
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Image upload via API not fully implemented in this example. Use the frontend imageService directly or implement proper multipart handling.' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// DELETE /api/images/delete - Delete an image by URL
const deleteImage = async (request) => {
  // Skip authentication during development/testing
  if (process.env.NODE_ENV === 'development') {
    console.log('Skipping authentication in development mode');
  } else {
    try {
      const authCheck = await authenticateAdminRequest(request);
      if (authCheck.success !== true) return authCheck; // Return unauthorized response if auth fails
    } catch (authError) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authentication error: ' + authError.message }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
  
  try {
    const { imageUrl } = await request.json();
    
    if (!imageUrl) {
      return new Response(
        JSON.stringify({ success: false, error: 'Image URL is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Delete image from storage
    const result = await deleteImageFromStorage(imageUrl, supabase);
    
    if (result.success) {
      return new Response(
        JSON.stringify({ success: true, message: 'Image deleted successfully' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, error: result.error }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const DELETE = deleteImage;