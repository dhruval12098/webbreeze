import { supabase } from '@/app/lib/supabaseClient';

// GET /api/bookings/availability - Get booking availability for rooms
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('room_id');
    
    let query;
    
    if (roomId) {
      // Get bookings for a specific room
      query = supabase
        .from('bookings')
        .select('check_in_date, check_out_date, booking_status')
        .eq('room_id', roomId)
        .in('booking_status', ['pending', 'confirmed']);
    } else {
      // Get bookings for all rooms
      query = supabase
        .from('bookings')
        .select('check_in_date, check_out_date, booking_status')
        .in('booking_status', ['pending', 'confirmed']);
    }
    
    const { data, error } = await query;

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