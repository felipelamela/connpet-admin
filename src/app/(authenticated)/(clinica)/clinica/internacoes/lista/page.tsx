"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Bed, Plus, Search, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useModuleContext } from "@/hooks/useModuleContext";

interface Internation {
  id: string;
  petName: string;
  veterinarian: string;
  startDate: string;
  endDate: string | null;
  status: string;
}

export default function ListaInternacoesPage() {
  const router = useRouter();
  const { getButtonColors } = useModuleContext();
  const buttonColors = getButtonColors();
  const [searchTerm, setSearchTerm] = useState("");
  const [internations, setInternations] = useState<Internation[]>([
    {
      id: "1",
      petName: "Rex",
      veterinarian: "Dr. Carlos Silva",
      startDate: "2025-10-15",
      endDate: null,
      status: "Em andamento",
    },
    {
      id: "2",
      petName: "Thor",
      veterinarian: "Dra. Maria Santos",
      startDate: "2025-10-10",
      endDate: "2025-10-14",
      status: "Concluída",
    },
  ]);

 

  const filteredInternations = internations.filter((int) =>
    int.petName.toLowerCase().includes(searchTerm.toLowerCase())
  );  return (
    
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Lista de Internações</h1>
          <p className="text-muted-foreground">Gerencie as internações de pets</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bed className="h-5 w-5" />
                <CardTitle>Internações Cadastradas</CardTitle>
              </div>
              <Button onClick={() => router.push("/clinica/internacoes/cadastrar")} className="bg-blue-600 text-white hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4 text-white" />
                Nova Internação
              </Button>
            </div>
            <CardDescription>
              Lista completa de internações registradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome do pet..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pet</TableHead>
                    <TableHead>Veterinário</TableHead>
                    <TableHead>Data Entrada</TableHead>
                    <TableHead>Data Saída</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInternations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        Nenhuma internação encontrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInternations.map((int) => (
                      <TableRow key={int.id}>
                        <TableCell className="font-medium">{int.petName}</TableCell>
                        <TableCell>{int.veterinarian}</TableCell>
                        <TableCell>
                          {new Date(int.startDate).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell>
                          {int.endDate
                            ? new Date(int.endDate).toLocaleDateString("pt-BR")
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              int.endDate
                                ? "bg-gray-100 text-gray-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {int.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/internacoes/detalhes?id=${int.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    
  );
}

