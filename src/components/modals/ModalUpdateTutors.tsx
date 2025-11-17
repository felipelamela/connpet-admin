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
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Users, X, Save, Edit } from "lucide-react"

interface TutorFormData {
  name: string;
  email: string;
  password: string;
  document: string;
  phone: string;
  status: boolean;
}

interface TutorData {
  id: string;
  userId: string;
  name: string;
  email: string;
  document?: string;
  phone?: string;
  status: boolean;
}

interface ModalUpdateTutorsProps {
  trigger?: React.ReactNode;
  system: string;
  tutor: TutorData;
}

export function ModalUpdateTutors({ trigger, system, tutor }: ModalUpdateTutorsProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<TutorFormData>({
    name: "",
    email: "",
    password: "",
    document: "",
    phone: "",
    status: true,
  });

  useEffect(() => {
    if (tutor) {
      setFormData({
        name: tutor.name || "",
        email: tutor.email || "",
        password: "", // Senha sempre vazia no update (opcional)
        document: tutor.document || "",
        phone: tutor.phone || "",
        status: tutor.status !== undefined ? tutor.status : true,
      });
    }
  }, [tutor]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, status: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.name.trim() || !formData.email.trim()) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }

      const tutorData: any = {
        id: tutor.id,
        userId: tutor.userId,
        name: formData.name.trim(),
        email: formData.email.trim(),
        document: formData.document.trim() || null,
        phone: formData.phone.trim() || null,
        status: formData.status,
      };

      // Incluir senha apenas se foi preenchida
      if (formData.password.trim()) {
        tutorData.password = formData.password.trim();
      }

      toast.success("Tutor atualizado com sucesso!");
      
      setOpen(false);
      router.push(`/${system}/tutores/lista`);
    } catch (error) {
      console.error("Erro ao atualizar tutor:", error);
      toast.error("Erro ao atualizar tutor. Tente novamente.");
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
            <DialogTitle>Editar Tutor</DialogTitle>
          </div>
          <DialogDescription>
            Atualize as informações do tutor
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
                <Label htmlFor="password">
                  Nova Senha
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Deixe em branco para manter"
                />
                <p className="text-xs text-muted-foreground">
                  Deixe em branco para manter a senha atual
                </p>
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

              <div className="space-y-2 md:col-span-2 flex items-center space-x-2">
                <Checkbox
                  id="status"
                  checked={formData.status}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="status" className="cursor-pointer">
                  Tutor ativo
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

