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
import { Users, Plus, Search, Eye, Edit } from "lucide-react";
import { useRouter } from "next/navigation";

interface Tutor {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  petsCount: number;
}

export default function ListaTutoresPage() {
  const router = useRouter();
 

  const [searchTerm, setSearchTerm] = useState("");
  const [tutores, setTutores] = useState<Tutor[]>([
    {
      id: "1",
      name: "João Silva",
      email: "joao@email.com",
      phone: "(11) 99999-9999",
      document: "123.456.789-00",
      petsCount: 2,
    },
    {
      id: "2",
      name: "Maria Santos",
      email: "maria@email.com",
      phone: "(11) 98888-8888",
      document: "987.654.321-00",
      petsCount: 1,
    },
  ]);

  const filteredTutores = tutores.filter(
    (tutor) =>
      tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );  return (
    
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Lista de Tutores</h1>
          <p className="text-muted-foreground">Gerencie todos os tutores cadastrados</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <CardTitle>Tutores Cadastrados</CardTitle>
              </div>
              <Button onClick={() => router.push("/clinica/tutores/cadastrar")}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Tutor
              </Button>
            </div>
            <CardDescription>
              Lista completa de tutores registrados no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou email..."
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
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Nº Pets</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTutores.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        Nenhum tutor encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTutores.map((tutor) => (
                      <TableRow key={tutor.id}>
                        <TableCell className="font-medium">{tutor.name}</TableCell>
                        <TableCell>{tutor.email}</TableCell>
                        <TableCell>{tutor.phone}</TableCell>
                        <TableCell>{tutor.document}</TableCell>
                        <TableCell>{tutor.petsCount}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/tutores/detalhes?id=${tutor.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/tutores/editar?id=${tutor.id}`)}
                            >
                              <Edit className="h-4 w-4" />
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

