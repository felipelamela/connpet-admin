"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FlaskConical } from "lucide-react";

export default function ListagemExamesPage() {
 


  return (
    
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Listagem de Exames | Resultados</h1>
          <p className="text-muted-foreground">Visualize e gerencie exames e resultados</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5" />
              <CardTitle>Exames e Resultados</CardTitle>
            </div>
            <CardDescription>Página em desenvolvimento</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Esta página está em desenvolvimento. Em breve você poderá visualizar todos os exames
              e resultados aqui.
            </p>
          </CardContent>
        </Card>
      </main>
    
  );
}

