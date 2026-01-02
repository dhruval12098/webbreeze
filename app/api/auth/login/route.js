import { supabase } from '@/app/lib/supabaseClient';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const { email, password, rememberMe, isGoogleAuth, userData } = await request.json();

    let user;
    let error;

    if (isGoogleAuth && userData) {
      // Handle Google authentication
      // Check if user already exists in database
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', userData.email)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows found
        // There was an actual error
        error = fetchError;
      } else if (!existingUser) {
        // User doesn't exist, create new user
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert([{
            email: userData.email,
            full_name: userData.name,
            avatar_url: userData.avatar_url,
            is_verified: true,
            auth_method: 'google',
            is_active: true
          }])
          .select()
          .single();
        
        if (insertError) {
          console.error('Error creating Google user:', insertError);
          return new Response(
            JSON.stringify({ success: false, error: 'Failed to create user account' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }
        user = newUser;
      } else {
        // User exists
        user = existingUser;
        
        // Check if user is trying to log in with a different auth method than they registered with
        if (existingUser.auth_method && existingUser.auth_method !== 'google') {
          // User previously registered with email/password, should use that method
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Please login with your password as this account was created with email/password authentication' 
            }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
          );
        }
        
        // Update user info with Google data if needed
        const { error: updateError } = await supabase
          .from('users')
          .update({ 
            full_name: userData.name,
            avatar_url: userData.avatar_url,
            is_verified: true
          })
          .eq('id', existingUser.id);
        
        if (updateError) {
          console.error('Error updating user info:', updateError);
        }
      }
    } else {
      // Handle traditional email/password authentication
      // Validate input
      if (!email || !password) {
        return new Response(
          JSON.stringify({ success: false, error: 'Email and password are required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Query the user from Supabase
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();
      
      user = data;
      error = fetchError;

      if (error || !user) {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid email or password' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      // Check if user is trying to log in with password but registered with Google
      if (user.auth_method && user.auth_method === 'google') {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Please login with Google as this account was created with Google authentication' 
          }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      // Check if password is null (Google-only user)
      if (!user.password_hash) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Please login with Google as this account was created with Google authentication' 
          }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      // Compare the provided password with the hashed password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid email or password' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Create a JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        auth_method: user.auth_method || 'password'
      }, 
      process.env.JWT_SECRET, 
      { 
        expiresIn: rememberMe ? '7d' : '12h' 
      }
    );
    
    // Set expiration: 12 hours default, 7 days with rememberMe
    const expirationHours = rememberMe ? 168 : 12; // 168 hours = 7 days, 12 hours for regular session
    const expiresAt = new Date(Date.now() + expirationHours * 60 * 60 * 1000);

    // Clean up old expired sessions for this user first
    await supabase
      .from('user_sessions')
      .delete()
      .eq('user_id', user.id)
      .lt('expires_at', new Date().toISOString());

    // Store session in the user_sessions table
    const { error: sessionError } = await supabase
      .from('user_sessions')
      .insert({
        user_id: user.id,
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
      id: user.id,
      email: user.email,
      name: user.full_name || user.name,
      created_at: new Date(user.created_at).toISOString(),
      updated_at: new Date(user.updated_at).toISOString(),
      is_active: user.is_active,
      is_verified: user.is_verified,
      avatar_url: user.avatar_url,
      auth_method: user.auth_method
    };

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

