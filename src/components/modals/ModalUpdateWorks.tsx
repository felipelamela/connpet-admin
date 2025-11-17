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
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Users, X, Save, Edit } from "lucide-react"
import api from "@/services/api"

interface EmployeeFormData {
  name: string;
  email: string;
  document: string;
  phone: string;
  roles: string;
}

interface EmployeeData {
  id: string;
  name: string;
  email: string;
  document?: string;
  phone?: string;
  roles: string;
}

interface ModalUpdateWorksProps {
  trigger?: React.ReactNode;
  system: string;
  employee: EmployeeData;
  refreshList?: () => void;
}

export function ModalUpdateWorks({ trigger, system, employee, refreshList }: ModalUpdateWorksProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: "",
    email: "",
    document: "",
    phone: "",
    roles: "",
  });

  useEffect(() => {
    if (open && employee) {
      setFormData({
        name: employee.name || "",
        email: employee.email || "",
        document: employee.document || "",
        phone: employee.phone || "",
        roles: employee.roles || "",
      });
    }
  }, [employee, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!employee?.id) {
      toast.error("Erro: ID do funcionário não encontrado");
      setIsSubmitting(false);
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.roles) {
      toast.error("Preencha todos os campos obrigatórios");
      setIsSubmitting(false);
      return;
    }

    const employeeData: any = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      document: formData.document.trim() || null,
      phone: formData.phone.trim() || null,
      roles: formData.roles,
    };

    // Remover campos vazios que não devem ser enviados como string vazia
    if (!employeeData.document) delete employeeData.document;
    if (!employeeData.phone) delete employeeData.phone;

    try {
      const resp = await api.put(`admin/clinic-vet-user/${employee.id}`, employeeData);
      toast.success("Funcionário atualizado com sucesso!");
      setOpen(false);
      if (refreshList) {
        refreshList();
      } else {
        router.push(`/${system}/funcionarios`);
      }
    } catch (error: any) {
      console.error("Erro ao atualizar funcionário:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao atualizar funcionário. Tente novamente.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
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
            <Users className="h-5 w-5" />
            <DialogTitle>Editar Funcionário</DialogTitle>
          </div>
          <DialogDescription>
            Atualize as informações do funcionário
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">
                  Nome Completo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: João Silva"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Ex: joao@email.com"
                  required
                />
              </div>

              <div className="space-y-2"> 
                <Label htmlFor="document">CPF</Label>
                <Input
                  id="document"
                  name="document"
                  value={formData.document}
                  onChange={handleInputChange}
                  placeholder="000.000.000-00"
                  maxLength={20}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="roles">
                  Cargo <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.roles}
                  onValueChange={(value) => handleSelectChange("roles", value)}
                  required
                >
                  <SelectTrigger id="roles">
                    <SelectValue placeholder="Selecione o cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLINIC_ADMIN">Administrador da Clínica</SelectItem>
                    <SelectItem value="CLINIC_VET">Veterinário</SelectItem>
                    <SelectItem value="CLINIC_STAFF">Equipe</SelectItem>
                    <SelectItem value="CLINIC_RECEPTIONIST">Recepcionista</SelectItem>
                  </SelectContent>
                </Select>
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

