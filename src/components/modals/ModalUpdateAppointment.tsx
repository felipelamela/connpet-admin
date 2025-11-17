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
import { Stethoscope, X, Save } from "lucide-react"
import api from "@/services/api"
import { getAppointmentTypeOptions } from "@/consts/appointmentType.const"
import { getVetSpecialtyOptions } from "@/consts/vetSpecialty.const"
import { getAppointmentStatusOptions, AppointmentStatusType } from "@/consts/appointmentStatus.const"

interface AppointmentFormData {
  vetId: string;
  status: string;
  type: string;
  typeSpecialty: string;
  description: string;
  scheduledAt: string;
}

interface Appointment {
  id: string;
  petId: string;
  panelId: string;
  vetId?: string;
  paymentOrderId: string;
  status: AppointmentStatusType;
  type: number;
  typeSpecialty: number;
  description?: string;
  scheduledAt?: string;
  pet: {
    id: string;
    name: string;
  };
}

interface ModalUpdateAppointmentProps {
  trigger?: React.ReactNode;
  appointment: Appointment;
  onSuccess?: () => void;
}

interface Vet {
  id: string;
  user: {
    name: string;
  };
}

export function ModalUpdateAppointment({ trigger, appointment, onSuccess }: ModalUpdateAppointmentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [vets, setVets] = useState<Vet[]>([]);
  const [formData, setFormData] = useState<AppointmentFormData>({
    vetId: appointment.vetId || "",
    status: appointment.status,
    type: appointment.type.toString(),
    typeSpecialty: appointment.typeSpecialty.toString(),
    description: appointment.description || "",
    scheduledAt: appointment.scheduledAt 
      ? new Date(appointment.scheduledAt).toISOString().slice(0, 16)
      : "",
  });

  useEffect(() => {
    if (open) {
      fetchVets();
    }
  }, [open]);

  useEffect(() => {
    // Atualizar formData quando o appointment mudar
    setFormData({
      vetId: appointment.vetId || "",
      status: appointment.status,
      type: appointment.type.toString(),
      typeSpecialty: appointment.typeSpecialty.toString(),
      description: appointment.description || "",
      scheduledAt: appointment.scheduledAt 
        ? new Date(appointment.scheduledAt).toISOString().slice(0, 16)
        : "",
    });
  }, [appointment]);

  const fetchVets = async () => {
    try {
      const response = await api.get("admin/clinic-vet-user");
      setVets(response.data?.data || []);
    } catch (error) {
      console.error("Erro ao buscar veterinários:", error);
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

    if (!formData.type || !formData.typeSpecialty) {
      toast.error("Preencha todos os campos obrigatórios");
      setIsSubmitting(false);
      return;
    }

    const updateData = {
      vetId: formData.vetId || undefined,
      status: formData.status,
      type: parseInt(formData.type),
      typeSpecialty: parseInt(formData.typeSpecialty),
      description: formData.description.trim() || undefined,
      scheduledAt: formData.scheduledAt || undefined,
    };

    try {
      await api.patch(`appointment/${appointment.id}`, updateData);
      toast.success("Consulta atualizada com sucesso!");
      setOpen(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erro ao atualizar consulta:", error);
      toast.error("Erro ao atualizar consulta. Tente novamente.");
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
            Editar Consulta
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            <DialogTitle>Editar Consulta</DialogTitle>
          </div>
          <DialogDescription>
            Atualize as informações da consulta de {appointment.pet.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Info do Pet (readonly) */}
          <div className="space-y-2 bg-muted p-3 rounded-md">
            <p className="text-sm">
              <span className="font-semibold">Pet:</span> {appointment.pet.name}
            </p>
          </div>

          {/* Veterinário */}
          <div className="space-y-2">
            <Label htmlFor="vetId">Veterinário (opcional)</Label>
            <Select value={formData.vetId || undefined} onValueChange={(value) => handleSelectChange("vetId", value)}>
              <SelectTrigger id="vetId">
                <SelectValue placeholder="Nenhum veterinário atribuído" />
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
            <Label htmlFor="status">
              Status <span className="text-red-500">*</span>
            </Label>
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
                  Atualizando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Atualizar Consulta
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

