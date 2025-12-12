"use client";
import React from "react";
import { User2, Mail, Phone, Eye } from "lucide-react";

const EnquiriesPage = () => {
  const enquiries = [
    {
      name: "Riya Sharma",
      email: "riya@gmail.com",
      phone: "+91 9876543210",
      message: "Need details about Deluxe Room availability.",
      date: "Dec 11, 2025",
    },
    {
      name: "Karan Patel",
      email: "karan@gmail.com",
      phone: "+91 9123456780",
      message: "Is early check-in possible?",
      date: "Dec 10, 2025",
    },
    {
      name: "Mehul Jain",
      email: "mehul@gmail.com",
      phone: "+91 8899776655",
      message: "Do you offer any corporate discounts?",
      date: "Dec 08, 2025",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-white">

      {/* PAGE HEADER */}
      <div className="w-full px-8 py-8 border-b border-[#E5E7EB]">
        <h1 className="text-3xl font-semibold text-[#0A3D2E]">Enquiries</h1>
      </div>

      {/* TABLE SECTION */}
      <div className="w-full px-8 py-8">
        <table className="w-full border-separate border-spacing-0 text-sm">
          <thead>
            <tr className="text-left text-[#6B7280] bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <th className="py-3 px-3 font-medium">Name</th>
              <th className="py-3 px-3 font-medium">Email</th>
              <th className="py-3 px-3 font-medium">Phone</th>
              <th className="py-3 px-3 font-medium">Message</th>
              <th className="py-3 px-3 font-medium">Date</th>
              <th className="py-3 px-3 font-medium text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="text-[#0A3D2E]">
            {enquiries.map((item, index) => (
              <tr
                key={index}
                className="border-b border-[#E5E7EB] hover:bg-[#F8FAFB] transition"
              >
                <td className="py-4 px-3 font-medium">{item.name}</td>
                <td className="px-3">{item.email}</td>
                <td className="px-3">{item.phone}</td>
                <td className="px-3 max-w-xs truncate">{item.message}</td>
                <td className="px-3">{item.date}</td>

                {/* ACTION BUTTON */}
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
      `}</style>
    </div>
  );
};

export default EnquiriesPage;
