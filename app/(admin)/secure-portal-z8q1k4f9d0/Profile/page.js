"use client";
import React, { useState } from "react";
import { Eye, EyeOff, Key } from "lucide-react";

const ProfilePage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: "Admin User",
    email: "admin@breezeandgrains.com",
    phoneNumber: "+91 98765 43210",
    role: "Super Administrator",
    lastLogin: "Dec 12, 2025, 14:30",
    joinDate: "Jan 15, 2024",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Password reset logic would go here
    alert("Password reset functionality would be implemented here");
  };

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
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/10"
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
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/10"
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
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/10"
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
          
          <div className="mt-8 flex justify-end">
            <button 
              className="px-6 py-2.5 bg-[#266000] text-white rounded-xl hover:bg-[#1e4d00] transition"
            >
              Update Profile
            </button>
          </div>
        </div>
        
        {/* Password Reset Card */}
        <div className="bg-white rounded-3xl shadow-[0_4px_18px_rgba(0,0,0,0.05)] p-6 border border-[#0A3D2E15]">
          <div className="flex items-center gap-3 mb-6">
            <Key className="text-[#266000]" size={24} />
            <h2 className="text-xl font-semibold text-[#0A3D2E]">Reset Password</h2>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/10 pr-12"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/10 pr-12"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/10 pr-12"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            
            <button 
              type="submit"
              className="w-full py-3 bg-[#266000] text-white rounded-xl hover:bg-[#1e4d00] transition flex items-center justify-center gap-2"
            >
              <Key size={18} />
              Reset Password
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-medium text-gray-900 mb-2">Password Requirements</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                At least 8 characters
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                Contains uppercase letter
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                Contains lowercase letter
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                Contains a number
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Account Statistics Card */}
      <div className="mt-8 bg-white rounded-3xl shadow-[0_4px_18px_rgba(0,0,0,0.05)] p-6 border border-[#0A3D2E15]">
        <h2 className="text-xl font-semibold mb-6 text-[#0A3D2E]">Account Activity</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0 text-sm">
            <thead>
              <tr className="text-[#6B7280] bg-[#F9FAFB] text-left border-b border-[#E5E7EB]">
                <th className="py-3 px-3 font-medium">Activity</th>
                <th className="py-3 px-3 font-medium">IP Address</th>
                <th className="py-3 px-3 font-medium">Location</th>
                <th className="py-3 px-3 font-medium">Date & Time</th>
                <th className="py-3 px-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-[#0A3D2E]">
              <tr className="border-b border-[#E5E7EB] hover:bg-[#F8FAFB] transition">
                <td className="py-4 px-3">Login</td>
                <td className="px-3">192.168.1.105</td>
                <td className="px-3">Mumbai, India</td>
                <td className="px-3">Dec 12, 2025 14:30</td>
                <td className="px-3">
                  <span className="px-3 py-1 rounded-full text-xs border font-medium bg-[#E8F6EF] text-[#0A3D2E] border-[#9FD9C3]">
                    Success
                  </span>
                </td>
              </tr>
              <tr className="border-b border-[#E5E7EB] hover:bg-[#F8FAFB] transition">
                <td className="py-4 px-3">Password Reset</td>
                <td className="px-3">192.168.1.105</td>
                <td className="px-3">Mumbai, India</td>
                <td className="px-3">Dec 10, 2025 09:15</td>
                <td className="px-3">
                  <span className="px-3 py-1 rounded-full text-xs border font-medium bg-[#E8F6EF] text-[#0A3D2E] border-[#9FD9C3]">
                    Success
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-[#F8FAFB] transition">
                <td className="py-4 px-3">Login Attempt</td>
                <td className="px-3">203.122.45.67</td>
                <td className="px-3">Delhi, India</td>
                <td className="px-3">Dec 8, 2025 22:45</td>
                <td className="px-3">
                  <span className="px-3 py-1 rounded-full text-xs border font-medium bg-[#FFF8E6] text-[#C6A300] border-[#E8D48F]">
                    Failed
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;