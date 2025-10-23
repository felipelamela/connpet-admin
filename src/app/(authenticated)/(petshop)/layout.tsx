"use client";

import { ModuleSidebar } from "@/components/sidebars/ModuleSidebar";
import { Store } from "lucide-react";

/**
 * Layout para o módulo PetShop
 */
export default function PetShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ModuleSidebar
        moduleName="PetShop"
        moduleColor="text-blue-600"
        moduleIcon={Store}
        modulePrefix="petshop"
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

