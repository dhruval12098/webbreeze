"use client";
import React, { useState, useEffect } from "react";
import { CalendarDays, User2, BedDouble, Eye, Search } from "lucide-react";
import { useAuth } from '@/app/context/AuthContext';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    room: '',
    date: ''
  });
  const { token } = useAuth();



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
              room: booking.room_id, // In a real implementation, you'd fetch room name
              date: `${new Date(booking.check_in_date).toLocaleDateString('en-GB')} - ${new Date(booking.check_out_date).toLocaleDateString('en-GB')} (Check-out: 10:00 AM)`,
              checkInTime: booking.check_in_time || 'Flexible',
              checkOutTime: '10:00 AM',
              status: booking.booking_status,
              paymentStatus: booking.booking_status === 'confirmed' ? 'Success' : 
                            booking.booking_status === 'pending' ? 'Pending' : 
                            booking.booking_status === 'cancelled' ? 'Refunded' : 'N/A',
              transactionId: booking.transaction_id || '-',
              amount: `₹${booking.total_amount}`,
              paymentDate: booking.created_at ? new Date(booking.created_at).toLocaleDateString('en-GB') : '-',
              paymentMethod: booking.payment_method || 'N/A'
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
            <option value="Deluxe Room">Deluxe Room</option>
            <option value="Standard Room">Standard Room</option>
            <option value="Premium Suite">Premium Suite</option>
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
        <table className="w-full border-separate border-spacing-0 text-sm min-w-[1200px]">
          <thead>
            <tr className="text-[#6B7280] bg-[#F9FAFB] text-left border-b border-[#E5E7EB]">
              <th className="py-3 px-3 font-medium">Customer</th>
              <th className="py-3 px-3 font-medium">Room</th>
              <th className="py-3 px-3 font-medium">Date</th>
              <th className="py-3 px-3 font-medium">Check-in Time</th>
              <th className="py-3 px-3 font-medium">Check-out Time</th>
              <th className="py-3 px-3 font-medium">Status</th>
              <th className="py-3 px-3 font-medium">Payment Status</th>
              <th className="py-3 px-3 font-medium">Transaction ID</th>
              <th className="py-3 px-3 font-medium">Amount</th>
              <th className="py-3 px-3 font-medium">Payment Date</th>
              <th className="py-3 px-3 font-medium">Payment Method</th>
              <th className="py-3 px-3 font-medium text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="text-[#0A3D2E]">
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="10" className="py-8 px-3 text-center text-gray-500">
                  No bookings found
                </td>
              </tr>
            ) : (
              filteredBookings.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-[#E5E7EB] hover:bg-[#F8FAFB] transition"
                >
                  <td className="py-4 px-3 font-medium">{item.name}</td>
                  <td className="px-3">{item.room}</td>
                  <td className="px-3">{item.date}</td>
                  <td className="px-3">{item.checkInTime}</td>
                  <td className="px-3">{item.checkOutTime}</td>

                  <td className="px-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs border font-medium ${getStatusStyle(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs border font-medium ${getPaymentStatusStyle(
                        item.paymentStatus
                      )}`}
                    >
                      {item.paymentStatus}
                    </span>
                  </td>

                  <td className="px-3 text-xs text-gray-600">{item.transactionId || "-"}</td>
                  <td className="px-3 font-medium">{item.amount}</td>
                  <td className="px-3 text-xs">{item.paymentDate || "-"}</td>
                  <td className="px-3 text-xs">{item.paymentMethod || "-"}</td>

                  {/* ACTION BUTTONS */}
                  <td className="px-3 text-right">
                    <button className="p-2 rounded-lg border border-[#E5E7EB] hover:bg-[#F3F4F6] transition">
                      <Eye size={16} className="text-[#0A3D2E]" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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