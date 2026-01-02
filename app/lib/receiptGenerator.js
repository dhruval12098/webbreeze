import jsPDF from 'jspdf';

// Generate professional receipt PDF
export const generateReceiptPDF = async (booking, user) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  // ----- COLORS & STYLES -----
  const brandPrimary = [89, 75, 0]; // Dark gold
  const brandSecondary = [23, 58, 0]; // Dark green
  const accentGold = [218, 165, 32]; // Accent gold
  const textPrimary = [31, 41, 55]; // Dark gray
  const textSecondary = [107, 114, 128]; // Light gray
  const borderColor = [229, 231, 235]; // Light border
  const lightBg = [252, 252, 250]; // Light background

  const margin = 20;
  const pageWidth = 210;
  const contentWidth = pageWidth - margin * 2;

  let y = 20;

  // ----- HEADER -----
  // Logo and homestay info
  try {
    const img = new Image();
    img.src = '/logo.svg';
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
    doc.addImage(img, 'SVG', margin, 8, 40, 15);
  } catch {
    // If logo fails to load, show text in green color
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...brandSecondary); // Use green color
    doc.text('BREEZEAND GRAINS', margin, 15);
  }

  // Homestay information
  doc.setFontSize(10);
  doc.setTextColor(...textPrimary);
  doc.setFont(undefined, 'normal');
  doc.text('Breeze & Grains', margin, 25);
  
  doc.setFontSize(8);
  doc.setTextColor(...textSecondary);
  doc.text('Alappuzha, Kerala, India', margin, 30);
  doc.text('breezegrains@gmail.com | +91 99616 72656', margin, 34);

  // Receipt title
  doc.setFontSize(16);
  doc.setTextColor(...brandSecondary);
  doc.setFont(undefined, 'bold');
  doc.text('RECEIPT', pageWidth - margin - 25, 18, { align: 'right' });

  doc.setFontSize(9);
  doc.setTextColor(...textSecondary);
  doc.setFont(undefined, 'normal');
  doc.text(`Booking #${booking.id.substring(0, 8).toUpperCase()}`, pageWidth - margin - 25, 24, { align: 'right' });
  doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, pageWidth - margin - 25, 29, { align: 'right' });
  
  // Add margin line
  y = 38;
  doc.setDrawColor(...borderColor);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y = 48;

  // ----- CUSTOMER INFO -----
  doc.setDrawColor(...borderColor);
  doc.setLineWidth(0.5);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, y, contentWidth, 30, 3, 3, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(...brandPrimary);
  doc.setFont(undefined, 'bold');
  doc.text('CUSTOMER INFORMATION', margin + 3, y + 7);

  doc.setFontSize(10);
  doc.setTextColor(...textPrimary);
  doc.setFont(undefined, 'bold');
  doc.text(user?.name || 'N/A', margin + 3, y + 14);

  doc.setFontSize(9);
  doc.setTextColor(...textSecondary);
  doc.setFont(undefined, 'normal');
  doc.text(user?.email || 'N/A', margin + 3, y + 19);
  if (user?.phone) doc.text(user.phone, margin + 3, y + 24);

  y += 35;

  // ----- BOOKING DETAILS TABLE -----
  doc.setFontSize(10);
  doc.setTextColor(...brandPrimary);
  doc.setFont(undefined, 'bold');
  doc.text('BOOKING DETAILS', margin, y);

  y += 4;
  doc.setDrawColor(...accentGold);
  doc.setLineWidth(0.8);
  doc.line(margin, y, pageWidth - margin, y);

  y += 6;

  const tableData = [
    ['Room', booking.room_title || booking.room_name || booking.room_id || 'N/A'],
    ['Check-in Date', new Date(booking.check_in_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })],
    ['Check-out Date', new Date(booking.check_out_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })],
    ['Check-in Time', booking.check_in_time || 'Flexible'],
    ['Number of Guests', String(booking.total_guests || 0)],
    ['Booking Date', new Date(booking.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })],
    ['Status', booking.booking_status?.toUpperCase() || 'PENDING']
  ];

  const col1Width = 60;
  const col2Width = contentWidth - col1Width - 2;

  tableData.forEach(([label, value]) => {
    // Label cell
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...textSecondary);
    doc.setFontSize(9);
    doc.text(label, margin + 1, y + 6);

    // Value cell
    doc.setFont(undefined, 'normal');
    doc.setTextColor(...textPrimary);
    const wrappedValue = doc.splitTextToSize(String(value), col2Width - 2);
    doc.text(wrappedValue, margin + col1Width + 2, y + 6);

    // Draw row borders
    doc.setDrawColor(...borderColor);
    doc.rect(margin, y, contentWidth, 8 + (wrappedValue.length - 1) * 4);

    y += 8 + (wrappedValue.length - 1) * 4;
  });

  y += 5;

  // ----- SPECIAL REQUESTS -----
  if (booking.special_requests) {
    const lines = doc.splitTextToSize(booking.special_requests, contentWidth - 4);
    const boxHeight = lines.length * 5 + 8;

    doc.setDrawColor(...borderColor);
    doc.setLineWidth(0.5);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, y, contentWidth, boxHeight, 3, 3, 'FD');

    doc.setFontSize(9);
    doc.setTextColor(...brandPrimary);
    doc.setFont(undefined, 'bold');
    doc.text('SPECIAL REQUESTS', margin + 2, y + 6);

    doc.setFontSize(9);
    doc.setTextColor(...textPrimary);
    doc.setFont(undefined, 'normal');
    doc.text(lines, margin + 2, y + 11);

    y += boxHeight + 5;
  }

  // ----- PAYMENT SUMMARY -----
  // Clean total box with border only
  doc.setDrawColor(...borderColor);
  doc.setLineWidth(0.5);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, y, contentWidth, 30, 3, 3, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(...textSecondary);
  doc.setFont(undefined, 'normal');
  doc.text('TOTAL AMOUNT', margin + 3, y + 10);

  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...textPrimary);
  const amountText = 'Rs. ' + booking.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  // Position the amount with proper margin from the right edge
  doc.text(amountText, margin + contentWidth - 3, y + 12, { align: 'right' });

  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(...textSecondary);
  const paymentStatus = booking.booking_status?.charAt(0).toUpperCase() + booking.booking_status?.slice(1) || 'Pending';
  doc.text(`Payment Status: ${paymentStatus}`, margin + 3, y + 22);

  y += 35;

  // ----- FOOTER -----
  doc.setDrawColor(...accentGold);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);

  y += 5;
  doc.setFontSize(10);
  doc.setTextColor(...brandPrimary);
  doc.setFont(undefined, 'bold');
  doc.text('Thank you for choosing Breeze & Grains', pageWidth / 2, y, { align: 'center' });

  y += 5;
  doc.setFontSize(8);
  doc.setTextColor(...textSecondary);
  doc.setFont(undefined, 'normal');
  doc.text('breezegrains@gmail.com  |  Alappuzha, Kerala, India', pageWidth / 2, y, { align: 'center' });

  y += 4;
  doc.setFontSize(7);
  doc.setFont(undefined, 'italic');
  doc.setTextColor(...textSecondary);
  doc.text('This is a computer-generated receipt and does not require a signature.', pageWidth / 2, y, { align: 'center' });

  // ----- SAVE PDF -----
  doc.save(`breezeandgrains-receipt-${booking.id.substring(0, 8)}.pdf`);
};
