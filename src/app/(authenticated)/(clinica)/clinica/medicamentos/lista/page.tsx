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
import { Pill, Plus, Search, Edit, Trash2 } from "lucide-react";

interface Medication {
  id: string;
  petName: string;
  name: string;
  dosage: string;
  startDate: string;
  endDate: string | null;
}

export default function ListaMedicamentosPage() {
 

  const [searchTerm, setSearchTerm] = useState("");
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: "1",
      petName: "Rex",
      name: "Antibiótico XYZ",
      dosage: "1 comprimido 2x ao dia",
      startDate: "2025-10-01",
      endDate: "2025-10-15",
    },
    {
      id: "2",
      petName: "Mimi",
      name: "Anti-inflamatório ABC",
      dosage: "0.5ml 1x ao dia",
      startDate: "2025-10-10",
      endDate: null,
    },
  ]);

 

  const filteredMedications = medications.filter(
    (med) =>
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.petName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este medicamento?")) {
      try {
        toast.success("Medicamento excluído com sucesso!");
        setMedications(medications.filter((med) => med.id !== id));
      } catch (error) {
        toast.error("Erro ao excluir medicamento");
      }
    }
  };  return (
    
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Lista de Medicamentos</h1>
          <p className="text-muted-foreground">Gerencie os medicamentos dos pets</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pill className="h-5 w-5" />
                <CardTitle>Medicamentos Cadastrados</CardTitle>
              </div>
              <Button onClick={() => router.push("/clinica/medicamentos/cadastrar")}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Medicamento
              </Button>
            </div>
            <CardDescription>
              Lista completa de medicamentos em uso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome do medicamento ou pet..."
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
                    <TableHead>Medicamento</TableHead>
                    <TableHead>Dosagem</TableHead>
                    <TableHead>Início</TableHead>
                    <TableHead>Término</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMedications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        Nenhum medicamento encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMedications.map((med) => (
                      <TableRow key={med.id}>
                        <TableCell className="font-medium">{med.petName}</TableCell>
                        <TableCell>{med.name}</TableCell>
                        <TableCell>{med.dosage}</TableCell>
                        <TableCell>
                          {new Date(med.startDate).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell>
                          {med.endDate
                            ? new Date(med.endDate).toLocaleDateString("pt-BR")
                            : "Em andamento"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/medicamentos/editar?id=${med.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(med.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
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

