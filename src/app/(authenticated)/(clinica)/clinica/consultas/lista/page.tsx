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
import { Stethoscope, Plus, Search, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/services/api";
import { getAppointmentTypeLabel } from "@/consts/appointmentType.const";
import { getVetSpecialtyLabel } from "@/consts/vetSpecialty.const";
import { getAppointmentStatusLabel, getAppointmentStatusColor, AppointmentStatusType } from "@/consts/appointmentStatus.const";
import { ModalCreateAppointment } from "@/components/modals/ModalCreateAppointment";

interface Appointment {
  id: string;
  petId: string;
  panelId: string;
  vetId?: string;
  paymentOrderId: string;
  status: AppointmentStatusType;
  type: number;
  typeSpecialty: number;
  description?: string;
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
  pet: {
    id: string;
    name: string;
    species: number;
    breed: number;
  };
  vet?: {
    id: string;
    user: {
      name: string;
    };
  };
  panel: {
    id: string;
    type: string;
  };
  paymentOrder: {
    id: string;
    amount: number;
    status: string;
  };
}

export default function ListaConsultasPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;
  const isInitialMount = useRef(true);

  const fetchAppointments = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const params = {
        page,
        limit: itemsPerPage,
        ...(searchTerm && { search: searchTerm }),
      };
      
      const response = await api.get("appointment", params);
      
      const apiData = response.data || {};
      const appointmentsData = apiData.appointments || [];
      
      setAppointments(appointmentsData);
      setTotalItems(apiData.total || 0);
      setTotalPages(Math.ceil((apiData.total || 0) / itemsPerPage));
    } catch {
      toast.error("Erro ao carregar consultas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments(1);
    isInitialMount.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchAppointments(page);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta consulta?")) {
      try {
        await api.delete(`appointment/${id}`);
        toast.success("Consulta excluída com sucesso!");
        fetchAppointments(currentPage);
      } catch (error) {
        toast.error("Erro ao excluir consulta");
      }
    }
  };

  const handleRefetch = () => {
    fetchAppointments(currentPage);
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              <CardTitle>Consultas Agendadas</CardTitle>
            </div>

          </div>
          <CardDescription>
            Lista completa de consultas registradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome do pet ou tipo..."
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
                  <TableHead>Tipo</TableHead>
                  <TableHead>Especialidade</TableHead>
                  <TableHead>Veterinário</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : appointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Nenhuma consulta encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">
                        {appointment.pet?.name || 'N/A'}
                      </TableCell>
                      <TableCell>{getAppointmentTypeLabel(appointment.type)}</TableCell>
                      <TableCell>{getVetSpecialtyLabel(appointment.typeSpecialty)}</TableCell>
                      <TableCell>{appointment.vet?.user?.name || 'Não atribuído'}</TableCell>
                      <TableCell>
                        {appointment.scheduledAt
                          ? new Date(appointment.scheduledAt).toLocaleString("pt-BR")
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getAppointmentStatusColor(appointment.status)}`}
                        >
                          {getAppointmentStatusLabel(appointment.status)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              router.push(`/clinica/consultas/editar?id=${appointment.id}`)
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(appointment.id)}
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
                Exibindo {appointments.length} de {totalItems} consultas
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

