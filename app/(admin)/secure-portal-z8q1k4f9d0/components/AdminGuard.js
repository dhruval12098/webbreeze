'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

export default function AdminGuard({ children }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for auth to load
    if (loading) {
      return;
    }

    // Check if user exists and has admin privileges
    if (!isAuthenticated || !user || !user.isAdmin) {
      // Redirect to admin login
      router.push('/admin-login');
      return;
    }

    setIsChecking(false);
  }, [user, loading, isAuthenticated, router]);

  // Show loading while auth is loading or checking is still true
  if (loading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-semibold">Verifying session...</div>
      </div>
    );
  }

  // Only render children if user is authenticated as admin
  return <>{children}</>;
}