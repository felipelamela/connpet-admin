"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export default function PetShopAgendamentosPage() {
  return (
    <div className="container mx-auto max-w-7xl">
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Agendamentos</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Gerencie os agendamentos do PetShop
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Agendamentos PetShop
          </CardTitle>
          <CardDescription>
            Lista de agendamentos de produtos e serviços
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Funcionalidade de agendamentos em implementação...
          </p>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}

