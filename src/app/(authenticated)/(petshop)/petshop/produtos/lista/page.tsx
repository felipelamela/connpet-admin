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
import { Package, Plus, Search, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useModuleContext } from "@/hooks/useModuleContext";
import { toast } from "sonner";
import { ModalCreateProducts } from "@/components/modals/ModalCreateProducts";
import { ModalUpdateProducts } from "@/components/modals/ModalUpdateProducts";

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
  const router = useRouter();
  const { getButtonColors } = useModuleContext();
  const buttonColors = getButtonColors();
 

  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Ração Premium 15kg",
      description: "Ração premium para cães adultos",
      type: "FOOD",
      batchNumber: "LOTE-2024-001",
      manufacturer: "Royal Canin",
      quantity: 50,
      pricePay: 60.00,
      priceSale: 89.90,
      expirationDate: "2025-12-31",
      active: true,
    },
    {
      id: "2",
      name: "Antipulgas",
      description: "Antipulgas e carrapatos",
      type: "MEDICINE",
      batchNumber: "LOTE-2024-050",
      manufacturer: "Bayer",
      quantity: 30,
      pricePay: 30.00,
      priceSale: 45.50,
      expirationDate: "2026-06-30",
      active: true,
    },
  ]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        // TODO: Implementar chamada à API
        toast.success("Produto excluído com sucesso!");
        setProducts(products.filter((product) => product.id !== id));
      } catch (error) {
        toast.error("Erro ao excluir produto");
      }
    }
  };  return (
    
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
                system="petshop" 
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
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        Nenhum produto encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
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
                              system="petshop"
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
          </CardContent>
        </Card>
      </main>
    
  );
}

