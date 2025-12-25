'use client';

import React, { useState, useEffect } from "react";
import { Heart, Edit, LogOut } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const router = useRouter();
  const { user, token, logout, updateUser, loading: authLoading } = useAuth();

  useEffect(() => {
    // Wait for auth context to finish loading
    if (authLoading) {
      return; // Don't do anything while auth is loading
    }

    // Now check if user is authenticated
    if (!token) {
      router.push('/login');
      return;
    }
    
    // Always fetch fresh user data from the API
    fetchUserData();
  }, [token, authLoading, router]);

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-plus-jakarta-sans">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-700">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-plus-jakarta-sans">
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white p-6 mb-8 border border-[#594B00]/30 rounded-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#173A00] mb-2">My Profile</h1>
              <p className="text-[#594B00]">Manage your account information and preferences</p>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-[#594B00] text-white rounded-xl hover:bg-[#173A00] transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white p-2 mb-6 border border-[#594B00]/30 rounded-xl inline-block">
          <div className="flex space-x-2">
            {['profile', 'bookings', 'favorites'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg transition-colors capitalize ${activeTab === tab 
                  ? 'bg-[#594B00] text-white' 
                  : 'text-[#594B00] hover:bg-[#FFFBE6]'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white p-6 border border-[#594B00]/30 rounded-xl">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#594B00] to-[#173A00] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[#173A00]">{user?.name || "User"}</h2>
                  <p className="text-[#594B00]">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#173A00] mb-1">Full Name</label>
                    <p className="p-3 bg-[#FFFBE6] rounded-lg border border-[#594B00]/30">{user?.name || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#173A00] mb-1">Email Address</label>
                    <p className="p-3 bg-[#FFFBE6] rounded-lg border border-[#594B00]/30">{user?.email || "N/A"}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#173A00] mb-1">User ID</label>
                    <p className="p-3 bg-[#FFFBE6] rounded-lg border border-[#594B00]/30 font-mono text-sm">{user?.id || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#173A00] mb-1">Member Since</label>
                    <p className="p-3 bg-[#FFFBE6] rounded-lg border border-[#594B00]/30">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : "N/A"}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#173A00] mb-1">Account Status</label>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-green-700 font-medium">Active</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#173A00] mb-4">My Bookings</h2>
              <p className="text-[#594B00]">Your booking history will be displayed here.</p>
              <div className="space-y-4">
                {/* Placeholder for booking items */}
                <div className="p-4 bg-[#FFFBE6] rounded-lg border border-[#594B00]/30">
                  <p className="text-center text-[#594B00]">No bookings found</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#173A00] mb-4">Favorite Rooms</h2>
              <p className="text-[#594B00]">Your favorite rooms will be displayed here.</p>
              <div className="space-y-4">
                {/* Placeholder for favorite items */}
                <div className="p-4 bg-[#FFFBE6] rounded-lg border border-[#594B00]/30">
                  <p className="text-center text-[#594B00]">No favorites found</p>
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