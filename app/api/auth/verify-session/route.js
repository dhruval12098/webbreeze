import { supabase } from '@/app/lib/supabaseClient';

export async function GET(request) {
  try {
    // Get token from Authorization header (Next.js normalizes headers to lowercase)
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
      return new Response(
        JSON.stringify({ success: false, error: 'No token provided' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.substring(7).trim(); // Remove 'Bearer ' prefix and any whitespace

    // Check if session exists and is valid
    const { data: session, error: sessionError } = await supabase
      .from('user_sessions')
      .select('*, users(*)')
      .eq('token', token)
      .gt('expires_at', new Date().toISOString()) // Must not be expired
      .single();

    if (sessionError || !session) {
      // Session not found or expired
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid or expired session',
          isExpired: true 
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is still active
    if (!session.users.is_active) {
      return new Response(
        JSON.stringify({ success: false, error: 'User account is inactive' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if session is about to expire (within 10 minutes) and refresh it
    const tenMinutesInMs = 10 * 60 * 1000; // 10 minutes in milliseconds
    const now = new Date();
    const expiresAt = new Date(session.expires_at);
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

    // Return user data without password, ensuring clean data extraction
    const cleanUser = {
      id: session.users.id,
      email: session.users.email,
      name: session.users.name,
      created_at: new Date(session.users.created_at).toISOString(),
      updated_at: new Date(session.users.updated_at).toISOString(),
      is_active: session.users.is_active
    };
    
    // Ensure clean data for JSON response
    const responsePayload = {
      success: true,
      user: cleanUser,
      expiresAt: new Date(session.expires_at).toISOString()
    };

    return new Response(
      JSON.stringify(responsePayload),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Session verification error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Session verification failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}