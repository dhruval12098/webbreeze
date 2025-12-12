'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const isAdminRoute = pathname.includes('/secure-portal-z8q1k4f9d0');
  
  if (isAdminRoute) {
    return null;
  }
  
  return <Navbar />;
}