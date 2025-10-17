"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Save } from "lucide-react";

interface ClinicFormData {
  cnpj: string;
  socialName: string;
  tradeName: string;
  email: string;
  phone: string;
  cellphone: string;
  openingTime: string;
  closingTime: string;
  emergencyService: boolean;
  observations: string;
}

export default function PerfilClinicaPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ClinicFormData>({
    cnpj: "12.345.678/0001-90",
    socialName: "Clínica Veterinária Exemplo LTDA",
    tradeName: "Clínica Vet Example",
    email: "contato@clinicavet.com",
    phone: "(11) 3333-3333",
    cellphone: "(11) 99999-9999",
    openingTime: "08:00",
    closingTime: "18:00",
    emergencyService: true,
    observations: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Você precisa fazer login primeiro");
      router.push("/login");
    } else {
      setIsLoading(false);
      // TODO: Carregar dados da clínica da API
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value === "true" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.socialName.trim() || !formData.email.trim()) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }

      const clinicData = {
        cnpj: formData.cnpj.trim(),
        socialName: formData.socialName.trim(),
        tradeName: formData.tradeName.trim() || null,
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        cellphone: formData.cellphone.trim() || null,
        openingTime: formData.openingTime || null,
        closingTime: formData.closingTime || null,
        emergencyService: formData.emergencyService,
        observations: formData.observations.trim() || null,
      };

      console.log("Dados da clínica:", clinicData);
      toast.success("Dados da clínica atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar clínica:", error);
      toast.error("Erro ao atualizar dados da clínica. Tente novamente.");
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
          <h1 className="text-3xl font-bold mb-2">Perfil da Clínica</h1>
          <p className="text-muted-foreground">Gerencie as informações da clínica</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                <CardTitle>Dados da Clínica</CardTitle>
              </div>
              <CardDescription>
                Atualize as informações da sua clínica veterinária
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Informações Básicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">
                      CNPJ <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="cnpj"
                      name="cnpj"
                      value={formData.cnpj}
                      onChange={handleInputChange}
                      placeholder="00.000.000/0000-00"
                      maxLength={18}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="socialName">
                      Razão Social <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="socialName"
                      name="socialName"
                      value={formData.socialName}
                      onChange={handleInputChange}
                      placeholder="Nome da Empresa LTDA"
                      maxLength={255}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tradeName">Nome Fantasia</Label>
                    <Input
                      id="tradeName"
                      name="tradeName"
                      value={formData.tradeName}
                      onChange={handleInputChange}
                      placeholder="Nome da Clínica"
                      maxLength={255}
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
                      placeholder="contato@clinica.com"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contato</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(00) 0000-0000"
                      maxLength={15}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cellphone">Celular</Label>
                    <Input
                      id="cellphone"
                      name="cellphone"
                      value={formData.cellphone}
                      onChange={handleInputChange}
                      placeholder="(00) 00000-0000"
                      maxLength={15}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Horário de Funcionamento</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="openingTime">Abertura</Label>
                    <Input
                      id="openingTime"
                      name="openingTime"
                      type="time"
                      value={formData.openingTime}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="closingTime">Fechamento</Label>
                    <Input
                      id="closingTime"
                      name="closingTime"
                      type="time"
                      value={formData.closingTime}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyService">Atendimento Emergencial</Label>
                    <Select
                      value={formData.emergencyService.toString()}
                      onValueChange={(value) => handleSelectChange("emergencyService", value)}
                    >
                      <SelectTrigger id="emergencyService">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Sim</SelectItem>
                        <SelectItem value="false">Não</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Observações</h3>
                <div className="space-y-2">
                  <Label htmlFor="observations">Observações Gerais</Label>
                  <Textarea
                    id="observations"
                    name="observations"
                    value={formData.observations}
                    onChange={handleInputChange}
                    placeholder="Informações adicionais sobre a clínica"
                    rows={4}
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
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </main>
    </LayoutWrapper>
  );
}

