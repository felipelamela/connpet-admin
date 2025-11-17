"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Stethoscope, X, Save, Search } from "lucide-react"
import api from "@/services/api"
import { getAppointmentTypeOptions } from "@/consts/appointmentType.const"
import { getVetSpecialtyOptions } from "@/consts/vetSpecialty.const"
import { getAppointmentStatusOptions } from "@/consts/appointmentStatus.const"

interface AppointmentFormData {
  petId: string;
  panelId: string;
  vetId: string;
  paymentOrderId: string;
  status: string;
  type: string;
  typeSpecialty: string;
  description: string;
  scheduledAt: string;
}

interface ModalCreateAppointmentProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

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

interface Vet {
  id: string;
  user: {
    name: string;
  };
}

export function ModalCreateAppointment({ trigger, onSuccess }: ModalCreateAppointmentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [cpfSearch, setCpfSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [vets, setVets] = useState<Vet[]>([]);
  const [formData, setFormData] = useState<AppointmentFormData>({
    petId: "",
    panelId: "e2ce53d8-e3b6-4c16-bc1f-56ab5aa45a09", // TODO: Pegar do contexto da empresa
    vetId: "",
    paymentOrderId: "",
    status: "PENDING",
    type: "",
    typeSpecialty: "",
    description: "",
    scheduledAt: "",
  });

  useEffect(() => {
    if (open) {
      fetchVets();
    }
  }, [open]);

  const fetchVets = async () => {
    try {
      const response = await api.get("admin/clinic-vet-user");
      setVets(response.data?.data || []);
    } catch (error) {
      console.error("Erro ao buscar veterinários:", error);
    }
  };

  const searchPets = async () => {
    if (!cpfSearch.trim()) {
      toast.error("Por favor, informe o CPF do tutor");
      return;
    }

    setIsSearching(true);
    try {
      const response = await api.get(`pet/tutor/document?document=${cpfSearch}`);
      
      // api.get() já retorna response.data, então response é { statusCode, success, message, data }
      // Os pets estão em response.data
      const petsData = Array.isArray(response.data) ? response.data : [];
      
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

    if (!formData.petId || !formData.panelId || !formData.paymentOrderId || !formData.type || !formData.typeSpecialty) {
      toast.error("Preencha todos os campos obrigatórios");
      setIsSubmitting(false);
      return;
    }

    const appointmentData = {
      petId: formData.petId,
      panelId: formData.panelId,
      vetId: formData.vetId || undefined,
      paymentOrderId: formData.paymentOrderId,
      status: formData.status,
      type: parseInt(formData.type),
      typeSpecialty: parseInt(formData.typeSpecialty),
      description: formData.description.trim() || undefined,
      scheduledAt: formData.scheduledAt || undefined,
    };

    try {
      await api.post("appointment", appointmentData);
      toast.success("Consulta cadastrada com sucesso!");
      
      setFormData({
        petId: "",
        panelId: "",
        vetId: "",
        paymentOrderId: "",
        status: "PENDING",
        type: "",
        typeSpecialty: "",
        description: "",
        scheduledAt: "",
      });
      setPets([]);
      setCpfSearch("");
      setOpen(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erro ao cadastrar consulta:", error);
      toast.error("Erro ao cadastrar consulta. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Stethoscope className="mr-2 h-4 w-4" />
            Nova Consulta
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            <DialogTitle>Agendar Nova Consulta</DialogTitle>
          </div>
          <DialogDescription>
            Preencha as informações abaixo para agendar uma nova consulta
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Busca de Pet por CPF */}
          <div className="space-y-2">
            <Label>Buscar Pet por CPF do Tutor</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Digite o CPF do tutor"
                value={cpfSearch}
                onChange={(e) => setCpfSearch(e.target.value)}
                className="flex-1"
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
          </div>

          {/* Seleção de Pet */}
          {pets.length > 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="petId">
                  Pet <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.petId} onValueChange={(value) => handleSelectChange("petId", value)}>
                  <SelectTrigger id="petId">
                    <SelectValue placeholder="Selecione um pet" />
                  </SelectTrigger>
                  <SelectContent>
                    {pets.map((pet) => (
                      <SelectItem key={pet.id} value={pet.id}>
                        {pet.name} - {typeof pet.species === 'string' ? pet.species : `Espécie ${pet.species}`} ({pet.gender === 'MALE' ? 'Macho' : 'Fêmea'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Detalhes do Pet Selecionado */}
              {formData.petId && pets.find(p => p.id === formData.petId) && (
                <div className="bg-muted p-3 rounded-md space-y-2">
                  <h4 className="font-semibold text-sm">Informações do Pet</h4>
                  {(() => {
                    const selectedPet = pets.find(p => p.id === formData.petId);
                    if (!selectedPet) return null;
                    return (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="font-medium">Nome:</span> {selectedPet.name}
                        </div>
                        <div>
                          <span className="font-medium">Espécie:</span> {typeof selectedPet.species === 'string' ? selectedPet.species : `Espécie ${selectedPet.species}`}
                        </div>
                        <div>
                          <span className="font-medium">Raça:</span> {typeof selectedPet.breed === 'string' ? selectedPet.breed : `ID ${selectedPet.breed}`}
                        </div>
                        <div>
                          <span className="font-medium">Gênero:</span> {selectedPet.gender === 'MALE' ? 'Macho' : 'Fêmea'}
                        </div>
                        {selectedPet.weight && (
                          <div>
                            <span className="font-medium">Peso:</span> {selectedPet.weight} kg
                          </div>
                        )}
                        {selectedPet.color && (
                          <div>
                            <span className="font-medium">Cor:</span> {selectedPet.color}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {/* Veterinário */}
          <div className="space-y-2">
            <Label htmlFor="vetId">Veterinário (Opcional)</Label>
            <Select value={formData.vetId} onValueChange={(value) => handleSelectChange("vetId", value)}>
              <SelectTrigger id="vetId">
                <SelectValue placeholder="Selecione um veterinário" />
              </SelectTrigger>
              <SelectContent>
                {vets.map((vet) => (
                  <SelectItem key={vet.id} value={vet.id}>
                    {vet.user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ID da Ordem de Pagamento */}
          <div className="space-y-2">
            <Label htmlFor="paymentOrderId">
              ID da Ordem de Pagamento <span className="text-red-500">*</span>
            </Label>
            <Input
              id="paymentOrderId"
              name="paymentOrderId"
              value={formData.paymentOrderId}
              onChange={handleInputChange}
              placeholder="Digite o ID da ordem de pagamento"
              required
            />
          </div>

          {/* Tipo de Consulta */}
          <div className="space-y-2">
            <Label htmlFor="type">
              Tipo de Consulta <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {getAppointmentTypeOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Especialidade */}
          <div className="space-y-2">
            <Label htmlFor="typeSpecialty">
              Especialidade <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.typeSpecialty} onValueChange={(value) => handleSelectChange("typeSpecialty", value)}>
              <SelectTrigger id="typeSpecialty">
                <SelectValue placeholder="Selecione a especialidade" />
              </SelectTrigger>
              <SelectContent>
                {getVetSpecialtyOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
              <SelectTrigger id="status">
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

          {/* Data e Hora Agendada */}
          <div className="space-y-2">
            <Label htmlFor="scheduledAt">Data e Hora Agendada</Label>
            <Input
              id="scheduledAt"
              name="scheduledAt"
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={handleInputChange}
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição / Observações</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Informações adicionais sobre a consulta..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
            </DialogClose>
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

