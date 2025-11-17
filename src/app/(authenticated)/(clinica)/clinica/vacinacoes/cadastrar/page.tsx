"use client";

import { useState } from "react";
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
import { Syringe, Save, X } from "lucide-react";

interface VaccinationFormData {
  petId: string;
  vaccineTypeId: string;
  veterinarianProfileId: string;
  applicationDate: string;
  batchNumber: string;
  manufacturer: string;
  expirationDate: string;
  nextDoseDate: string;
  doseNumber: string;
  adverseReaction: string;
  observations: string;
}

export default function CadastrarVacinacaoPage() {
 

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<VaccinationFormData>({
    petId: "",
    vaccineTypeId: "",
    veterinarianProfileId: "",
    applicationDate: "",
    batchNumber: "",
    manufacturer: "",
    expirationDate: "",
    nextDoseDate: "",
    doseNumber: "1",
    adverseReaction: "",
    observations: "",
  });

 

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
      if (!formData.petId || !formData.vaccineTypeId || !formData.applicationDate) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }

      const vaccinationData = {
        petId: formData.petId,
        vaccineTypeId: formData.vaccineTypeId,
        veterinarianProfileId: formData.veterinarianProfileId,
        applicationDate: formData.applicationDate,
        batchNumber: formData.batchNumber.trim(),
        manufacturer: formData.manufacturer.trim(),
        expirationDate: formData.expirationDate,
        nextDoseDate: formData.nextDoseDate || null,
        doseNumber: parseInt(formData.doseNumber),
        adverseReaction: formData.adverseReaction.trim() || null,
        observations: formData.observations.trim() || null,
      };

      toast.success("Vacinação cadastrada com sucesso!");
      router.push("/clinica/vacinacoes/lista");
    } catch (error) {
      console.error("Erro ao cadastrar vacinação:", error);
      toast.error("Erro ao cadastrar vacinação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };  return (
    
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Cadastrar Vacinação</h1>
          <p className="text-muted-foreground">Registre uma nova vacinação</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Syringe className="h-5 w-5" />
                <CardTitle>Dados da Vacinação</CardTitle>
              </div>
              <CardDescription>
                Preencha as informações abaixo para registrar uma vacinação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Informações do Pet e Vacina</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
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
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vaccineTypeId">
                      Tipo de Vacina <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.vaccineTypeId}
                      onValueChange={(value) => handleSelectChange("vaccineTypeId", value)}
                      required
                    >
                      <SelectTrigger id="vaccineTypeId">
                        <SelectValue placeholder="Selecione a vacina" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">V10</SelectItem>
                        <SelectItem value="2">Antirrábica</SelectItem>
                        <SelectItem value="3">V8</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="veterinarianProfileId">
                      Veterinário <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.veterinarianProfileId}
                      onValueChange={(value) => handleSelectChange("veterinarianProfileId", value)}
                      required
                    >
                      <SelectTrigger id="veterinarianProfileId">
                        <SelectValue placeholder="Selecione o veterinário" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Dr. Carlos Silva</SelectItem>
                        <SelectItem value="2">Dra. Maria Santos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="applicationDate">
                      Data de Aplicação <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="applicationDate"
                      name="applicationDate"
                      type="date"
                      value={formData.applicationDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Informações do Lote</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="batchNumber">
                      Número do Lote <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="batchNumber"
                      name="batchNumber"
                      value={formData.batchNumber}
                      onChange={handleInputChange}
                      placeholder="Ex: ABC123"
                      maxLength={100}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="manufacturer">
                      Fabricante <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="manufacturer"
                      name="manufacturer"
                      value={formData.manufacturer}
                      onChange={handleInputChange}
                      placeholder="Ex: Laboratório XYZ"
                      maxLength={255}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expirationDate">
                      Data de Validade <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="expirationDate"
                      name="expirationDate"
                      type="date"
                      value={formData.expirationDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nextDoseDate">Próxima Dose</Label>
                    <Input
                      id="nextDoseDate"
                      name="nextDoseDate"
                      type="date"
                      value={formData.nextDoseDate}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="doseNumber">
                      Número da Dose <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="doseNumber"
                      name="doseNumber"
                      type="number"
                      min="1"
                      value={formData.doseNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Observações</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adverseReaction">Reação Adversa</Label>
                    <Textarea
                      id="adverseReaction"
                      name="adverseReaction"
                      value={formData.adverseReaction}
                      onChange={handleInputChange}
                      placeholder="Descreva qualquer reação adversa observada"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="observations">Observações Gerais</Label>
                    <Textarea
                      id="observations"
                      name="observations"
                      value={formData.observations}
                      onChange={handleInputChange}
                      placeholder="Observações adicionais"
                      rows={3}
                    />
                  </div>
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
                      Cadastrar Vacinação
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/clinica/vacinacoes/lista")}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  <X className="mr-2 h-4 w-4 text-gray-700" />
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </main>
    
  );
}

