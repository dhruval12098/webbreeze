import { supabase } from '@/app/lib/supabaseClient';

/**
 * Admin authentication middleware to protect admin API routes
 * @param {Request} request - The incoming request object
 * @returns {Response|null} - Null if authenticated, Response object if not authenticated
 */
export async function authenticateAdminRequest(request) {
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
    
    // For admin routes, we've successfully authenticated
    // Return session data to be used in the route
    return { success: true, admin: adminData, sessionId: sessionData.id };
  } catch (error) {
    console.error('Admin authentication error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Authentication error: ' + error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Helper function to wrap admin API routes with authentication
 * @param {Function} handler - The API route handler function
 * @returns {Function} - Wrapped handler function with authentication
 */
export function withAdminAuth(handler) {
  return async function(request, params) {
    // Check admin authentication
    const authResult = await authenticateAdminRequest(request);
    
    if (!authResult.success) {
      return authResult; // Return unauthorized response
    }
    
    // Add admin data to the request
    request.admin = authResult.admin;
    request.sessionId = authResult.sessionId;
    
    // If authenticated, proceed with the original handler
    return handler(request, params);
  };
}