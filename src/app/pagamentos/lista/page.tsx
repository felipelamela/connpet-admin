"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { DollarSign, Search, Eye } from "lucide-react";

interface Payment {
  id: string;
  petName: string;
  amount: number;
  status: string;
  createdAt: string;
}

export default function ListaPagamentosPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: "1",
      petName: "Rex",
      amount: 350.00,
      status: "COMPLETED",
      createdAt: "2025-10-15",
    },
    {
      id: "2",
      petName: "Mimi",
      amount: 150.00,
      status: "PENDING",
      createdAt: "2025-10-16",
    },
    {
      id: "3",
      petName: "Thor",
      amount: 500.00,
      status: "COMPLETED",
      createdAt: "2025-10-14",
    },
  ]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Você precisa fazer login primeiro");
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const filteredPayments = payments.filter((payment) =>
    payment.petName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: { label: string; className: string } } = {
      PENDING: { label: "Pendente", className: "bg-yellow-100 text-yellow-800" },
      COMPLETED: { label: "Concluído", className: "bg-green-100 text-green-800" },
      FAILED: { label: "Falhou", className: "bg-red-100 text-red-800" },
      CANCELLED: { label: "Cancelado", className: "bg-gray-100 text-gray-800" },
    };
    return statusMap[status] || { label: status, className: "bg-gray-100 text-gray-800" };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <LayoutWrapper>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Lista de Pagamentos</h1>
          <p className="text-muted-foreground">Gerencie os pagamentos realizados</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              <CardTitle>Pagamentos Registrados</CardTitle>
            </div>
            <CardDescription>
              Lista completa de pagamentos do sistema
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
                  className="pl-8"
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pet</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        Nenhum pagamento encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayments.map((payment) => {
                      const statusInfo = getStatusLabel(payment.status);
                      return (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{payment.petName}</TableCell>
                          <TableCell>
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(payment.amount)}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${statusInfo.className}`}>
                              {statusInfo.label}
                            </span>
                          </TableCell>
                          <TableCell>
                            {new Date(payment.createdAt).toLocaleDateString("pt-BR")}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/pagamentos/detalhes?id=${payment.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
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

