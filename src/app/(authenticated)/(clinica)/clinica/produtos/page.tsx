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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Package, Plus, Search, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ModalCreateProducts } from "@/components/modals/ModalCreateProducts";
import { ModalUpdateProducts } from "@/components/modals/ModalUpdateProducts";
import api from "@/services/api";

interface Product {
  id: string;
  name: string;
  description?: string;
  type: string;
  batchNumber?: string;
  manufacturer?: string;
  quantity: number;
  pricePay: number;
  priceSale: number;
  expirationDate: string;
  active: boolean;
}

export default function ListaProdutosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 1;
  const isInitialMount = useRef(true);

  const fetchProducts = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const params = {
        page,
        limit: itemsPerPage,
        ...(searchTerm && { search: searchTerm }),
      };
      
      const response = await api.get("admin/product", params);
      
      setProducts(response.data?.products || []);
      setTotalItems(response.data?.total || 0);
      setTotalPages(Math.ceil((response.data?.total || 0) / itemsPerPage));
    } catch (error) {
      toast.error("Erro ao carregar produtos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
    isInitialMount.current = false;
  }, []);

  // useEffect(() => {
  //   if (isInitialMount.current) return;
    
  //   const timeoutId = setTimeout(() => {
  //     fetchProducts(1);
  //     setCurrentPage(1);
  //   }, 500);

  //   return () => clearTimeout(timeoutId);
  // }, [searchTerm]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchProducts(page);
    }
  };

  const getTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      MEDICINE: "Medicamento",
      FOOD: "Alimento",
      TOY: "Brinquedo",
      HYGIENE: "Higiene",
      ACCESSORY: "Acessório",
    };
    return types[type] || type;
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await api.delete(`admin/product/${id}`);
        toast.success("Produto excluído com sucesso!");
        fetchProducts(currentPage);
      } catch (error) {
        toast.error("Erro ao excluir produto");
      }
    }
  };  

  const insertProduct = (item: Product) => {
    fetchProducts(currentPage);
  }
  return (
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Lista de Produtos</h1>
          <p className="text-muted-foreground">Gerencie o catálogo de produtos</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                <CardTitle>Produtos Cadastrados</CardTitle>
              </div>
              <ModalCreateProducts 
                trigger={
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Produto
                  </Button>
                } 
                system="clinic-vet" 
                insertList={insertProduct}
              />
            </div>
            <CardDescription>
              Lista completa de produtos registrados no sistema
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
                    <TableHead>Tipo</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Validade</TableHead>
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
                  ) : products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        Nenhum produto encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{getTypeLabel(product.type)}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(product.priceSale)}
                        </TableCell>
                        <TableCell>
                          {product.expirationDate
                            ? new Date(product.expirationDate).toLocaleDateString("pt-BR")
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <ModalUpdateProducts
                              trigger={
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              }
                              system="clinica"
                              product={product}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(product.id)}
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
                  Exibindo {products.length} de {totalItems} produtos
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    
  );
}

