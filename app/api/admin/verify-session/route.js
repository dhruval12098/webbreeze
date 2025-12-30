import { supabase } from '@/app/lib/supabaseClient';

export async function GET(request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing or invalid authorization header' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Check if the session exists in admin_sessions table
    const { data: sessionData, error: sessionError } = await supabase
      .from('admin_sessions')
      .select(`
        id,
        admin_id,
        session_token,
        expires_at
      `)
      .eq('session_token', token)
      .single();
    
    if (sessionError || !sessionData) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized: Invalid session' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if session has expired
    if (new Date(sessionData.expires_at) < new Date()) {
      // Delete expired session
      await supabase
        .from('admin_sessions')
        .delete()
        .eq('id', sessionData.id);
      
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized: Session expired' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get admin details
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('id, email, name, created_at')
      .eq('id', sessionData.admin_id)
      .single();
    
    if (adminError || !adminData) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized: Admin not found' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Return success response with admin data
    return new Response(
      JSON.stringify({ 
        success: true, 
        admin: adminData,
        expiresAt: sessionData.expires_at
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Admin session verification error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}