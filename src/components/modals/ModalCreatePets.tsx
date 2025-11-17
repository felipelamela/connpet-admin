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
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { PawPrint, X, Save } from "lucide-react"

interface PetFormData {
  tutorId: string;
  name: string;
  species: string;
  breed: string;
  birthDate: string;
  color: string;
  weight: string;
  microchipNumber: string;
  observations: string;
  gender: string;
  active: boolean;
}

interface ModalCreatePetsProps {
  trigger?: React.ReactNode;
  system: string;
}

export function ModalCreatePets({ trigger, system }: ModalCreatePetsProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<PetFormData>({
    tutorId: "",
    name: "",
    species: "",
    breed: "",
    birthDate: "",
    color: "",
    weight: "",
    microchipNumber: "",
    observations: "",
    gender: "",
    active: true,
  });

  // TODO: Carregar lista de tutores do sistema
  const tutoresMock = [
    { id: "1", name: "João Silva" },
    { id: "2", name: "Maria Santos" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, active: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.name.trim() || !formData.species || !formData.breed || !formData.gender || !formData.tutorId) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }

      const petData = {
        tutorId: formData.tutorId,
        name: formData.name.trim(),
        species: formData.species,
        breed: parseInt(formData.breed) || 1,
        birthDate: formData.birthDate || null,
        color: formData.color.trim() || null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        microchipNumber: formData.microchipNumber.trim() || null,
        observations: formData.observations.trim() || null,
        gender: formData.gender,
        active: formData.active,
      };

      toast.success("Pet cadastrado com sucesso!");
      
      setFormData({
        tutorId: "",
        name: "",
        species: "",
        breed: "",
        birthDate: "",
        color: "",
        weight: "",
        microchipNumber: "",
        observations: "",
        gender: "",
        active: true,
      });
      
      setOpen(false);
      router.push(`/${system}/pets/lista`);
    } catch (error) {
      console.error("Erro ao cadastrar pet:", error);
      toast.error("Erro ao cadastrar pet. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <PawPrint className="mr-2 h-4 w-4" />
            Cadastrar Pet
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <PawPrint className="h-5 w-5" />
            <DialogTitle>Cadastrar Pet</DialogTitle>
          </div>
          <DialogDescription>
            Preencha as informações abaixo para cadastrar um novo pet
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="tutorId">
                  Tutor <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.tutorId}
                  onValueChange={(value) => handleSelectChange("tutorId", value)}
                  required
                >
                  <SelectTrigger id="tutorId">
                    <SelectValue placeholder="Selecione o tutor" />
                  </SelectTrigger>
                  <SelectContent>
                    {tutoresMock.map((tutor) => (
                      <SelectItem key={tutor.id} value={tutor.id}>
                        {tutor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
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

              <div className="space-y-2">
                <Label htmlFor="species">
                  Espécie <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.species}
                  onValueChange={(value) => handleSelectChange("species", value)}
                  required
                >
                  <SelectTrigger id="species">
                    <SelectValue placeholder="Selecione a espécie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DOG">Cachorro</SelectItem>
                    <SelectItem value="CAT">Gato</SelectItem>
                    <SelectItem value="BIRD">Ave</SelectItem>
                    <SelectItem value="RABBIT">Coelho</SelectItem>
                    <SelectItem value="HAMSTER">Hamster</SelectItem>
                    <SelectItem value="GUINEA_PIG">Porquinho da Índia</SelectItem>
                    <SelectItem value="FERRET">Furão</SelectItem>
                    <SelectItem value="REPTILE">Réptil</SelectItem>
                    <SelectItem value="FISH">Peixe</SelectItem>
                    <SelectItem value="OTHER">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="breed">
                  Raça <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="breed"
                  name="breed"
                  value={formData.breed}
                  onChange={handleInputChange}
                  placeholder="Ex: Labrador"
                  required
                />
              </div>

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
                    <SelectItem value="MALE">Macho</SelectItem>
                    <SelectItem value="FEMALE">Fêmea</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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

              <div className="space-y-2">
                <Label htmlFor="color">Cor/Pelagem</Label>
                <Input
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  placeholder="Ex: Branco e marrom"
                  maxLength={50}
                />
              </div>

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
                  placeholder="Ex: 15.5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="microchipNumber">Número do Microchip</Label>
                <Input
                  id="microchipNumber"
                  name="microchipNumber"
                  value={formData.microchipNumber}
                  onChange={handleInputChange}
                  placeholder="Número do microchip"
                  maxLength={15}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="observations">Observações</Label>
                <Textarea
                  id="observations"
                  name="observations"
                  value={formData.observations}
                  onChange={handleInputChange}
                  placeholder="Informações adicionais sobre o pet..."
                  rows={3}
                />
              </div>

              <div className="space-y-2 md:col-span-2 flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={formData.active}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="active" className="cursor-pointer">
                  Pet ativo
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

