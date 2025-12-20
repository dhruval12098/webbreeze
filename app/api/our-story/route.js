import { supabase } from '@/app/lib/supabaseClient';
import { withAuth } from '@/app/api/middleware/auth';

// GET /api/our-story - Get our story section data
export async function GET(request) {
  try {
    const { data, error } = await supabase
      .from('our_story_section')
      .select('*')
      .limit(1);

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Return the first item or null if no data
    const ourStoryData = data && data.length > 0 ? data[0] : null;

    return new Response(
      JSON.stringify({ success: true, data: ourStoryData }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// POST /api/our-story - Create or update our story section data
const updateOurStory = async (request) => {
  try {
    const body = await request.json();
    
    // Check if our story section data already exists
    const { data: existingData, error: selectError } = await supabase
      .from('our_story_section')
      .select('id')
      .limit(1);

    if (selectError) {
      throw selectError;
    }

    let result;
    if (existingData && existingData.length > 0) {
      // Update existing record
      const { data, error } = await supabase
        .from('our_story_section')
        .update(body)
        .eq('id', existingData[0].id)
        .select();

      if (error) {
        throw error;
      }
      result = data[0];
    } else {
      // Insert new record
      const { data, error } = await supabase
        .from('our_story_section')
        .insert([body])
        .select();

      if (error) {
        throw error;
      }
      result = data[0];
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in updateOurStory:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// Export POST without authentication for testing purposes
// In production, uncomment the line below and comment the other export
// export const POST = withAuth(updateOurStory);
export async function POST(request) {
  // For development/testing, bypass authentication
  if (process.env.NODE_ENV === 'development') {
    return updateOurStory(request);
  }
  
  // In production, use authentication
  return withAuth(updateOurStory)(request);
}