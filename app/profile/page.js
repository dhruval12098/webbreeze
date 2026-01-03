'use client';

import React, { useState, useEffect } from "react";
import { Heart, Edit, LogOut } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import BookingHistory from '../components/profile/BookingHistory';

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const router = useRouter();
  const { user, token, logout, updateUser, loading: authLoading, isAdminAuthenticated, isUserAuthenticated } = useAuth();

  useEffect(() => {
    // Wait for auth context to finish loading
    if (authLoading) {
      return; // Don't do anything while auth is loading
    }

    // Redirect admin users to admin dashboard first
    if (isAdminAuthenticated) {
      router.push('/secure-portal-z8q1k4f9d0');
      return;
    }
    
    // Redirect to login if not authenticated as a user
    if (!token || !isUserAuthenticated) {
      router.push('/login');
      return;
    }
    
    // Always fetch fresh user data from the API
    fetchUserData();
  }, [token, authLoading, isAdminAuthenticated, isUserAuthenticated, router]);

  // Effect to handle auth state when user data fetch fails
  useEffect(() => {
    if (error && error.includes('Session has expired')) {
      logout();
      router.push('/login');
    }
  }, [error, logout, router]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch user data');
      }

      const data = await response.json();
      if (data.success) {
        updateUser(data.user);
      } else {
        throw new Error(data.error || 'Failed to fetch user data');
      }
    } catch (err) {
      setError(err.message);
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    router.refresh();
  };

  // Show loading while either auth or profile data is loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-plus-jakarta-sans">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-black">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-plus-jakarta-sans">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFBE6] to-white font-plus-jakarta-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header Section */}
        <div className="bg-white p-4 sm:p-6 mb-6 sm:mb-8 border border-[#594B00]/30 rounded-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#173A00] mb-1 sm:mb-2">My Profile</h1>
              <p className="text-[#594B00] text-sm sm:text-base">Manage your account information and preferences</p>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-[#594B00] text-white rounded-lg sm:rounded-xl hover:bg-[#173A00] transition-colors w-full sm:w-auto"
            >
              <LogOut size={16} className="sm:size-5" />
              <span className="text-sm sm:text-base">Logout</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white p-2 mb-4 sm:mb-6 border border-[#594B00]/30 rounded-lg sm:rounded-xl overflow-x-auto">
          <div className="flex space-x-1 sm:space-x-2 min-w-max">
            {['profile', 'bookings', 'favorites'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 sm:px-6 sm:py-2 rounded-md sm:rounded-lg transition-colors capitalize text-sm sm:text-base whitespace-nowrap ${activeTab === tab 
                  ? 'bg-[#594B00] text-white' 
                  : 'text-[#594B00] hover:bg-[#FFFBE6]'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white p-4 sm:p-6 border border-[#594B00]/30 rounded-xl">
          {activeTab === 'profile' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#594B00] to-[#173A00] rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-lg sm:text-xl font-semibold text-[#173A00]">{user?.name || "User"}</h2>
                  <p className="text-[#594B00] text-sm sm:text-base">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-[#173A00] mb-1">Full Name</label>
                    <p className="p-2 sm:p-3 bg-[#FFFBE6] rounded-lg border border-[#594B00]/30 text-sm sm:text-base">{user?.name || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-[#173A00] mb-1">Email Address</label>
                    <p className="p-2 sm:p-3 bg-[#FFFBE6] rounded-lg border border-[#594B00]/30 text-sm sm:text-base">{user?.email || "N/A"}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-[#173A00] mb-1">User ID</label>
                    <p className="p-2 sm:p-3 bg-[#FFFBE6] rounded-lg border border-[#594B00]/30 font-mono text-xs sm:text-sm">{user?.id || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-[#173A00] mb-1">Member Since</label>
                    <p className="p-2 sm:p-3 bg-[#FFFBE6] rounded-lg border border-[#594B00]/30 text-sm sm:text-base">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : "N/A"}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#173A00] mb-1">Account Status</label>
                  <div className="p-2 sm:p-3 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-green-700 font-medium text-sm sm:text-base">Active</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <BookingHistory />
          )}

          {activeTab === 'favorites' && (
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-semibold text-[#173A00] mb-3 sm:mb-4">Favorite Rooms</h2>
              <p className="text-[#594B00] text-sm sm:text-base">Your favorite rooms will be displayed here.</p>
              <div className="space-y-4">
                {/* Placeholder for favorite items */}
                <div className="p-3 sm:p-4 bg-[#FFFBE6] rounded-lg border border-[#594B00]/30">
                  <p className="text-center text-[#594B00] text-sm sm:text-base">No favorites found</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;