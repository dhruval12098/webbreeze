"use client";
import React, { useState, useEffect } from "react";
import {
  CalendarCheck2,
  MessageSquare,
  User,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { adminMetricsApi } from "@/app/lib/apiClient";

const DashboardPage = () => {
  const { token } = useAuth();
  const [metrics, setMetrics] = useState({
    totalBookings: 0,
    totalEnquiries: 0,
    totalRevenue: 0,
    totalUsers: 0,
    recentBookings: [],
    recentEnquiries: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      fetchMetrics();
    }
  }, [token]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Use the apiClient to fetch metrics with admin token
      const result = await adminMetricsApi.getMetrics(token);

      if (result.success) {
        setMetrics(prev => ({ ...prev, ...result.data }));
      } else {
        throw new Error(result.error || 'Failed to fetch dashboard metrics');
      }
    } catch (err) {
      console.error('Error fetching metrics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-white px-6 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C6A300]"></div>
          <p className="mt-4 text-lg text-[#0A3D2E]">Loading dashboard metrics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-white px-6 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white px-6 py-8">
      {/* ================= WELCOME ================= */}
      <h1 className="text-3xl font-semibold tracking-tight mb-8 text-[#0A3D2E]">
        Welcome back, Admin 
      </h1>

      {/* ================= TOP STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">

        {/* Total Bookings Card */}
        <div className="bg-white rounded-3xl shadow-[0_4px_18px_rgba(0,0,0,0.05)] p-6 border border-[#0A3D2E15] hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#0A3D2E99]">Total Bookings</p>
              <h2 className="text-3xl font-semibold mt-1 text-[#0A3D2E]">{metrics.totalBookings}</h2>
            </div>
            <CalendarCheck2 size={34} className="text-[#C6A300]" />
          </div>
        </div>

        {/* Enquiries Card */}
        <div className="bg-white rounded-3xl shadow-[0_4px_18px_rgba(0,0,0,0.05)] p-6 border border-[#0A3D2E15] hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#0A3D2E99]">Enquiries</p>
              <h2 className="text-3xl font-semibold mt-1 text-[#0A3D2E]">{metrics.totalEnquiries}</h2>
            </div>
            <MessageSquare size={34} className="text-[#C6A300]" />
          </div>
        </div>

        {/* Users Card */}
        <div className="bg-white rounded-3xl shadow-[0_4px_18px_rgba(0,0,0,0.05)] p-6 border border-[#0A3D2E15] hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#0A3D2E99]">Users</p>
              <h2 className="text-3xl font-semibold mt-1 text-[#0A3D2E]">
                {metrics.totalUsers}
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
                <th className="pb-3">Date</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>

            <tbody className="text-[#0A3D2E]">
              {Array.isArray(metrics.recentBookings) && metrics.recentBookings.length > 0 ? (
                metrics.recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-[#0A3D2E08] transition">
                    <td className="py-3">{booking.user_name}</td>
                    <td>{booking.check_in_date} - {booking.check_out_date}</td>
                    <td className="font-medium text-[#0A3D2E]">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        booking.booking_status === 'Confirmed' ? 'bg-[#E8F6EF] text-[#0A3D2E] border-[#9FD9C3]' :
                        booking.booking_status === 'Pending' ? 'bg-[#FFF8E6] text-[#C6A300] border-[#E8D48F]' :
                        'bg-[#FDECEC] text-[#D64545] border-[#F3B4B4]'
                      }`}>
                        {booking.booking_status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-3 text-center text-[#0A3D2E99]">No recent bookings</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ============= RECENT ENQUIRIES LIST ============= */}
        <div className="bg-white rounded-3xl border border-[#0A3D2E15] shadow-[0_4px_18px_rgba(0,0,0,0.05)] p-6">
          <h2 className="text-xl font-semibold mb-5 text-[#0A3D2E]">
            Latest Enquiries
          </h2>

          <div className="flex flex-col gap-5">
            {Array.isArray(metrics.recentEnquiries) && metrics.recentEnquiries.length > 0 ? (
              metrics.recentEnquiries.map((enquiry) => (
                <div key={enquiry.id} className="p-5 rounded-2xl bg-[#0A3D2E05] border border-[#0A3D2E15] hover:bg-[#0A3D2E0A] transition">
                  <p className="font-medium text-[#0A3D2E]">{enquiry.name}</p>
                  <p className="text-sm text-[#0A3D2E99]">
                    "{enquiry.message}"
                  </p>
                </div>
              ))
            ) : (
              <div className="p-5 rounded-2xl bg-[#0A3D2E05] border border-[#0A3D2E15] text-center text-[#0A3D2E99]">
                No recent enquiries
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default DashboardPage;