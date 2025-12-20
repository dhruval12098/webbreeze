import { supabase } from '@/app/lib/supabaseClient';

// Helper function to set CORS headers
function setCORSHeaders(response) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

// Handle OPTIONS requests for CORS
export async function OPTIONS(request) {
  const response = new Response(null, { status: 204 });
  return setCORSHeaders(response);
}

// GET /api/guest-reviews - Get all guest reviews
export async function GET(request) {
  try {
    const { data, error } = await supabase
      .from('guest_reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const response = new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
    return setCORSHeaders(response);
  } catch (error) {
    const response = new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
    
    return setCORSHeaders(response);
  }
}

// POST /api/guest-reviews - Create a new guest review
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.reviewer_name || !body.designation || !body.review_text || !body.rating) {
      const response = new Response(
        JSON.stringify({ success: false, error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
      
      return setCORSHeaders(response);
    }
    
    const { data, error } = await supabase
      .from('guest_reviews')
      .insert([body])
      .select();

    if (error) {
      const response = new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
      
      return setCORSHeaders(response);
    }

    const response = new Response(
      JSON.stringify({ success: true, data }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
    
    return setCORSHeaders(response);
  } catch (error) {
    const response = new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
    
    return setCORSHeaders(response);
  }
}