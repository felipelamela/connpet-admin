"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  PawPrint,
  LayoutDashboard,
  Stethoscope,
  Calendar,
  Package,
  FlaskConical,
  LogOut,
  User,
  Settings,
  Users,
  Pill,
  Syringe,
  Bed,
  DollarSign,
  Building2,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Pets",
    icon: PawPrint,
    items: [
      { title: "Lista de Pets", href: "/pets/lista" },
      { title: "Cadastrar Pet", href: "/pets/cadastrar" },
      { title: "Lista de Tutores", href: "/tutores/lista" },
      { title: "Cadastrar Tutor", href: "/tutores/cadastrar" },
    ],
  },
  {
    title: "Consultas",
    icon: Stethoscope,
    items: [
      { title: "Nova Consulta", href: "/consultas/nova" },
      { title: "Lista de consultas", href: "/consultas/lista" },
      { title: "Histórico", href: "/consultas/historico" },
    ],
  },
  {
    title: "Agendamentos",
    icon: Calendar,
    href: "/agendamentos",
  },
  {
    title: "Produtos",
    icon: Package,
    items: [
      { title: "Lista de Produtos", href: "/produtos/lista" },
      { title: "Cadastrar Produto", href: "/produtos/cadastrar" },
    ],
  },
  {
    title: "Exames",
    icon: FlaskConical,
    items: [
      { title: "Cadastrar Pedido", href: "/exames/cadastrar" },
      { title: "Listagem Exames", href: "/exames/listagem" },
    ],
  },
  {
    title: "Vacinações",
    icon: Syringe,
    items: [
      { title: "Lista de Vacinações", href: "/vacinacoes/lista" },
      { title: "Cadastrar Vacinação", href: "/vacinacoes/cadastrar" },
      { title: "Tipos de Vacina", href: "/tipos-vacina/lista" },
    ],
  },
  {
    title: "Medicamentos",
    icon: Pill,
    items: [
      { title: "Lista de Medicamentos", href: "/medicamentos/lista" },
      { title: "Cadastrar Medicamento", href: "/medicamentos/cadastrar" },
    ],
  },
  {
    title: "Internações",
    icon: Bed,
    items: [
      { title: "Lista de Internações", href: "/internacoes/lista" },
      { title: "Cadastrar Internação", href: "/internacoes/cadastrar" },
    ],
  },
  {
    title: "Equipe",
    icon: Users,
    items: [
      { title: "Lista de Funcionários", href: "/funcionarios/lista" },
      { title: "Cadastrar Funcionário", href: "/funcionarios/cadastrar" },
      { title: "Lista de Serviços", href: "/servicos/lista" },
      { title: "Cadastrar Serviço", href: "/servicos/cadastrar" },
    ],
  },
  {
    title: "Financeiro",
    icon: DollarSign,
    items: [
      { title: "Lista de Pagamentos", href: "/pagamentos/lista" },
      { title: "Planos", href: "/planos/lista" },
    ],
  },
  {
    title: "Clínica",
    icon: Building2,
    items: [
      { title: "Perfil da Clínica", href: "/clinica/perfil" },
      { title: "Configurações", href: "/configuracoes" },
    ],
  },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    toast.success("Logout realizado com sucesso!");
    router.push("/login");
  };

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => {
    return pathname === href;
  };

  const isParentActive = (items?: { href: string }[]) => {
    return items?.some((item) => pathname === item.href);
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b">
        <Link href="/dashboard" className="flex items-center gap-2">
          <PawPrint className="h-8 w-8 text-primary" />
          <div className="flex flex-col">
            <span className="font-bold text-lg">ConnPet</span>
            <span className="text-xs text-muted-foreground">Admin</span>
          </div>
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isExpanded = expandedItems.includes(item.title);
            const hasActiveChild = isParentActive(item.items);

            if (item.items) {
              return (
                <div key={item.title}>
                  <button
                    onClick={() => toggleExpanded(item.title)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors",
                      hasActiveChild
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            "block px-3 py-2 text-sm rounded-md transition-colors",
                            isActive(subItem.href)
                              ? "bg-primary text-primary-foreground font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.title}
                href={item.href || "#"}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                  isActive(item.href || "")
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Menu */}
      <div className="p-4 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-3 py-2 h-auto"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatar.png" alt="Usuário" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-left">
                <p className="text-sm font-medium">Admin</p>
                <p className="text-xs text-muted-foreground">
                  admin@connpet.com
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/perfil" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/configuracoes" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-background border-b flex items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <PawPrint className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">ConnPet</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="lg:hidden fixed top-16 left-0 bottom-0 z-50 w-72 bg-background border-r flex flex-col">
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-72 bg-background border-r flex-col z-40">
        <SidebarContent />
      </aside>
    </>
  );
}

