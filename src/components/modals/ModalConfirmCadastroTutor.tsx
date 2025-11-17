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

interface ModalConfirmCadastroTutorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: string;
  onConfirm: () => void;
}

export function ModalConfirmCadastroTutor({ 
  open, 
  onOpenChange, 
  document,
  onConfirm
}: ModalConfirmCadastroTutorProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <DialogTitle>Cadastrar Novo Tutor</DialogTitle>
          </div>
          <DialogDescription>
            Nenhum tutor foi encontrado com o documento informado. Deseja cadastrar um novo tutor?
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm">
              <span className="font-medium">Documento:</span> {document}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Você será redirecionado para a tela de cadastro de tutor.
            </p>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleConfirm}
          >
            <Check className="mr-2 h-4 w-4" />
            Sim, Cadastrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

