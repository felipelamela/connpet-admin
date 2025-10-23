"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PawPrint } from "lucide-react";

export default function EditarCadastroPage() {
 


  return (
    
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Editar Cadastro</h1>
          <p className="text-muted-foreground">Edite os dados do pet ou tutor</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <PawPrint className="h-5 w-5" />
              <CardTitle>Formulário de Edição</CardTitle>
            </div>
            <CardDescription>Página em desenvolvimento</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Esta página está em desenvolvimento. Em breve você poderá editar cadastros aqui.
            </p>
          </CardContent>
        </Card>
      </main>
    
  );
}

