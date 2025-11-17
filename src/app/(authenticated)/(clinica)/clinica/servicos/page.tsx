"use client";

import { useState, useEffect, useRef } from "react";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Stethoscope, Plus, Search, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ModalCreateServices } from "@/components/modals/ModalCreateServices";
import { ModalUpdateServices } from "@/components/modals/ModalUpdateServices";
import api from "@/services/api";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;
  const isInitialMount = useRef(true);

  const fetchServices = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const params = {
        page,
        limit: itemsPerPage,
        ...(searchTerm && { search: searchTerm }),
      };
      
      const response = await api.get("admin/services", params);
      
      setServices(response.data?.services || []);
      setTotalItems(response.data?.total || 0);
      setTotalPages(Math.ceil((response.data?.total || 0) / itemsPerPage));
    } catch (error) {
      toast.error("Erro ao carregar serviços");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(1);
    isInitialMount.current = false;
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchServices(page);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este serviço?")) {
      try {
        await api.delete(`admin/service/${id}`);
        toast.success("Serviço excluído com sucesso!");
        fetchServices(currentPage);
      } catch (error) {
        console.error("Erro ao excluir serviço:", error);
        toast.error("Erro ao excluir serviço");
      }
    }
  };

  const insertService = (item: Service) => {
    fetchServices(currentPage);
  };

  return (
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
              system="clinica" 
              insertList={insertService}
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : services.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      Nenhum serviço encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(Number(service.price))}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <ModalUpdateServices
                            trigger={
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            }
                            system="clinica"
                            service={service}
                            refreshList={() => fetchServices(currentPage)}
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

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage - 1);
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {Array.from({ length: 5 }, (_, i) => {
                    const page = currentPage + i - 2;
                    if (page < 1 || page > totalPages) return null;
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={page === currentPage}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(page);
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              <div className="mt-4 text-center text-sm text-muted-foreground">
                Exibindo {services.length} de {totalItems} serviços
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

