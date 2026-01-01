import { supabase } from '@/app/lib/supabaseClient';
import { uploadImageToStorage, deleteImageFromStorage } from '@/app/lib/imageService';
import { authenticateAdminRequest } from '@/app/api/admin/middleware/auth';

// GET /api/gallery-images - Fetch gallery images
export async function GET(request) {
  try {
    // Public endpoint - no authentication required to view gallery images
    
    const { searchParams } = new URL(request.url);
    const galleryType = searchParams.get('type');

    let query = supabase
      .from('gallery_images')
      .select('*')
      .order('sort_order', { ascending: true });

    if (galleryType) {
      query = query.eq('gallery_type', galleryType);
    }

    const { data, error } = await query;

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, images: data }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// POST /api/gallery-images - Add a new gallery image
export async function POST(request) {
  try {
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

    const formData = await request.formData();
    const imageFile = formData.get('image');
    const galleryType = formData.get('galleryType');
    const sortOrder = formData.get('sortOrder');

    if (!imageFile || !galleryType) {
      return new Response(
        JSON.stringify({ success: false, error: 'Image file and gallery type are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate gallery type
    if (galleryType !== 'guest' && galleryType !== 'homestay') {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid gallery type' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check current count for this gallery type
    const { count, error: countError } = await supabase
      .from('gallery_images')
      .select('*', { count: 'exact', head: true })
      .eq('gallery_type', galleryType);

    if (countError) {
      return new Response(
        JSON.stringify({ success: false, error: countError.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check limits (20 for guest, 30 for homestay)
    const maxImages = galleryType === 'guest' ? 20 : 30;
    if (count >= maxImages) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Cannot add more than ${maxImages} images to ${galleryType} gallery` 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check file size (must be less than 1MB = 1024KB)
    const fileSizeKB = Math.round(imageFile.size / 1024);
    if (fileSizeKB > 1024) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Image file size must be less than 1MB' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Upload image to storage
    const folderPath = `gallery/${galleryType}`;
    const uploadResult = await uploadImageToStorage(imageFile, folderPath, supabase);
    
    if (!uploadResult.success) {
      return new Response(
        JSON.stringify({ success: false, error: uploadResult.error }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Save image record to database
    const { data, error } = await supabase
      .from('gallery_images')
      .insert({
        image_url: uploadResult.publicUrl,
        gallery_type: galleryType,
        sort_order: sortOrder ? parseInt(sortOrder) : null,
        file_size_kb: fileSizeKB
      })
      .select()
      .single();

    if (error) {
      // If database insert fails, try to delete the uploaded image
      await deleteImageFromStorage(uploadResult.publicUrl, supabase);
      
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, image: data }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// DELETE /api/gallery-images - Delete a gallery image
export async function DELETE(request) {
  try {
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

    const { imageUrl } = await request.json();
    
    if (!imageUrl) {
      return new Response(
        JSON.stringify({ success: false, error: 'Image URL is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Delete image from storage
    const deleteResult = await deleteImageFromStorage(imageUrl, supabase);
    
    // Delete record from database regardless of storage deletion result
    const { error: dbError } = await supabase
      .from('gallery_images')
      .delete()
      .eq('image_url', imageUrl);

    if (dbError) {
      return new Response(
        JSON.stringify({ success: false, error: dbError.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Image deleted successfully',
        storageDeleted: deleteResult.success
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}


