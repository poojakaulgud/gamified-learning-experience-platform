'use client';
import React from 'react';

// shared navigation
import UserNavBar from '@/components/dash_ui/UserNavBar';
// import { AuthRouteProvider } from '@/providers/AuthRouteProvider';

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Include shared UI here e.g. a header or sidebar */}
      <UserNavBar />
      {children}
    </>
  );
}
