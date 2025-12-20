import { supabase } from '@/app/lib/supabaseClient';

// GET /api/descriptions - Get all descriptions (should only be one)
export async function GET(request) {
  try {
    const { data, error } = await supabase
      .from('descriptions')
      .select('*')
      .limit(1);

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: data[0] || null }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// POST /api/descriptions - Create or update description
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Check if a description already exists
    const { data: existingData, error: fetchError } = await supabase
      .from('descriptions')
      .select('id')
      .limit(1);

    if (fetchError) {
      return new Response(
        JSON.stringify({ success: false, error: fetchError.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let result;
    if (existingData && existingData.length > 0) {
      // Update existing record
      const { data, error } = await supabase
        .from('descriptions')
        .update(body)
        .eq('id', existingData[0].id);
      
      if (error) {
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      result = data;
    } else {
      // Create new record
      const { data, error } = await supabase
        .from('descriptions')
        .insert([body]);
      
      if (error) {
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      result = data;
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}