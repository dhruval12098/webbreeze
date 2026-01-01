import { supabase } from '@/app/lib/supabaseClient';
import { authenticateAdminRequest } from '@/app/api/admin/middleware/auth';

// GET /api/rooms - Get all rooms
export async function GET(request) {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*');

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// POST /api/rooms - Create a new room
const createRoom = async (request) => {
  try {
    // Skip authentication during development/testing
    if (process.env.NODE_ENV !== 'development') {
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
    
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('rooms')
      .insert([body]);

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const POST = createRoom;