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
import { Users, Plus, Search, Eye, Edit, UserMinus, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ModalCreateWorks } from "@/components/modals/ModalCreateWorks";
import { ModalUpdateWorks } from "@/components/modals/ModalUpdateWorks";
import { useModuleContext } from "@/hooks/useModuleContext";
import api from "@/services/api";

interface Employee {
  id: string; // ID do UserProfileEmployee
  userId: string; // ID do User (para change-status)
  name: string;
  email: string;
  phone: string;
  document?: string;
  roles: string;
  status: boolean;
}

export default function ListaFuncionariosPage() {
  const router = useRouter();
  const { getButtonColors } = useModuleContext();
  const buttonColors = getButtonColors();
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;
  const isInitialMount = useRef(true);

  const fetchEmployees = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const params = {
        page,
        limit: itemsPerPage,
        ...(searchTerm && { search: searchTerm }),
      };
      
      const response = await api.get("admin/clinic-vet-user", params);
      
      // A API agora retorna { users, total, page, limit }
      const apiData = response.data || {};
      const users = apiData.users || [];
      
      // Mapear os dados da API para o formato esperado
      // O item.id é o ID do UserProfileEmployee, que é o que precisamos para buscar detalhes
      // O item.userId é o ID do User, que é necessário para change-status
      const mappedEmployees = users.map((item: any) => ({
        id: item.id, // ID do UserProfileEmployee (para buscar detalhes)
        userId: item.userId || item.user?.id || '', // ID do User (para change-status)
        name: item.user?.name || '',
        email: item.user?.email || '',
        phone: item.phone || '',
        document: item.document || '',
        roles: item.roles || '',
        status: item.user?.status || false, // Por padrão, considerar ativo
      }));
      
      setEmployees(mappedEmployees);
      setTotalItems(apiData.total || 0);
      setTotalPages(Math.ceil((apiData.total || 0) / itemsPerPage));
    } catch {
      toast.error("Erro ao carregar funcionários");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(1);
    isInitialMount.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchEmployees(page);
    }
  };

  const handleStatusChange = async (employeeId: string, userId: string, currentStatus: boolean) => {
    const action = currentStatus ? "INATIVAR" : "ATIVAR";
    if (confirm(`Tem certeza que deseja ${action} este funcionário?`)) {
      try {
        // O endpoint change-status espera o userId, não o employeeId
        await api.put(`admin/clinic-vet-user/change-status/${userId}`, { status: !currentStatus });
        toast.success(`Funcionário ${currentStatus ? "INATIVADO" : "ATIVADO"} com sucesso!`);
        fetchEmployees(currentPage);
      } catch (error) {
        console.error(`Erro ao ${action} funcionário:`, error);
        toast.error(`Erro ao ${action} funcionário`);
      }
    }
  };

  const getRoleLabel = (role: string) => {
    const roles: { [key: string]: string } = {
      ADMIN: "Administrador",
      CLINIC_ADMIN: "Administrador da Clínica",
      CLINIC_VET: "Veterinário",
      CLINIC_STAFF: "Equipe",
      CLINIC_RECEPTIONIST: "Recepcionista",
    };
    return roles[role] || role;
  };

  const insertEmployee = () => {
    fetchEmployees(currentPage);
  };  
  
  return (
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Lista de Funcionários</h1>
          <p className="text-muted-foreground">Gerencie todos os funcionários da clínica</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <CardTitle>Funcionários Cadastrados</CardTitle>
              </div>
              <ModalCreateWorks 
                trigger={
                  <Button className={buttonColors.default}>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Funcionário
                  </Button>
                } 
                system="clinica" 
                insertList={insertEmployee}
              />
            </div>
            <CardDescription>
              Lista completa de funcionários registrados no sistema
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
                    <TableHead>Cargo</TableHead>
                    <TableHead>Status</TableHead>
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
                  ) : employees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        Nenhum funcionário encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    employees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>{employee.phone}</TableCell>
                        <TableCell>{getRoleLabel(employee.roles)}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              employee.status
                                ? "bg-orange-100 text-orange-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {employee.status  == true ? "Ativo" : "Inativo"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/clinica/funcionarios/detalhes?id=${employee.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <ModalUpdateWorks
                              trigger={
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              }
                              system="clinica"
                              employee={employee}
                              refreshList={() => fetchEmployees(currentPage)}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusChange(employee.id, employee.userId, employee.status)}
                            >
                              {employee.status ? (
                                <UserMinus className="h-4 w-4 text-red-500" />
                              ) : (
                                <UserCheck className="h-4 w-4 text-orange-500" />
                              )}
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
                  Exibindo {employees.length} de {totalItems} funcionários
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
  );
}

