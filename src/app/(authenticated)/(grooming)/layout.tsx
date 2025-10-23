"use client";

import { ModuleSidebar } from "@/components/sidebars/ModuleSidebar";
import { Sparkles } from "lucide-react";

/**
 * Layout para o módulo Grooming
 */
export default function GroomingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ModuleSidebar
        moduleName="Grooming"
        moduleColor="text-purple-600"
        moduleIcon={Sparkles}
        modulePrefix="grooming"
      />
      {/* Content com margin-left para compensar a sidebar */}
      <div className="lg:ml-72">
        {/* Mobile: padding-top para o header */}
        <main className="lg:pt-8 pt-20 px-4 sm:px-6 lg:px-8 pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}

