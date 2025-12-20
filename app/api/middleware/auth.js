import { supabase } from '@/app/lib/supabaseClient';

/**
 * Authentication middleware to protect API routes
 * @param {Request} request - The incoming request object
 * @returns {Response|null} - Null if authenticated, Response object if not authenticated
 */
export async function authenticateRequest(request) {
  // Skip authentication during development/testing
  // Also skip if NODE_ENV is undefined (default development behavior)
  if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
    try {
      // Get the session from cookies or authorization header
      const session = await supabase.auth.getSession();
      
      // Alternative approach using authorization header
      // const authHeader = request.headers.get('authorization');
      // if (!authHeader || !authHeader.startsWith('Bearer ')) {
      //   return new Response(
      //     JSON.stringify({ success: false, error: 'Missing or invalid authorization header' }),
      //     { status: 401, headers: { 'Content-Type': 'application/json' } }
      //   );
      // }
      
      // const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      
      // Check if user is authenticated
      if (!session || !session.data || !session.data.session) {
        return new Response(
          JSON.stringify({ success: false, error: 'Unauthorized: No active session' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      // Optionally check user role/permissions
      const user = session.data.session.user;
      if (!user) {
        return new Response(
          JSON.stringify({ success: false, error: 'Unauthorized: No user data' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      // For admin-only routes, you might want to check user role
      // This would depend on how you've set up user roles in your application
      // For example:
      // if (user.app_metadata.role !== 'admin') {
      //   return new Response(
      //     JSON.stringify({ success: false, error: 'Forbidden: Insufficient permissions' }),
      //     { status: 403, headers: { 'Content-Type': 'application/json' } }
      //   );
      // }
      
      // If authenticated, return null to indicate success
      return null;
    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authentication error: ' + error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
  
  // In development mode, bypass authentication
  return null;
}

/**
 * Helper function to wrap API routes with authentication
 * @param {Function} handler - The API route handler function
 * @returns {Function} - Wrapped handler function with authentication
 */
export function withAuth(handler) {
  return async function(request, params) {
    // Check authentication
    const authResponse = await authenticateRequest(request);
    if (authResponse) {
      return authResponse; // Return unauthorized response
    }
    
    // If authenticated, proceed with the original handler
    return handler(request, params);
  };
}