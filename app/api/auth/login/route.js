import { supabase } from '@/app/lib/supabaseClient';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { email, password, rememberMe } = await request.json();

    // Validate input
    if (!email || !password) {
      return new Response(
        JSON.stringify({ success: false, error: 'Email and password are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Query the user from Supabase
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid email or password' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Compare the provided password with the hashed password
    const isValidPassword = await bcrypt.compare(password, data.password_hash);
    if (!isValidPassword) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid email or password' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create a session token (you might want to use JWT or a different approach)
    // For now, we'll return user data with a simple token
    const token = generateToken();
    
    // Set expiration: 7 days default, 30 days with rememberMe
    const expirationDays = rememberMe ? 30 : 7;
    const expiresAt = new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000);

    // Store session in the user_sessions table
    const { error: sessionError } = await supabase
      .from('user_sessions')
      .insert({
        user_id: data.id,
        token: token,
        expires_at: expiresAt.toISOString(),
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        user_agent: request.headers.get('user-agent')
      });

    if (sessionError) {
      console.error('Session creation error:', sessionError);
      return new Response(
        JSON.stringify({ success: false, error: 'Login failed' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Return user data without password, ensuring clean data extraction
    const cleanUser = {
      id: data.id,
      email: data.email,
      name: data.name,
      created_at: new Date(data.created_at).toISOString(),
      updated_at: new Date(data.updated_at).toISOString(),
      is_active: data.is_active
    };
    
    // Clean up old expired sessions for this user
    await supabase
      .from('user_sessions')
      .delete()
      .eq('user_id', data.id)
      .lt('expires_at', new Date().toISOString());

    // Ensure clean data for JSON response
    const responsePayload = {
      success: true,
      user: cleanUser,
      token: token,
      expiresAt: expiresAt.toISOString()
    };

    return new Response(
      JSON.stringify(responsePayload),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Simple token generation function (in production, consider using JWT)
function generateToken() {
  return 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}