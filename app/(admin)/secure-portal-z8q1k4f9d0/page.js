"use client";

import React from 'react'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Dashboard from './Dashboard/page'
// import TestScrollingPage from './test-scrolling'

const page = () => {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && (!isAuthenticated || !user || !user.isAdmin)) {
      router.push('/admin-login');
    }
  }, [isAuthenticated, user, loading, router]);

  if (loading || (!isAuthenticated || !user || !user.isAdmin)) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div>
      <Dashboard />
    </div>
  )
}

export default page