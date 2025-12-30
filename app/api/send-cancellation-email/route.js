import nodemailer from 'nodemailer';
import { supabase } from '@/app/lib/supabaseClient';

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function POST(request) {
  try {
    const { booking_id } = await request.json();
    console.log('Received booking_id for cancellation:', booking_id);

    // Fetch booking with user and room details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        users (name, email),
        rooms (title)
      `)
      .eq('id', booking_id)
      .single();

    console.log('Booking query result:', { booking, bookingError });

    if (bookingError || !booking) {
      console.error('Booking not found error:', bookingError);
      throw new Error('Booking not found');
    }

    const user = booking.users;
    const adminEmail = process.env.ADMIN_EMAIL;

    // Email to user
    const userMailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: user.email,
      subject: 'Booking Cancellation - Breeze and Grains',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0A3D2E 0%, #1F5F4A 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Booking Cancelled</h1>
            <p style="color: #E8F6EF; margin: 10px 0 0 0; font-size: 16px;">We're sorry to see you go</p>
          </div>

          <div style="background: white; padding: 30px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">Dear ${user.name},</p>

            <p style="font-size: 16px; line-height: 1.6; color: #374151;">
              Your booking has been cancelled as requested. Here are the details of your cancelled booking:
            </p>

            <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 15px 0; color: #0A3D2E; font-size: 18px;">Booking Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB; font-weight: bold; color: #374151;">Room:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB; color: #374151;">${booking.rooms?.title || booking.room_id || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB; font-weight: bold; color: #374151;">Check-in:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB; color: #374151;">${booking.check_in_date} at ${booking.check_in_time}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB; font-weight: bold; color: #374151;">Check-out:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB; color: #374151;">${booking.check_out_date} at ${booking.check_out_time}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB; font-weight: bold; color: #374151;">Guests:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB; color: #374151;">${booking.total_guests}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Amount Paid:</td>
                  <td style="padding: 8px 0; color: #374151;">₹${booking.total_amount}</td>
                </tr>
              </table>
            </div>

            <p style="font-size: 16px; line-height: 1.6; color: #374151;">
              If you have any questions or need to make a new booking, please don't hesitate to contact us.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}"
                 style="background: linear-gradient(135deg, #0A3D2E 0%, #1F5F4A 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Book Again
              </a>
            </div>

            <p style="font-size: 14px; line-height: 1.6; color: #6B7280; text-align: center; margin: 20px 0 0 0;">
              Best regards,<br>
              <strong>The Breeze and Grains Team</strong>
            </p>
          </div>
        </div>
      `,
    };

    // Email to admin
    const adminMailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: adminEmail,
      subject: 'Booking Cancelled - Admin Notification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Booking Cancelled</h1>
            <p style="color: #FECACA; margin: 10px 0 0 0; font-size: 16px;">A booking has been cancelled</p>
          </div>

          <div style="background: white; padding: 30px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">
              A booking has been cancelled by the admin. Here are the details:
            </p>

            <div style="background: #FEF2F2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #DC2626;">
              <h3 style="margin: 0 0 15px 0; color: #DC2626; font-size: 18px;">Cancelled Booking Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #FECACA; font-weight: bold; color: #374151;">Customer:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #FECACA; color: #374151;">${user.name} (${user.email})</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #FECACA; font-weight: bold; color: #374151;">Room:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #FECACA; color: #374151;">${booking.rooms?.title || booking.room_id || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #FECACA; font-weight: bold; color: #374151;">Dates:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #FECACA; color: #374151;">${booking.check_in_date} - ${booking.check_out_date}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #FECACA; font-weight: bold; color: #374151;">Amount:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #FECACA; color: #374151;">₹${booking.total_amount}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Transaction ID:</td>
                  <td style="padding: 8px 0; color: #374151;">${booking.transaction_id || 'N/A'}</td>
                </tr>
              </table>
            </div>

            <p style="font-size: 14px; line-height: 1.6; color: #6B7280; text-align: center; margin: 20px 0 0 0;">
              This is an automated notification from the booking system.
            </p>
          </div>
        </div>
      `,
    };

    // Send emails
    await transporter.sendMail(userMailOptions);
    await transporter.sendMail(adminMailOptions);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Cancellation emails sent successfully'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Cancellation email error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}