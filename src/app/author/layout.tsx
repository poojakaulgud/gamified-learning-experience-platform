'use client';
import React from 'react';

// shared navigation
import AuthorNavBar from '@/components/dash_ui/AuthorNavBar';

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Include shared UI here e.g. a header or sidebar */}
      <AuthorNavBar />
      {children}
    </>
  );
}
