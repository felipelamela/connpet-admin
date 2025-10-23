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
import { PawPrint, Plus, Search, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  gender: string;
  birthDate: string;
  active: boolean;
}

export default function ListaPetsPage() {
  const router = useRouter();
 

  const [searchTerm, setSearchTerm] = useState("");
  const [pets, setPets] = useState<Pet[]>([
    {
      id: "1",
      name: "Rex",
      species: "Canino",
      breed: "Labrador",
      gender: "Macho",
      birthDate: "2020-05-15",
      active: true,
    },
    {
      id: "2",
      name: "Mimi",
      species: "Felino",
      breed: "Persa",
      gender: "Fêmea",
      birthDate: "2021-03-20",
      active: true,
    },
  ]);

  const filteredPets = pets.filter((pet) =>
    pet.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: string) => {
    router.push(`/petshop/pets/editar?id=${id}`);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este pet?")) {
      try {
        // TODO: Implementar chamada à API
        toast.success("Pet excluído com sucesso!");
        setPets(pets.filter((pet) => pet.id !== id));
      } catch (error) {
        toast.error("Erro ao excluir pet");
      }
    }
  };  return (
    
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Lista de Pets</h1>
          <p className="text-muted-foreground">Gerencie todos os pets cadastrados</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PawPrint className="h-5 w-5" />
                <CardTitle>Pets Cadastrados</CardTitle>
              </div>
              <Button onClick={() => router.push("/petshop/pets/cadastrar")}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Pet
              </Button>
            </div>
            <CardDescription>
              Lista completa de pets registrados no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome..."
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
                    <TableHead>Espécie</TableHead>
                    <TableHead>Raça</TableHead>
                    <TableHead>Sexo</TableHead>
                    <TableHead>Data Nascimento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        Nenhum pet encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPets.map((pet) => (
                      <TableRow key={pet.id}>
                        <TableCell className="font-medium">{pet.name}</TableCell>
                        <TableCell>{pet.species}</TableCell>
                        <TableCell>{pet.breed}</TableCell>
                        <TableCell>{pet.gender}</TableCell>
                        <TableCell>
                          {new Date(pet.birthDate).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              pet.active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {pet.active ? "Ativo" : "Inativo"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(pet.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(pet.id)}
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

