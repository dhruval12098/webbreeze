import { supabase } from '@/app/lib/supabaseClient';
// Removed unused authentication import

// GET /api/nearby-places/[id] - Get a specific nearby place by ID
export async function GET(request, { params }) {
  try {
    // Properly await the params promise
    const { id } = await params;
    
    const { data, error } = await supabase
      .from('nearby_places')
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

// PUT /api/nearby-places/[id] - Update a specific nearby place by ID
export async function PUT(request, { params }) {
  try {
    // Properly await the params promise
    const { id } = await params;
    const body = await request.json();
    
    // Ensure the ID in the body matches the URL parameter
    const updatedBody = { ...body, id: parseInt(id) };
    
    const { data, error } = await supabase
      .from('nearby_places')
      .upsert(updatedBody, { onConflict: 'id' })
      .select(); // Add select() to return the upserted data

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

// DELETE /api/nearby-places/[id] - Delete a specific nearby place by ID
export async function DELETE(request, { params }) {
  try {
    // Properly await the params promise
    const { id } = await params;
    
    const { data, error } = await supabase
      .from('nearby_places')
      .delete()
      .eq('id', id);

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Nearby place deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};