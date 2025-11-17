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
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Stethoscope, X, Save, Edit } from "lucide-react"
import api from "@/services/api"

interface ServiceFormData {
  name: string;
  description: string;
  category: string;
  duration: string;
  price: string;
  commission: string;
  active: boolean;
}

interface ServiceData {
  id: string;
  name: string;
  description?: string;
  category: string;
  duration?: number;
  price: number;
  commission?: number;
  active: boolean;
}

interface ModalUpdateServicesProps {
  trigger?: React.ReactNode;
  system: string;
  service: ServiceData;
  refreshList?: () => void;
}

export function ModalUpdateServices({ trigger, system, service, refreshList }: ModalUpdateServicesProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ServiceFormData>({
    name: "",
    description: "",
    category: "",
    duration: "30",
    price: "",
    commission: "",
    active: true,
  });

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || "",
        description: service.description || "",
        category: service.category || "",
        duration: service.duration?.toString() || "30",
        price: service.price.toString() || "",
        commission: service.commission?.toString() || "",
        active: service.active !== undefined ? service.active : true,
      });
    }
  }, [service]);

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

    if (!formData.name.trim() || !formData.price || !formData.category) {
      toast.error("Preencha todos os campos obrigatórios");
      setIsSubmitting(false);
      return;
    }

    const serviceData = {
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      category: formData.category,
      duration: parseInt(formData.duration) || 30,
      price: parseFloat(formData.price) || 0,
      commission: formData.commission ? parseFloat(formData.commission) : null,
      active: formData.active,
    };

    api.put(`admin/service/${service.id}`, serviceData).then((resp) => {
      toast.success("Serviço atualizado com sucesso!");
      setOpen(false);
      if (refreshList) {
        refreshList();
      } else {
        router.push(`/${system}/servicos/lista`);
      }
    }).catch((e) => {
      console.error("Erro ao atualizar serviço:", e);
      toast.error("Erro ao atualizar serviço. Tente novamente.");
    }).finally(() => {
      setIsSubmitting(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            <DialogTitle>Editar Serviço</DialogTitle>
          </div>
          <DialogDescription>
            Atualize as informações do serviço
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">
                  Nome do Serviço <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Consulta Veterinária"
                  maxLength={255}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Descrição detalhada do serviço..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">
                  Categoria <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                  required
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CONSULTATION">Consulta</SelectItem>
                    <SelectItem value="EXAM">Exame</SelectItem>
                    <SelectItem value="VACCINE">Vacina</SelectItem>
                    <SelectItem value="SURGERY">Cirurgia</SelectItem>
                    <SelectItem value="HOSPITALIZATION">Internação</SelectItem>
                    <SelectItem value="BATH_GROOMING">Banho e Tosa</SelectItem>
                    <SelectItem value="PETSHOP">Pet Shop</SelectItem>
                    <SelectItem value="OTHER">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">
                  Duração (minutos)
                </Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">
                  Preço (R$) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Ex: 150.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="commission">Comissão (R$)</Label>
                <Input
                  id="commission"
                  name="commission"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.commission}
                  onChange={handleInputChange}
                  placeholder="Ex: 10.00"
                />
              </div>

              <div className="space-y-2 md:col-span-2 flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={formData.active}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="active" className="cursor-pointer">
                  Serviço ativo
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
                  Atualizando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

