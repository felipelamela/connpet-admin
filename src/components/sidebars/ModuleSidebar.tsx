"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  PawPrint,
  LayoutDashboard,
  Calendar,
  Package,
  LogOut,
  User,
  Settings,
  Users,
  DollarSign,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Scissors,
  UserCog,
  LucideIcon,
  Store,
  Building2,
  Sparkles,
  ArrowLeftRight,
} from "lucide-react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MenuItem {
  title: string;
  icon: LucideIcon;
  href?: string;
  items?: { title: string; href: string }[];
}

interface ModuleSidebarProps {
  moduleName: string;
  moduleColor: string;
  moduleIcon: LucideIcon;
  modulePrefix: string; // ex: "petshop", "clinica", "grooming"
}

export function ModuleSidebar({
  moduleName,
  moduleColor,
  moduleIcon: ModuleIcon,
  modulePrefix,
}: ModuleSidebarProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems: MenuItem[] = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: `/${modulePrefix}/dashboard`,
    },
    {
      title: "Agendamentos",
      icon: Calendar,
      href: `/${modulePrefix}/agendamentos`,
    },
    {
      title: "Produtos",
      icon: Package,
      items: [
        { title: "Lista de Produtos", href: `/${modulePrefix}/produtos/lista` },
        { title: "Cadastrar Produto", href: `/${modulePrefix}/produtos/cadastrar` },
      ],
    },
    {
      title: "Pets",
      icon: PawPrint,
      items: [
        { title: "Lista de Pets", href: `/${modulePrefix}/pets/lista` },
        { title: "Cadastrar Pet", href: `/${modulePrefix}/pets/cadastrar` },
      ],
    },
    {
      title: "Tutores",
      icon: Users,
      items: [
        { title: "Lista de Tutores", href: `/${modulePrefix}/tutores/lista` },
        { title: "Cadastrar Tutor", href: `/${modulePrefix}/tutores/cadastrar` },
      ],
    },
    {
      title: "Serviços",
      icon: Scissors,
      items: [
        { title: "Lista de Serviços", href: `/${modulePrefix}/servicos/lista` },
        { title: "Cadastrar Serviço", href: `/${modulePrefix}/servicos/cadastrar` },
      ],
    },
    {
      title: "Pagamentos",
      icon: DollarSign,
      href: `/${modulePrefix}/pagamento`,
    },
    {
      title: "Funcionários",
      icon: UserCog,
      href: `/${modulePrefix}/funcionarios`,
    },
    {
      title: "Configurações",
      icon: Settings,
      href: `/${modulePrefix}/configuracoes`,
    },
    {
      title: "Alterar Módulo",
      icon: ArrowLeftRight,
      href: "/select-module",
    },
  ];

  const modules = [
    { name: "PetShop", href: "/petshop/dashboard", icon: Store, prefix: "petshop" },
    { name: "Clínica", href: "/clinica/dashboard", icon: Building2, prefix: "clinica" },
    { name: "Grooming", href: "/grooming/dashboard", icon: Sparkles, prefix: "grooming" },
  ];

  const handleLogout = async () => {
    await logout();
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
        <Link href={`/${modulePrefix}/dashboard`} className="flex items-center gap-2">
          <ModuleIcon className={`h-8 w-8 ${moduleColor}`} />
          <div className="flex flex-col">
            <span className="font-bold text-lg">ConnPet</span>
            <span className="text-xs text-muted-foreground">{moduleName}</span>
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
                        ? `${moduleColor} font-medium bg-opacity-10`
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
                              ? `${moduleColor} font-medium bg-opacity-10`
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
                    ? `${moduleColor} font-medium bg-opacity-10`
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
                <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase() || 'AD'}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-left">
                <p className="text-sm font-medium">{user?.name || 'Usuário'}</p>
                <p className="text-xs text-muted-foreground">
                  {user?.email || ''}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/${modulePrefix}/perfil`} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/${modulePrefix}/configuracoes`} className="cursor-pointer">
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
        <Link href={`/${modulePrefix}/dashboard`} className="flex items-center gap-2">
          <ModuleIcon className={`h-6 w-6 ${moduleColor}`} />
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

