import { supabase } from '@/app/lib/supabaseClient';

export async function GET(request) {
  try {
    // Extract token from Authorization header (Next.js normalizes headers to lowercase)
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

    // Fetch user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user_id)
      .eq('is_active', true)
      .single();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Return user data without password, ensuring clean data extraction
    const cleanUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      created_at: new Date(user.created_at).toISOString(),
      updated_at: new Date(user.updated_at).toISOString(),
      is_active: user.is_active
    };
    
    // Ensure clean data for JSON response
    const responsePayload = {
      success: true,
      user: cleanUser,
      expiresAt: session.expires_at
    };
    
    return new Response(
      JSON.stringify(responsePayload),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Profile fetch error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function PUT(request) {
  try {
    // Extract token from Authorization header (Next.js normalizes headers to lowercase)
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

    // Get updated user data from request
    const { name, email } = await request.json();

    // Update user data
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        updated_at: new Date().toISOString()
      })
      .eq('id', session.user_id)
      .select()
      .single();

    if (updateError) {
      console.error('Profile update error:', updateError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to update profile' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Return updated user data without password, ensuring clean data extraction
    const cleanUser = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      created_at: new Date(updatedUser.created_at).toISOString(),
      updated_at: new Date(updatedUser.updated_at).toISOString(),
      is_active: updatedUser.is_active
    };
    
    // Ensure clean data for JSON response
    const responsePayload = {
      success: true,
      user: cleanUser,
      expiresAt: session.expires_at
    };
    
    return new Response(
      JSON.stringify(responsePayload),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Profile update error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}