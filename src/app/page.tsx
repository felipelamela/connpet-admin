"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Se ainda está carregando, aguardar
    if (isLoading) return;
    
    // Se já redirecionou, não fazer nada
    if (hasRedirected.current) return;
    
    // Marcar que vai redirecionar
    hasRedirected.current = true;
    
    // Redirecionar apenas UMA vez
    const destination = isAuthenticated ? "/select-module" : "/login";
    
    // Usar timeout para evitar que o redirect aconteça durante o render
    setTimeout(() => {
      router.replace(destination);
    }, 0);
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Carregando...
        </p>
      </div>
    </div>
  );
}
