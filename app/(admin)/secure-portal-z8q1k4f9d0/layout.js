"use client";
import React from "react";
import Sidebar from "./components/common/Sidebar";
import Header from "./components/common/Header";

export default function AdminLayout({ children }) {
  // assume parent controls collapsed; if you want local state keep it here
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const toggleSidebar = () => setSidebarCollapsed((s) => !s);

  return (
    <div className="flex h-screen bg-white">
      {/* Fixed sidebar (doesn't scroll) */}
      <div className="fixed top-0 left-0 h-screen z-50">
        <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      </div>

      {/* Main content area */}
      <div className={`flex-1 flex flex-col min-h-0 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Fixed header */}
        <div className="fixed top-0 right-0 left-0 z-40 bg-white shadow-sm">
          <div className={sidebarCollapsed ? 'ml-20' : 'ml-64'}>
            <Header onToggleSidebar={toggleSidebar} />
          </div>
        </div>

        {/* Scrollable content area - using data-lenis-prevent to work with SmoothScroll */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 mt-16" data-lenis-prevent>
          {children}
        </main>
      </div>
    </div>
  );
}