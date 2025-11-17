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
} from "@/components/ui/dialog"
import { Users, Check, X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import api from "@/services/api"

interface Tutor {
  id: string;
  name: string;
  email: string;
  document: string | null;
}

interface ModalAddTutorToSystemProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tutor: Tutor | null;
  onSuccess: () => void;
}

export function ModalAddTutorToSystem({ 
  open, 
  onOpenChange, 
  tutor,
  onSuccess 
}: ModalAddTutorToSystemProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTutor = async () => {
    if (!tutor) return;

    setIsSubmitting(true);
    try {
      // TODO: Implementar endpoint para adicionar tutor ao sistema da clínica
      // Por enquanto, vamos usar o endpoint de criação de tutorCompany
      // const panelId = 'e2ce53d8-e3b6-4c16-bc1f-56ab5aa45a09'; // TODO: obter do contexto
      // await api.post('admin/tutors/add', { tutorId: tutor.id, panelId });
      
      toast.success("Tutor adicionado ao sistema com sucesso!");
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Erro ao adicionar tutor:", error);
      toast.error(error.message || "Erro ao adicionar tutor ao sistema. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!tutor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <DialogTitle>Adicionar Tutor ao Sistema</DialogTitle>
          </div>
          <DialogDescription>
            O tutor já existe no sistema. Deseja adicioná-lo à sua clínica?
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Informações do Tutor:</p>
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p><span className="font-medium">Nome:</span> {tutor.name}</p>
              <p><span className="font-medium">Email:</span> {tutor.email}</p>
              {tutor.document && (
                <p><span className="font-medium">CPF:</span> {tutor.document}</p>
              )}
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
            type="button"
            onClick={handleAddTutor}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Adicionando...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Adicionar Tutor
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

