import { supabase } from '@/app/lib/supabaseClient';
import { authenticateAdminRequest } from '@/app/api/admin/middleware/auth';

// GET /api/amenities - Get all amenities
export async function GET(request) {
  try {
    const { data, error } = await supabase
      .from('amenities')
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

// POST /api/amenities - Create a new amenity
export async function POST(request) {
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
      .from('amenities')
      .insert([body])
      .select(); // Add select() to return the inserted data

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
}