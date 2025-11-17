"use client";

import { useState } from "react";
import { LayoutWrapper } from "@/components/layout-wrapper";
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
import { Syringe, Plus, Search, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useModuleContext } from "@/hooks/useModuleContext";
import { toast } from "sonner";

interface VaccineType {
  id: string;
  name: string;
  species: string;
  manufacturer: string;
  dosesRequired: number;
  isRequired: boolean;
  active: boolean;
}

export default function ListaTiposVacinaPage() {
  const router = useRouter();
  const { getButtonColors } = useModuleContext();
  const buttonColors = getButtonColors();

  const [searchTerm, setSearchTerm] = useState("");
  const [vaccineTypes, setVaccineTypes] = useState<VaccineType[]>([
    {
      id: "1",
      name: "V10",
      species: "DOG",
      manufacturer: "Laboratório ABC",
      dosesRequired: 3,
      isRequired: true,
      active: true,
    },
    {
      id: "2",
      name: "Antirrábica",
      species: "DOG",
      manufacturer: "Laboratório XYZ",
      dosesRequired: 1,
      isRequired: true,
      active: true,
    },
  ]);

 

  const filteredVaccineTypes = vaccineTypes.filter((vt) =>
    vt.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSpeciesLabel = (species: string) => {
    const speciesMap: { [key: string]: string } = {
      DOG: "Cão",
      CAT: "Gato",
      BIRD: "Ave",
      RABBIT: "Coelho",
      OTHER: "Outro",
    };
    return speciesMap[species] || species;
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este tipo de vacina?")) {
      try {
        toast.success("Tipo de vacina excluído com sucesso!");
        setVaccineTypes(vaccineTypes.filter((vt) => vt.id !== id));
      } catch (error) {
        toast.error("Erro ao excluir tipo de vacina");
      }
    }
  };  return (
    <LayoutWrapper>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tipos de Vacina</h1>
          <p className="text-muted-foreground">Gerencie os tipos de vacinas disponíveis</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Syringe className="h-5 w-5" />
                <CardTitle>Tipos de Vacina Cadastrados</CardTitle>
              </div>
              <Button
                onClick={() => router.push("/clinica/tipos-vacina/cadastrar")}
                className={buttonColors.default}
              >
                <Plus className="mr-2 h-4 w-4" />
                Novo Tipo de Vacina
              </Button>
            </div>
            <CardDescription>
              Lista completa de tipos de vacinas registrados
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
                    <TableHead>Fabricante</TableHead>
                    <TableHead>Doses</TableHead>
                    <TableHead>Obrigatória</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVaccineTypes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        Nenhum tipo de vacina encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVaccineTypes.map((vt) => (
                      <TableRow key={vt.id}>
                        <TableCell className="font-medium">{vt.name}</TableCell>
                        <TableCell>{getSpeciesLabel(vt.species)}</TableCell>
                        <TableCell>{vt.manufacturer}</TableCell>
                        <TableCell>{vt.dosesRequired}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              vt.isRequired
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {vt.isRequired ? "Sim" : "Não"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              vt.active
                                ? "bg-orange-100 text-orange-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {vt.active ? "Ativo" : "Inativo"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/clinica/tipos-vacina/editar?id=${vt.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(vt.id)}
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
    </LayoutWrapper>
  );
}

