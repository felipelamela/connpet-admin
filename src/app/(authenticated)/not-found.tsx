"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";

/**
 * Página 404 - Não encontrada (Rotas Autenticadas)
 * Mostra opções para o usuário autenticado
 */
export default function AuthenticatedNotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <FileQuestion className="h-20 w-20 text-gray-400 dark:text-gray-600" />
          </div>
          <CardTitle className="text-3xl mb-2">Página não encontrada</CardTitle>
          <CardDescription className="text-base">
            A página que você está tentando acessar não existe ou ainda não foi implementada na estrutura modular.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mensagem informativa */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>💡 Dica:</strong> As rotas antigas foram movidas para a nova estrutura modular.
              Acesse através dos módulos: <strong>PetShop</strong>, <strong>Clínica</strong> ou <strong>Grooming</strong>.
            </p>
          </div>

          {/* Botões de ação */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={() => router.push('/select-module')}
              className="w-full"
              size="lg"
            >
              <Home className="mr-2 h-5 w-5" />
              Voltar para Seleção de Módulos
            </Button>

            <Button
              onClick={() => router.back()}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Voltar para Página Anterior
            </Button>
          </div>

          {/* Links rápidos */}
          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-3">
              Acesso rápido aos módulos:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={() => router.push('/petshop/dashboard')}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                🛒 PetShop
              </Button>
              <Button
                onClick={() => router.push('/clinica/dashboard')}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                🏥 Clínica
              </Button>
              <Button
                onClick={() => router.push('/grooming/dashboard')}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                ✨ Grooming
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

