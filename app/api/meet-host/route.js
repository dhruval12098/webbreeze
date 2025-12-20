import { supabase } from '@/app/lib/supabaseClient';
import { withAuth } from '@/app/api/middleware/auth';

// GET /api/meet-host - Get meet host section data
export async function GET(request) {
  try {
    const { data, error } = await supabase
      .from('meet_hosts_section')
      .select('*')
      .limit(1);

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Return the first item or null if no data
    const meetHostData = data && data.length > 0 ? data[0] : null;

    return new Response(
      JSON.stringify({ success: true, data: meetHostData }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// POST /api/meet-host - Create or update meet host section data
const updateMeetHost = async (request) => {
  try {
    const body = await request.json();
    
    // Check if meet host section data already exists
    const { data: existingData, error: selectError } = await supabase
      .from('meet_hosts_section')
      .select('id')
      .limit(1);

    if (selectError) {
      throw selectError;
    }

    let result;
    if (existingData && existingData.length > 0) {
      // Update existing record
      const { data, error } = await supabase
        .from('meet_hosts_section')
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
        .from('meet_hosts_section')
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
    console.error('Error in updateMeetHost:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// Export POST without authentication for testing purposes
// In production, uncomment the line below and comment the other export
// export const POST = withAuth(updateMeetHost);
export async function POST(request) {
  // For development/testing, bypass authentication
  if (process.env.NODE_ENV === 'development') {
    return updateMeetHost(request);
  }
  
  // In production, use authentication
  return withAuth(updateMeetHost)(request);
}