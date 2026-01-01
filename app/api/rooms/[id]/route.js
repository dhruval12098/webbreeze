import { supabase } from '@/app/lib/supabaseClient';
import { authenticateAdminRequest } from '@/app/api/admin/middleware/auth';

// GET /api/rooms/[id] - Get a specific room by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
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

// PUT /api/rooms/[id] - Update a specific room by ID
const updateRoom = async (request, { params }) => {
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
    
    const { id } = await params;
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('rooms')
      .update(body)
      .eq('id', id);

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
};

export const PUT = updateRoom;

// DELETE /api/rooms/[id] - Delete a specific room by ID
const deleteRoom = async (request, { params }) => {
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
    
    const { id } = await params;
    
    const { data, error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', id);

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Room deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const DELETE = deleteRoom;