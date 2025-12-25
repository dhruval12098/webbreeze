'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Navbar from './Navbar';

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const { token } = useAuth();
  const isAdminRoute = pathname.includes('/secure-portal-z8q1k4f9d0');
  
  if (isAdminRoute) {
    return null;
  }
  
  // Use token as key to force re-render when auth state changes
  return <Navbar key={token || 'no-token'} />;
}