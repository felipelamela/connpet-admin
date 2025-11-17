"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
  User,
  MapPin,
  PawPrint,
  Save,
  Phone,
  ChevronDown,
  Check,
  X,
  Edit,
  Calendar as CalendarIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useModuleContext } from "@/hooks/useModuleContext";
import api from "@/services/api";
import { DogBreedConst } from "@/consts/dogbreed.const";
import { CatBreedConst } from "@/consts/catbreed.const";
import { BirdBreedConst } from "@/consts/birdBreed.const";
import { ReptilesConst } from "@/consts/reptiles.const";
import { RodentBreedConst } from "@/consts/rodent.const";
import { UFToEstadoCode, EstadoCodeToUF, EstadoConst } from "@/consts/estado.const";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { BreedCombobox } from "@/components/breadcombo";
import { StateCombobox } from "@/components/stateComboBox";

interface ComboboxOption {
  value: string;
  label: string;
}

interface TutorData {
  name: string;
  email: string;
  phone: string;
  document: string;
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
 
  const router = useRouter();
  const { getButtonColors } = useModuleContext();
  const buttonColors = getButtonColors();
  const searchParams = useSearchParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stateSearchTerm, setStateSearchTerm] = useState("");
  const [isStateOpen, setIsStateOpen] = useState(false);
  const [birthDateOpen, setBirthDateOpen] = useState(false);
  const [addressFieldsDisabled, setAddressFieldsDisabled] = useState({
    street: false,
    neighborhood: false,
    city: false,
    state: false,
  });
  const [formData, setFormData] = useState<FormData>({
    tutor: {
      name: "",
      email: "",
      phone: "",
      document: "",
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

  // Preencher documento se vier da URL
  useEffect(() => {
    const documentParam = searchParams.get("document");
    if (documentParam) {
      setFormData((prev) => ({
        ...prev,
        tutor: {
          ...prev.tutor,
          document: documentParam,
        },
      }));
    }
  }, [searchParams]);

  const handleInputChange = (
    section: keyof FormData,
    field: string,
    value: string
  ) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      };      
      if (section === "pet" && field === "species") {
        newData.pet.breed = "";
      }
      return newData;
    });
  };

  const getBreedConst = () => {
    const species = formData.pet.species;
    if (species === "1") return DogBreedConst;
    if (species === "2") return CatBreedConst;
    if (species === "3") return BirdBreedConst;
    if (species === "4") return ReptilesConst;
    if (species === "5") return RodentBreedConst;
    return null;
  };



  const isBreedDisabled = formData.pet.species === "0" || !formData.pet.species;

  const getBreedOptions = (): ComboboxOption[] => {
    const breedConst = getBreedConst()
    if (!breedConst) return []

    return Object.entries(breedConst).map(([key, value]) => ({
      value: key.toString(), // garante string
      label: value as string,
    }))
  }

  const getBirthDateValue = (): Date | undefined => {
    if (!formData.pet.birthDate) return undefined;
    const date = new Date(formData.pet.birthDate);
    return isNaN(date.getTime()) ? undefined : date;
  };

  const formatDateToString = (date: Date | undefined): string => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd");
  };

  const validateForm = (): boolean => {
    const { tutor, address, pet } = formData;

    if (!tutor.name.trim()) {
      toast.error("Nome do tutor é obrigatório");
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

    if (!pet.name.trim()) {
      toast.error("Nome do pet é obrigatório");
      return false;
    }
    if (!pet.species) {
      toast.error("Espécie é obrigatória");
      return false;
    }
    if (!pet.gender) {
      toast.error("Sexo é obrigatório");
      return false;
    }

    return true;
  };

  const getSpeciesNumber = (species: string): number => {
    const speciesMap: { [key: string]: number } = {
      Canino: 0,
      Felino: 1,
      Ave: 2,
      Réptil: 7,
      Roedor: 4,
      Outro: 9,
    };
    return speciesMap[species] ?? 9;
  };

  const getGenderEnum = (gender: string): "MALE" | "FEMALE" => {
    return gender === "Macho" ? "MALE" : "FEMALE";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const finalData = {
        name: formData.tutor.name.trim(),
        email: formData.tutor.email.trim(),
        document: formData.tutor.document.trim() || undefined,
        phone: formData.tutor.phone.trim() || undefined,
        
        cep: formData.address.cep.trim(),
        street: formData.address.street.trim(),
        number: formData.address.number.trim(),
        complement: formData.address.complement.trim() || undefined,
        neighborhood: formData.address.neighborhood.trim(),
        city: formData.address.city.trim(),
        state: EstadoCodeToUF[formData.address.state] as any,
        country: formData.address.country || undefined,
        
        namePet: formData.pet.name.trim(),
        species: parseInt(formData.pet.species),
        breed: formData.pet.species === "Outro" ? 0 : parseInt(formData.pet.breed || "0"),
        gender: getGenderEnum(formData.pet.gender),
        birthDate: formData.pet.birthDate || undefined,
        color: formData.pet.color.trim() || undefined,
        weight: formData.pet.weight ? parseFloat(formData.pet.weight) : undefined,
        microchipNumber: formData.pet.microchipNumber.trim() || undefined,
        observations: formData.pet.observations.trim() || undefined,
        active: true,
      };

      await api.post("tutor/with-pet", finalData);

      toast.success("Tutor, endereço e pet cadastrados com sucesso!");
      router.push("/clinica/tutores/lista");
    } catch (error) {
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
        setAddressFieldsDisabled({
          street: false,
          neighborhood: false,
          city: false,
          state: false,
        });
        return;
      }

      handleInputChange("address", "street", data.logradouro || "");
      handleInputChange("address", "neighborhood", data.bairro || "");
      handleInputChange("address", "city", data.localidade || "");
      handleInputChange("address", "state", UFToEstadoCode[data.uf] || "");
      
      setStateSearchTerm("");

      setAddressFieldsDisabled({
        street: true,
        neighborhood: true,
        city: true,
        state: true,
      });

      toast.success("Endereço preenchido automaticamente");
    } catch (error) {
      toast.error("Erro ao buscar CEP");
      setAddressFieldsDisabled({
        street: false,
        neighborhood: false,
        city: false,
        state: false,
      });
    }
  };

  const enableAddressFieldsEdit = () => {
    setAddressFieldsDisabled({
      street: false,
      neighborhood: false,
      city: false,
      state: false,
    });
    setStateSearchTerm("");
  };  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Cadastrar Tutor</h1>
        <p className="text-muted-foreground">
          Cadastre um novo tutor, endereço e pet no sistema
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-orange-600" />
              <CardTitle>Dados do Tutor</CardTitle>
            </div>
            <CardDescription>Informações básicas do tutor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="space-y-2">
                <Label htmlFor="tutor-phone">Telefone</Label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="tutor-phone"
                    type="tel"
                    value={formData.tutor.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      handleInputChange("tutor", "phone", value);
                    }}
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                  />
                </div>
              </div>

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
            </div>
          </CardContent>


          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-orange-600" />
                <CardTitle>Endereço</CardTitle>
              </div>
              {(addressFieldsDisabled.street || 
                addressFieldsDisabled.neighborhood || 
                addressFieldsDisabled.city || 
                addressFieldsDisabled.state) && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={enableAddressFieldsEdit}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Editar Endereço
                </Button>
              )}
            </div>
            <CardDescription>Dados de localização</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      const previousCep = formData.address.cep;
                      handleInputChange("address", "cep", value);
                      
                      if (value !== previousCep) {
                        setAddressFieldsDisabled({
                          street: false,
                          neighborhood: false,
                          city: false,
                          state: false,
                        });
                      }
                      
                      if (value.length === 8) {
                        searchCEP(value);
                      } else if (value.length < previousCep.length) {
                        handleInputChange("address", "street", "");
                        handleInputChange("address", "neighborhood", "");
                        handleInputChange("address", "city", "");
                        handleInputChange("address", "state", "");
                        setStateSearchTerm("");
                      }
                    }}
                    placeholder="00000000"
                    maxLength={8}
                    required
                  />
                </div>
              </div>

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
                  disabled={addressFieldsDisabled.street}
                  readOnly={addressFieldsDisabled.street}
                />
              </div>

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
                  disabled={addressFieldsDisabled.neighborhood}
                  readOnly={addressFieldsDisabled.neighborhood}
                />
              </div>

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
                  disabled={addressFieldsDisabled.city}
                  readOnly={addressFieldsDisabled.city}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address-state">
                  Estado <span className="text-red-500">*</span>
                </Label>
                <StateCombobox
                  value={formData.address.state}
                  onValueChange={(val) => handleInputChange("address", "state", val)}
                  options={Object.entries(EstadoConst).map(([key, label]) => ({
                    value: key,
                    label,
                  }))}
                  disabled={addressFieldsDisabled.state}
                  placeholder={
                    addressFieldsDisabled.state
                      ? "Preenchido automaticamente"
                      : "Selecione um estado"
                  }
                />
              </div>

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
          </CardContent>
        


          <CardHeader>
            <div className="flex items-center gap-2">
              <PawPrint className="h-5 w-5 text-orange-600" />
              <CardTitle>Dados do Pet</CardTitle>
            </div>
            <CardDescription>Informações do pet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <SelectItem value="1">Canino (Cachorro)</SelectItem>
                      <SelectItem value="2">Felino (Gato)</SelectItem>
                      <SelectItem value="3">Ave</SelectItem>
                      <SelectItem value="4">Réptil</SelectItem>
                      <SelectItem value="5">Roedor</SelectItem>
                      <SelectItem value="0">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <BreedCombobox
                    value={formData.pet.breed}
                    onValueChange={(val) => handleInputChange("pet", "breed", val)}
                    options={getBreedOptions()}
                    disabled={isBreedDisabled}
                    placeholder={
                      isBreedDisabled
                        ? "Selecione uma espécie primeiro"
                        : "Selecione uma raça"
                    }
                  />
                </div>
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

                <div className="space-y-2">
                  <Label htmlFor="pet-birthDate">Data de Nascimento</Label>
                  <Popover open={birthDateOpen} onOpenChange={setBirthDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.pet.birthDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.pet.birthDate ? (
                          format(getBirthDateValue()!, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={getBirthDateValue()}
                        onSelect={(date) => {
                          handleInputChange("pet", "birthDate", formatDateToString(date));
                          setBirthDateOpen(false);
                        }}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

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
          </CardContent>

        </Card>

        <div className="flex justify-end gap-4 pb-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} className={buttonColors.default}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Cadastrando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Cadastrar
              </>
            )}
          </Button>
        </div>
      </form>
    </main>
  );
}

