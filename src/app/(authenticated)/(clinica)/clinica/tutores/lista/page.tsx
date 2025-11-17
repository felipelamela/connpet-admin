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
import { Users, Plus, Search, Eye, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useModuleContext } from "@/hooks/useModuleContext";
import { toast } from "sonner";
import { ModalCreateTutors } from "@/components/modals/ModalCreateTutors";
import { ModalUpdateTutors } from "@/components/modals/ModalUpdateTutors";
import { ModalAddTutorToSystem } from "@/components/modals/ModalAddTutorToSystem";
import { ModalConfirmCadastroTutor } from "@/components/modals/ModalConfirmCadastroTutor";
import api from "@/services/api";

interface Tutor {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string | null;
  document: string | null;
  status: boolean;
  petsCount: number;
}

export default function ListaTutoresPage() {
  const router = useRouter();
  const { getButtonColors } = useModuleContext();
  const buttonColors = getButtonColors();
  const [searchTerm, setSearchTerm] = useState("");
  const [documentSearch, setDocumentSearch] = useState("");
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [foundTutor, setFoundTutor] = useState<Tutor | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCadastroModal, setShowCadastroModal] = useState(false);
  const itemsPerPage = 10;
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchTutores = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const params = {
        page,
        limit: itemsPerPage,
        ...(searchTerm && { search: searchTerm }),
      };
      
      const response = await api.get("admin/tutors", params);
      
      const apiData = response?.data || {};
      const tutorsData = apiData.tutors || [];
      
      const mappedTutores: Tutor[] = tutorsData.map((item: any) => ({
        id: item.tutor?.id || item.id,
        userId: item.tutor?.userId || item.tutor?.user?.id || '',
        name: item.tutor?.user?.name || '',
        email: item.tutor?.user?.email || '',
        phone: item.tutor?.phone || null,
        document: item.tutor?.document || null,
        status: item.tutor?.user?.status ?? true,
        petsCount: item.tutor?._count?.pets || 0,
      }));
      
      setTutores(mappedTutores);
      setTotalItems(apiData.total || 0);
      setTotalPages(Math.ceil((apiData.total || 0) / itemsPerPage));
      setCurrentPage(page);
    } catch (error) {
      console.error("Erro ao carregar tutores:", error);
      toast.error("Erro ao carregar lista de tutores");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTutores(1);
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      fetchTutores(1);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchTutores(page);
    }
  };

  const handleSearchByDocument = async () => {
    if (!documentSearch.trim()) {
      toast.error("Por favor, informe um documento para buscar");
      return;
    }

    setIsSearching(true);
    try {
      // Buscar tutor por documento no sistema da clínica
      const response = await api.get("admin/tutors", {
        page: 1,
        limit: 10,
        search: documentSearch.trim(),
      });

      const apiData = response?.data || {};
      const tutorsData = apiData.tutors || [];

      if (tutorsData.length > 0) {
        // Tutor encontrado no sistema da clínica - já está cadastrado
        const tutor = tutorsData[0];
        const mappedTutor: Tutor = {
          id: tutor.tutor?.id || tutor.id,
          userId: tutor.tutor?.userId || tutor.tutor?.user?.id || '',
          name: tutor.tutor?.user?.name || '',
          email: tutor.tutor?.user?.email || '',
          phone: tutor.tutor?.phone || null,
          document: tutor.tutor?.document || null,
          status: tutor.tutor?.user?.status ?? true,
          petsCount: tutor.tutor?._count?.pets || 0,
        };
        
        // Tutor encontrado - mostrar modal para adicionar ao sistema
        setFoundTutor(mappedTutor);
        setShowAddModal(true);
      } else {
        // Tutor não encontrado no sistema da clínica
        // Mostrar modal perguntando se deseja cadastrar
        setShowCadastroModal(true);
      }
    } catch (error: any) {
      console.error("Erro ao buscar tutor:", error);
      // Se não encontrou, mostrar modal de cadastro
      setShowCadastroModal(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddTutorSuccess = () => {
    fetchTutores(1);
    setDocumentSearch("");
  };

  const handleConfirmCadastro = () => {
    router.push(`/clinica/tutores/cadastrar?document=${encodeURIComponent(documentSearch.trim())}`);
  };

  return (
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
            <ModalCreateTutors 
              trigger={
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Tutor
                </Button>
              } 
              system="clinica"
            />
          </div>
          <CardDescription>
            Lista completa de tutores registrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar tutor por documento (CPF)..."
                  value={documentSearch}
                  onChange={(e) => setDocumentSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearchByDocument();
                    }
                  }}
                  className="pl-8"
                />
              </div>
              <Button
                onClick={handleSearchByDocument}
                disabled={isSearching || !documentSearch.trim()}
               className={buttonColors.default}>
                {isSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Buscar
                  </>
                )}
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou documento..."
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : tutores.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Nenhum tutor encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  tutores.map((tutor) => (
                    <TableRow key={tutor.id}>
                      <TableCell className="font-medium">{tutor.name}</TableCell>
                      <TableCell>{tutor.email}</TableCell>
                      <TableCell>{tutor.phone || "N/A"}</TableCell>
                      <TableCell>{tutor.document || "N/A"}</TableCell>
                      <TableCell>{tutor.petsCount}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/clinica/tutores/detalhes?id=${tutor.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <ModalUpdateTutors
                            trigger={
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            }
                            system="clinica"
                            tutor={{
                              ...tutor,
                              document: tutor.document ?? undefined,
                              phone: tutor.phone ?? undefined,
                            }}
                          />
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
                          className="cursor-pointer"
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
                Exibindo {tutores.length} de {totalItems} tutores
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ModalAddTutorToSystem
        open={showAddModal}
        onOpenChange={setShowAddModal}
        tutor={foundTutor}
        onSuccess={handleAddTutorSuccess}
      />

      <ModalConfirmCadastroTutor
        open={showCadastroModal}
        onOpenChange={setShowCadastroModal}
        document={documentSearch}
        onConfirm={handleConfirmCadastro}
      />
    </main>
  );
}

