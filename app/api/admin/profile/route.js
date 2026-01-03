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
    
    // Check if session is about to expire (within 10 minutes) and refresh it
    const tenMinutesInMs = 10 * 60 * 1000; // 10 minutes in milliseconds
    if (expiresAt.getTime() - now.getTime() < tenMinutesInMs) {
      // Extend the session by 12 hours
      const newExpiry = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 hours from now
      
      const { error: updateError } = await supabase
        .from('admin_sessions')
        .update({ expires_at: newExpiry.toISOString() })
        .eq('session_token', token);
      
      if (updateError) {
        console.error('Error updating admin session expiry:', updateError);
      }
    }

    // Fetch admin data
    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .eq('id', session.admin_id)
      .single();

    if (adminError || !admin) {
      return new Response(
        JSON.stringify({ success: false, error: 'Admin not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Return admin data without sensitive information
    const cleanAdmin = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      created_at: new Date(admin.created_at).toISOString(),
    };
    
    // Ensure clean data for JSON response
    const responsePayload = {
      success: true,
      admin: cleanAdmin,
      expiresAt: session.expires_at
    };
    
    return new Response(
      JSON.stringify(responsePayload),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Admin profile fetch error:', error);
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
    
    // Check if session is about to expire (within 10 minutes) and refresh it
    const tenMinutesInMs = 10 * 60 * 1000; // 10 minutes in milliseconds
    if (expiresAt.getTime() - now.getTime() < tenMinutesInMs) {
      // Extend the session by 12 hours
      const newExpiry = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 hours from now
      
      const { error: updateError } = await supabase
        .from('admin_sessions')
        .update({ expires_at: newExpiry.toISOString() })
        .eq('session_token', token);
      
      if (updateError) {
        console.error('Error updating admin session expiry:', updateError);
      }
    }

    // Get updated admin data from request
    const { name, email } = await request.json();

    // Update admin data
    const { data: updatedAdmin, error: updateError } = await supabase
      .from('admins')
      .update({
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        updated_at: new Date().toISOString()
      })
      .eq('id', session.admin_id)
      .select()
      .single();

    if (updateError) {
      console.error('Admin profile update error:', updateError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to update admin profile' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Return updated admin data without sensitive information
    const cleanAdmin = {
      id: updatedAdmin.id,
      email: updatedAdmin.email,
      name: updatedAdmin.name,
      created_at: new Date(updatedAdmin.created_at).toISOString(),
    };
    
    // Ensure clean data for JSON response
    const responsePayload = {
      success: true,
      admin: cleanAdmin,
      expiresAt: session.expires_at
    };
    
    return new Response(
      JSON.stringify(responsePayload),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Admin profile update error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}