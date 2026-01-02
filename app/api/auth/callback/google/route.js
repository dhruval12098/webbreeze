import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=google_auth_failed`);
  }

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=no_code`);
  }

  try {
    const client_id = process.env.GOOGLE_CLIENT_ID;
    const client_secret = process.env.GOOGLE_CLIENT_SECRET;
    const redirect_uri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`;

    if (!client_id || !client_secret) {
      return NextResponse.json({ error: 'Google OAuth not configured' }, { status: 500 });
    }

    const oauth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uri
    );

    // Get access token
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info from Google
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    // Check if user already exists in Supabase
    let { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', data.email)
      .single();

    let user;
    if (existingUser) {
      // Check if user is trying to log in with Google but registered with email/password
      if (existingUser.auth_method && existingUser.auth_method !== 'google') {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=wrong_auth_method`);
      }
      
      // User already exists, update their Google info if needed
      user = existingUser;
      
      // Update user info with Google data
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          full_name: data.name,
          avatar_url: data.picture,
          is_verified: true
        })
        .eq('id', existingUser.id);
      
      if (updateError) {
        console.error('Error updating user info:', updateError);
      }
    } else {
      // Create new user in Supabase
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            email: data.email,
            full_name: data.name,
            avatar_url: data.picture,
            is_verified: true,
            auth_method: 'google'
          }
        ])
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user:', insertError);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=user_creation_failed`);
      }
      
      user = newUser;
    }

    // Generate JWT token server-side
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        auth_method: user.auth_method || 'google'
      }, 
      process.env.JWT_SECRET, 
      { 
        expiresIn: '7d' // 7 days for Google users
      }
    );
    
    const expiresAt = new Date(Date.now() + 7*24*60*60*1000); // 7 days
    
    // Clean up old expired sessions for this user
    await supabase
      .from('user_sessions')
      .delete()
      .eq('user_id', user.id)
      .lt('expires_at', new Date().toISOString());

    // Insert new session (only once)
    const { error: sessionError } = await supabase.from('user_sessions').insert({
      user_id: user.id,
      token,
      expires_at: expiresAt.toISOString(),
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      user_agent: request.headers.get('user-agent')
    });
    
    if (sessionError) {
      console.error('Error creating session:', sessionError);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=session_creation_failed`);
    }

    // Redirect to frontend with the JWT token (no user data in URL)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/auth/google-success?token=${token}`
    );
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=google_auth_failed`);
  }
}