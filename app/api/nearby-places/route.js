import { supabase } from '@/app/lib/supabaseClient';
// Removed unused authentication import

// GET /api/nearby-places - Get all nearby places
export async function GET(request) {
  try {
    const { data, error } = await supabase
      .from('nearby_places')
      .select('*')
      .order('id');

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

// POST /api/nearby-places - Create a new nearby place
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Use upsert to handle both insert and update scenarios
    // This prevents duplicate key constraint violations
    const { data, error } = await supabase
      .from('nearby_places')
      .upsert([body], { onConflict: 'id' })
      .select(); // Add select() to return the upserted data

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