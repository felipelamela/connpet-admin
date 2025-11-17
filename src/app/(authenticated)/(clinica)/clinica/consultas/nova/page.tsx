"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Stethoscope, Search, Save, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { getAppointmentTypeOptions } from "@/consts/appointmentType.const";
import { getVetSpecialtyOptions } from "@/consts/vetSpecialty.const";
import { getAppointmentStatusOptions } from "@/consts/appointmentStatus.const";
import { BreedCombobox } from "@/components/breadcombo";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

const getCurrentDateTimeInSaoPaulo = () => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(new Date());
  const dateParts = parts.reduce<Record<string, string>>((acc, part) => {
    if (part.type !== "literal") {
      acc[part.type] = part.value;
    }
    return acc;
  }, {});

  const { year, month, day, hour, minute } = dateParts;
  return `${year}-${month}-${day}T${hour}:${minute}`;
};

interface Pet {
  id: string;
  name: string;
  species: string | number;
  breed: string | number;
  birthDate?: string;
  color?: string;
  weight?: string | number;
  microchipNumber?: string;
  gender: string;
  tutor?: {
    document: string;
  };
}

export default function NovaConsultaPage() {
  const router = useRouter();
  const [cpf, setCpf] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState("");
  const [petDetails, setPetDetails] = useState<Pet | null>(null);
  const [panelId] = useState("e2ce53d8-e3b6-4c16-bc1f-56ab5aa45a09"); // TODO: Pegar do contexto da empresa
  const [type, setType] = useState("");
  const [typeSpecialty, setTypeSpecialty] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [scheduledAt, setScheduledAt] = useState(() => getCurrentDateTimeInSaoPaulo());
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForScheduling, setIsForScheduling] = useState(false);
  const handleSchedulingToggle = (value: boolean) => {
    setIsForScheduling(value);
    if (!value) {
      setScheduledAt(getCurrentDateTimeInSaoPaulo());
    }
  };
  const [serviceOptions, setServiceOptions] = useState<ComboboxOption[]>([]);
  const [selectedService, setSelectedService] = useState<string>("");

  const appointmentTypeOptions = useMemo(
    () =>
      getAppointmentTypeOptions().map((option) => ({
        value: option.value.toString(),
        label: option.label,
      })),
    []
  );

  const specialtyOptions = useMemo(
    () =>
      getVetSpecialtyOptions().map((option) => ({
        value: option.value.toString(),
        label: option.label,
      })),
    []
  );

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await api.get("admin/services");
        const services =
          (response as any)?.data?.services ??
          (response as any)?.services ??
          (response as any)?.data ??
          (Array.isArray(response) ? response : []);

        const formatted: ComboboxOption[] = (services as any[])
          .map((service: any) => ({
            value: service?.id ?? service?.serviceId ?? "",
            label: service?.name ?? service?.title ?? "Serviço",
          }))
          .filter((service) => service.value);

        setServiceOptions(formatted);
      } catch (error) {
        console.error("Erro ao carregar serviços:", error);
        toast.error("Não foi possível carregar os serviços disponíveis.");
        setServiceOptions([]);
      }
    };

    loadServices();
  }, []);

  const searchPets = async () => {
    if (!cpf.trim()) {
      toast.error("Por favor, informe o CPF do tutor");
      return;
    }

    setIsSearching(true);
    try {
      const response = await api.get(`pet/tutor/document?document=${cpf}`);
      
      // api.get() já retorna response.data, então response é { statusCode, success, message, data }
      // Os pets estão em response.data
      const petsData = Array.isArray(response.data) ? response.data : [];
      
      setSelectedPet("");
      setPetDetails(null);
      setPets(petsData);
      
      if (petsData.length === 0) {
        toast.info("Nenhum pet encontrado para este CPF");
      } else {
        toast.success(`${petsData.length} pet(s) encontrado(s)!`);
      }
    } catch (error) {
      console.error("❌ Erro ao buscar pets:", error);
      toast.error("Erro ao buscar pets do tutor");
    } finally {
      setIsSearching(false);
    }
  };

  const handlePetSelect = (petId: string) => {
    setSelectedPet(petId);
    const pet = pets.find((p) => p.id === petId);
    setPetDetails(pet || null);
  };

  const calculateAge = (birthDate?: string): string => {
    if (!birthDate) return "N/A";
    const today = new Date();
    const birth = new Date(birthDate);
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    if (years === 0) return `${months} meses`;
    if (months === 0) return `${years} ${years === 1 ? "ano" : "anos"}`;
    return `${years} ${years === 1 ? "ano" : "anos"} e ${months} ${months === 1 ? "mês" : "meses"}`;
  };

  const getSpeciesLabel = (species: string | number) => {
    if (typeof species === 'number') {
      return `Espécie ${species}`;
    }
    const labels: { [key: string]: string } = {
      DOG: "Cão",
      CAT: "Gato",
      BIRD: "Ave",
      RABBIT: "Coelho",
      HAMSTER: "Hamster",
      GUINEA_PIG: "Porquinho da Índia",
      FERRET: "Furão",
      REPTILE: "Réptil",
      FISH: "Peixe",
      OTHER: "Outro",
    };
    return labels[species] || species;
  };

  const getGenderLabel = (gender: string) => {
    return gender === "MALE" ? "Macho" : "Fêmea";
  };

