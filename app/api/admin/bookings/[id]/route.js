import { supabase } from '@/app/lib/supabaseClient';

// PUT /api/admin/bookings/[id] - Update a specific booking (for admin)
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
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
    // Handle field name mapping for status
    const updateData = { ...bookingData, updated_at: new Date().toISOString() };
    // Map 'status' field to 'booking_status' if present
    if (updateData.status && !updateData.booking_status) {
      updateData.booking_status = updateData.status;
      delete updateData.status; // Remove the old field
    }
    
    const { data, error } = await supabase
      .from('bookings')
      .update(updateData)
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

// DELETE /api/admin/bookings/[id] - Delete a specific booking (if needed)
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
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

    // Delete the booking
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Booking deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// GET /api/admin/bookings/[id] - Get a specific booking (if needed)
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
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

    // Fetch the specific booking with user and room information
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        users (name, full_name, email),
        rooms (title)
      `)
      .eq('id', id)
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Format the response data
    let displayTime = data.check_in_time;
    if (data.check_in_time) {
      const [hours, minutes] = data.check_in_time.split(':');
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
    
    const formattedBooking = {
      id: data.id,
      user_id: data.user_id,
      room_id: data.room_id,
      room_name: data.rooms?.title || data.room_id, // Use room title if available, otherwise use room_id
      user_name: data.users?.name || data.users?.full_name || 'Unknown User',
      user_email: data.users?.email || 'N/A',
      check_in_date: data.check_in_date,
      check_out_date: data.check_out_date,
      check_in_time: displayTime,
      total_guests: data.total_guests,
      special_requests: data.special_requests,
      phone: data.phone,
      total_amount: data.total_amount,
      booking_status: data.booking_status,
      razorpay_order_id: data.razorpay_order_id,
      transaction_id: data.transaction_id,
      payment_status: data.payment_status,
      created_at: data.created_at,
      updated_at: data.updated_at
    };

    return new Response(
      JSON.stringify({ success: true, data: formattedBooking }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}