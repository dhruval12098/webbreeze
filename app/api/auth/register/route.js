import { supabase } from '@/app/lib/supabaseClient';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { name, email, password, rememberMe } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ success: false, error: 'Name, email, and password are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid email format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if user already exists
    const { data: existingUser, error: existingError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return new Response(
        JSON.stringify({ success: false, error: 'User with this email already exists' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        name: name,
        email: email,
        password_hash: hashedPassword
      })
      .select()
      .single();

    if (insertError) {
      console.error('User creation error:', insertError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to create user' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create a session token for the newly registered user
    const token = generateToken();
    
    // Set expiration: 7 days default, 30 days with rememberMe
    const expirationDays = rememberMe ? 30 : 7;
    const expiresAt = new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000);

    // Store session in the user_sessions table
    const { error: sessionError } = await supabase
      .from('user_sessions')
      .insert({
        user_id: newUser.id,
        token: token,
        expires_at: expiresAt.toISOString(),
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        user_agent: request.headers.get('user-agent')
      });

    if (sessionError) {
      console.error('Session creation error:', sessionError);
      // Don't fail the registration just because session creation failed
      console.warn('Failed to create session, but user was created');
    }

    // Return user data without password, ensuring clean data extraction
    const cleanUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      created_at: new Date(newUser.created_at).toISOString(),
      updated_at: new Date(newUser.updated_at).toISOString(),
      is_active: newUser.is_active
    };
    
    // Clean up old expired sessions for this user
    await supabase
      .from('user_sessions')
      .delete()
      .eq('user_id', newUser.id)
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
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Registration error:', error);
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