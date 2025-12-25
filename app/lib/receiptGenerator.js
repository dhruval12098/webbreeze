import jsPDF from 'jspdf';

// Function to generate a professional receipt PDF
export const generateReceiptPDF = async (booking, user) => {
  const doc = new jsPDF();

  // Set document properties
  doc.setProperties({
    title: `Booking Receipt - ${booking.id.substring(0, 8)}`,
    subject: 'Booking Receipt',
    author: 'Breezeand Grains',
    creator: 'Breezeand Grains Booking System'
  });

  // Brand colors
  const brandPrimary = [89, 75, 0];
  const brandSecondary = [23, 58, 0];
  const textPrimary = [31, 41, 55];
  const textSecondary = [107, 114, 128];
  const borderColor = [229, 231, 235];

  // Load and add logo
  try {
    const img = new Image();
    img.src = '/logo.svg';
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
    doc.addImage(img, 'SVG', 20, 15, 40, 12);
  } catch (error) {
    doc.setFontSize(18);
    doc.setTextColor(...brandPrimary);
    doc.setFont(undefined, 'bold');
    doc.text('BREEZEAND GRAINS', 20, 24);
  }

  // Receipt Title - Top Right
  doc.setFontSize(20);
  doc.setTextColor(...brandSecondary);
  doc.setFont(undefined, 'bold');
  doc.text('RECEIPT', 190, 20, { align: 'right' });

  // Receipt details
  doc.setFontSize(10);
  doc.setTextColor(...textSecondary);
  doc.setFont(undefined, 'normal');
  doc.text(`Receipt #${booking.id.substring(0, 8).toUpperCase()}`, 190, 26, { align: 'right' });
  doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, 190, 31, { align: 'right' });

  // Main divider
  doc.setDrawColor(...brandPrimary);
  doc.setLineWidth(0.5);
  doc.line(20, 38, 190, 38);

  // Customer & Status Row
  let y = 48;
  
  doc.setFontSize(10);
  doc.setTextColor(...brandPrimary);
  doc.setFont(undefined, 'bold');
  doc.text('CUSTOMER', 20, y);

  doc.setFontSize(12);
  doc.setTextColor(...textPrimary);
  doc.setFont(undefined, 'bold');
  doc.text(user?.name || 'N/A', 20, y + 7);

  doc.setFontSize(10);
  doc.setTextColor(...textSecondary);
  doc.setFont(undefined, 'normal');
  doc.text(user?.email || 'N/A', 20, y + 14);
  if (user?.phone) {
    doc.text(user.phone, 20, y + 21);
  }

  // Status Badge
  let statusColor;
  let statusText = booking.booking_status?.toUpperCase() || 'PENDING';
  
  if (booking.booking_status === 'confirmed') {
    statusColor = [34, 197, 94];
  } else if (booking.booking_status === 'pending') {
    statusColor = [245, 158, 11];
  } else if (booking.booking_status === 'cancelled') {
    statusColor = [239, 68, 68];
  } else {
    statusColor = [107, 114, 128];
  }

  doc.setFillColor(...statusColor);
  doc.setLineWidth(0.2);
  doc.roundedRect(150, y - 2, 40, 10, 3, 3, 'F');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.setFont(undefined, 'bold');
  doc.text(statusText, 170, y + 4, { align: 'center' });

  // Booking Details Section
  y = 80;
  
  doc.setDrawColor(...borderColor);
  doc.setLineWidth(0.2);
  doc.setFillColor(249, 250, 251);
  doc.rect(20, y, 170, 65, 'FD');

  y += 8;
  doc.setFontSize(12);
  doc.setTextColor(...brandPrimary);
  doc.setFont(undefined, 'bold');
  doc.text('BOOKING DETAILS', 25, y);

  y += 12;
  const detailsStartY = y;

  // Left column details
  doc.setFontSize(9);
  doc.setTextColor(...textSecondary);
  doc.setFont(undefined, 'normal');
  doc.text('Room', 25, y);

  doc.setFontSize(11);
  doc.setTextColor(...textPrimary);
  doc.setFont(undefined, 'bold');
  doc.text(booking.room_title || booking.room_name || booking.room_id || 'N/A', 25, y + 6);

  y += 16;
  doc.setFontSize(9);
  doc.setTextColor(...textSecondary);
  doc.text('Check-in', 25, y);

  doc.setFontSize(11);
  doc.setTextColor(...textPrimary);
  doc.text(new Date(booking.check_in_date).toLocaleDateString('en-GB'), 25, y + 6);

  y += 16;
  doc.setFontSize(9);
  doc.setTextColor(...textSecondary);
  doc.text('Check-out', 25, y);

  doc.setFontSize(11);
  doc.setTextColor(...textPrimary);
  doc.text(`${new Date(booking.check_out_date).toLocaleDateString('en-GB')} at 10:00 AM`, 25, y + 6);

  // Right column details
  y = detailsStartY;

  doc.setFontSize(9);
  doc.setTextColor(...textSecondary);
  doc.text('Guests', 115, y);

  doc.setFontSize(11);
  doc.setTextColor(...textPrimary);
  doc.text(String(booking.total_guests || 0), 115, y + 6);

  y += 16;
  doc.setFontSize(9);
  doc.setTextColor(...textSecondary);
  doc.text('Check-in Time', 115, y);

  doc.setFontSize(11);
  doc.setTextColor(...textPrimary);
  doc.text(booking.check_in_time || 'Flexible', 115, y + 6);

  y += 16;
  doc.setFontSize(9);
  doc.setTextColor(...textSecondary);
  doc.text('Booking Date', 115, y);

  doc.setFontSize(11);
  doc.setTextColor(...textPrimary);
  doc.text(new Date(booking.created_at).toLocaleDateString('en-GB'), 115, y + 6);

  // Special Requests
  if (booking.special_requests) {
    y = 152;
    doc.setFontSize(9);
    doc.setTextColor(...textSecondary);
    doc.text('Special Requests', 25, y);

    doc.setFontSize(10);
    doc.setTextColor(...textPrimary);
    const splitText = doc.splitTextToSize(booking.special_requests, 160);
    doc.text(splitText, 25, y + 6);
  }

  // Payment Section - Clean and Prominent
  y = 178;
  
  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(...brandPrimary);
  doc.setLineWidth(0.2);
  doc.roundedRect(20, y, 170, 30, 3, 3, 'FD');

  y += 10;
  doc.setFontSize(10);
  doc.setTextColor(...textSecondary);
  doc.setFont(undefined, 'normal');
  doc.text('TOTAL AMOUNT', 25, y);

  doc.setFontSize(16);
  doc.setTextColor(...brandPrimary);
  doc.setFont(undefined, 'bold');
  const amountText = 'Rs.' + booking.total_amount.toFixed(2);
  doc.text(amountText, 185, y + 6, { align: 'right' });

  doc.setFontSize(9);
  doc.setTextColor(...textSecondary);
  doc.setFont(undefined, 'normal');
  doc.text('Payment Status: ' + (booking.booking_status?.charAt(0).toUpperCase() + booking.booking_status?.slice(1) || 'Pending'), 25, y + 14);

  // Footer
  y = 260;
  doc.setDrawColor(...borderColor);
  doc.setLineWidth(0.3);
  doc.line(20, y, 190, y);

  y += 8;
  doc.setFontSize(10);
  doc.setTextColor(...brandPrimary);
  doc.setFont(undefined, 'bold');
  doc.text('Thank you for choosing Breezeand Grains', 105, y, { align: 'center' });
  
  y += 5;
  doc.setFontSize(8);
  doc.setTextColor(...textSecondary);
  doc.setFont(undefined, 'normal');
  doc.text('hello@breezeandgrains.com  |  123 Breezeand Grains Street, Digital City', 105, y, { align: 'center' });

  y += 4;
  doc.setFontSize(7);
  doc.setFont(undefined, 'italic');
  doc.text('This is a computer-generated receipt and does not require a signature.', 105, y, { align: 'center' });

  // Save the PDF
  doc.save(`breezeandgrains-receipt-${booking.id.substring(0, 8)}.pdf`);
};