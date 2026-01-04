// Import Supabase client
import { supabase } from '@/app/lib/supabaseClient';

// PUT /api/bookings/[id] - Update an existing booking
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Booking ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing or invalid authorization header' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const token = authHeader.substring(7).trim(); // Remove 'Bearer ' prefix and any whitespace
    
    // Verify the session token
    const { data: session, error: sessionError } = await supabase
      .from('user_sessions')
      .select('user_id, expires_at')
      .eq('token', token)
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
        .from('user_sessions')
        .delete()
        .eq('token', token);

      return new Response(
        JSON.stringify({ success: false, error: 'Session has expired' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if session is about to expire (within 10 minutes) and refresh it
    const tenMinutesInMs = 10 * 60 * 1000; // 10 minutes in milliseconds
    if (expiresAt.getTime() - now.getTime() < tenMinutesInMs) {
      // Extend the session by 12 hours
      const newExpiry = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 hours from now
      
      const { error: updateError } = await supabase
        .from('user_sessions')
        .update({ expires_at: newExpiry.toISOString() })
        .eq('token', token);
        
      if (updateError) {
        console.error('Error updating session expiry:', updateError);
      }
    }

    const userId = session.user_id;
    const updateData = await request.json();
    
    // Check if the booking belongs to the user
    const { data: existingBooking, error: fetchError } = await supabase
      .from('bookings')
      .select('user_id')
      .eq('id', id)
      .single();
      
    if (fetchError || !existingBooking) {
      return new Response(
        JSON.stringify({ success: false, error: 'Booking not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (existingBooking.user_id !== userId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized: You can only update your own bookings' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Update the booking
    const { data, error } = await supabase
      .from('bookings')
      .update({
        ...updateData,
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

// GET /api/bookings/[id] - Get a specific booking
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Booking ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing or invalid authorization header' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const token = authHeader.substring(7).trim(); // Remove 'Bearer ' prefix and any whitespace
    
    // Verify the session token
    const { data: session, error: sessionError } = await supabase
      .from('user_sessions')
      .select('user_id, expires_at')
      .eq('token', token)
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
        .from('user_sessions')
        .delete()
        .eq('token', token);

      return new Response(
        JSON.stringify({ success: false, error: 'Session has expired' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if session is about to expire (within 10 minutes) and refresh it
    const tenMinutesInMs = 10 * 60 * 1000; // 10 minutes in milliseconds
    if (expiresAt.getTime() - now.getTime() < tenMinutesInMs) {
      // Extend the session by 12 hours
      const newExpiry = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 hours from now
      
      const { error: updateError } = await supabase
        .from('user_sessions')
        .update({ expires_at: newExpiry.toISOString() })
        .eq('token', token);
        
      if (updateError) {
        console.error('Error updating session expiry:', updateError);
      }
    }

    const userId = session.user_id;
    
    // Check if the booking belongs to the user
    const { data: booking, error } = await supabase
      .from('bookings')
      .select(`
        *,
        rooms (title)
      `)
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!booking) {
      return new Response(
        JSON.stringify({ success: false, error: 'Booking not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

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
    
    const formattedBooking = {
      ...booking,
      room_name: booking.rooms?.title || booking.room_id, // Use room title if available, otherwise use room_id
      check_in_time: displayTime
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

// DELETE /api/bookings/[id] - Delete a booking
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Booking ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing or invalid authorization header' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const token = authHeader.substring(7).trim(); // Remove 'Bearer ' prefix and any whitespace
    
    // Verify the session token
    const { data: session, error: sessionError } = await supabase
      .from('user_sessions')
      .select('user_id, expires_at')
      .eq('token', token)
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
        .from('user_sessions')
        .delete()
        .eq('token', token);

      return new Response(
        JSON.stringify({ success: false, error: 'Session has expired' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if session is about to expire (within 10 minutes) and refresh it
    const tenMinutesInMs = 10 * 60 * 1000; // 10 minutes in milliseconds
    if (expiresAt.getTime() - now.getTime() < tenMinutesInMs) {
      // Extend the session by 12 hours
      const newExpiry = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 hours from now
      
      const { error: updateError } = await supabase
        .from('user_sessions')
        .update({ expires_at: newExpiry.toISOString() })
        .eq('token', token);
        
      if (updateError) {
        console.error('Error updating session expiry:', updateError);
      }
    }

    const userId = session.user_id;
    
    // Check if the booking belongs to the user
    const { data: existingBooking, error: fetchError } = await supabase
      .from('bookings')
      .select('user_id, booking_status')
      .eq('id', id)
      .single();
      
    if (fetchError || !existingBooking) {
      return new Response(
        JSON.stringify({ success: false, error: 'Booking not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (existingBooking.user_id !== userId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized: You can only delete your own bookings' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Prevent deletion of confirmed bookings
    if (existingBooking.booking_status === 'Confirmed') {
      return new Response(
        JSON.stringify({ success: false, error: 'Cannot delete a confirmed booking' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
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
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}