type ComboboxOption = {
  value: string;
  label: string;
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPet) {
      toast.error("Por favor, selecione um pet");
      return;
    }

    if (!panelId) {
      toast.error("Por favor, selecione um painel");
      return;
    }

    if (!type) {
      toast.error("Por favor, selecione o tipo de consulta");
      return;
    }

    if (!typeSpecialty) {
      toast.error("Por favor, selecione a especialidade");
      return;
    }

    if (!selectedService) {
      toast.error("Por favor, selecione um serviço");
      return;
    }

    setIsSubmitting(true);
    try {
      const appointmentData = {
        petId: selectedPet,
        panelId: panelId,
        vetId: undefined,
        status: status,
        type: parseInt(type),
        typeSpecialty: parseInt(typeSpecialty),
        serviceId: selectedService || null,
        description: description.trim() || undefined,
        scheduledAt: scheduledAt || undefined,
        forScheduling: isForScheduling,
      };

      await api.post("appointment", appointmentData);
      toast.success("Consulta cadastrada com sucesso!");
      router.push("/clinica/consultas/lista");
    } catch (error) {
      console.error("Erro ao cadastrar consulta:", error);
      toast.error("Erro ao cadastrar consulta");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            <CardTitle>Formulário de Agendamento</CardTitle>
          </div>
          <CardDescription>
            Busque os pets do tutor pelo CPF e selecione qual será atendido
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Busca por CPF e seleção de Pet */}
            <div className="space-y-4">
              <Label>Buscar Pet por CPF do Tutor</Label>
              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end">
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite o CPF do tutor"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    className="w-full"
                  />
                  <Button
                    type="button"
                    onClick={searchPets}
                    disabled={isSearching}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    {isSearching ? "Buscando..." : "Buscar"}
                  </Button>
                </div>
                <div>
                  <Label htmlFor="pet" className="mb-1 block md:sr-only lg:not-sr-only">
                    Selecione o Pet
                  </Label>
                  <Select value={selectedPet} onValueChange={handlePetSelect}>
                    <SelectTrigger
                      id="pet"
                      disabled={pets.length === 0}
                      className="w-full"
                    >
                      <SelectValue
                        placeholder={
                          pets.length === 0
                            ? "Nenhum pet disponível"
                            : "Selecione um pet"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {pets.length === 0 ? (
                        <SelectItem value="__empty" disabled>
                          Nenhum pet encontrado
                        </SelectItem>
                      ) : (
                        pets.map((pet) => (
                          <SelectItem key={pet.id} value={pet.id}>
                            {pet.name} - {getSpeciesLabel(pet.species)} ({getGenderLabel(pet.gender)})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Detalhes do Pet Selecionado */}
            <div className="bg-muted/60 border border-dashed border-muted-foreground/40 p-4 rounded-md space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Informações do Pet</h3>
                {!petDetails && (
                  <span className="text-xs text-muted-foreground">
                    Selecione um pet para visualizar os dados
                  </span>
                )}
              </div>

              {petDetails ? (
                <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                  <div>
                    <span className="font-medium">Nome:</span> {petDetails.name}
                  </div>
                  <div>
                    <span className="font-medium">Espécie:</span> {getSpeciesLabel(petDetails.species)}
                  </div>
                  <div>
                    <span className="font-medium">Raça:</span>{" "}
                    {typeof petDetails.breed === "string" ? petDetails.breed : `ID ${petDetails.breed}`}
                  </div>
                  <div>
                    <span className="font-medium">Idade:</span> {calculateAge(petDetails.birthDate)}
                  </div>
                  <div>
                    <span className="font-medium">Cor:</span> {petDetails.color || "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Peso:</span>{" "}
                    {petDetails.weight ? `${petDetails.weight} kg` : "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Gênero:</span> {getGenderLabel(petDetails.gender)}
                  </div>
                  <div>
                    <span className="font-medium">Tutor (CPF):</span>{" "}
                    {petDetails.tutor?.document || "N/A"}
                  </div>
                  {petDetails.microchipNumber && (
                    <div className="md:col-span-2">
                      <span className="font-medium">Microchip:</span> {petDetails.microchipNumber}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhum pet selecionado. Busque pelo CPF do tutor e escolha um pet para visualizar suas informações.
                </p>
              )}
            </div>

            {/* Tipo de Consulta, Especialidade e Serviço */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <BreedCombobox
                value={type}
                onValueChange={setType}
                options={appointmentTypeOptions}
                placeholder="Selecione o tipo"
                label={
                  <>
                    Tipo de Consulta <span className="text-red-500">*</span>
                  </>
                }
                emptyMessage="Nenhum tipo encontrado."
              />

              <BreedCombobox
                value={typeSpecialty}
                onValueChange={setTypeSpecialty}
                options={specialtyOptions}
                placeholder="Selecione a especialidade"
                label={
                  <>
                    Especialidade <span className="text-red-500">*</span>
                  </>
                }
                emptyMessage="Nenhuma especialidade encontrada."
              />

              <BreedCombobox
                value={selectedService}
                onValueChange={setSelectedService}
                options={serviceOptions}
                placeholder={
                  serviceOptions.length === 0
                    ? "Nenhum serviço disponível"
                    : "Selecione um serviço"
                }
                label="Serviço"
                emptyMessage="Nenhum serviço encontrado."
                disabled={serviceOptions.length === 0}
              />
            </div>

            {/* Status, Data e Tipo de Atendimento */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAppointmentStatusOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduledAt">Data de Entrada</Label>
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  disabled={!isForScheduling}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="forScheduling">Tipo de Atendimento</Label>
                <Toggle
                  id="forScheduling"
                  pressed={isForScheduling}
                  onPressedChange={handleSchedulingToggle}
                  className={cn(
                    "w-full justify-center whitespace-normal text-center text-sm font-medium",
                    isForScheduling
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "bg-muted text-muted-foreground hover:bg-muted"
                  )}
                >
                  {isForScheduling ? "Para agendamento" : "Consulta para hoje"}
                </Toggle>
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="description">Descrição / Observações</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Informações adicionais sobre a consulta..."
                rows={4}
              />
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Cadastrando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Cadastrar Consulta
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

