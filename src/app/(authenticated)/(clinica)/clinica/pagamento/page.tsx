"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

export default function PagamentoPage() {
  return (
    <div className="container mx-auto max-w-7xl">
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pagamentos</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Gerencie os pagamentos e faturamento do PetShop
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            Gestão de Pagamentos
          </CardTitle>
          <CardDescription>
            Controle financeiro e faturamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Funcionalidade de pagamentos em implementação...
          </p>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}

