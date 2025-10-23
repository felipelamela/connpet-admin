"use client";

import { Sidebar } from "@/components/sidebar";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      {/* Main Content with padding for sidebar */}
      <div className="lg:pl-72">
        {/* Mobile padding for header */}
        <div className="lg:hidden h-16" />
        {children}
      </div>
    </div>
  );
}

