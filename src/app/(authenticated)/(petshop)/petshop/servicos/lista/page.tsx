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
import { Stethoscope, Plus, Search, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useModuleContext } from "@/hooks/useModuleContext";
import { toast } from "sonner";
import { ModalCreateServices } from "@/components/modals/ModalCreateServices";
import { ModalUpdateServices } from "@/components/modals/ModalUpdateServices";

interface Service {
  id: string;
  name: string;
  description?: string;
  category: string;
  duration?: number;
  price: number;
  commission?: number;
  active: boolean;
}

export default function ListaServicosPage() {
  const router = useRouter();
  const { getButtonColors } = useModuleContext();
  const buttonColors = getButtonColors();
 

  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      name: "Consulta Veterinária",
      description: "Consulta geral com veterinário",
      category: "CONSULTATION",
      duration: 30,
      price: 150.00,
      commission: 10.00,
      active: true,
    },
    {
      id: "2",
      name: "Banho e Tosa",
      description: "Banho completo e tosa conforme raça",
      category: "BATH_GROOMING",
      duration: 60,
      price: 80.00,
      commission: 15.00,
      active: true,
    },
    {
      id: "3",
      name: "Vacinação",
      description: "Aplicação de vacinas",
      category: "VACCINE",
      duration: 15,
      price: 60.00,
      commission: 5.00,
      active: true,
    },
  ]);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este serviço?")) {
      try {
        toast.success("Serviço excluído com sucesso!");
        setServices(services.filter((service) => service.id !== id));
      } catch (error) {
        toast.error("Erro ao excluir serviço");
      }
    }
  };  return (
    
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Lista de Serviços</h1>
          <p className="text-muted-foreground">Gerencie todos os serviços oferecidos</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                <CardTitle>Serviços Cadastrados</CardTitle>
              </div>
              <ModalCreateServices 
                trigger={
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Serviço
                  </Button>
                } 
                system="petshop" 
              />
            </div>
            <CardDescription>
              Lista completa de serviços registrados no sistema
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
                    <TableHead>Nome do Serviço</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        Nenhum serviço encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredServices.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell className="font-medium">{service.name}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(service.price)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <ModalUpdateServices
                              trigger={
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              }
                              system="petshop"
                              service={service}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(service.id)}
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

