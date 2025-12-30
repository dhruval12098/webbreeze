"use client";
import React, { useState, useEffect } from "react";
import { CalendarDays, User2, BedDouble, Eye, Search, X } from "lucide-react";
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'react-toastify';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    room: '',
    date: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const { token } = useAuth();

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  const handleCancel = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancel = async () => {
    if (!selectedBooking) return;
    
    setIsCancelling(true);

    try {
      // First, send cancellation email
      const emailResponse = await fetch('/api/send-cancellation-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ booking_id: selectedBooking.id })
      });

      if (!emailResponse.ok) {
        throw new Error('Failed to send cancellation email');
      }

      // Then, update booking status to cancelled
      const updateResponse = await fetch(`/api/admin/bookings/${selectedBooking.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'cancelled',
          payment_status: 'refunded' // Assuming refund will be processed
        })
      });

      if (updateResponse.ok) {
        // Update local state
        setBookings(bookings.map(b =>
          b.id === selectedBooking.id
            ? { ...b, status: 'cancelled', paymentStatus: 'refunded' }
            : b
        ));
        setShowCancelConfirm(false);
        closeModal();
        toast.success('Booking cancelled successfully. Cancellation email sent to customer.');
      } else {
        throw new Error('Failed to update booking status');
      }
    } catch (error) {
      console.error('Cancel error:', error);
      toast.error('Failed to cancel booking: ' + error.message);
    } finally {
      setIsCancelling(false);
    }
  };



  // Fetch all bookings for admin view
  useEffect(() => {
    if (token) {
      const fetchAllBookings = async () => {
        try {
          const response = await fetch('/api/admin/bookings', {
            headers: {
              'authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to fetch bookings');
          }

          const result = await response.json();

          if (result.success) {
            // Transform the booking data to match the table format
            const transformedBookings = result.data.map(booking => ({
              id: booking.id,
              name: booking.user_name,
              user_email: booking.user_email,
              room: booking.room_name || booking.room_id,
              date: `${new Date(booking.check_in_date).toLocaleDateString('en-GB')} - ${new Date(booking.check_out_date).toLocaleDateString('en-GB')} (Check-out: 10:00 AM)`,
              checkInTime: booking.check_in_time || 'Flexible',
              checkOutTime: '10:00 AM',
              status: booking.booking_status,
              paymentStatus: booking.payment_status ? booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1) : 'Pending',
              transactionId: booking.transaction_id || '-',
              razorpayOrderId: booking.razorpay_order_id || '-',
              phone: booking.phone || '-',
              specialRequests: booking.special_requests || '-',
              totalGuests: booking.total_guests,
              amount: `₹${booking.total_amount}`,
              paymentDate: booking.created_at ? new Date(booking.created_at).toLocaleDateString('en-GB') : '-',
              paymentMethod: booking.payment_method || 'Razorpay'
            }));
            setBookings(transformedBookings);
          } else {
            setError(result.error || 'Failed to fetch bookings');
          }
        } catch (err) {
          setError('An error occurred while fetching bookings');
          console.error('Error fetching all bookings:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchAllBookings();
    }
  }, [token]);

  const getStatusStyle = (status) => {
    if (status === "Confirmed") return "bg-[#E8F6EF] text-[#0A3D2E] border-[#9FD9C3]";
    if (status === "Pending") return "bg-[#FFF8E6] text-[#C6A300] border-[#E8D48F]";
    if (status === "Cancelled") return "bg-[#FDECEC] text-[#D64545] border-[#F3B4B4]";
    if (status === "Completed") return "bg-[#E8F6EF] text-[#0A3D2E] border-[#9FD9C3]";
  };

  const getPaymentStatusStyle = (status) => {
    if (status === "Success") return "bg-[#E8F6EF] text-[#0A3D2E] border-[#9FD9C3]";
    if (status === "Pending") return "bg-[#FFF8E6] text-[#C6A300] border-[#E8D48F]";
    if (status === "Failed") return "bg-[#FDECEC] text-[#D64545] border-[#F3B4B4]";
    if (status === "Refunded") return "bg-[#E6F0FF] text-[#3B82F6] border-[#BDD6FF]";
  };

  // Filter bookings based on search criteria
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = filters.search === '' || 
      booking.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      booking.room.toLowerCase().includes(filters.search.toLowerCase());
    const matchesRoom = filters.room === '' || booking.room === filters.room;
    // Note: Date filtering would require more complex logic based on actual date format
    
    return matchesSearch && matchesRoom;
  });

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A3D2E] mx-auto mb-4"></div>
          <p className="text-[#0A3D2E]">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#0A3D2E] text-white rounded-lg hover:bg-[#0A3D2E]/80 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white">

      {/* HEADER */}
      <div className="w-full px-8 py-8 border-b border-[#E5E7EB]">
        <h1 className="text-3xl font-semibold text-[#0A3D2E]">Bookings</h1>
      </div>

      {/* FILTER BAR */}
      <div className="w-full px-8 py-6 border-b border-[#E5E7EB] flex flex-wrap gap-4 items-center">
        <div className="filter-box">
          <Search size={18} className="icon" />
          <input 
            type="text" 
            placeholder="Search by name or room" 
            className="filter-input"
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
        </div>

        <div className="filter-box">
          <BedDouble size={18} className="icon" />
          <select 
            className="filter-input"
            value={filters.room}
            onChange={(e) => setFilters({...filters, room: e.target.value})}
          >
            <option value="">All Rooms</option>
            {/* Options will be populated based on available rooms */}
          </select>
        </div>

        <div className="filter-box">
          <CalendarDays size={18} className="icon" />
          <input 
            type="date" 
            className="filter-input"
            value={filters.date}
            onChange={(e) => setFilters({...filters, date: e.target.value})}
          />
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="w-full px-8 py-8 overflow-x-auto">
        <table className="w-full border-separate border-spacing-0 text-xs min-w-[1200px]">
          <thead>
            <tr className="text-[#6B7280] bg-[#F9FAFB] text-left border-b border-[#E5E7EB]">
              <th className="py-3 px-3 font-medium">Customer</th>
              <th className="py-3 px-3 font-medium">Room</th>
              <th className="py-3 px-3 font-medium">Date</th>
              <th className="py-3 px-3 font-medium">Check-in Time</th>
              <th className="py-3 px-3 font-medium">Check-out Time</th>
              <th className="py-3 px-3 font-medium">Guests</th>
              <th className="py-3 px-3 font-medium">Status</th>
              <th className="py-3 px-3 font-medium">Payment Status</th>
              <th className="py-3 px-3 font-medium">Transaction ID</th>
              <th className="py-3 px-3 font-medium">Phone</th>
              <th className="py-3 px-3 font-medium">Special Requests</th>
              <th className="py-3 px-3 font-medium">Amount</th>
              <th className="py-3 px-3 font-medium">Payment Date</th>
              <th className="py-3 px-3 font-medium">Payment Method</th>
              <th className="py-3 px-3 font-medium text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="text-[#0A3D2E]">
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="14" className="py-8 px-3 text-center text-gray-500">
                  No bookings found
                </td>
              </tr>
            ) : (
              filteredBookings.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-[#E5E7EB] hover:bg-[#F8FAFB] transition"
                >
                  <td className="py-3 px-3 font-medium text-xs">{item.name}</td>
                  <td className="px-3 text-xs">{item.room_name || item.room}</td>
                  <td className="px-3 text-xs">{item.date}</td>
                  <td className="px-3 text-xs">{item.checkInTime}</td>
                  <td className="px-3 text-xs">{item.checkOutTime}</td>
                  <td className="px-3 text-xs">{item.totalGuests}</td>
                  <td className="px-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs border font-medium ${getStatusStyle(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs border font-medium ${getPaymentStatusStyle(
                        item.paymentStatus
                      )}`}
                    >
                      {item.paymentStatus}
                    </span>
                  </td>
                  <td className="px-3 text-xs text-gray-600">{item.transactionId || "-"}</td>
                  <td className="px-3 text-xs text-gray-600">{item.phone || "-"}</td>
                  <td className="px-3 text-xs text-gray-600 max-w-32 truncate" title={item.specialRequests}>{item.specialRequests || "-"}</td>
                  <td className="px-3 font-medium text-xs">{item.amount}</td>
                  <td className="px-3 text-xs">{item.paymentDate || "-"}</td>
                  <td className="px-3 text-xs">{item.paymentMethod || "-"}</td>

                  {/* ACTION BUTTONS */}
                  <td className="px-3 text-right">
                    <button className="p-2 rounded-lg border border-[#E5E7EB] hover:bg-[#F3F4F6] transition" onClick={() => openModal(item)}>
                      <Eye size={16} className="text-[#0A3D2E]" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#E5E7EB]">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-[#0A3D2E]">Booking Details</h2>
                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <X size={24} className="text-[#0A3D2E]" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="bg-[#FFFBE6] rounded-lg p-4">
                <h3 className="font-semibold text-[#594B00] mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Name:</span> {selectedBooking.name}</div>
                  <div><span className="font-medium">Email:</span> {selectedBooking.user_email}</div>
                  <div><span className="font-medium">Phone:</span> {selectedBooking.phone}</div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="bg-[#F9FAFB] rounded-lg p-4">
                <h3 className="font-semibold text-[#594B00] mb-3">Booking Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Room:</span> {selectedBooking.room_name || selectedBooking.room}</div>
                  <div><span className="font-medium">Check-in:</span> {selectedBooking.date.split(' - ')[0]} at {selectedBooking.checkInTime}</div>
                  <div><span className="font-medium">Check-out:</span> {selectedBooking.date.split(' - ')[1].split(' (')[0]} at {selectedBooking.checkOutTime}</div>
                  <div><span className="font-medium">Guests:</span> {selectedBooking.totalGuests}</div>
                </div>
                {selectedBooking.specialRequests && (
                  <div className="mt-3">
                    <span className="font-medium">Special Requests:</span> {selectedBooking.specialRequests}
                  </div>
                )}
              </div>

              {/* Payment Info */}
              <div className="bg-[#E8F6EF] rounded-lg p-4">
                <h3 className="font-semibold text-[#0A3D2E] mb-3">Payment Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Amount:</span> {selectedBooking.amount}</div>
                  <div><span className="font-medium">Status:</span> {selectedBooking.paymentStatus}</div>
                  <div><span className="font-medium">Transaction ID:</span> {selectedBooking.transactionId}</div>
                  <div><span className="font-medium">Payment Date:</span> {selectedBooking.paymentDate}</div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-[#E5E7EB] flex justify-end gap-3">
              <button 
                onClick={closeModal}
                className="px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-gray-50 transition"
              >
                Close
              </button>
              <button 
                onClick={handleCancel}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL CONFIRMATION MODAL */}
      {showCancelConfirm && selectedBooking && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[#0A3D2E]">Cancel Booking</h2>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to cancel this booking? This will:
              </p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>• Send a cancellation email to the customer</li>
                <li>• Mark the booking as cancelled</li>
                <li>• Update payment status to refunded</li>
                <li>• Make the dates available for new bookings</li>
              </ul>

              <div className="bg-[#FFFBE6] rounded-lg p-4 mb-6">
                <h4 className="font-medium text-[#594B00] mb-2">Booking Summary</h4>
                <div className="text-sm text-[#594B00]">
                  <div><strong>Customer:</strong> {selectedBooking.name}</div>
                  <div><strong>Room:</strong> {selectedBooking.room_name || selectedBooking.room}</div>
                  <div><strong>Dates:</strong> {selectedBooking.date}</div>
                  <div><strong>Amount:</strong> {selectedBooking.amount}</div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-[#E5E7EB] flex justify-end gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-gray-50 transition"
              >
                Keep Booking
              </button>
              <button
                onClick={confirmCancel}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                disabled={isCancelling}
              >
                {isCancelling ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : 'Yes, Cancel Booking'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INLINE STYLES */}
      <style>{`
        .filter-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #F9FAFB;
          border: 1px solid #E5E7EB;
          padding: 10px 16px;
          border-radius: 12px;
        }

        .filter-input {
          background: transparent;
          outline: none;
          font-size: 14px;
          color: #0A3D2E;
        }

        .icon {
          color: #6B7280;
        }
      `}</style>
    </div>
  );
};

export default BookingsPage;