"use client";
import React, { useState } from "react";
import { Search, Bell, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

const Header = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Call admin logout API
      const token = localStorage.getItem("auth_token");
      if (token) {
        await fetch("/api/admin/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
      }
      
      // Clear auth data and redirect
      await logout();
      router.push("/admin-login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="w-full bg-white border-b border-neutral-200 flex items-center justify-between px-6 py-4">
      
      {/* LEFT — Page Title */}
      <h2 className="text-xl font-semibold tracking-tight font-sans text-neutral-800">
        Breeze & Grains Dashboard
      </h2>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-6">

        {/* Search Bar */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search..."
            className="
              w-56 h-10 pl-10 pr-3 rounded-xl bg-neutral-100
              border border-neutral-200 text-sm
              focus:outline-none focus:ring-2 focus:ring-black/10 
            "
          />
        </div>

        {/* Notification Icon */}
        <button className="relative hover:text-neutral-900 text-neutral-600 transition">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Profile Image and Logout */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neutral-300 overflow-hidden cursor-pointer">
            {/* Placeholder avatar */}
            <img 
              src="https://via.placeholder.com/100" 
              alt="profile"
              className="w-full h-full object-cover" 
            />
          </div>
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-600 disabled:opacity-50"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

    </header>
  );
};

export default Header;