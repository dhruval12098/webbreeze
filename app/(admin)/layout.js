"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function AdminRootLayout({ children }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      // If user is not authenticated and not on login page, redirect to login
      if (!isAuthenticated && pathname !== '/admin-login' && pathname !== '/(admin)/admin-login') {
        router.push("/admin-login");
      }
    }
  }, [isAuthenticated, loading, router, pathname]);

  // If not authenticated and not on login page, don't render children until redirect happens
  if (!isAuthenticated && !loading && pathname !== '/admin-login' && pathname !== '/(admin)/admin-login') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  );
}