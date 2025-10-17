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
import { Users, Save, X } from "lucide-react";

interface EmployeeFormData {
  name: string;
  email: string;
  password: string;
  document: string;
  phone: string;
  role: string;
}

export default function CadastrarFuncionarioPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: "",
    email: "",
    password: "",
    document: "",
    phone: "",
    role: "",
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
      if (!formData.name.trim() || !formData.email.trim() || !formData.role) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }

      const employeeData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        document: formData.document.trim() || null,
        phone: formData.phone.trim() || null,
        role: formData.role,
      };

      console.log("Dados do funcionário:", employeeData);
      toast.success("Funcionário cadastrado com sucesso!");
      router.push("/funcionarios/lista");
    } catch (error) {
      console.error("Erro ao cadastrar funcionário:", error);
      toast.error("Erro ao cadastrar funcionário. Tente novamente.");
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
          <h1 className="text-3xl font-bold mb-2">Cadastrar Funcionário</h1>
          <p className="text-muted-foreground">Cadastre um novo funcionário no sistema</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <CardTitle>Dados do Funcionário</CardTitle>
              </div>
              <CardDescription>
                Preencha as informações abaixo para cadastrar um novo funcionário
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="name">
                    Nome Completo <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ex: João Silva"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Ex: joao@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">
                    Senha <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Senha de acesso"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="document">CPF</Label>
                  <Input
                    id="document"
                    name="document"
                    value={formData.document}
                    onChange={handleInputChange}
                    placeholder="000.000.000-00"
                    maxLength={20}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="role">
                    Cargo <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleSelectChange("role", value)}
                    required
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Selecione o cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CLINIC_ADMIN">Administrador da Clínica</SelectItem>
                      <SelectItem value="CLINIC_VET">Veterinário</SelectItem>
                      <SelectItem value="CLINIC_STAFF">Equipe</SelectItem>
                      <SelectItem value="CLINIC_RECEPTIONIST">Recepcionista</SelectItem>
                    </SelectContent>
                  </Select>
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
                      Cadastrar Funcionário
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/funcionarios/lista")}
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

