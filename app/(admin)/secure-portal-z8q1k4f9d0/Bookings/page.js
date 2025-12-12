"use client";
import React from "react";
import { CalendarDays, User2, BedDouble, Eye } from "lucide-react";

const BookingsPage = () => {
  const bookings = [
    { 
      name: "Rohan Patel", 
      room: "Deluxe Room", 
      date: "Dec 12 - Dec 15", 
      status: "Confirmed",
      paymentStatus: "Success",
      transactionId: "rzp_1234567890",
      amount: "₹15,000",
      paymentDate: "Dec 12, 2025",
      paymentMethod: "Credit Card"
    },
    { 
      name: "Isha Sharma", 
      room: "Standard Room", 
      date: "Dec 10 - Dec 11", 
      status: "Pending",
      paymentStatus: "Pending",
      transactionId: "",
      amount: "₹8,500",
      paymentDate: "",
      paymentMethod: ""
    },
    { 
      name: "Ankit Verma", 
      room: "Premium Suite", 
      date: "Dec 20 - Dec 24", 
      status: "Cancelled",
      paymentStatus: "Refunded",
      transactionId: "rzp_0987654321",
      amount: "₹25,000",
      paymentDate: "Dec 15, 2025",
      paymentMethod: "UPI"
    },
  ];

  const getStatusStyle = (status) => {
    if (status === "Confirmed") return "bg-[#E8F6EF] text-[#0A3D2E] border-[#9FD9C3]";
    if (status === "Pending") return "bg-[#FFF8E6] text-[#C6A300] border-[#E8D48F]";
    if (status === "Cancelled") return "bg-[#FDECEC] text-[#D64545] border-[#F3B4B4]";
  };

  const getPaymentStatusStyle = (status) => {
    if (status === "Success") return "bg-[#E8F6EF] text-[#0A3D2E] border-[#9FD9C3]";
    if (status === "Pending") return "bg-[#FFF8E6] text-[#C6A300] border-[#E8D48F]";
    if (status === "Failed") return "bg-[#FDECEC] text-[#D64545] border-[#F3B4B4]";
    if (status === "Refunded") return "bg-[#E6F0FF] text-[#3B82F6] border-[#BDD6FF]";
  };

  return (
    <div className="w-full min-h-screen bg-white">

      {/* HEADER */}
      <div className="w-full px-8 py-8 border-b border-[#E5E7EB]">
        <h1 className="text-3xl font-semibold text-[#0A3D2E]">Bookings</h1>
      </div>

      {/* FILTER BAR */}
      <div className="w-full px-8 py-6 border-b border-[#E5E7EB] flex flex-wrap gap-4 items-center">

        <div className="filter-box">
          <User2 size={18} className="icon" />
          <input type="text" placeholder="Search by name" className="filter-input" />
        </div>

        <div className="filter-box">
          <BedDouble size={18} className="icon" />
          <select className="filter-input">
            <option>All Rooms</option>
            <option>Deluxe Room</option>
            <option>Standard Room</option>
            <option>Premium Suite</option>
          </select>
        </div>

        <div className="filter-box">
          <CalendarDays size={18} className="icon" />
          <input type="date" className="filter-input" />
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
            {bookings.map((item, index) => (
              <tr
                key={index}
                className="border-b border-[#E5E7EB] hover:bg-[#F8FAFB] transition"
              >
                <td className="py-4 px-3 font-medium">{item.name}</td>
                <td className="px-3">{item.room}</td>
                <td className="px-3">{item.date}</td>

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
            ))}
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