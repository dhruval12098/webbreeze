import { supabase } from '@/app/lib/supabaseClient';

// GET /api/admin/bookings - Get all bookings for admin view
export async function GET(request) {
  try {
    // Get user ID from auth header or session
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing or invalid authorization header' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify the session token
    const { data: session, error: sessionError } = await supabase
      .from('admin_sessions')
      .select('admin_id, expires_at')
      .eq('session_token', token)
      .single();

    if (sessionError || !session) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid or expired session' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if session is expired
    const now = new Date();
    const expiresAt = new Date(session.expires_at);
    if (now > expiresAt) {
      // Delete expired session
      await supabase
        .from('admin_sessions')
        .delete()
        .eq('session_token', token);

      return new Response(
        JSON.stringify({ success: false, error: 'Session has expired' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // In a real implementation, you would check if the user is an admin
    // For now, we'll assume the user can access all bookings
    // You might want to add an admin role check here
    
    // Fetch all bookings with user and room information
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        users (name, email)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Format the response data
    const formattedBookings = data.map(booking => {
      // Convert the time back to 12-hour format for display if needed
      let displayTime = booking.check_in_time;
      if (booking.check_in_time) {
        const [hours, minutes] = booking.check_in_time.split(':');
        const hour = parseInt(hours, 10);
        let period = 'AM';
        let displayHour = hour;
        
        if (hour >= 12) {
          period = 'PM';
          if (hour > 12) {
            displayHour = hour - 12;
          }
        }
        
        if (hour === 0) {
          displayHour = 12;
        }
        
        displayTime = `${displayHour}:${minutes} ${period}`;
      }
      
      return {
        id: booking.id,
        user_id: booking.user_id,
        room_id: booking.room_id,
        user_name: booking.users?.name || 'Unknown User',
        user_email: booking.users?.email || 'N/A',
        check_in_date: booking.check_in_date,
        check_out_date: booking.check_out_date,
        check_in_time: displayTime,
        total_guests: booking.total_guests,
        special_requests: booking.special_requests,
        total_amount: booking.total_amount,
        booking_status: booking.booking_status,
        created_at: booking.created_at,
        updated_at: booking.updated_at
      };
    });

    return new Response(
      JSON.stringify({ success: true, data: formattedBookings }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// PUT /api/admin/bookings/[id] - Update a booking (for admin)
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const bookingData = await request.json();
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing or invalid authorization header' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify the session token
    const { data: session, error: sessionError } = await supabase
      .from('admin_sessions')
      .select('admin_id, expires_at')
      .eq('session_token', token)
      .single();

    if (sessionError || !session) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid or expired session' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if session is expired
    const now = new Date();
    const expiresAt = new Date(session.expires_at);
    if (now > expiresAt) {
      // Delete expired session
      await supabase
        .from('admin_sessions')
        .delete()
        .eq('session_token', token);

      return new Response(
        JSON.stringify({ success: false, error: 'Session has expired' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update the booking
    const { data, error } = await supabase
      .from('bookings')
      .update({ 
        ...bookingData, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

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