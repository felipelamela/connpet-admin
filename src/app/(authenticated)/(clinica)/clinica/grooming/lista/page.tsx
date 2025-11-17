"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
import { Scissors, Search, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/services/api";

interface Grooming {
  id: string;
  petId: string;
  panelId: string;
  paymentOrderId?: string;
  status: string;
  startDate: string;
  endDate?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  pet: {
    id: string;
    name: string;
    species: number;
    breed: number;
  };
  panel: {
    id: string;
    type: string;
  };
  paymentOrder?: {
    id: string;
    amount: number;
    status: string;
  };
}

const getStatusLabel = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    IN_PROGRESS: "Em Andamento",
    DISCHARGED: "Finalizado",
    CANCELLED: "Cancelado",
  };
  return statusMap[status] || status;
};

const getStatusColor = (status: string): string => {
  const colorMap: { [key: string]: string } = {
    IN_PROGRESS: "bg-blue-100 text-blue-800",
    DISCHARGED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };
  return colorMap[status] || "bg-gray-100 text-gray-800";
};

export default function ListaGroomingsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [groomings, setGroomings] = useState<Grooming[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;
  const isInitialMount = useRef(true);

  const fetchGroomings = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const params = {
        page,
        limit: itemsPerPage,
        ...(searchTerm && { search: searchTerm }),
      };
      
      const response = await api.get("grooming", { params });
      
      // SuccessResponse retorna { success: true, message: string, data: any }
      const apiData = response.data?.data || response.data || {};
      const groomingsData = apiData.groomings || (Array.isArray(apiData) ? apiData : []);
      
      setGroomings(Array.isArray(groomingsData) ? groomingsData : []);
      setTotalItems(apiData.total || groomingsData.length || 0);
      setTotalPages(Math.ceil((apiData.total || groomingsData.length || 0) / itemsPerPage));
    } catch (error: any) {
      console.error("Erro ao carregar groomings:", error);
      toast.error("Erro ao carregar groomings");
      setGroomings([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroomings(1);
    isInitialMount.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchGroomings(page);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este grooming?")) {
      try {
        await api.delete(`grooming/${id}`);
        toast.success("Grooming excluído com sucesso!");
        fetchGroomings(currentPage);
      } catch (error) {
        toast.error("Erro ao excluir grooming");
      }
    }
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scissors className="h-5 w-5" />
              <CardTitle>Groomings</CardTitle>
            </div>
            <Button onClick={() => router.push("/clinica/grooming/nova")}>
              Novo Grooming
            </Button>
          </div>
          <CardDescription>
            Lista completa de groomings registrados no sistema
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    fetchGroomings(1);
                  }
                }}
                className="pl-8"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pet</TableHead>
                  <TableHead>Data Início</TableHead>
                  <TableHead>Data Fim</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : groomings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Nenhum grooming encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  groomings.map((grooming) => (
                    <TableRow key={grooming.id}>
                      <TableCell className="font-medium">
                        {grooming.pet?.name || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {grooming.startDate
                          ? new Date(grooming.startDate).toLocaleString("pt-BR")
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {grooming.endDate
                          ? new Date(grooming.endDate).toLocaleString("pt-BR")
                          : 'Em andamento'}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getStatusColor(grooming.status)}`}
                        >
                          {getStatusLabel(grooming.status)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              router.push(`/clinica/grooming/editar?id=${grooming.id}`)
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(grooming.id)}
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

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                Exibindo {groomings.length} de {totalItems} groomings
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

