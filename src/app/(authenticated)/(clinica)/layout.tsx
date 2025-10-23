"use client";

import { ClinicaSidebar } from "@/components/sidebars/ClinicaSidebar";

/**
 * Layout para o módulo Clínica Veterinária
 * Usa sidebar específica com itens médicos
 */
export default function ClinicaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ClinicaSidebar />
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

