import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Create transporter for sending emails
const createTransporter = async () => {
  const nodemailer = await import('nodemailer');
  return nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
};

// Function to send welcome email to subscriber
async function sendWelcomeEmailToSubscriber(email) {
  try {
    const transporter = await createTransporter();
    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: email,
      subject: 'Welcome to Breeze & Grains Newsletter!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; border: 1px solid #e0e0e0;">
            <h1 style="color: #594B00; text-align: center; margin-bottom: 20px;">Welcome to Our Newsletter!</h1>
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Dear Subscriber,
            </p>
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Thank you for subscribing to the Breeze & Grains newsletter! We're thrilled to have you join our community.
            </p>
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              You'll now receive exclusive updates, special offers, and insights about our peaceful homestay by the backwaters of Kerala.
            </p>
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              If you have any questions, feel free to reach out to us at any time.
            </p>
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Warm regards,<br>
              The Breeze & Grains Team
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to subscriber: ${email}`);
  } catch (error) {
    console.error('Error sending welcome email to subscriber:', error);
    throw error;
  }
}

// Function to send notification email to owner
async function sendNotificationEmailToOwner(subscriberEmail) {
  try {
    const transporter = await createTransporter();
    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL, // Send to owner
      subject: 'New Newsletter Subscriber - Breeze & Grains',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; border: 1px solid #e0e0e0;">
            <h1 style="color: #594B00; text-align: center; margin-bottom: 20px;">New Newsletter Subscriber</h1>
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Hello,
            </p>
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              You have a new subscriber to your newsletter:
            </p>
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px; background-color: #f0f8f0; padding: 10px; border-radius: 5px;">
              <strong>Email:</strong> ${subscriberEmail}
            </p>
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              This person has joined your newsletter community. You may want to consider them for any special offers or updates.
            </p>
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Best regards,<br>
              Breeze & Grains Notification System
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Notification email sent to owner for subscriber: ${subscriberEmail}`);
  } catch (error) {
    console.error('Error sending notification email to owner:', error);
    throw error;
  }
}

export async function POST(request) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Valid email is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if email already exists in the newsletter_subscribers table
    const { data: existingSubscriber, error: fetchError } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', email)
      .single();

    if (existingSubscriber) {
      return new Response(
        JSON.stringify({ error: 'Email is already subscribed' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Insert the new subscriber into the database
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email, created_at: new Date().toISOString() }]);

    if (error) {
      console.error('Error inserting newsletter subscriber:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to subscribe to newsletter' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Send welcome email to the subscriber
    await sendWelcomeEmailToSubscriber(email);

    // Send notification email to the owner
    await sendNotificationEmailToOwner(email);

    return new Response(
      JSON.stringify({ success: true, message: 'Successfully subscribed to newsletter' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing newsletter subscription:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}