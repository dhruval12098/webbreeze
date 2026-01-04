import { supabase } from '@/app/lib/supabaseClient';

// GET /api/admin/metrics - Get dashboard metrics for admin view
export async function GET(request) {
  try {
    // Get admin ID from auth header or session
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing or invalid authorization header' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify the admin session token
    const { data: session, error: sessionError } = await supabase
      .from('admin_sessions')
      .select('admin_id, expires_at')
      .eq('session_token', token)
      .single();

    if (sessionError || !session) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid or expired admin session' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if session is expired
    const sessionCheckTime = new Date();
    const expiresAt = new Date(session.expires_at);
    if (sessionCheckTime > expiresAt) {
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

    // Get current month and year for revenue calculation
    const revenueCalcDate = new Date();
    const currentMonth = revenueCalcDate.getMonth() + 1;
    const currentYear = revenueCalcDate.getFullYear();
    
    // Format date for SQL query (YYYY-MM-DD)
    const startDate = new Date(currentYear, currentMonth - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(currentYear, currentMonth, 0).toISOString().split('T')[0];

    // Fetch metrics in parallel
    const [
      // Total bookings count
      bookingsCountResult,
      // Total enquiries count
      enquiriesCountResult,
      // Revenue for current month
      revenueResult,
      // Total users count
      usersCountResult,
      // Recent bookings (last 5)
      recentBookingsResult,
      // Recent enquiries (last 5)
      recentEnquiriesResult
    ] = await Promise.all([
      // Total bookings count
      supabase
        .from('bookings')
        .select('id', { count: 'exact', head: true }),
      
      // Total enquiries count
      supabase
        .from('enquiries')
        .select('id', { count: 'exact', head: true }),
      
      // Revenue for current month
      supabase
        .from('bookings')
        .select('total_amount')
        .gte('created_at', `${startDate}T00:00:00`)
        .lte('created_at', `${endDate}T23:59:59`)
        .eq('booking_status', 'Confirmed'),
      
      // Total users count
      supabase
        .from('users')
        .select('id', { count: 'exact', head: true }),
      
      // Recent bookings (last 5)
      supabase
        .from('bookings')
        .select(`
          *,
          users (name, full_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(5),
      
      // Recent enquiries (last 5)
      supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)
    ]);

    // Handle errors
    if (bookingsCountResult.error) {
      throw new Error(bookingsCountResult.error.message);
    }
    
    if (enquiriesCountResult.error) {
      throw new Error(enquiriesCountResult.error.message);
    }
    
    if (revenueResult.error) {
      throw new Error(revenueResult.error.message);
    }
    
    if (usersCountResult.error) {
      throw new Error(usersCountResult.error.message);
    }
    
    if (recentBookingsResult.error) {
      throw new Error(recentBookingsResult.error.message);
    }
    
    if (recentEnquiriesResult.error) {
      throw new Error(recentEnquiriesResult.error.message);
    }

    // Calculate total revenue for current month
    const totalRevenue = revenueResult.data.reduce((sum, booking) => {
      return sum + (booking.total_amount || 0);
    }, 0);

    // Format recent bookings
    const recentBookings = recentBookingsResult.data.map(booking => {
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
        user_name: booking.users?.name || booking.users?.full_name || 'Unknown User',
        room_id: booking.room_id,
        check_in_date: booking.check_in_date,
        check_out_date: booking.check_out_date,
        booking_status: booking.booking_status,
        created_at: booking.created_at,
        check_in_time: displayTime,
        total_amount: booking.total_amount
      };
    });

    // Format recent enquiries
    const recentEnquiries = recentEnquiriesResult.data.map(enquiry => ({
      id: enquiry.id,
      name: enquiry.name,
      email: enquiry.email,
      message: enquiry.message,
      created_at: enquiry.created_at
    }));

    // Prepare the response
    const metrics = {
      totalBookings: bookingsCountResult.count || 0,
      totalEnquiries: enquiriesCountResult.count || 0,
      totalRevenue: totalRevenue || 0,
      totalUsers: usersCountResult.count || 0,
      recentBookings: recentBookings || [],
      recentEnquiries: recentEnquiries || []
    };

    return new Response(
      JSON.stringify({ success: true, data: metrics }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching admin metrics:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}