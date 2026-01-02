import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET() {
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

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['profile', 'email'],
      response_type: 'code',
      prompt: 'select_account', // Ensures the account chooser appears
    });

    // Redirect to Google
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.json({ error: 'Failed to initiate Google OAuth' }, { status: 500 });
  }
}