"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Stepper,
  StepperHeader,
  Step,
  StepIndicator,
  StepperFooter,
} from "@/components/ui/stepper";
import {
  User,
  MapPin,
  PawPrint,
  ChevronLeft,
  ChevronRight,
  Save,
} from "lucide-react";

// Tipos para os dados do formulário
interface TutorData {
  name: string;
  email: string;
  password: string;
  document: string;
  role: string;
  jumper: string;
}

interface AddressData {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
}

interface PetData {
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

interface FormData {
  tutor: TutorData;
  address: AddressData;
  pet: PetData;
}

export default function CadastrarTutorPage() {
 

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    tutor: {
      name: "",
      email: "",
      password: "",
      document: "",
      role: "",
      jumper: "",
    },
    address: {
      cep: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      country: "Brasil",
    },
    pet: {
      name: "",
      species: "",
      breed: "",
      gender: "",
      birthDate: "",
      color: "",
      weight: "",
      microchipNumber: "",
      observations: "",
    },
  });

 

  const handleInputChange = (
    section: keyof FormData,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const validateStep1 = (): boolean => {
    const { tutor } = formData;

    if (!tutor.name.trim()) {
      toast.error("Nome é obrigatório");
      return false;
    }
    if (!tutor.email.trim()) {
      toast.error("Email é obrigatório");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tutor.email)) {
      toast.error("Email inválido");
      return false;
    }
    if (!tutor.password || tutor.password.length < 6) {
      toast.error("Senha deve ter no mínimo 6 caracteres");
      return false;
    }
    if (!tutor.role) {
      toast.error("Tipo de usuário é obrigatório");
      return false;
    }
    if (!tutor.jumper) {
      toast.error("Jumper é obrigatório");
      return false;
    }

    return true;
  };

  const validateStep2 = (): boolean => {
    const { address } = formData;

    if (!address.cep.trim() || address.cep.length !== 8) {
      toast.error("CEP inválido (8 dígitos)");
      return false;
    }
    if (!address.street.trim()) {
      toast.error("Rua é obrigatória");
      return false;
    }
    if (!address.number.trim()) {
      toast.error("Número é obrigatório");
      return false;
    }
    if (!address.neighborhood.trim()) {
      toast.error("Bairro é obrigatório");
      return false;
    }
    if (!address.city.trim()) {
      toast.error("Cidade é obrigatória");
      return false;
    }
    if (!address.state) {
      toast.error("Estado é obrigatório");
      return false;
    }

    return true;
  };

  const validateStep3 = (): boolean => {
    const { pet } = formData;

    if (!pet.name.trim()) {
      toast.error("Nome do pet é obrigatório");
      return false;
    }
    if (!pet.species) {
      toast.error("Espécie é obrigatória");
      return false;
    }
    if (!pet.breed) {
      toast.error("Raça é obrigatória");
      return false;
    }
    if (!pet.gender) {
      toast.error("Sexo é obrigatório");
      return false;
    }

    return true;
  };

  const handleNext = () => {
    let isValid = false;

    switch (currentStep) {
      case 0:
        isValid = validateStep1();
        break;
      case 1:
        isValid = validateStep2();
        break;
      case 2:
        isValid = validateStep3();
        break;
    }

    if (isValid && currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep3()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar dados para envio
      const finalData = {
        tutor: {
          name: formData.tutor.name.trim(),
          email: formData.tutor.email.trim(),
          password: formData.tutor.password,
          document: formData.tutor.document.trim() || null,
          status: true,
          role: parseInt(formData.tutor.role),
          jumper: parseInt(formData.tutor.jumper),
        },
        address: {
          cep: formData.address.cep.trim(),
          street: formData.address.street.trim(),
          number: formData.address.number.trim(),
          complement: formData.address.complement.trim() || null,
          neighborhood: formData.address.neighborhood.trim(),
          city: formData.address.city.trim(),
          state: parseInt(formData.address.state),
          country: formData.address.country,
        },
        pet: {
          name: formData.pet.name.trim(),
          species: formData.pet.species,
          breed: parseInt(formData.pet.breed),
          gender: formData.pet.gender,
          birthDate: formData.pet.birthDate || null,
          color: formData.pet.color.trim() || null,
          weight: formData.pet.weight ? parseFloat(formData.pet.weight) : null,
          microchipNumber: formData.pet.microchipNumber.trim() || null,
          observations: formData.pet.observations.trim() || null,
          active: true,
        },
      };

      // TODO: Implementar chamada à API
      console.log("Dados completos:", finalData);

      toast.success("Tutor, endereço e pet cadastrados com sucesso!");
      router.push("/grooming/dashboard");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      toast.error("Erro ao cadastrar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const searchCEP = async (cep: string) => {
    if (cep.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        toast.error("CEP não encontrado");
        return;
      }

      handleInputChange("address", "street", data.logradouro || "");
      handleInputChange("address", "neighborhood", data.bairro || "");
      handleInputChange("address", "city", data.localidade || "");
      // Mapeamento de UF para código de estado (exemplo simplificado)
      const stateMap: { [key: string]: string } = {
        SP: "1",
        RJ: "2",
        MG: "3",
        // Adicione outros estados conforme necessário
      };
      handleInputChange("address", "state", stateMap[data.uf] || "");

      toast.success("Endereço preenchido automaticamente");
    } catch (error) {
      toast.error("Erro ao buscar CEP");
    }
  };  return (
    
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Cadastrar Tutor</h1>
          <p className="text-muted-foreground">
            Cadastre um novo tutor, endereço e pet no sistema
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Cadastro Completo</CardTitle>
              <CardDescription>
                Preencha as informações em 3 etapas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Stepper currentStep={currentStep} onStepChange={setCurrentStep}>
                {/* Header com indicadores */}
                <StepperHeader>
                  <StepIndicator index={0} title="Tutor" />
                  <StepIndicator index={1} title="Endereço" />
                  <StepIndicator index={2} title="Pet" />
                </StepperHeader>

                {/* Step 1: Dados do Tutor */}
                <Step index={0} title="Dados do Tutor" description="Informações básicas do tutor">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Nome */}
                      <div className="space-y-2">
                        <Label htmlFor="tutor-name">
                          Nome Completo <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="tutor-name"
                            value={formData.tutor.name}
                            onChange={(e) =>
                              handleInputChange("tutor", "name", e.target.value)
                            }
                            placeholder="Nome completo do tutor"
                            required
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="tutor-email">
                          Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="tutor-email"
                          type="email"
                          value={formData.tutor.email}
                          onChange={(e) =>
                            handleInputChange("tutor", "email", e.target.value)
                          }
                          placeholder="email@exemplo.com"
                          required
                        />
                      </div>

                      {/* Senha */}
                      <div className="space-y-2">
                        <Label htmlFor="tutor-password">
                          Senha <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="tutor-password"
                          type="password"
                          value={formData.tutor.password}
                          onChange={(e) =>
                            handleInputChange("tutor", "password", e.target.value)
                          }
                          placeholder="Mínimo 6 caracteres"
                          minLength={6}
                          required
                        />
                      </div>

                      {/* Documento */}
                      <div className="space-y-2">
                        <Label htmlFor="tutor-document">CPF/CNPJ</Label>
                        <Input
                          id="tutor-document"
                          value={formData.tutor.document}
                          onChange={(e) =>
                            handleInputChange("tutor", "document", e.target.value)
                          }
                          placeholder="000.000.000-00"
                        />
                      </div>

                      {/* Role */}
                      <div className="space-y-2">
                        <Label htmlFor="tutor-role">
                          Tipo de Usuário <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formData.tutor.role}
                          onValueChange={(value) =>
                            handleInputChange("tutor", "role", value)
                          }
                          required
                        >
                          <SelectTrigger id="tutor-role">
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Administrador</SelectItem>
                            <SelectItem value="2">Veterinário</SelectItem>
                            <SelectItem value="3">Tutor</SelectItem>
                            <SelectItem value="4">Atendente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Jumper */}
                      <div className="space-y-2">
                        <Label htmlFor="tutor-jumper">
                          Jumper <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formData.tutor.jumper}
                          onValueChange={(value) =>
                            handleInputChange("tutor", "jumper", value)
                          }
                          required
                        >
                          <SelectTrigger id="tutor-jumper">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Não</SelectItem>
                            <SelectItem value="1">Sim</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </Step>

                {/* Step 2: Endereço */}
                <Step index={1} title="Endereço" description="Dados de localização">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* CEP */}
                      <div className="space-y-2">
                        <Label htmlFor="address-cep">
                          CEP <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="address-cep"
                            value={formData.address.cep}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              handleInputChange("address", "cep", value);
                              if (value.length === 8) {
                                searchCEP(value);
                              }
                            }}
                            placeholder="00000000"
                            maxLength={8}
                            required
                          />
                        </div>
                      </div>

                      {/* Rua */}
                      <div className="space-y-2">
                        <Label htmlFor="address-street">
                          Rua <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="address-street"
                          value={formData.address.street}
                          onChange={(e) =>
                            handleInputChange("address", "street", e.target.value)
                          }
                          placeholder="Nome da rua"
                          maxLength={255}
                          required
                        />
                      </div>

                      {/* Número */}
                      <div className="space-y-2">
                        <Label htmlFor="address-number">
                          Número <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="address-number"
                          value={formData.address.number}
                          onChange={(e) =>
                            handleInputChange("address", "number", e.target.value)
                          }
                          placeholder="123"
                          maxLength={10}
                          required
                        />
                      </div>

                      {/* Complemento */}
                      <div className="space-y-2">
                        <Label htmlFor="address-complement">Complemento</Label>
                        <Input
                          id="address-complement"
                          value={formData.address.complement}
                          onChange={(e) =>
                            handleInputChange(
                              "address",
                              "complement",
                              e.target.value
                            )
                          }
                          placeholder="Apto, Bloco, etc."
                          maxLength={255}
                        />
                      </div>

                      {/* Bairro */}
                      <div className="space-y-2">
                        <Label htmlFor="address-neighborhood">
                          Bairro <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="address-neighborhood"
                          value={formData.address.neighborhood}
                          onChange={(e) =>
                            handleInputChange(
                              "address",
                              "neighborhood",
                              e.target.value
                            )
                          }
                          placeholder="Nome do bairro"
                          maxLength={100}
                          required
                        />
                      </div>

                      {/* Cidade */}
                      <div className="space-y-2">
                        <Label htmlFor="address-city">
                          Cidade <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="address-city"
                          value={formData.address.city}
                          onChange={(e) =>
                            handleInputChange("address", "city", e.target.value)
                          }
                          placeholder="Nome da cidade"
                          maxLength={100}
                          required
                        />
                      </div>

                      {/* Estado */}
                      <div className="space-y-2">
                        <Label htmlFor="address-state">
                          Estado <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formData.address.state}
                          onValueChange={(value) =>
                            handleInputChange("address", "state", value)
                          }
                          required
                        >
                          <SelectTrigger id="address-state">
                            <SelectValue placeholder="Selecione o estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">São Paulo</SelectItem>
                            <SelectItem value="2">Rio de Janeiro</SelectItem>
                            <SelectItem value="3">Minas Gerais</SelectItem>
                            <SelectItem value="4">Bahia</SelectItem>
                            <SelectItem value="5">Paraná</SelectItem>
                            <SelectItem value="6">Rio Grande do Sul</SelectItem>
                            <SelectItem value="7">Pernambuco</SelectItem>
                            <SelectItem value="8">Ceará</SelectItem>
                            <SelectItem value="9">Pará</SelectItem>
                            <SelectItem value="10">Santa Catarina</SelectItem>
                            <SelectItem value="11">Goiás</SelectItem>
                            <SelectItem value="12">Maranhão</SelectItem>
                            <SelectItem value="13">Paraíba</SelectItem>
                            <SelectItem value="14">Amazonas</SelectItem>
                            <SelectItem value="15">Espírito Santo</SelectItem>
                            <SelectItem value="16">Mato Grosso</SelectItem>
                            <SelectItem value="17">Rio Grande do Norte</SelectItem>
                            <SelectItem value="18">Piauí</SelectItem>
                            <SelectItem value="19">Alagoas</SelectItem>
                            <SelectItem value="20">Distrito Federal</SelectItem>
                            <SelectItem value="21">Mato Grosso do Sul</SelectItem>
                            <SelectItem value="22">Sergipe</SelectItem>
                            <SelectItem value="23">Rondônia</SelectItem>
                            <SelectItem value="24">Tocantins</SelectItem>
                            <SelectItem value="25">Acre</SelectItem>
                            <SelectItem value="26">Amapá</SelectItem>
                            <SelectItem value="27">Roraima</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* País */}
                      <div className="space-y-2">
                        <Label htmlFor="address-country">País</Label>
                        <Input
                          id="address-country"
                          value={formData.address.country}
                          onChange={(e) =>
                            handleInputChange("address", "country", e.target.value)
                          }
                          maxLength={100}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </Step>

                {/* Step 3: Pet */}
                <Step index={2} title="Dados do Pet" description="Informações do pet">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Nome do Pet */}
                      <div className="space-y-2">
                        <Label htmlFor="pet-name">
                          Nome do Pet <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex items-center gap-2">
                          <PawPrint className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="pet-name"
                            value={formData.pet.name}
                            onChange={(e) =>
                              handleInputChange("pet", "name", e.target.value)
                            }
                            placeholder="Nome do pet"
                            maxLength={100}
                            required
                          />
                        </div>
                      </div>

                      {/* Espécie */}
                      <div className="space-y-2">
                        <Label htmlFor="pet-species">
                          Espécie <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formData.pet.species}
                          onValueChange={(value) =>
                            handleInputChange("pet", "species", value)
                          }
                          required
                        >
                          <SelectTrigger id="pet-species">
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
                        <Label htmlFor="pet-breed">
                          Raça <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formData.pet.breed}
                          onValueChange={(value) =>
                            handleInputChange("pet", "breed", value)
                          }
                          required
                        >
                          <SelectTrigger id="pet-breed">
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
                        <Label htmlFor="pet-gender">
                          Sexo <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formData.pet.gender}
                          onValueChange={(value) =>
                            handleInputChange("pet", "gender", value)
                          }
                          required
                        >
                          <SelectTrigger id="pet-gender">
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
                        <Label htmlFor="pet-birthDate">Data de Nascimento</Label>
                        <Input
                          id="pet-birthDate"
                          type="date"
                          value={formData.pet.birthDate}
                          onChange={(e) =>
                            handleInputChange("pet", "birthDate", e.target.value)
                          }
                          max={new Date().toISOString().split("T")[0]}
                        />
                      </div>

                      {/* Cor */}
                      <div className="space-y-2">
                        <Label htmlFor="pet-color">Cor/Pelagem</Label>
                        <Input
                          id="pet-color"
                          value={formData.pet.color}
                          onChange={(e) =>
                            handleInputChange("pet", "color", e.target.value)
                          }
                          placeholder="Cor do pet"
                          maxLength={50}
                        />
                      </div>

                      {/* Peso */}
                      <div className="space-y-2">
                        <Label htmlFor="pet-weight">Peso (kg)</Label>
                        <Input
                          id="pet-weight"
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.pet.weight}
                          onChange={(e) =>
                            handleInputChange("pet", "weight", e.target.value)
                          }
                          placeholder="Peso em kg"
                        />
                      </div>

                      {/* Microchip */}
                      <div className="space-y-2">
                        <Label htmlFor="pet-microchipNumber">
                          Número do Microchip
                        </Label>
                        <Input
                          id="pet-microchipNumber"
                          value={formData.pet.microchipNumber}
                          onChange={(e) =>
                            handleInputChange(
                              "pet",
                              "microchipNumber",
                              e.target.value
                            )
                          }
                          placeholder="Número do microchip"
                          maxLength={15}
                        />
                      </div>
                    </div>

                    {/* Observações */}
                    <div className="space-y-2">
                      <Label htmlFor="pet-observations">Observações</Label>
                      <Textarea
                        id="pet-observations"
                        value={formData.pet.observations}
                        onChange={(e) =>
                          handleInputChange("pet", "observations", e.target.value)
                        }
                        placeholder="Informações adicionais sobre o pet"
                        rows={4}
                        className="resize-none"
                      />
                    </div>
                  </div>
                </Step>

                {/* Footer com botões de navegação */}
                <StepperFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 0 || isSubmitting}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>

                  <div className="flex-1" />

                  {currentStep < 2 ? (
                    <Button type="button" onClick={handleNext}>
                      Próximo
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Cadastrando...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Finalizar Cadastro
                        </>
                      )}
                    </Button>
                  )}
                </StepperFooter>
              </Stepper>
            </CardContent>
          </Card>
        </form>
      </main>
    
  );
}

