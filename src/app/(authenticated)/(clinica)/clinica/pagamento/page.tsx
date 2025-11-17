"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { DollarSign } from "lucide-react";
import { toast } from "sonner";
import api from "@/services/api";

type PaymentOrder = {
  id: string;
  amount: string;
  status: string;
  originType: string;
  createdAt: string;
  updatedAt: string;
  items?: Array<{
    id: string;
    product?: {
      name: string;
      price?: string | number | null;
    } | null;
    service?: {
      name: string;
      priceSale?: string | number | null;
    } | null;
  }>;
};

const formatCurrency = (value: string | number | null | undefined) => {
  const numeric = Number(value ?? 0);
  if (Number.isNaN(numeric)) return "R$ 0,00";
  return numeric.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "N/A";
  try {
    return new Date(value).toLocaleString("pt-BR");
  } catch {
    return value;
  }
};

const getStatusBadgeClasses = (status: string) => {
  switch (status) {
    case "PAID":
    case "COMPLETED":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "CANCELLED":
    case "FAILED":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

export default function PagamentoPage() {
  const [payments, setPayments] = useState<PaymentOrder[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const itemsPerPage = 10;

  const fetchPayments = async (page = 1) => {
    setIsLoading(true);
    try {
      const params = { page, limit: itemsPerPage };
      const response = await api.get("admin/payments", params);
      const data = response?.data || {};
      const paymentList = data.payments || [];

      setPayments(paymentList);
      const total = data.total || 0;
      setTotalItems(total);
      setTotalPages(Math.max(1, Math.ceil(total / itemsPerPage)));
    } catch (error) {
      console.error("Erro ao carregar pagamentos:", error);
      toast.error("Não foi possível carregar os pagamentos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(1);
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchPayments(page);
    }
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Pagamentos
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Visualize e acompanhe as ordens de pagamento da clínica.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                Ordens de Pagamento
              </CardTitle>
              <CardDescription>
                Histórico das ordens de pagamento geradas para este painel.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Itens</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead>Atualizado em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Nenhuma ordem de pagamento encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-sm">
                        {payment.id}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeClasses(payment.status)}`}
                        >
                          {payment.status || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>{formatCurrency(payment.amount)}</TableCell>
                      <TableCell>{payment.items?.length ?? 0}</TableCell>
                      <TableCell>{formatDateTime(payment.createdAt)}</TableCell>
                      <TableCell>{formatDateTime(payment.updatedAt)}</TableCell>
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
                      onClick={(event) => {
                        event.preventDefault();
                        handlePageChange(currentPage - 1);
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: 5 }, (_, index) => {
                    const page = currentPage + index - 2;
                    if (page < 1 || page > totalPages) return null;
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={page === currentPage}
                          onClick={(event) => {
                            event.preventDefault();
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
                      onClick={(event) => {
                        event.preventDefault();
                        handlePageChange(currentPage + 1);
                      }}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              <div className="mt-4 text-center text-sm text-muted-foreground">
                Exibindo {payments.length} de {totalItems} ordens de pagamento
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
