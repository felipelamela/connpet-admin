"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FlaskConical } from "lucide-react";

export default function CadastrarExamePage() {
 


  return (
    
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Cadastrar Pedido de Exame</h1>
          <p className="text-muted-foreground">Cadastre um novo pedido de exame</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5" />
              <CardTitle>Formulário de Pedido</CardTitle>
            </div>
            <CardDescription>Página em desenvolvimento</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Esta página está em desenvolvimento. Em breve você poderá cadastrar pedidos de exames aqui.
            </p>
          </CardContent>
        </Card>
      </main>
    
  );
}

