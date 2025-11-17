"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Scissors, Store } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type PanelType = "PETSHOP" | "CLINIC" | "GROOMING";

interface ModuleDefinition {
  id: string;
  title: string;
  description: string;
  icon: typeof Store;
  color: string;
  hoverColor: string;
  path: string;
}

const MODULE_CONFIG: Record<PanelType, ModuleDefinition> = {
  PETSHOP: {
    id: "petshop",
    title: "PetShop",
    description: "Gerenciamento de produtos, vendas e estoque",
    icon: Store,
    color: "from-blue-500 to-blue-600",
    hoverColor: "hover:from-blue-600 hover:to-blue-700",
    path: "/petshop/dashboard",
  },
  CLINIC: {
    id: "clinica",
    title: "Clínica Veterinária",
    description: "Atendimentos, prontuários e exames",
    icon: Building2,
    color: "from-orange-500 to-orange-600",
    hoverColor: "hover:from-orange-600 hover:to-orange-700",
    path: "/clinica/dashboard",
  },
  GROOMING: {
    id: "grooming",
    title: "Grooming",
    description: "Agendamentos de banho e tosa",
    icon: Scissors,
    color: "from-purple-500 to-purple-600",
    hoverColor: "hover:from-purple-600 hover:to-purple-700",
    path: "/grooming/dashboard",
  },
};

interface ModuleCard extends ModuleDefinition {
  type: PanelType;
  availablePanel: { id: string; type: string } | null;
  isActive: boolean;
  disabled: boolean;
}

export default function SelectModulePage() {
  const router = useRouter();
  const { user, isLoading, selectPanel } = useAuth();
  const [selectingModule, setSelectingModule] = useState<PanelType | null>(null);

  const modules = useMemo<ModuleCard[]>(() => {
    return (Object.keys(MODULE_CONFIG) as PanelType[]).map((type) => {
      const config = MODULE_CONFIG[type];
      const availablePanel = user?.panels?.find((panel) => panel.type === type) || null;
      const isActive =
        availablePanel?.id && user?.panelId ? availablePanel.id === user.panelId : false;

      return {
        ...config,
        type,
        availablePanel,
        isActive,
        disabled: !availablePanel,
      };
    });
  }, [user]);

  const handleModuleSelect = async (module: ModuleCard) => {
    if (!module.availablePanel) {
      toast.error("Você não possui acesso a este módulo.");
      return;
    }

    if (selectingModule) {
      return;
    }

    try {
      setSelectingModule(module.type);
      await selectPanel(module.availablePanel.id, module.availablePanel.type);
      router.push(module.path);
    } catch (error: any) {
      const errorMessage =
        error?.message || "Não foi possível acessar o módulo selecionado.";
      toast.error(errorMessage);
    } finally {
      setSelectingModule(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <p className="text-lg text-gray-600 dark:text-gray-300">Carregando módulos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
              Bem-vindo ao ConnPet
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Selecione o módulo que deseja acessar
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {modules.map((module) => {
              const Icon = module.icon;
              const isSelecting = selectingModule === module.type;
              return (
                <Card
                  key={module.type}
                  className={cn(
                    "border-2 transition-all duration-300",
                    module.disabled
                      ? "cursor-not-allowed border-transparent opacity-50 hover:scale-100 hover:shadow-none"
                      : "border-transparent hover:scale-105 hover:shadow-xl",
                    module.isActive && !module.disabled ? "border-orange-500 shadow-lg" : ""
                  )}
                >
                  <CardHeader>
                    <div
                      className={cn(
                        "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br transition-all",
                        module.color,
                        !module.disabled && module.hoverColor
                      )}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-center text-xl">{module.title}</CardTitle>
                    <CardDescription className="text-center">
                      {module.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center gap-3">
                      <button
                        className={cn(
                          "w-full cursor-pointer rounded-lg px-6 py-2 font-medium text-white transition-all bg-gradient-to-r",
                          module.color,
                          !module.disabled && module.hoverColor,
                          (module.disabled || isSelecting) && "cursor-not-allowed opacity-70"
                        )}
                        disabled={module.disabled || isSelecting}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleModuleSelect(module);
                        }}
                      >
                        {module.isActive ? "Selecionado" : "Acessar"}
                      </button>
                      <span className="text-center text-sm text-muted-foreground">
                        {module.disabled
                          ? "Seu painel não possui acesso a este módulo."
                          : module.isActive
                          ? "Módulo atualmente selecionado."
                          : "Clique em acessar para entrar neste módulo."}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Você pode alternar entre os módulos a qualquer momento através do menu lateral.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


