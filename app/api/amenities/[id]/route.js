import { supabase } from '@/app/lib/supabaseClient';

// PUT /api/amenities/[id] - Update an amenity
export async function PUT(request, { params }) {
  try {
    // Properly await the params promise
    const { id } = await params;
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('amenities')
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
}

// DELETE /api/amenities/[id] - Delete an amenity
export async function DELETE(request, { params }) {
  try {
    // Properly await the params promise
    const { id } = await params;
    
    const { data, error } = await supabase
      .from('amenities')
      .delete()
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
}