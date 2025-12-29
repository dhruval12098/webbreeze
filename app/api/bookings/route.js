import { supabase } from '@/app/lib/supabaseClient';

// GET /api/bookings - Get all bookings for a user
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

    const userId = session.user_id;
    
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Format the booking data for proper display
    const formattedData = data.map(booking => {
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
        ...booking,
        check_in_time: displayTime
      };
    });
    
    return new Response(
      JSON.stringify({ success: true, data: formattedData }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// POST /api/bookings - Create a new booking
export async function POST(request) {
  try {
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
    
    const userId = session.user_id;
    const bookingData = await request.json();
    
    // Verify the user exists
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (userError || !userData) {
      return new Response(
        JSON.stringify({ success: false, error: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Verify the room exists
    const { data: roomData, error: roomError } = await supabase
      .from('rooms')
      .select('id')
      .eq('id', bookingData.room_id)
      .single();
    
    if (roomError || !roomData) {
      return new Response(
        JSON.stringify({ success: false, error: 'Room not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Check for overlapping bookings for the same room
    // Using daterange to check for overlaps as per the database constraint
    // Note: check-out date is available for check-in since check-out happens at 10 AM
    const { data: overlappingBookings, error: overlapError } = await supabase
      .from('bookings')
      .select('id')
      .eq('room_id', bookingData.room_id)
      .or(`and(check_in_date.lt.${bookingData.check_out_date},check_out_date.gt.${bookingData.check_in_date})`)
      .in('booking_status', ['pending', 'confirmed']);
    
    if (overlapError) {
      console.error('Error checking for overlapping bookings:', overlapError);
    } else if (overlappingBookings && overlappingBookings.length > 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Room is already booked for the selected dates' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Prepare the booking data with proper time format
    let bookingToInsert = {
      ...bookingData,
      user_id: userId
    };
    
    // Ensure check_in_time is properly formatted for database storage
    if (bookingData.check_in_time) {
      // If check_in_time is in HH:MM AM/PM format, convert to 24-hour for database
      const [time, period] = bookingData.check_in_time.split(' ');
      let [hours, minutes] = time.split(':');
      
      hours = parseInt(hours, 10);
      
      if (period === 'AM' && hours === 12) {
        hours = 0;
      } else if (period === 'PM' && hours !== 12) {
        hours += 12;
      }
      
      // Format hours to ensure it's always 2 digits
      const formattedHours = hours.toString().padStart(2, '0');
      bookingToInsert.check_in_time = `${formattedHours}:${minutes}`;
    }
    
    // Insert the booking
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingToInsert])
      .select();

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: data[0] }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}