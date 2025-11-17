"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { FileQuestion } from "lucide-react";

/**
 * Página 404 - Não encontrada (Global)
 * Redireciona para login se não autenticado
 * Redireciona para select-module se autenticado
 */
export default function NotFound() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/select-module');
      } else {
        router.replace('/login');
      }
    }, 5000); 

    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading, router]);

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full text-center">
        {/* Ícone */}
        <div className="mb-8">
          <FileQuestion className="h-24 w-24 text-gray-400 dark:text-gray-600 mx-auto" />
        </div>

        {/* Título */}
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          404
        </h1>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Página não encontrada
        </h2>

        {/* Descrição */}
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          A página que você está procurando não existe ou foi movida para a nova estrutura modular.
        </p>

        {/* Contador de redirecionamento */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Redirecionando em <span className="font-bold text-primary">3 segundos</span>...
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            {isAuthenticated ? 'Levando você para a seleção de módulos' : 'Levando você para o login'}
          </p>
        </div>

        {/* Loading bar */}
        <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div className="bg-primary h-full animate-progress-bar" style={{ animation: 'progressBar 3s linear' }}></div>
        </div>

        <style jsx>{`
          @keyframes progressBar {
            from { width: 0%; }
            to { width: 100%; }
          }
          .animate-progress-bar {
            animation: progressBar 5s linear;
          }
        `}</style>
      </div>
    </div>
  );
}

