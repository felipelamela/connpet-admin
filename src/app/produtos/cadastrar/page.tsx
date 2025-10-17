"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, Save, X } from "lucide-react";

interface ProductFormData {
  name: string;
  quantity: string;
  price: string;
  type: string;
  validatedAt: string;
}

export default function CadastrarProdutoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    quantity: "",
    price: "",
    type: "",
    validatedAt: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Você precisa fazer login primeiro");
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.name.trim()) {
        toast.error("Nome do produto é obrigatório");
        return;
      }
      if (!formData.type) {
        toast.error("Tipo do produto é obrigatório");
        return;
      }

      const productData = {
        name: formData.name.trim(),
        quantity: parseInt(formData.quantity) || 0,
        price: parseFloat(formData.price) || 0,
        type: formData.type,
        validatedAt: formData.validatedAt || null,
      };

      console.log("Dados do produto:", productData);
      toast.success("Produto cadastrado com sucesso!");
      router.push("/produtos/lista");
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      toast.error("Erro ao cadastrar produto. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
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
          <h1 className="text-3xl font-bold mb-2">Cadastrar Produto</h1>
          <p className="text-muted-foreground">Cadastre um novo produto no sistema</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                <CardTitle>Dados do Produto</CardTitle>
              </div>
              <CardDescription>
                Preencha as informações abaixo para cadastrar um novo produto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="name">
                    Nome do Produto <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ex: Ração Premium"
                    maxLength={255}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">
                    Tipo <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleSelectChange("type", value)}
                    required
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MEDICINE">Medicamento</SelectItem>
                      <SelectItem value="FOOD">Alimento</SelectItem>
                      <SelectItem value="TOY">Brinquedo</SelectItem>
                      <SelectItem value="HYGIENE">Higiene</SelectItem>
                      <SelectItem value="ACCESSORY">Acessório</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">
                    Quantidade <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="Ex: 100"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">
                    Preço (R$) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Ex: 59.90"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="validatedAt">Data de Validade</Label>
                  <Input
                    id="validatedAt"
                    name="validatedAt"
                    type="date"
                    value={formData.validatedAt}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 sm:flex-initial"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Cadastrando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Cadastrar Produto
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/produtos/lista")}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-initial"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </main>
    </LayoutWrapper>
  );
}

