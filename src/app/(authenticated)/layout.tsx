"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Layout para rotas autenticadas
 * Apenas verifica autenticação, não renderiza navbar
 * Cada módulo tem seu próprio layout com sidebar
 */
export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Só redirecionar se não autenticado E não estiver carregando
    if (!isLoading && !isAuthenticated && !hasRedirected.current) {
      hasRedirected.current = true;
      
      setTimeout(() => {
        router.replace("/login");
      }, 0);
    }
  }, [isLoading, isAuthenticated, router]);

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Verificando autenticação...
          </p>
        </div>
      </div>
    );
  }

  // Não autenticado (aguardando redirecionamento)
  if (!isAuthenticated) {
    return null;
  }

  // Autenticado - renderizar conteúdo (sem navbar/sidebar aqui)
  // Cada rota decide seu próprio layout
  return <>{children}</>;
}
