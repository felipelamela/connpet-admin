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
import { PawPrint, Save, X } from "lucide-react";

interface PetFormData {
  name: string;
  species: string;
  breed: string;
  gender: string;
  birthDate: string;
  color: string;
  weight: string;
  microchipNumber: string;
  observations: string;
}

export default function CadastrarPetPage() {
 

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<PetFormData>({
    name: "",
    species: "",
    breed: "",
    gender: "",
    birthDate: "",
    color: "",
    weight: "",
    microchipNumber: "",
    observations: "",
  });

 

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
      // Validações básicas
      if (!formData.name.trim()) {
        toast.error("Nome do pet é obrigatório");
        return;
      }
      if (!formData.species) {
        toast.error("Espécie é obrigatória");
        return;
      }
      if (!formData.breed) {
        toast.error("Raça é obrigatória");
        return;
      }
      if (!formData.gender) {
        toast.error("Sexo é obrigatório");
        return;
      }

      // Preparar dados para envio
      const petData = {
        name: formData.name.trim(),
        species: formData.species,
        breed: parseInt(formData.breed),
        gender: formData.gender,
        birthDate: formData.birthDate || null,
        color: formData.color.trim() || null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        microchipNumber: formData.microchipNumber.trim() || null,
        observations: formData.observations.trim() || null,
        active: true,
      };

      // TODO: Implementar chamada à API
      console.log("Dados do pet:", petData);
      
      toast.success("Pet cadastrado com sucesso!");
      router.push("/clinica/pets/editar");
    } catch (error) {
      console.error("Erro ao cadastrar pet:", error);
      toast.error("Erro ao cadastrar pet. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/clinica/dashboard");
  };  return (
    
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Cadastrar Pet</h1>
          <p className="text-muted-foreground">Cadastre um novo pet no sistema</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <PawPrint className="h-5 w-5" />
                <CardTitle>Dados do Pet</CardTitle>
              </div>
              <CardDescription>
                Preencha as informações abaixo para cadastrar um novo pet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Informações Básicas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Informações Básicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nome */}
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Nome do Pet <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ex: Rex"
                      maxLength={100}
                      required
                    />
                  </div>

                  {/* Espécie */}
                  <div className="space-y-2">
                    <Label htmlFor="species">
                      Espécie <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.species}
                      onValueChange={(value) =>
                        handleSelectChange("species", value)
                      }
                      required
                    >
                      <SelectTrigger id="species">
                        <SelectValue placeholder="Selecione a espécie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Canino">Canino (Cachorro)</SelectItem>
                        <SelectItem value="Felino">Felino (Gato)</SelectItem>
                        <SelectItem value="Ave">Ave</SelectItem>
                        <SelectItem value="Réptil">Réptil</SelectItem>
                        <SelectItem value="Roedor">Roedor</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Raça */}
                  <div className="space-y-2">
                    <Label htmlFor="breed">
                      Raça <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.breed}
                      onValueChange={(value) => handleSelectChange("breed", value)}
                      required
                    >
                      <SelectTrigger id="breed">
                        <SelectValue placeholder="Selecione a raça" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">SRD (Sem Raça Definida)</SelectItem>
                        <SelectItem value="2">Labrador</SelectItem>
                        <SelectItem value="3">Golden Retriever</SelectItem>
                        <SelectItem value="4">Bulldog</SelectItem>
                        <SelectItem value="5">Pastor Alemão</SelectItem>
                        <SelectItem value="6">Poodle</SelectItem>
                        <SelectItem value="7">Yorkshire</SelectItem>
                        <SelectItem value="8">Shih Tzu</SelectItem>
                        <SelectItem value="9">Persa</SelectItem>
                        <SelectItem value="10">Siamês</SelectItem>
                        <SelectItem value="11">Maine Coon</SelectItem>
                        <SelectItem value="12">Outra</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sexo */}
                  <div className="space-y-2">
                    <Label htmlFor="gender">
                      Sexo <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => handleSelectChange("gender", value)}
                      required
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Selecione o sexo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Macho">Macho</SelectItem>
                        <SelectItem value="Fêmea">Fêmea</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Data de Nascimento */}
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Data de Nascimento</Label>
                    <Input
                      id="birthDate"
                      name="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  {/* Cor */}
                  <div className="space-y-2">
                    <Label htmlFor="color">Cor/Pelagem</Label>
                    <Input
                      id="color"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      placeholder="Ex: Marrom, Preto e Branco"
                      maxLength={50}
                    />
                  </div>
                </div>
              </div>

              {/* Informações Adicionais */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Informações Adicionais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Peso */}
                  <div className="space-y-2">
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="Ex: 12.5"
                    />
                  </div>

                  {/* Número do Microchip */}
                  <div className="space-y-2">
                    <Label htmlFor="microchipNumber">Número do Microchip</Label>
                    <Input
                      id="microchipNumber"
                      name="microchipNumber"
                      value={formData.microchipNumber}
                      onChange={handleInputChange}
                      placeholder="Ex: 123456789012345"
                      maxLength={15}
                    />
                  </div>
                </div>

                {/* Observações */}
                <div className="space-y-2">
                  <Label htmlFor="observations">Observações</Label>
                  <Textarea
                    id="observations"
                    name="observations"
                    value={formData.observations}
                    onChange={handleInputChange}
                    placeholder="Informações adicionais sobre o pet (alergias, comportamento, etc.)"
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </div>

              {/* Botões de Ação */}
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
                      Cadastrar Pet
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
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
    
  );
}

