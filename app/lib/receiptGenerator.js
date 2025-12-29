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

  // Header Section with gradient effect
  doc.setFillColor(...lightBg);
  doc.rect(0, 0, pageWidth, 50, 'F');
  
  doc.setDrawColor(...brandPrimary);
  doc.setLineWidth(3);
  doc.line(margin, 48, pageWidth - margin, 48);

  // Load and add logo
  try {
    const img = new Image();
    img.src = '/logo.svg';
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
    doc.addImage(img, 'SVG', margin, 12, 45, 14);
  } catch (error) {
    doc.setFontSize(16);
    doc.setTextColor(...brandPrimary);
    doc.setFont(undefined, 'bold');
    doc.text('BREEZEAND GRAINS', margin, 22);
  }

  // Receipt Title Box - Top Right
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

  if (user?.phone) {
    y += 4;
    doc.text(user.phone, margin + 5, y);
  }

  // Status Badge Box
  y = 65;
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

  // Section header with accent line
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

  // Helper function for detail rows with proper text wrapping
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

  // Left column
  y = detailsY;
  y = addDetail('Room', booking.room_title || booking.room_name || booking.room_id || 'N/A', col1X, y, 75);
  y += 10;
  y = addDetail('Check-in Date', new Date(booking.check_in_date).toLocaleDateString('en-GB', { 
    year: 'numeric', month: 'short', day: 'numeric' 
  }), col1X, y, 75);
  y += 10;
  y = addDetail('Check-out Date', new Date(booking.check_out_date).toLocaleDateString('en-GB', { 
    year: 'numeric', month: 'short', day: 'numeric' 
  }), col1X, y, 75);

  // Right column
  y = detailsY;
  y = addDetail('Number of Guests', String(booking.total_guests || 0), col2X, y, 75);
  y += 10;
  y = addDetail('Check-in Time', booking.check_in_time || 'Flexible', col2X, y, 75);
  y += 10;
  y = addDetail('Booking Date', new Date(booking.created_at).toLocaleDateString('en-GB', { 
    year: 'numeric', month: 'short', day: 'numeric' 
  }), col2X, y, 75);

  // Special Requests Box (if exists)
  let specialRequestsHeight = 0;
  if (booking.special_requests) {
    y = 194;
    
    const requestLines = doc.splitTextToSize(booking.special_requests, contentWidth - 10);
    specialRequestsHeight = Math.min(requestLines.length * 4 + 16, 35);
    
    doc.setDrawColor(...borderColor);
    doc.setLineWidth(1);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, y, contentWidth, specialRequestsHeight, 3, 3, 'FD');

    y += 7;
    doc.setFontSize(8);
    doc.setTextColor(...brandPrimary);
    doc.setFont(undefined, 'bold');
    doc.text('SPECIAL REQUESTS', margin + 5, y);

    y += 5;
    doc.setFontSize(8);
    doc.setTextColor(...textPrimary);
    doc.setFont(undefined, 'normal');
    doc.text(requestLines, margin + 5, y);
    
    y = 194 + specialRequestsHeight + 8;
  } else {
    y = 194;
  }

  // Payment Summary Box - Prominent
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
  const paymentStatus = booking.booking_status?.charAt(0).toUpperCase() + booking.booking_status?.slice(1) || 'Pending';
  doc.text(`Payment Status: ${paymentStatus}`, margin + 5, y);

  // Footer Section
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
  doc.text('hello@breezeandgrains.com  |  123 Breezeand Grains Street, Digital City', pageWidth / 2, y, { align: 'center' });

  y += 4;
  doc.setFontSize(7);
  doc.setFont(undefined, 'italic');
  doc.setTextColor(...textSecondary);
  doc.text('This is a computer-generated receipt and does not require a signature.', pageWidth / 2, y, { align: 'center' });

  // Save the PDF
  doc.save(`breezeandgrains-receipt-${booking.id.substring(0, 8)}.pdf`);
};