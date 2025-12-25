import { supabase } from '@/app/lib/supabaseClient';

export async function POST(request) {
  try {
    // Extract token from Authorization header (Next.js normalizes headers to lowercase)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing or invalid authorization header' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Delete the session from the database
    const { error } = await supabase
      .from('user_sessions')
      .delete()
      .eq('token', token);

    if (error) {
      console.error('Logout error:', error);
      return new Response(
        JSON.stringify({ success: false, error: 'Logout failed' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Ensure clean data for JSON response
    const responsePayload = {
      success: true,
      message: 'Logged out successfully'
    };
    
    return new Response(
      JSON.stringify(responsePayload),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Logout error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}