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
    
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        rooms (title)
      `)
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
        room_name: booking.rooms?.title || booking.room_id, // Use room title if available, otherwise use room_id
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
    const bookingData = await request.json();
    
    // Validate required fields
    if (!bookingData.room_id || !bookingData.check_in_date || !bookingData.check_out_date || !bookingData.total_guests || !bookingData.total_amount) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required booking data: room_id, check_in_date, check_out_date, total_guests, or total_amount' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Validate date formats
    const checkInDate = new Date(bookingData.check_in_date);
    const checkOutDate = new Date(bookingData.check_out_date);
    
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid date format for check-in or check-out date' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Ensure check-out date is after check-in date
    if (checkOutDate <= checkInDate) {
      return new Response(
        JSON.stringify({ success: false, error: 'Check-out date must be after check-in date' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
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
      .lt('check_in_date', bookingData.check_out_date)
      .gt('check_out_date', bookingData.check_in_date)
      .in('booking_status', ['pending', 'confirmed']);
    
    if (overlapError) {
      console.error('Error checking for overlapping bookings:', overlapError);
      return new Response(
        JSON.stringify({ success: false, error: 'Error checking room availability: ' + overlapError.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
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
    
    // Ensure booking status is lowercase to match database constraint
    if (bookingToInsert.booking_status) {
      bookingToInsert.booking_status = bookingToInsert.booking_status.toLowerCase();
    } else {
      // Set default status if not provided
      bookingToInsert.booking_status = 'pending';
    }
    
    // Ensure payment status is lowercase to match database constraint
    if (bookingToInsert.payment_status) {
      bookingToInsert.payment_status = bookingToInsert.payment_status.toLowerCase();
    } else {
      // Set default status if not provided
      bookingToInsert.payment_status = 'pending';
    }
    
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
    let insertResult;
    try {
      insertResult = await supabase
        .from('bookings')
        .insert([bookingToInsert])
        .select();
    } catch (insertError) {
      console.error('Booking insertion error:', insertError);
      return new Response(
        JSON.stringify({ success: false, error: insertError.message || 'Database insertion failed' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (insertResult.error) {
      console.error('Booking insertion error:', insertResult.error);
      return new Response(
        JSON.stringify({ success: false, error: insertResult.error.message || 'Booking creation failed' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const data = insertResult.data;

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