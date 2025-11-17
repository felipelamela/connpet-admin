"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import api from "@/services/api";
import { ArrowLeft, Badge, DollarSign } from "lucide-react";

interface PaymentItem {
  id: string;
  product?: {
    name: string;
    price?: string | number | null;
    priceSale?: string | number | null;
  } | null;
  service?: {
    name: string;
    price?: string | number | null;
    priceSale?: string | number | null;
  } | null;
}

interface PaymentDetail {
  id: string;
  amount: string | number;
  status: string;
  createdAt: string;
  updatedAt: string;
  items: PaymentItem[];
}

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

export default function PagamentoDetalhesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("id");

  const [payment, setPayment] = useState<PaymentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!paymentId) {
      toast.error("ID do pagamento não informado.");
      router.push("/clinica/pagamento");
      return;
    }

    const fetchPayment = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("admin/payments/" + paymentId);
        const data = response?.data;

        if (!data) {
          throw new Error("Dados do pagamento não encontrados.");
        }

        setPayment(data as PaymentDetail);
      } catch (error) {
        console.error("Erro ao carregar pagamento:", error);
        toast.error("Não foi possível carregar os detalhes do pagamento.");
        router.push("/clinica/pagamento");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayment();
  }, [paymentId, router]);

  const { serviceItems, productItems } = useMemo(() => {
    const items = payment?.items ?? [];

    const services = items
      .filter((item) => item.service)
      .map((item) => {
        const servicePrice = item.service?.price ?? item.service?.priceSale ?? 0;
        return {
          id: item.id,
          name: item.service?.name ?? "Serviço",
          price: servicePrice,
        };
      });

    const products = items
      .filter((item) => item.product)
      .map((item) => {
        const productPrice =
          item.product?.priceSale ?? item.product?.price ?? item.product?.price ?? 0;
        return {
          id: item.id,
          name: item.product?.name ?? "Produto",
          price: productPrice,
        };
      });

    return {
      serviceItems: services,
      productItems: products,
    };
  }, [payment]);

  const totalServices = serviceItems.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const totalProducts = productItems.reduce((sum, item) => sum + Number(item.price || 0), 0);

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Detalhes do Pagamento
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Visualize os itens vinculados a esta ordem de pagamento.
            </p>
          </div>
        </div>
        {payment && (
          <div className="flex flex-wrap items-center gap-3">
            <Badge className={cn("uppercase", getStatusBadgeClasses(payment.status))}>
              {payment.status}
            </Badge>
            <div className="flex items-center gap-2 text-lg font-semibold">
              <DollarSign className="h-4 w-4 text-blue-600" />
              {formatCurrency(payment.amount)}
            </div>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações Gerais</CardTitle>
          <CardDescription>
            Identificador, status e datas relacionadas ao pagamento selecionado.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">ID do Pagamento</p>
            <p className="font-mono text-sm">{payment?.id || "-"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Criado em</p>
            <p>{formatDateTime(payment?.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Atualizado em</p>
            <p>{formatDateTime(payment?.updatedAt)}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Serviços</CardTitle>
            <CardDescription>Lista de serviços associados a este pagamento.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Serviço</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center">
                        Carregando...
                      </TableCell>
                    </TableRow>
                  ) : serviceItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center">
                        Nenhum serviço vinculado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    serviceItems.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell>{service.name}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(service.price)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm font-medium">
              <span>Total de Serviços</span>
              <span>{formatCurrency(totalServices)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produtos</CardTitle>
            <CardDescription>Lista de produtos associados a este pagamento.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center">
                        Carregando...
                      </TableCell>
                    </TableRow>
                  ) : productItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center">
                        Nenhum produto vinculado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    productItems.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(product.price)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm font-medium">
              <span>Total de Produtos</span>
              <span>{formatCurrency(totalProducts)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
