"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope } from "lucide-react";

export default function NovaConsultaPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Você precisa fazer login primeiro");
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Nova Consulta</h1>
          <p className="text-muted-foreground">Agende uma nova consulta</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              <CardTitle>Formulário de Agendamento</CardTitle>
            </div>
            <CardDescription>Página em desenvolvimento</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Esta página está em desenvolvimento. Em breve você poderá agendar novas consultas aqui.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

