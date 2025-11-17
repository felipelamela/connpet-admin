import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  Package, 
  PawPrint, 
  Users, 
  TrendingUp,
  DollarSign,
  Wrench,
  ClipboardList,
  Hospital
} from "lucide-react";

interface DashboardContentProps {
  moduleName: string;
  moduleColor: string;
}

export function DashboardContent({ moduleName, moduleColor }: DashboardContentProps) {
  // Função para obter classes de cor baseadas no módulo
  const getButtonColorClasses = () => {
    if (moduleColor === "text-blue-600") {
      return {
        border: "border-blue-200 dark:border-blue-800",
        hover: "hover:bg-blue-50 dark:hover:bg-blue-950",
        hoverBorder: "hover:border-blue-300 dark:hover:border-blue-700"
      };
    } else if (moduleColor === "text-orange-600") {
      return {
        border: "border-orange-200 dark:border-orange-800",
        hover: "hover:bg-orange-50 dark:hover:bg-orange-950",
        hoverBorder: "hover:border-orange-300 dark:hover:border-orange-700"
      };
    } else if (moduleColor === "text-purple-600") {
      return {
        border: "border-purple-200 dark:border-purple-800",
        hover: "hover:bg-purple-50 dark:hover:bg-purple-950",
        hoverBorder: "hover:border-purple-300 dark:hover:border-purple-700"
      };
    }
    // Fallback para verde
    return {
      border: "border-green-200 dark:border-green-800",
      hover: "hover:bg-green-50 dark:hover:bg-green-950",
      hoverBorder: "hover:border-green-300 dark:hover:border-green-700"
    };
  };

  const buttonColors = getButtonColorClasses();

  const stats = [
    {
      title: "Agendamentos Hoje",
      value: "12",
      description: "+2 desde ontem",
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      title: "Pets Cadastrados",
      value: "248",
      description: "+15 este mês",
      icon: PawPrint,
      color: "text-green-600",
    },
    {
      title: "Tutores Ativos",
      value: "189",
      description: "+8 este mês",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Faturamento Mês",
      value: "R$ 24.580",
      description: "+12% vs mês anterior",
      icon: DollarSign,
      color: "text-yellow-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard {moduleName}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Visão geral das métricas e atividades
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions and Recent Activity Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Atalhos para as funcionalidades mais usadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <button className={`p-4 border rounded-lg transition-all ${buttonColors.border} ${buttonColors.hover} ${buttonColors.hoverBorder}`}>
                <Calendar className={`h-6 w-6 ${moduleColor} mx-auto mb-2`} />
                <p className="text-sm font-medium">Novo Agendamento</p>
              </button>
              <button className={`p-4 border rounded-lg transition-all ${buttonColors.border} ${buttonColors.hover} ${buttonColors.hoverBorder}`}>
                <PawPrint className={`h-6 w-6 ${moduleColor} mx-auto mb-2`} />
                <p className="text-sm font-medium">Cadastrar Pet</p>
              </button>
              <button className={`p-4 border rounded-lg transition-all ${buttonColors.border} ${buttonColors.hover} ${buttonColors.hoverBorder}`}>
                <Users className={`h-6 w-6 ${moduleColor} mx-auto mb-2`} />
                <p className="text-sm font-medium">Cadastrar Tutor</p>
              </button>
              <button className={`p-4 border rounded-lg transition-all ${buttonColors.border} ${buttonColors.hover} ${buttonColors.hoverBorder}`}>
                <Package className={`h-6 w-6 ${moduleColor} mx-auto mb-2`} />
                <p className="text-sm font-medium">Adicionar Produto</p>
              </button>
              <button className={`p-4 border rounded-lg transition-all ${buttonColors.border} ${buttonColors.hover} ${buttonColors.hoverBorder}`}>
                <TrendingUp className={`h-6 w-6 ${moduleColor} mx-auto mb-2`} />
                <p className="text-sm font-medium">Ver Relatórios</p>
              </button>
              <button className={`p-4 border rounded-lg transition-all ${buttonColors.border} ${buttonColors.hover} ${buttonColors.hoverBorder}`}>
                <DollarSign className={`h-6 w-6 ${moduleColor} mx-auto mb-2`} />
                <p className="text-sm font-medium">Faturamento</p>
              </button>
              <button className={`p-4 border rounded-lg transition-all ${buttonColors.border} ${buttonColors.hover} ${buttonColors.hoverBorder}`}>
                <Wrench className={`h-6 w-6 ${moduleColor} mx-auto mb-2`} />
                <p className="text-sm font-medium">Adicionar Serviço</p>
              </button>
              <button className={`p-4 border rounded-lg transition-all ${buttonColors.border} ${buttonColors.hover} ${buttonColors.hoverBorder}`}>
                <ClipboardList className={`h-6 w-6 ${moduleColor} mx-auto mb-2`} />
                <p className="text-sm font-medium">Listagem de Exames</p>
              </button>
              <button className={`p-4 border rounded-lg transition-all ${buttonColors.border} ${buttonColors.hover} ${buttonColors.hoverBorder}`}>
                <Hospital className={`h-6 w-6 ${moduleColor} mx-auto mb-2`} />
                <p className="text-sm font-medium">Internação</p>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>
              Últimas ações realizadas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center space-x-4 border-b pb-4 last:border-0">
                  <div className={`w-2 h-2 rounded-full ${
                    moduleColor === "text-blue-600" ? "bg-blue-600" : 
                    moduleColor === "text-orange-600" ? "bg-orange-600" :
                    moduleColor === "text-green-600" ? "bg-green-600" : 
                    "bg-purple-600"
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Novo agendamento criado</p>
                    <p className="text-xs text-gray-500">Pet: Rex - Tutor: João Silva</p>
                  </div>
                  <p className="text-xs text-gray-400">Há 2 horas</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

