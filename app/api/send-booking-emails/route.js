import nodemailer from 'nodemailer';
import { supabase } from '@/app/lib/supabaseClient';
import { generateReceiptPDF } from '@/app/lib/receiptGenerator';

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
    console.log('Received booking_id:', booking_id);

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

    // Generate PDF receipt (server-side adaptation)
    const pdfBuffer = await generatePDFBuffer(booking, user);

    // Email to user
    const userMailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: user.email,
      subject: 'Booking Confirmation - Breeze and Grains',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #594B00;">Booking Confirmed!</h2>
          <p>Dear ${user.name},</p>
          <p>Your booking has been confirmed and payment received successfully.</p>
          <p><strong>Booking ID:</strong> ${booking.id.substring(0, 8).toUpperCase()}</p>
          <p><strong>Total Amount:</strong> ₹${booking.total_amount}</p>
          <p>Please find your receipt attached.</p>
          <p>Thank you for choosing Breeze and Grains!</p>
          <br>
          <p>Best regards,<br>Breeze and Grains Team</p>
        </div>
      `,
      attachments: [
        {
          filename: `receipt-${booking.id.substring(0, 8)}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    // Email to admin
    const adminMailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: adminEmail,
      subject: 'New Booking Received - Breeze and Grains',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #594B00;">New Booking Alert</h2>
          <p>A new booking has been received and payment confirmed.</p>
          <p><strong>Booking ID:</strong> ${booking.id}</p>
          <p><strong>Customer:</strong> ${user.name} (${user.email})</p>
          <p><strong>Room:</strong> ${booking.rooms?.title || booking.room_id}</p>
          <p><strong>Dates:</strong> ${new Date(booking.check_in_date).toLocaleDateString()} - ${new Date(booking.check_out_date).toLocaleDateString()}</p>
          <p><strong>Amount:</strong> ₹${booking.total_amount}</p>
          <p><strong>Payment Status:</strong> ${booking.payment_status}</p>
          <p>Please check the admin dashboard for details.</p>
        </div>
      `,
    };

    // Send emails
    await transporter.sendMail(userMailOptions);
    await transporter.sendMail(adminMailOptions);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Email sending error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Server-side PDF generation
async function generatePDFBuffer(booking, user) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();

  // Set document properties
  doc.setProperties({
    title: `Booking Receipt - ${booking.id.substring(0, 8)}`,
    subject: 'Booking Receipt',
    author: 'Breezeand Grains',
    creator: 'Breezeand Grains Booking System'
  });

  // Brand colors
  const brandPrimary = [89, 75, 0]; // Gold/Brown
  const brandSecondary = [23, 58, 0]; // Dark Green
  const accentGold = [218, 165, 32]; // Lighter gold for accents
  const textPrimary = [31, 41, 55];
  const textSecondary = [107, 114, 128];
  const borderColor = [229, 231, 235];
  const lightBg = [252, 252, 250];

  // Page margins
  const margin = 20;
  const pageWidth = 210;
  const contentWidth = pageWidth - (margin * 2);

  // Header Section
  doc.setFillColor(...lightBg);
  doc.rect(0, 0, pageWidth, 50, 'F');
  
  doc.setDrawColor(...brandPrimary);
  doc.setLineWidth(3);
  doc.line(margin, 48, pageWidth - margin, 48);

  // Company name instead of logo (server-side limitation)
  doc.setFontSize(16);
  doc.setTextColor(...brandPrimary);
  doc.setFont(undefined, 'bold');
  doc.text('BREEZEAND GRAINS', margin, 22);

  // Receipt Title Box
  doc.setFillColor(...brandPrimary);
  doc.roundedRect(pageWidth - margin - 50, 12, 50, 24, 2, 2, 'F');
  
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.setFont(undefined, 'bold');
  doc.text('RECEIPT', pageWidth - margin - 25, 21, { align: 'center' });
  
  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');
  doc.text(`#${booking.id.substring(0, 8).toUpperCase()}`, pageWidth - margin - 25, 28, { align: 'center' });
  doc.text(new Date().toLocaleDateString('en-GB'), pageWidth - margin - 25, 32, { align: 'center' });

  let y = 58;

  // Customer Information Box
  doc.setDrawColor(...borderColor);
  doc.setLineWidth(1);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, y, contentWidth * 0.58, 36, 3, 3, 'FD');

  y += 7;
  doc.setFontSize(8);
  doc.setTextColor(...brandPrimary);
  doc.setFont(undefined, 'bold');
  doc.text('CUSTOMER INFORMATION', margin + 5, y);

  y += 7;
  doc.setFontSize(11);
  doc.setTextColor(...textPrimary);
  doc.setFont(undefined, 'bold');
  doc.text(user?.name || 'N/A', margin + 5, y);

  y += 5;
  doc.setFontSize(8);
  doc.setTextColor(...textSecondary);
  doc.setFont(undefined, 'normal');
  doc.text(user?.email || 'N/A', margin + 5, y);

  // Status Badge Box
  y = 65;
  let statusColor = [34, 197, 94]; // Green for confirmed
  let statusText = 'CONFIRMED';

  const statusBoxX = margin + (contentWidth * 0.58) + 8;
  const statusBoxWidth = contentWidth * 0.42 - 8;

  doc.setDrawColor(...statusColor);
  doc.setLineWidth(1);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(statusBoxX, y, statusBoxWidth, 29, 3, 3, 'FD');

  y += 7;
  doc.setFontSize(7);
  doc.setTextColor(...textSecondary);
  doc.setFont(undefined, 'normal');
  doc.text('STATUS', statusBoxX + (statusBoxWidth / 2), y, { align: 'center' });

  y += 7;
  doc.setFillColor(...statusColor);
  doc.roundedRect(statusBoxX + 8, y - 4, statusBoxWidth - 16, 11, 2, 2, 'F');
  
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.setFont(undefined, 'bold');
  doc.text(statusText, statusBoxX + (statusBoxWidth / 2), y + 2, { align: 'center' });

  // Booking Details Section
  y = 106;
  
  doc.setDrawColor(...borderColor);
  doc.setLineWidth(1);
  doc.setFillColor(...lightBg);
  doc.roundedRect(margin, y, contentWidth, 76, 3, 3, 'FD');

  y += 7;
  doc.setFontSize(10);
  doc.setTextColor(...brandPrimary);
  doc.setFont(undefined, 'bold');
  doc.text('BOOKING DETAILS', margin + 5, y);
  
  doc.setDrawColor(...accentGold);
  doc.setLineWidth(0.8);
  doc.line(margin + 5, y + 1.5, margin + 42, y + 1.5);

  y += 9;
  const detailsY = y;
  const col1X = margin + 5;
  const col2X = margin + (contentWidth / 2) + 5;

  const addDetail = (label, value, x, yPos, maxWidth = 75) => {
    doc.setFontSize(7);
    doc.setTextColor(...textSecondary);
    doc.setFont(undefined, 'normal');
    doc.text(label, x, yPos);

    doc.setFontSize(9);
    doc.setTextColor(...textPrimary);
    doc.setFont(undefined, 'bold');
    const lines = doc.splitTextToSize(String(value), maxWidth);
    doc.text(lines, x, yPos + 4.5);
    return yPos + 4.5 + ((lines.length - 1) * 4);
  };

  y = detailsY;
  y = addDetail('Room', booking.rooms?.title || booking.room_id || 'N/A', col1X, y, 75);
  y += 10;
  y = addDetail('Check-in Date', new Date(booking.check_in_date).toLocaleDateString('en-GB'), col1X, y, 75);
  y += 10;
  y = addDetail('Check-out Date', new Date(booking.check_out_date).toLocaleDateString('en-GB'), col1X, y, 75);

  y = detailsY;
  y = addDetail('Number of Guests', String(booking.total_guests || 1), col2X, y, 75);
  y += 10;
  y = addDetail('Check-in Time', booking.check_in_time || 'Flexible', col2X, y, 75);
  y += 10;
  y = addDetail('Booking Date', new Date(booking.created_at).toLocaleDateString('en-GB'), col2X, y, 75);

  // Payment Summary Box
  y = 194;
  doc.setFillColor(...brandPrimary);
  doc.setDrawColor(...brandPrimary);
  doc.setLineWidth(1);
  doc.roundedRect(margin, y, contentWidth, 32, 3, 3, 'FD');

  y += 8;
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.setFont(undefined, 'normal');
  doc.text('TOTAL AMOUNT', margin + 5, y);

  y += 2;
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  const amountText = '₹' + booking.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  doc.text(amountText, pageWidth - margin - 5, y + 4, { align: 'right' });

  y += 12;
  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');
  doc.text(`Payment Status: Paid`, margin + 5, y);

  // Footer
  y = 265;
  doc.setDrawColor(...accentGold);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);

  y += 5;
  doc.setFontSize(10);
  doc.setTextColor(...brandPrimary);
  doc.setFont(undefined, 'bold');
  doc.text('Thank you for choosing Breezeand Grains', pageWidth / 2, y, { align: 'center' });
  
  y += 5;
  doc.setFontSize(8);
  doc.setTextColor(...textSecondary);
  doc.setFont(undefined, 'normal');
  doc.text('hello@breezeandgrains.com | 123 Breezeand Grains Street, Digital City', pageWidth / 2, y, { align: 'center' });

  y += 4;
  doc.setFontSize(7);
  doc.setFont(undefined, 'italic');
  doc.setTextColor(...textSecondary);
  doc.text('This is a computer-generated receipt and does not require a signature.', pageWidth / 2, y, { align: 'center' });

  const arrayBuffer = doc.output('arraybuffer');
  // Convert ArrayBuffer to Buffer for nodemailer
  return Buffer.from(arrayBuffer);
}