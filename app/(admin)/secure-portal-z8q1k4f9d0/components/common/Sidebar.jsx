"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  CalendarCheck2,
  MessageSquare,
  FileText,
  User,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Sidebar = ({ collapsed, onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(collapsed || false);

  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/secure-portal-z8q1k4f9d0/Dashboard" },
    { name: "Bookings", icon: <CalendarCheck2 size={18} />, path: "/secure-portal-z8q1k4f9d0/Bookings" },
    { name: "Enquiries", icon: <MessageSquare size={18} />, path: "/secure-portal-z8q1k4f9d0/Enquiries" },
    { name: "Newsletter", icon: <Mail size={18} />, path: "/secure-portal-z8q1k4f9d0/Newsletter" },
    { name: "Content", icon: <FileText size={18} />, path: "/secure-portal-z8q1k4f9d0/Content" },
    { name: "Profile", icon: <User size={18} />, path: "/secure-portal-z8q1k4f9d0/Profile" },
  ];

  const handleToggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (onToggle) onToggle(newState);
  };

  return (
    <aside
      className={`
        h-screen bg-[#266000] 
        text-white flex flex-col relative transition-all duration-300
        ${isCollapsed ? "w-20" : "w-64"}
      `}
    >

      {/* HEADER */}
      <div className="flex items-start justify-between px-4 pt-4 pb-2">
        <div className="flex flex-col items-start">
          {!isCollapsed ? (
            <>
              <img 
                src="/logo.svg" 
                alt="Logo" 
                className="w-44 object-contain mt-2"
              />

              <h1 className="text-sm font-medium tracking-tight text-gray-300 mt-2">
                Admin Panel
              </h1>
            </>
          ) : (
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
          )}
        </div>

        <button
          onClick={handleToggle}
          className="
            w-8 h-8 mt-1
            bg-white/15 border border-white/20 backdrop-blur 
            rounded-xl flex items-center justify-center 
            hover:bg-white/20 transition
          "
        >
          {isCollapsed ? (
            <ChevronRight size={18} className="text-white" />
          ) : (
            <ChevronLeft size={18} className="text-white" />
          )}
        </button>
      </div>

      <div className="border-t border-white/20 mx-4 mt-2"></div>

      {/* NAVIGATION */}
      <nav className="flex flex-col gap-1 mt-3 px-3">
        {navItems.map((item, idx) => (
          <Link
            key={idx}
            href={item.path}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-xl 
              text-white/90 hover:bg-white/10 transition-all
              ${isCollapsed ? "justify-center" : ""}
            `}
          >
            <span className="text-white">{item.icon}</span>
            {!isCollapsed && <span className="text-[15px]">{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* FOOTER */}
      {!isCollapsed && (
        <div className="mt-auto text-xs text-white/60 px-6 py-5">
          © 2025 Admin UI
        </div>
      )}
    </aside>
  );
};

export default Sidebar;