import { supabase } from '@/app/lib/supabaseClient';

// GET /api/guest-reviews/[id] - Get a specific guest review by ID
export async function GET(request, { params }) {
  try {
    // Properly await the params promise
    const { id } = await params;
    
    // Validate the ID
    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: 'ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const { data, error } = await supabase
      .from('guest_reviews')
      .select(`
        id,
        reviewer_name,
        designation,
        review_text,
        rating,
        date,
        image_url,
        created_at,
        updated_at
      `)
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
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=60'
        } 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// PUT /api/guest-reviews/[id] - Update a specific guest review by ID
export async function PUT(request, { params }) {
  try {
    // Properly await the params promise
    const { id } = await params;
    
    // Validate the ID
    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: 'ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const body = await request.json();
    
    // Validate rating if provided
    if (body.rating !== undefined) {
      const rating = parseInt(body.rating);
      if (isNaN(rating) || rating < 1 || rating > 5) {
        return new Response(
          JSON.stringify({ success: false, error: 'Rating must be a number between 1 and 5' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      body.rating = rating;
    }
    
    // Add updated timestamp
    body.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('guest_reviews')
      .update(body)
      .eq('id', id)
      .select();

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        } 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// DELETE /api/guest-reviews/[id] - Delete a specific guest review by ID
export async function DELETE(request, { params }) {
  try {
    // Properly await the params promise
    const { id } = await params;
    
    // Validate the ID
    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: 'ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Delete the review
    const { data, error } = await supabase
      .from('guest_reviews')
      .delete()
      .eq('id', id);

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Guest review deleted successfully' }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        } 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};