import { supabase } from '../../../app/lib/supabaseClient';

export async function POST(request) {
  try {
    const { name, email, phone, selected_date, number_of_guests, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Name, email, and message are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Insert the enquiry into the database
    const { data, error } = await supabase
      .from('enquiries')
      .insert([{
        name,
        email,
        phone,
        selected_date: selected_date || null,
        number_of_guests,
        message
      }]);

    if (error) {
      console.error('Error inserting enquiry:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to submit enquiry' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Enquiry submitted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing enquiry:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching enquiries:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch enquiries' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(data),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}