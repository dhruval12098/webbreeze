import { supabase } from '@/app/lib/supabaseClient';
import { deleteImageFromStorage, getFileNameFromUrl } from '@/app/lib/imageService';

export async function POST(request) {
  try {
    const body = await request.json();
    const { imageUrl } = body;
    
    if (!imageUrl) {
      return Response.json({ success: false, error: 'Image URL is required' }, { status: 400 });
    }
    
    // Test filename extraction
    const fileName = getFileNameFromUrl(imageUrl);
    
    // Test deletion
    const result = await deleteImageFromStorage(imageUrl, supabase);
    
    return Response.json({
      success: true,
      fileName,
      deletionResult: result
    });
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}