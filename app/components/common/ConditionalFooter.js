'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  const isAdminRoute = pathname.includes('/secure-portal-z8q1k4f9d0');
  
  if (isAdminRoute) {
    return null;
  }
  
  return <Footer />;
}