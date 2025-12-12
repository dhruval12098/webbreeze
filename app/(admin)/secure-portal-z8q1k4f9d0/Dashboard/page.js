"use client";
import React from "react";
import {
  CalendarCheck2,
  MessageSquare,
  User,
  DollarSign,
} from "lucide-react";

const DashboardPage = () => {
  return (
    <div className="w-full min-h-screen bg-white px-6 py-8">
      {/* ================= WELCOME ================= */}
      <h1 className="text-3xl font-semibold tracking-tight mb-8 text-[#0A3D2E]">
        Welcome back, Admin 
      </h1>

      {/* ================= TOP STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

        {/* CARD */}
        <div className="bg-white rounded-3xl shadow-[0_4px_18px_rgba(0,0,0,0.05)] p-6 border border-[#0A3D2E15] hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#0A3D2E99]">Total Bookings</p>
              <h2 className="text-3xl font-semibold mt-1 text-[#0A3D2E]">248</h2>
            </div>
            <CalendarCheck2 size={34} className="text-[#C6A300]" />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_4px_18px_rgba(0,0,0,0.05)] p-6 border border-[#0A3D2E15] hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#0A3D2E99]">Enquiries</p>
              <h2 className="text-3xl font-semibold mt-1 text-[#0A3D2E]">73</h2>
            </div>
            <MessageSquare size={34} className="text-[#C6A300]" />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_4px_18px_rgba(0,0,0,0.05)] p-6 border border-[#0A3D2E15] hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#0A3D2E99]">Revenue (This Month)</p>
              <h2 className="text-3xl font-semibold mt-1 text-[#0A3D2E]">
                ₹1,20,450
              </h2>
            </div>
            <DollarSign size={34} className="text-[#C6A300]" />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_4px_18px_rgba(0,0,0,0.05)] p-6 border border-[#0A3D2E15] hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#0A3D2E99]">Users</p>
              <h2 className="text-3xl font-semibold mt-1 text-[#0A3D2E]">
                112
              </h2>
            </div>
            <User size={34} className="text-[#C6A300]" />
          </div>
        </div>

      </div>

      {/* ================== CONTENT GRID ================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* ============= RECENT BOOKINGS TABLE ============= */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#0A3D2E15] shadow-[0_4px_18px_rgba(0,0,0,0.05)] p-6">
          <h2 className="text-xl font-semibold mb-5 text-[#0A3D2E]">
            Recent Bookings
          </h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#0A3D2E99] border-b">
                <th className="pb-3">Customer</th>
                <th className="pb-3">Room</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>

            <tbody className="text-[#0A3D2E]">

              <tr className="border-b hover:bg-[#0A3D2E08] transition">
                <td className="py-3">Rohan Patel</td>
                <td>Deluxe Room</td>
                <td>Dec 12 - Dec 15</td>
                <td className="font-medium text-[#0A3D2E]">
                  <span className="bg-[#C6A30022] px-3 py-1 rounded-full text-xs">
                    Confirmed
                  </span>
                </td>
              </tr>

              <tr className="border-b hover:bg-[#0A3D2E08] transition">
                <td className="py-3">Isha Sharma</td>
                <td>Standard Room</td>
                <td>Dec 10 - Dec 11</td>
                <td className="font-medium text-[#C6A300]">
                  <span className="bg-[#C6A30022] px-3 py-1 rounded-full text-xs">
                    Pending
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-[#0A3D2E08] transition">
                <td className="py-3">Ankit Verma</td>
                <td>Premium Suite</td>
                <td>Dec 20 - Dec 24</td>
                <td className="font-medium text-red-600">
                  <span className="bg-red-100 px-3 py-1 rounded-full text-xs">
                    Cancelled
                  </span>
                </td>
              </tr>

            </tbody>
          </table>
        </div>

        {/* ============= RECENT ENQUIRIES LIST ============= */}
        <div className="bg-white rounded-3xl border border-[#0A3D2E15] shadow-[0_4px_18px_rgba(0,0,0,0.05)] p-6">
          <h2 className="text-xl font-semibold mb-5 text-[#0A3D2E]">
            Latest Enquiries
          </h2>

          <div className="flex flex-col gap-5">

            <div className="p-5 rounded-2xl bg-[#0A3D2E05] border border-[#0A3D2E15] hover:bg-[#0A3D2E0A] transition">
              <p className="font-medium text-[#0A3D2E]">Akash Mehta</p>
              <p className="text-sm text-[#0A3D2E99]">
                "Is the premium suite available for New Year?"
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0A3D2E05] border border-[#0A3D2E15] hover:bg-[#0A3D2E0A] transition">
              <p className="font-medium text-[#0A3D2E]">Priya Desai</p>
              <p className="text-sm text-[#0A3D2E99]">
                "Do you offer airport pickup for guests?"
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0A3D2E05] border border-[#0A3D2E15] hover:bg-[#0A3D2E0A] transition">
              <p className="font-medium text-[#0A3D2E]">Harsh Shah</p>
              <p className="text-sm text-[#0A3D2E99]">
                "Is breakfast included in all room bookings?"
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default DashboardPage;