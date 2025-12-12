"use client";

import React, { useState } from "react";
import { Heart, Edit, LogOut } from "lucide-react";

// Sample Data
const bookings = [
  {
    id: 1,
    title: "Beachside Villa",
    location: "Goa, India",
    dateRange: "Dec 15 - Dec 20, 2025",
    status: "Confirmed",
  },
  {
    id: 2,
    title: "Mountain Cabin",
    location: "Manali, India",
    dateRange: "Jan 5 - Jan 10, 2026",
    status: "Pending",
  },
];

const wishlist = [
  {
    id: 1,
    title: "Luxury Apartment",
    location: "Bali, Indonesia",
  },
  {
    id: 2,
    title: "City Loft",
    location: "Tokyo, Japan",
  },
];

const activities = [
  {
    id: 1,
    type: "Booking",
    message: "You confirmed a booking at Beachside Villa",
    date: "Dec 1, 2025",
  },
  {
    id: 2,
    type: "Review",
    message: "You left a review for Mountain Cabin",
    date: "Nov 28, 2025",
  },
];

const Page = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gray-50 font-plus-jakarta-sans">
      
      {/* ===================== PROFILE HEADER ===================== */}
      <div className="bg-white shadow-md rounded-b-3xl px-8 py-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8">
          
          {/* Left Side - Static Avatar */}
          <div className="flex-shrink-0 w-48 h-48 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500 text-xl font-bold">Avatar</span>
          </div>

          {/* Right Side - User Info */}
          <div className="flex-1 flex flex-col gap-4">
            <h1 className="text-3xl md:text-4xl font-playfair-display font-bold text-gray-900">
              Dhruval Patel
            </h1>
            <p className="text-gray-600">Member since Jan 2020</p>
            <p className="text-gray-700 max-w-xl">
              Traveler, photographer, and design enthusiast. Sharing my journey one stay at a time.
            </p>
            <p className="text-gray-600">
              dhruval@example.com | +91 9876543210 | India
            </p>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-4">
              <button className="px-6 py-2 bg-black text-white rounded-2xl flex items-center gap-2 hover:bg-gray-800 transition">
                <Edit size={16} /> Edit Profile
              </button>
              <button className="px-6 py-2 bg-gray-200 text-gray-900 rounded-2xl flex items-center gap-2 hover:bg-gray-300 transition">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== TABS ===================== */}
      <div className="mt-8 px-8">
        <div className="flex gap-8 border-b border-gray-200">
          {["overview", "bookings", "wishlist"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 font-medium text-gray-700 transition ${
                activeTab === tab
                  ? "border-b-2 border-black text-gray-900"
                  : "hover:text-gray-900"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ===================== CONTENT ===================== */}
      <div className="px-8 py-10">
        
        {/* Overview */}
        {activeTab === "overview" && (
          <div>
            <h2 className="text-2xl font-playfair-display font-bold mb-6">
              Recent Activity
            </h2>
            <ul className="space-y-4">
              {activities.map((act) => (
                <li
                  key={act.id}
                  className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center"
                >
                  <div>
                    <p className="text-gray-900 font-medium">{act.message}</p>
                    <p className="text-gray-600 text-sm">{act.date}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${
                      act.type === "Booking" ? "bg-green-500" : "bg-blue-500"
                    }`}
                  >
                    {act.type}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Bookings */}
        {activeTab === "bookings" && (
          <div>
            <h2 className="text-2xl font-playfair-display font-bold mb-6">
              My Bookings
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-500 font-medium">Image</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 text-lg">{b.title}</h3>
                    <p className="text-gray-600 text-sm">{b.location}</p>
                    <p className="text-gray-600 text-sm">{b.dateRange}</p>
                    <span
                      className={`inline-block mt-2 px-3 py-1 rounded-full text-white text-sm ${
                        b.status === "Confirmed"
                          ? "bg-green-500"
                          : b.status === "Pending"
                          ? "bg-yellow-500"
                          : "bg-gray-400"
                      }`}
                    >
                      {b.status}
                    </span>
                    <button className="mt-4 w-full py-2 bg-black text-white rounded-2xl hover:bg-gray-800 transition">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wishlist */}
        {activeTab === "wishlist" && (
          <div>
            <h2 className="text-2xl font-playfair-display font-bold mb-6">
              Wishlist
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-500 font-medium">Image</span>
                  </div>
                  <div className="p-4 flex flex-col gap-2">
                    <h3 className="font-medium text-gray-900 text-lg">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.location}</p>
                    <div className="flex justify-between items-center mt-2">
                      <Heart className="text-red-500" />
                      <button className="py-1 px-3 bg-black text-white rounded-2xl text-sm hover:bg-gray-800 transition">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
