"use client";
import React, { useState } from "react";
import { Eye, EyeOff, Key } from "lucide-react";

const ProfilePage = () => {
  // Form state
  const [formData, setFormData] = useState({
    fullName: "Admin User",
    email: "admin@breezeandgrains.com",
    phoneNumber: "+91 98765 43210",
    role: "Super Administrator",
    lastLogin: "Dec 12, 2025, 14:30",
    joinDate: "Jan 15, 2024"
  });



  return (
    <div className="w-full min-h-screen bg-white px-6 py-8">
      <h1 className="text-3xl font-semibold tracking-tight mb-8 text-[#0A3D2E]">
        Profile Settings
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-[0_4px_18px_rgba(0,0,0,0.05)] p-6 border border-[#0A3D2E15]">
          <h2 className="text-xl font-semibold mb-6 text-[#0A3D2E]">Profile Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                readOnly
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                readOnly
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                readOnly
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Login
              </label>
              <input
                type="text"
                name="lastLogin"
                value={formData.lastLogin}
                readOnly
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Member Since
              </label>
              <input
                type="text"
                name="joinDate"
                value={formData.joinDate}
                readOnly
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50"
              />
            </div>
          </div>
        </div>
        

      </div>
      

    </div>
  );
};

export default ProfilePage;