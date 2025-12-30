import { supabase } from '@/app/lib/supabaseClient';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return new Response(
        JSON.stringify({ success: false, error: 'Email and password are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Query the admin from the admins table
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid admin email or password' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Compare the provided password with the hashed password
    const isValidPassword = await bcrypt.compare(password, data.password_hash);
    if (!isValidPassword) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid admin email or password' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create a session token
    const token = generateToken();
    
    // Set expiration: 7 days
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Store session in the admin_sessions table
    const { error: sessionError } = await supabase
      .from('admin_sessions')
      .insert({
        admin_id: data.id,
        session_token: token,
        expires_at: expiresAt.toISOString()
      });

    if (sessionError) {
      console.error('Admin session creation error:', sessionError);
      return new Response(
        JSON.stringify({ success: false, error: 'Admin login failed' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Return admin data without password, ensuring clean data extraction
    const cleanAdmin = {
      id: data.id,
      email: data.email,
      name: data.name,
      created_at: new Date(data.created_at).toISOString(),
    };
    
    // Clean up old expired sessions for this admin
    await supabase
      .from('admin_sessions')
      .delete()
      .eq('admin_id', data.id)
      .lt('expires_at', new Date().toISOString());

    // Ensure clean data for JSON response
    const responsePayload = {
      success: true,
      admin: cleanAdmin,
      token: token,
      expiresAt: expiresAt.toISOString()
    };

    return new Response(
      JSON.stringify(responsePayload),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Admin login error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Simple token generation function (in production, consider using JWT)
function generateToken() {
  return 'admin_token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}