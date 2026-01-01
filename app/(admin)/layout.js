"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function AdminRootLayout({ children }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect after loading is complete
    if (!loading) {
      // If user is not authenticated and not on login page, redirect to login
      if (!isAuthenticated && pathname !== '/admin-login' && pathname !== '/(admin)/admin-login') {
        router.push("/admin-login");
      }
    }
  }, [isAuthenticated, loading, router, pathname]);

  // If still loading auth state, show loading indicator
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Verifying session...</div>
      </div>
    );
  }

  // If not authenticated and not on login page, don't render children until redirect happens
  if (!isAuthenticated && pathname !== '/admin-login' && pathname !== '/(admin)/admin-login') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  );
}