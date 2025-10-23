"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Scissors, Store } from "lucide-react";

export default function SelectModulePage() {
  const router = useRouter();

  const modules = [
    {
      id: "petshop",
      title: "PetShop",
      description: "Gerenciamento de produtos, vendas e estoque",
      icon: Store,
      color: "from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700",
      path: "/petshop/dashboard",
    },
    {
      id: "clinica",
      title: "Clínica Veterinária",
      description: "Atendimentos, prontuários e exames",
      icon: Building2,
      color: "from-green-500 to-green-600",
      hoverColor: "hover:from-green-600 hover:to-green-700",
      path: "/clinica/dashboard",
    },
    {
      id: "grooming",
      title: "Grooming",
      description: "Agendamentos de banho e tosa",
      icon: Scissors,
      color: "from-purple-500 to-purple-600",
      hoverColor: "hover:from-purple-600 hover:to-purple-700",
      path: "/grooming/dashboard",
    },
  ];

  const handleModuleSelect = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Bem-vindo ao ConnPet
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Selecione o módulo que deseja acessar
            </p>
          </div>

          {/* Module Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <Card
                  key={module.id}
                  className="transition-all duration-300 hover:shadow-xl hover:scale-105"
                >
                  <CardHeader>
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${module.color} flex items-center justify-center mb-4 mx-auto transition-all ${module.hoverColor}`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-center text-xl">
                      {module.title}
                    </CardTitle>
                    <CardDescription className="text-center">
                      {module.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center gap-3">
                      <button
                        className={`cursor-pointer px-6 py-2 rounded-lg bg-gradient-to-r ${module.color} text-white font-medium transition-all ${module.hoverColor}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleModuleSelect(module.path);
                        }}
                      >
                        Acessar
                      </button>
                      <button
                        className={`cursor-pointer px-6 py-2 rounded-lg bg-gradient-to-r ${module.color} text-white font-medium transition-all ${module.hoverColor}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleModuleSelect(module.path);
                        }}
                      >
                        Planos
                      </button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Info Footer */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Você pode alternar entre os módulos a qualquer momento através do menu
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

