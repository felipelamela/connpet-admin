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
import { Pill, Save, X } from "lucide-react";

interface MedicationFormData {
  petId: string;
  name: string;
  dosage: string;
  startDate: string;
  endDate: string;
}

export default function CadastrarMedicamentoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<MedicationFormData>({
    petId: "",
    name: "",
    dosage: "",
    startDate: "",
    endDate: "",
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      if (!formData.petId || !formData.name.trim() || !formData.startDate) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }

      const medicationData = {
        petId: formData.petId,
        name: formData.name.trim(),
        dosage: formData.dosage.trim() || null,
        startDate: formData.startDate,
        endDate: formData.endDate || null,
      };

      console.log("Dados do medicamento:", medicationData);
      toast.success("Medicamento cadastrado com sucesso!");
      router.push("/medicamentos/lista");
    } catch (error) {
      console.error("Erro ao cadastrar medicamento:", error);
      toast.error("Erro ao cadastrar medicamento. Tente novamente.");
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
          <h1 className="text-3xl font-bold mb-2">Cadastrar Medicamento</h1>
          <p className="text-muted-foreground">Cadastre um novo medicamento para um pet</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Pill className="h-5 w-5" />
                <CardTitle>Dados do Medicamento</CardTitle>
              </div>
              <CardDescription>
                Preencha as informações abaixo para cadastrar um novo medicamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="petId">
                    Pet <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.petId}
                    onValueChange={(value) => handleSelectChange("petId", value)}
                    required
                  >
                    <SelectTrigger id="petId">
                      <SelectValue placeholder="Selecione o pet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Rex</SelectItem>
                      <SelectItem value="2">Mimi</SelectItem>
                      <SelectItem value="3">Thor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="name">
                    Nome do Medicamento <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ex: Antibiótico XYZ"
                    maxLength={255}
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="dosage">Dosagem</Label>
                  <Textarea
                    id="dosage"
                    name="dosage"
                    value={formData.dosage}
                    onChange={handleInputChange}
                    placeholder="Ex: 1 comprimido 2x ao dia"
                    maxLength={100}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">
                    Data de Início <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Data de Término</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
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
                      Cadastrar Medicamento
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/medicamentos/lista")}
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

