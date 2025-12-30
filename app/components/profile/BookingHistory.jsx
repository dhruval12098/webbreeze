import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Download } from 'lucide-react'; // Import the download icon
import { generateReceiptPDF } from '@/app/lib/receiptGenerator'; // Import the PDF generator

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, user } = useAuth(); // Get user info as well

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) {
        setError('Please log in to view your bookings');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/bookings', {
          headers: {
            'authorization': `Bearer ${token}`
          }
        });

        const result = await response.json();

        if (result.success) {
          setBookings(result.data);
        } else {
          setError(result.error || 'Failed to fetch bookings');
        }
      } catch (err) {
        setError('An error occurred while fetching bookings');
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  // Function to handle PDF download
  const handleDownloadReceipt = (booking) => {
    generateReceiptPDF(booking, user);
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <p className="text-sm sm:text-base">Loading your bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <p className="text-red-500 text-sm sm:text-base">{error}</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4" style={{ color: "#173A00" }}>Your Booking History</h3>
        <p className="text-sm sm:text-base">You haven't made any bookings yet.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4" style={{ color: "#173A00" }}>Your Booking History</h3>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div 
            key={booking.id} 
            className="border border-[#594B00]/20 rounded-lg p-3 sm:p-4 bg-white shadow-sm"
          >
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
              <div className="flex-1">
                <h4 className="font-medium text-base" style={{ color: "#173A00" }}>
                  Booking #{booking.id.substring(0, 8)}
                </h4>
                <p className="text-xs sm:text-sm mt-1" style={{ color: "#173A00" }}>
                  <span className="font-medium">Check-in:</span> {new Date(booking.check_in_date).toLocaleDateString('en-GB')}
                </p>
                <p className="text-xs sm:text-sm" style={{ color: "#173A00" }}>
                  <span className="font-medium">Check-out:</span> {new Date(booking.check_out_date).toLocaleDateString('en-GB')} at 10:00 AM
                </p>
                <p className="text-xs sm:text-sm" style={{ color: "#173A00" }}>
                  <span className="font-medium">Guests:</span> {booking.total_guests}
                </p>
                <p className="text-xs sm:text-sm" style={{ color: "#173A00" }}>
                  <span className="font-medium">Total:</span> ₹{booking.total_amount.toFixed(2)}/-
                </p>
                <p className="text-xs sm:text-sm font-medium" style={{ 
                  color: booking.booking_status === 'confirmed' ? '#22c55e' : 
                         booking.booking_status === 'pending' ? '#f59e0b' : 
                         booking.booking_status === 'cancelled' ? '#ef4444' : '#6b7280' 
                }}>
                  Status: {booking.booking_status.charAt(0).toUpperCase() + booking.booking_status.slice(1)}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs sm:text-sm text-gray-500">
                  Booked on: {new Date(booking.created_at).toLocaleDateString('en-GB')}
                </p>
                {/* Download Receipt Button */}
                <button
                  onClick={() => handleDownloadReceipt(booking)}
                  className="mt-2 flex items-center justify-center sm:justify-start gap-1 px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm bg-[#594B00] text-white rounded hover:bg-[#473B00] transition-colors w-full sm:w-auto"
                  title="Download Receipt"
                >
                  <Download size={12} className="sm:size-3" />
                  <span className="text-xs sm:text-sm">Receipt</span>
                </button>
              </div>
            </div>
            {booking.special_requests && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="text-xs sm:text-sm" style={{ color: "#173A00" }}>
                  <span className="font-medium">Special Requests:</span> {booking.special_requests}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingHistory;